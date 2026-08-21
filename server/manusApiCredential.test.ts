import { describe, expect, it } from "vitest";

describe("Manus API credential", () => {
  it("authenticates against the lightweight task-list endpoint", async () => {
    const apiKey = process.env.MANUS_API_KEY;
    expect(apiKey, "MANUS_API_KEY must be configured for A11 agent runs").toBeTruthy();

    const response = await fetch("https://api.manus.ai/v2/task.list?limit=1", {
      headers: { "x-manus-api-key": apiKey! },
    });

    expect(response.ok, `Manus API credential validation failed with HTTP ${response.status}`).toBe(true);
    const body = (await response.json()) as { ok?: boolean };
    expect(body.ok).toBe(true);
  }, 20_000);
});
