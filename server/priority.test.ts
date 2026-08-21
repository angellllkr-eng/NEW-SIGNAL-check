import { describe, expect, it } from "vitest";
import { scorePriority } from "./priority";

describe("scorePriority", () => {
  it("elevates a high-confidence security and release blocker to P0", () => {
    const result = scorePriority({ securityExposure: 5, revenueProximity: 2, marketEvidence: 2, releaseReadiness: 4, blockerSeverity: 5, confidence: 5, effort: 2 });
    expect(result.band).toBe("p0");
    expect(result.total).toBeGreaterThanOrEqual(78);
    expect(result.rationale).toContain("security exposure");
  });

  it("keeps a low-evidence, high-effort idea in a lower priority band", () => {
    const result = scorePriority({ securityExposure: 0, revenueProximity: 1, marketEvidence: 0, releaseReadiness: 1, blockerSeverity: 0, confidence: 0, effort: 5 });
    expect(result.band).toBe("p3");
  });

  it("clamps out-of-range inputs rather than overstating priority", () => {
    const result = scorePriority({ securityExposure: 12, revenueProximity: -4, marketEvidence: 0, releaseReadiness: 0, blockerSeverity: 0, confidence: 0, effort: 0 });
    expect(result.total).toBe(35);
  });
});
