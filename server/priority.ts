export type PrioritySignal = {
  securityExposure: number;
  revenueProximity: number;
  marketEvidence: number;
  releaseReadiness: number;
  blockerSeverity: number;
  confidence: number;
  effort: number;
};

export type PriorityScore = {
  total: number;
  band: "p0" | "p1" | "p2" | "p3";
  rationale: string;
};

const clamp = (value: number) => Math.max(0, Math.min(5, value));

/**
 * Scores the urgency of a candidate work item from explicit 0–5 signals.
 * Security, release blockers, and proximity to a validated revenue move are weighted highest.
 * Confidence raises prioritization; effort reduces it so the queue remains executable.
 */
export function scorePriority(input: PrioritySignal): PriorityScore {
  const securityExposure = clamp(input.securityExposure);
  const revenueProximity = clamp(input.revenueProximity);
  const marketEvidence = clamp(input.marketEvidence);
  const releaseReadiness = clamp(input.releaseReadiness);
  const blockerSeverity = clamp(input.blockerSeverity);
  const confidence = clamp(input.confidence);
  const effort = clamp(input.effort);

  const total = Math.round(
    securityExposure * 7 +
      revenueProximity * 5 +
      marketEvidence * 3 +
      releaseReadiness * 4 +
      blockerSeverity * 6 +
      confidence * 3 -
      effort * 2,
  );

  const band = total >= 78 ? "p0" : total >= 55 ? "p1" : total >= 32 ? "p2" : "p3";
  const strongestDrivers = [
    { name: "security exposure", value: securityExposure },
    { name: "release blocker", value: blockerSeverity },
    { name: "revenue proximity", value: revenueProximity },
    { name: "release readiness", value: releaseReadiness },
    { name: "market evidence", value: marketEvidence },
  ]
    .filter((item) => item.value >= 3)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((item) => item.name);

  const rationale = strongestDrivers.length
    ? `Driven by ${strongestDrivers.join(" and ")}; confidence ${confidence}/5, effort ${effort}/5.`
    : `No elevated driver recorded; confidence ${confidence}/5, effort ${effort}/5.`;

  return { total, band, rationale };
}
