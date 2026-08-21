import { afterEach, describe, expect, it, vi } from "vitest";
import { createPrivateA11Task } from "./a11ManusApi";

describe("A11 Manus task client", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("creates a private, owner-started task with the safety boundary in the task instruction", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, task_id: "task-private-1", task_url: "https://manus.im/app/task-private-1" }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await createPrivateA11Task({
      purpose: "research_brief",
      instruction: "Review the current source gaps and identify safe follow-up research.",
      agentProfile: "standard",
    });

    expect(result.taskId).toBe("task-private-1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(request.body)) as { share_visibility: string; interactive_mode: boolean; message: { content: string } };
    expect(body.share_visibility).toBe("private");
    expect(body.interactive_mode).toBe(true);
    expect(body.message.content).toContain("Do not perform external actions");
    expect(body.message.content).toContain("Do not perform external actions, publish content, modify accounts");
  });
});
