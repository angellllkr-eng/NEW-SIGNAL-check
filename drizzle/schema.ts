import { boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Public enquiries stored by the owned first-party qualification workflow. */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 160 }),
  role: varchar("role", { length: 120 }),
  businessStage: varchar("businessStage", { length: 80 }),
  need: varchar("need", { length: 120 }),
  urgency: varchar("urgency", { length: 80 }),
  message: text("message"),
  source: varchar("source", { length: 80 }).notNull().default("website"),
  diagnosticScore: int("diagnosticScore"),
  diagnosticLabel: varchar("diagnosticLabel", { length: 100 }),
  signalMap: text("signalMap"),
  consent: boolean("consent").notNull().default(false),
  status: mysqlEnum("status", ["new", "reviewing", "qualified", "nurture", "closed"]).notNull().default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Lightweight first-party event stream for CRO measurement without third-party pixel dependency. */
export const conversionEvents = mysqlTable("conversion_events", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 120 }),
  eventName: varchar("eventName", { length: 100 }).notNull(),
  path: varchar("path", { length: 320 }),
  leadId: int("leadId"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Owner-managed evidence records. Nothing becomes public unless separately verified and published. */
export const proofItems = mysqlTable("proof_items", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["founder_profile", "credential", "case_study", "client_logo", "testimonial"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  publicSummary: text("publicSummary"),
  evidenceUrl: varchar("evidenceUrl", { length: 2048 }),
  permissionConfirmed: boolean("permissionConfirmed").notNull().default(false),
  status: mysqlEnum("status", ["draft", "pending_approval", "verified", "published", "archived"]).notNull().default("draft"),
  expiresAt: timestamp("expiresAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Private source registry. Stores provenance and metadata only; never stores source-file bytes or credentials. */
export const sourceArtifacts = mysqlTable("source_artifacts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 240 }).notNull(),
  kind: mysqlEnum("kind", ["document", "repository", "deployment", "endpoint", "log", "issue", "other"]).notNull(),
  sourceType: mysqlEnum("sourceType", ["drive", "github", "public_web", "vercel", "manual", "other"]).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 2048 }),
  sourceRef: varchar("sourceRef", { length: 320 }),
  sensitivity: mysqlEnum("sensitivity", ["private", "restricted", "public"]).notNull().default("private"),
  verification: mysqlEnum("verification", ["verified", "observed", "unverified", "blocked"]).notNull().default("observed"),
  freshness: mysqlEnum("freshness", ["current", "aging", "stale", "unknown"]).notNull().default("unknown"),
  summary: text("summary"),
  tags: json("tags"),
  observedAt: timestamp("observedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Private incident ledger. Incident statements remain explicitly scoped to their verification state. */
export const commandIncidents = mysqlTable("command_incidents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 240 }).notNull(),
  severity: mysqlEnum("severity", ["critical", "high", "medium", "low"]).notNull().default("medium"),
  status: mysqlEnum("status", ["reported", "investigating", "contained", "resolved", "monitoring"]).notNull().default("reported"),
  verification: mysqlEnum("verification", ["verified", "observed", "unverified", "blocked"]).notNull().default("unverified"),
  summary: text("summary"),
  impact: text("impact"),
  sourceIds: json("sourceIds"),
  openedAt: timestamp("openedAt"),
  lastVerifiedAt: timestamp("lastVerifiedAt"),
  nextReviewAt: timestamp("nextReviewAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Product and workstream portfolio, intentionally distinct from source verification and revenue claims. */
export const commandInitiatives = mysqlTable("command_initiatives", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  productLine: varchar("productLine", { length: 160 }),
  stage: mysqlEnum("stage", ["discovery", "validation", "build", "release_candidate", "live", "paused", "archived"]).notNull().default("discovery"),
  verification: mysqlEnum("verification", ["verified", "observed", "unverified", "blocked"]).notNull().default("observed"),
  revenueState: mysqlEnum("revenueState", ["not_assessed", "hypothesis", "ready_to_validate", "revenue_observed", "blocked"]).notNull().default("not_assessed"),
  owner: varchar("owner", { length: 160 }),
  primaryGoal: varchar("primaryGoal", { length: 320 }),
  summary: text("summary"),
  sourceUrl: varchar("sourceUrl", { length: 2048 }),
  lastVerifiedAt: timestamp("lastVerifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Repository and deployment-health register. Connector gaps are recorded, never assumed healthy. */
export const commandRepositories = mysqlTable("command_repositories", {
  id: int("id").autoincrement().primaryKey(),
  repoFullName: varchar("repoFullName", { length: 240 }).notNull().unique(),
  visibility: mysqlEnum("visibility", ["public", "private", "internal", "unknown"]).notNull().default("unknown"),
  primaryRole: varchar("primaryRole", { length: 200 }),
  defaultBranch: varchar("defaultBranch", { length: 120 }),
  workflowStatus: mysqlEnum("workflowStatus", ["healthy", "failing", "unknown", "unavailable"]).notNull().default("unknown"),
  deploymentStatus: mysqlEnum("deploymentStatus", ["live", "degraded", "unknown", "unavailable"]).notNull().default("unknown"),
  openIssueCount: int("openIssueCount").notNull().default(0),
  lastPushedAt: timestamp("lastPushedAt"),
  observedAt: timestamp("observedAt").defaultNow().notNull(),
  sourceUrl: varchar("sourceUrl", { length: 2048 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Decision ledger ties priorities to evidence, avoids opaque ranking, and preserves responsibility. */
export const commandDecisions = mysqlTable("command_decisions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 280 }).notNull(),
  category: mysqlEnum("category", ["security", "release", "product", "growth", "operations", "research"]).notNull(),
  status: mysqlEnum("status", ["queued", "in_progress", "blocked", "decided", "deferred"]).notNull().default("queued"),
  priority: mysqlEnum("priority", ["p0", "p1", "p2", "p3"]).notNull().default("p2"),
  effort: mysqlEnum("effort", ["small", "medium", "large", "unknown"]).notNull().default("unknown"),
  rationale: text("rationale"),
  priorityScore: int("priorityScore"),
  prioritySignals: json("prioritySignals"),
  owner: varchar("owner", { length: 160 }),
  sourceIds: json("sourceIds"),
  dueAt: timestamp("dueAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Claims are auditable statements under review, kept separate from verified operating facts. */
export const commandClaims = mysqlTable("command_claims", {
  id: int("id").autoincrement().primaryKey(),
  statement: text("statement").notNull(),
  category: mysqlEnum("category", ["security", "product", "commercial", "public_footprint", "operational", "other"]).notNull().default("other"),
  verification: mysqlEnum("verification", ["verified", "observed", "unverified", "blocked"]).notNull().default("unverified"),
  confidence: mysqlEnum("confidence", ["high", "medium", "low", "unknown"]).notNull().default("unknown"),
  sourceIds: json("sourceIds"),
  notes: text("notes"),
  lastReviewedAt: timestamp("lastReviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Executable follow-through records, linked to decisions but never used to authorize external mutations automatically. */
export const commandTasks = mysqlTable("command_tasks", {
  id: int("id").autoincrement().primaryKey(),
  decisionId: int("decisionId"),
  title: varchar("title", { length: 280 }).notNull(),
  status: mysqlEnum("status", ["todo", "in_progress", "blocked", "done"]).notNull().default("todo"),
  owner: varchar("owner", { length: 160 }),
  dueAt: timestamp("dueAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Owner-started Manus tasks. This table records intent and lifecycle state, never credentials or unchecked external-action confirmations. */
export const a11AgentJobs = mysqlTable("a11_agent_jobs", {
  id: int("id").autoincrement().primaryKey(),
  purpose: varchar("purpose", { length: 240 }).notNull(),
  instruction: text("instruction").notNull(),
  inputSourceIds: json("inputSourceIds"),
  agentProfile: mysqlEnum("agentProfile", ["lite", "standard", "max"]).notNull().default("standard"),
  manusTaskId: varchar("manusTaskId", { length: 160 }),
  status: mysqlEnum("status", ["queued", "running", "needs_input", "completed", "failed", "stopped"]).notNull().default("queued"),
  resultSummary: text("resultSummary"),
  resultUrl: varchar("resultUrl", { length: 2048 }),
  errorMessage: text("errorMessage"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  lastPolledAt: timestamp("lastPolledAt"),
  createdByUserId: int("createdByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type ProofItem = typeof proofItems.$inferSelect;
export type SourceArtifact = typeof sourceArtifacts.$inferSelect;
export type CommandIncident = typeof commandIncidents.$inferSelect;
export type CommandInitiative = typeof commandInitiatives.$inferSelect;
export type CommandRepository = typeof commandRepositories.$inferSelect;
export type CommandDecision = typeof commandDecisions.$inferSelect;
export type CommandClaim = typeof commandClaims.$inferSelect;
export type CommandTask = typeof commandTasks.$inferSelect;
export type A11AgentJob = typeof a11AgentJobs.$inferSelect;
