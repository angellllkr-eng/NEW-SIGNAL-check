import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const createA11AgentJob = vi.fn().mockResolvedValue(44);
const updateA11AgentJob = vi.fn().mockResolvedValue(undefined);
const createPrivateA11Task = vi.fn().mockResolvedValue({ taskId: "private-task-44", taskUrl: "https://manus.im/app/private-task-44" });
const createCommandDecision = vi.fn().mockResolvedValue(45);
const createCommandClaim = vi.fn().mockResolvedValue(46);

vi.mock("./commandCenterDb", () => ({
  createA11AgentJob,
  updateA11AgentJob,
  createCommandClaim,
  createCommandDecision,
  createCommandIncident: vi.fn(),
  createCommandTask: vi.fn(),
  createSourceArtifact: vi.fn(),
  getA11AgentJob: vi.fn(),
  getCommandCenterSnapshot: vi.fn(),
}));

vi.mock("./a11ManusApi", () => ({
  createPrivateA11Task,
  getPrivateA11Task: vi.fn(),
}));

const { commandCenterRouter } = await import("./routers/commandCenter");

function contextFor(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: role === "admin" ? 11 : 12,
      openId: `${role}-open-id`,
      email: `${role}@example.com`,
      name: role,
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const validRun = {
  purpose: "research_brief" as const,
  instruction: "Review the evidence gaps and list the next safe research decisions.",
  sourceIds: [4],
  agentProfile: "standard" as const,
  confirmed: true as const,
};

const validPrioritySignals = {
  securityExposure: 0,
  revenueProximity: 3,
  marketEvidence: 2,
  releaseReadiness: 2,
  blockerSeverity: 1,
  confidence: 3,
  effort: 2,
};

describe("commandCenter owner mutations", () => {
  it("permits the owner to explicitly start a private, bounded run", async () => {
    const caller = commandCenterRouter.createCaller(contextFor("admin"));
    const result = await caller.startA11Run(validRun);

    expect(createA11AgentJob).toHaveBeenCalledWith(expect.objectContaining({ createdByUserId: 11, inputSourceIds: [4], status: "queued" }));
    expect(createPrivateA11Task).toHaveBeenCalledWith(validRun);
    expect(updateA11AgentJob).toHaveBeenCalledWith(44, expect.objectContaining({ manusTaskId: "private-task-44", status: "running" }));
    expect(result).toMatchObject({ jobId: 44, status: "running" });
  });

  it("rejects a non-owner before the job can be created", async () => {
    const caller = commandCenterRouter.createCaller(contextFor("user"));
    await expect(caller.startA11Run(validRun)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("permits the owner to write a scored decision and a provenance-linked claim", async () => {
    const caller = commandCenterRouter.createCaller(contextFor("admin"));

    await caller.addDecision({
      title: "Validate public deployment ownership",
      category: "product",
      status: "queued",
      priority: "p3",
      effort: "small",
      rationale: "The source of truth should be established before public positioning changes.",
      owner: "A.",
      sourceIds: [5],
      prioritySignals: validPrioritySignals,
    });
    await caller.addClaim({
      statement: "A deployment-linked product claim remains under review pending original service evidence.",
      category: "product",
      verification: "unverified",
      confidence: "low",
      sourceIds: [5],
      notes: "Keep distinct from verified operating facts.",
    });

    expect(createCommandDecision).toHaveBeenCalledWith(expect.objectContaining({ priorityScore: expect.any(Number), prioritySignals: validPrioritySignals }));
    expect(createCommandClaim).toHaveBeenCalledWith(expect.objectContaining({ sourceIds: [5], verification: "unverified" }));
  });

  it("rejects non-owner claim and decision mutations before persistence", async () => {
    const caller = commandCenterRouter.createCaller(contextFor("user"));
    await expect(caller.addDecision({
      title: "Validate public deployment ownership",
      category: "product",
      status: "queued",
      priority: "p3",
      effort: "small",
      rationale: "Requires a documented source of truth.",
      owner: "A.",
      sourceIds: [],
      prioritySignals: validPrioritySignals,
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.addClaim({
      statement: "A claim requires original evidence before verification.",
      category: "product",
      verification: "unverified",
      confidence: "low",
      sourceIds: [],
      notes: "Pending review.",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
