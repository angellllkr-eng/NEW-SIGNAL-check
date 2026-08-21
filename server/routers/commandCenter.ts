import { z } from "zod";
import { createA11AgentJob, createCommandClaim, createCommandDecision, createCommandIncident, createCommandTask, createSourceArtifact, getA11AgentJob, getCommandCenterSnapshot, updateA11AgentJob } from "../commandCenterDb";
import { adminProcedure, router } from "../_core/trpc";
import { createPrivateA11Task, getPrivateA11Task } from "../a11ManusApi";
import { mapManusTaskStatus, safeA11Error } from "../a11JobState";
import { scorePriority } from "../priority";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const url = z.string().trim().url().max(2048).optional().or(z.literal(""));

const sourceInput = z.object({
  title: z.string().trim().min(3).max(240),
  kind: z.enum(["document", "repository", "deployment", "endpoint", "log", "issue", "other"]),
  sourceType: z.enum(["drive", "github", "public_web", "vercel", "manual", "other"]),
  sourceUrl: url,
  sourceRef: optionalText(320),
  sensitivity: z.enum(["private", "restricted", "public"]),
  verification: z.enum(["verified", "observed", "unverified", "blocked"]),
  freshness: z.enum(["current", "aging", "stale", "unknown"]),
  summary: optionalText(6000),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
});

const incidentInput = z.object({
  title: z.string().trim().min(3).max(240),
  severity: z.enum(["critical", "high", "medium", "low"]),
  status: z.enum(["reported", "investigating", "contained", "resolved", "monitoring"]),
  verification: z.enum(["verified", "observed", "unverified", "blocked"]),
  summary: optionalText(6000),
  impact: optionalText(6000),
  sourceIds: z.array(z.number().int().positive()).max(50).default([]),
});

const decisionInput = z.object({
  title: z.string().trim().min(3).max(280),
  category: z.enum(["security", "release", "product", "growth", "operations", "research"]),
  status: z.enum(["queued", "in_progress", "blocked", "decided", "deferred"]),
  priority: z.enum(["p0", "p1", "p2", "p3"]),
  effort: z.enum(["small", "medium", "large", "unknown"]),
  rationale: optionalText(6000),
  owner: optionalText(160),
  sourceIds: z.array(z.number().int().positive()).max(50).default([]),
  prioritySignals: z.object({
    securityExposure: z.number().min(0).max(5),
    revenueProximity: z.number().min(0).max(5),
    marketEvidence: z.number().min(0).max(5),
    releaseReadiness: z.number().min(0).max(5),
    blockerSeverity: z.number().min(0).max(5),
    confidence: z.number().min(0).max(5),
    effort: z.number().min(0).max(5),
  }).default({ securityExposure: 0, revenueProximity: 0, marketEvidence: 0, releaseReadiness: 0, blockerSeverity: 0, confidence: 0, effort: 0 }),
});

const claimInput = z.object({
  statement: z.string().trim().min(8).max(12_000),
  category: z.enum(["security", "product", "commercial", "public_footprint", "operational", "other"]),
  verification: z.enum(["verified", "observed", "unverified", "blocked"]),
  confidence: z.enum(["high", "medium", "low", "unknown"]),
  sourceIds: z.array(z.number().int().positive()).max(50).default([]),
  notes: optionalText(6000),
});

const taskInput = z.object({
  decisionId: z.number().int().positive().optional(),
  title: z.string().trim().min(3).max(280),
  status: z.enum(["todo", "in_progress", "blocked", "done"]),
  owner: optionalText(160),
  notes: optionalText(6000),
});

const agentRunInput = z.object({
  purpose: z.enum(["evidence_summary", "current_state_brief", "release_readiness", "research_brief", "decision_brief"]),
  instruction: z.string().trim().min(12).max(12_000),
  sourceIds: z.array(z.number().int().positive()).max(50).default([]),
  agentProfile: z.enum(["lite", "standard", "max"]).default("standard"),
  confirmed: z.literal(true),
});

export const commandCenterRouter = router({
  snapshot: adminProcedure.query(() => getCommandCenterSnapshot()),
  addSource: adminProcedure.input(sourceInput).mutation(({ input }) =>
    createSourceArtifact({
      ...input,
      sourceUrl: input.sourceUrl || undefined,
      sourceRef: input.sourceRef || undefined,
      summary: input.summary || undefined,
      tags: input.tags,
    }),
  ),
  addIncident: adminProcedure.input(incidentInput).mutation(({ input }) =>
    createCommandIncident({
      ...input,
      summary: input.summary || undefined,
      impact: input.impact || undefined,
      sourceIds: input.sourceIds,
    }),
  ),
  addDecision: adminProcedure.input(decisionInput).mutation(({ input }) => {
    const score = scorePriority(input.prioritySignals);
    return createCommandDecision({
      ...input,
      priority: score.band,
      priorityScore: score.total,
      prioritySignals: input.prioritySignals,
      rationale: input.rationale ? `${input.rationale}\n\nScore ${score.total}: ${score.rationale}` : `Score ${score.total}: ${score.rationale}`,
      owner: input.owner || undefined,
      sourceIds: input.sourceIds,
    });
  }),
  addClaim: adminProcedure.input(claimInput).mutation(({ input }) =>
    createCommandClaim({
      ...input,
      notes: input.notes || undefined,
      sourceIds: input.sourceIds,
      lastReviewedAt: new Date(),
    }),
  ),
  addTask: adminProcedure.input(taskInput).mutation(({ input }) =>
    createCommandTask({
      ...input,
      owner: input.owner || undefined,
      notes: input.notes || undefined,
    }),
  ),
  startA11Run: adminProcedure.input(agentRunInput).mutation(async ({ input, ctx }) => {
    const jobId = await createA11AgentJob({
      purpose: input.purpose,
      instruction: input.instruction,
      inputSourceIds: input.sourceIds,
      agentProfile: input.agentProfile,
      status: "queued",
      createdByUserId: ctx.user.id,
    });

    try {
      const task = await createPrivateA11Task(input);
      await updateA11AgentJob(jobId, {
        manusTaskId: task.taskId,
        resultUrl: task.taskUrl,
        status: "running",
        startedAt: new Date(),
      });
      return { jobId, status: "running" as const, taskUrl: task.taskUrl };
    } catch (error) {
      const message = safeA11Error(error);
      await updateA11AgentJob(jobId, { status: "failed", errorMessage: message, completedAt: new Date() });
      return { jobId, status: "failed" as const, error: message };
    }
  }),
  refreshA11Run: adminProcedure.input(z.object({ jobId: z.number().int().positive() })).mutation(async ({ input }) => {
    const job = await getA11AgentJob(input.jobId);
    if (!job) throw new Error("A11 job not found.");
    if (!job.manusTaskId) return { status: job.status, error: job.errorMessage ?? "This job has no external task identifier." };

    try {
      const task = await getPrivateA11Task(job.manusTaskId);
      const status = mapManusTaskStatus(task.status);
      await updateA11AgentJob(job.id, {
        status,
        resultUrl: task.taskUrl ?? job.resultUrl ?? undefined,
        lastPolledAt: new Date(),
        completedAt: status === "stopped" || status === "failed" ? new Date() : undefined,
      });
      return { status, taskUrl: task.taskUrl ?? job.resultUrl };
    } catch (error) {
      const message = safeA11Error(error);
      await updateA11AgentJob(job.id, { status: "failed", errorMessage: message, lastPolledAt: new Date(), completedAt: new Date() });
      return { status: "failed" as const, error: message };
    }
  }),
});
