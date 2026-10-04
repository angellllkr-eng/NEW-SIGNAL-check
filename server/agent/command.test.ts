import {describe, expect, it} from "vitest";
import {agentOperatorCommandSchema} from "./command";

describe("agent/operator command contract", () => {
  it("accepts the canonical command shape", () => {
    const result = agentOperatorCommandSchema.safeParse({id: "cmd-1", action: "signal.validate", input: {signal: "x"}, evidence_required: true});
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields and unknown fields", () => {
    expect(agentOperatorCommandSchema.safeParse({id: "cmd-1", input: {}}).success).toBe(false);
    expect(agentOperatorCommandSchema.safeParse({id: "cmd-1", action: "x", input: {}, extra: true}).success).toBe(false);
  });
});
