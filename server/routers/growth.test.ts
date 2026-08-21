import { describe, expect, it } from "vitest";
import { leadInput, proofInput, trackEventInput } from "./growth";

describe("owned growth input contracts", () => {
  it("accepts an explicit-consent lead with a bounded Signal Map", () => {
    const parsed = leadInput.safeParse({
      name: "A. Example",
      email: "a@example.com",
      businessStage: "growing",
      need: "monthly-rhythm",
      urgency: "this-quarter",
      source: "signal-map-contact",
      diagnosticScore: 8,
      diagnosticLabel: "Tighten the rhythm",
      signalMap: "A short owned summary",
      consent: true,
      website: "",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects missing consent and unknown event names", () => {
    expect(leadInput.safeParse({ name: "A. Example", email: "a@example.com", consent: false }).success).toBe(false);
    expect(trackEventInput.safeParse({ sessionId: "12345678", eventName: "made_up_event", path: "/" }).success).toBe(false);
  });

  it("accepts a bounded primary CTA event", () => {
    expect(trackEventInput.safeParse({ sessionId: "12345678", eventName: "primary_cta_clicked", path: "/", metadata: { destination: "contact" } }).success).toBe(true);
  });

  it("accepts a private draft proof record but rejects malformed evidence links", () => {
    expect(proofInput.safeParse({ type: "credential", title: "Professional designation", status: "draft", permissionConfirmed: false }).success).toBe(true);
    expect(proofInput.safeParse({ type: "credential", title: "Professional designation", evidenceUrl: "not a url", status: "draft", permissionConfirmed: false }).success).toBe(false);
  });
});
