export type A11JobStatus = "queued" | "running" | "needs_input" | "completed" | "failed" | "stopped";
export type ManusTaskStatus = "running" | "waiting" | "stopped" | "error";

export function mapManusTaskStatus(status: ManusTaskStatus): A11JobStatus {
  if (status === "running") return "running";
  if (status === "waiting") return "needs_input";
  if (status === "error") return "failed";
  return "stopped";
}

export function mapAgentProfile(profile: "lite" | "standard" | "max") {
  return profile === "lite" ? "manus-1.6-lite" : profile === "max" ? "manus-1.6-max" : "manus-1.6";
}

export function safeA11Error(error: unknown) {
  const message = error instanceof Error ? error.message : "The external agent request did not complete.";
  return message
    .replace(/authorization\s*:\s*bearer\s+\S+/gi, "authorization: bearer [redacted]")
    .replace(/(?:api[_ -]?key|token)\s*[:=]\s*\S+/gi, "credential redacted")
    .slice(0, 600);
}
