import { describe, expect, it } from "vitest";
import { mapAgentProfile, mapManusTaskStatus, safeA11Error } from "./a11JobState";

describe("A11 agent-job state mapping", () => {
  it("preserves waiting and stopped states without treating them as completed output", () => {
    expect(mapManusTaskStatus("running")).toBe("running");
    expect(mapManusTaskStatus("waiting")).toBe("needs_input");
    expect(mapManusTaskStatus("stopped")).toBe("stopped");
    expect(mapManusTaskStatus("error")).toBe("failed");
  });

  it("maps the workspace profiles to supported API profiles", () => {
    expect(mapAgentProfile("lite")).toBe("manus-1.6-lite");
    expect(mapAgentProfile("standard")).toBe("manus-1.6");
    expect(mapAgentProfile("max")).toBe("manus-1.6-max");
  });

  it("redacts credential-like fragments from persisted failures", () => {
    expect(safeA11Error(new Error("Authorization: Bearer secret-value rejected"))).not.toContain("secret-value");
  });
});
