import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createStandardUserContext(): TrpcContext {
  return {
    user: {
      id: 77,
      openId: "standard-user",
      email: "standard@example.com",
      name: "Standard User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("commandCenter access", () => {
  it("rejects non-owner access before private workspace data is queried", async () => {
    const caller = appRouter.createCaller(createStandardUserContext());
    await expect(caller.commandCenter.snapshot()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
