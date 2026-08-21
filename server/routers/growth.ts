import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createConversionEvent, createLead, createProofItem, listProofItems, listRecentConversionEvents, listRecentLeads } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const shortText = (max: number) => z.string().trim().max(max).optional();

export const leadInput = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  company: shortText(160),
  role: shortText(120),
  businessStage: z.enum(["early", "growing", "established", "other"]).optional(),
  need: z.enum(["visibility", "monthly-rhythm", "decision-support", "other"]).optional(),
  urgency: z.enum(["now", "this-quarter", "exploring"]).optional(),
  message: shortText(2000),
  source: z.string().trim().min(1).max(80).default("website"),
  diagnosticScore: z.number().int().min(4).max(12).optional(),
  diagnosticLabel: shortText(100),
  signalMap: shortText(2000),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export const trackEventInput = z.object({
  sessionId: z.string().trim().min(8).max(120),
  eventName: z.enum(["primary_cta_clicked", "diagnostic_started", "diagnostic_completed", "signal_map_copied", "signal_map_printed", "contact_form_started", "lead_submitted"]),
  path: z.string().trim().min(1).max(320),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export const proofInput = z.object({
  type: z.enum(["founder_profile", "credential", "case_study", "client_logo", "testimonial"]),
  title: z.string().trim().min(3).max(200),
  publicSummary: shortText(2000),
  evidenceUrl: z.string().trim().url().max(2048).optional().or(z.literal("")),
  permissionConfirmed: z.boolean(),
  status: z.enum(["draft", "pending_approval", "verified", "published", "archived"]).default("draft"),
  notes: shortText(2000),
});

const leadRateLimit = new Map<string, { count: number; resetAt: number }>();

function enforceLeadRateLimit(ip: string) {
  const now = Date.now();
  const entry = leadRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    leadRateLimit.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return;
  }
  if (entry.count >= 5) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait a few minutes before sending another note." });
  entry.count += 1;
}

export const growthRouter = router({
  submitLead: publicProcedure.input(leadInput).mutation(async ({ input, ctx }) => {
    const forwarded = ctx.req.headers["x-forwarded-for"];
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]?.trim() || "unknown";
    enforceLeadRateLimit(ip);
    const { website: _website, ...lead } = input;
    const leadId = await createLead({ ...lead, consent: true });
    await createConversionEvent({
      eventName: "lead_submitted",
      path: "/contact",
      leadId,
      metadata: { source: lead.source, need: lead.need ?? null, urgency: lead.urgency ?? null },
    });
    return { leadId };
  }),
  trackEvent: publicProcedure.input(trackEventInput).mutation(async ({ input }) => {
    await createConversionEvent(input);
    return { success: true };
  }),
  listLeads: adminProcedure.input(z.object({ limit: z.number().int().min(1).max(100).default(50) })).query(({ input }) => listRecentLeads(input.limit)),
  listEvents: adminProcedure.input(z.object({ limit: z.number().int().min(1).max(200).default(100) })).query(({ input }) => listRecentConversionEvents(input.limit)),
  listProof: adminProcedure.input(z.object({ limit: z.number().int().min(1).max(100).default(50) })).query(({ input }) => listProofItems(input.limit)),
  addProof: adminProcedure.input(proofInput).mutation(async ({ input }) => {
    const id = await createProofItem({ ...input, evidenceUrl: input.evidenceUrl || undefined });
    return { id };
  }),
});
