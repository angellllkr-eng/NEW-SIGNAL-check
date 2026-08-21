import { desc, eq } from "drizzle-orm";
import {
  a11AgentJobs,
  commandClaims,
  commandDecisions,
  commandIncidents,
  commandInitiatives,
  commandRepositories,
  commandTasks,
  sourceArtifacts,
} from "../drizzle/schema";
import { getDb } from "./db";

export async function getCommandCenterSnapshot() {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");

  const [sources, incidents, initiatives, repositories, decisions, tasks, agentJobs, claims] = await Promise.all([
    db.select().from(sourceArtifacts).orderBy(desc(sourceArtifacts.observedAt)).limit(60),
    db.select().from(commandIncidents).orderBy(desc(commandIncidents.updatedAt)).limit(40),
    db.select().from(commandInitiatives).orderBy(desc(commandInitiatives.updatedAt)).limit(40),
    db.select().from(commandRepositories).orderBy(desc(commandRepositories.observedAt)).limit(60),
    db.select().from(commandDecisions).orderBy(desc(commandDecisions.updatedAt)).limit(60),
    db.select().from(commandTasks).orderBy(desc(commandTasks.updatedAt)).limit(100),
    db.select().from(a11AgentJobs).orderBy(desc(a11AgentJobs.updatedAt)).limit(50),
    db.select().from(commandClaims).orderBy(desc(commandClaims.updatedAt)).limit(60),
  ]);

  return { sources, incidents, initiatives, repositories, decisions, tasks, agentJobs, claims };
}

export async function createSourceArtifact(input: typeof sourceArtifacts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");
  const result = await db.insert(sourceArtifacts).values(input);
  return Number(result[0].insertId);
}

export async function createCommandIncident(input: typeof commandIncidents.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");
  const result = await db.insert(commandIncidents).values(input);
  return Number(result[0].insertId);
}

export async function createCommandDecision(input: typeof commandDecisions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");
  const result = await db.insert(commandDecisions).values(input);
  return Number(result[0].insertId);
}

export async function createCommandClaim(input: typeof commandClaims.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");
  const result = await db.insert(commandClaims).values(input);
  return Number(result[0].insertId);
}

export async function createCommandTask(input: typeof commandTasks.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");
  const result = await db.insert(commandTasks).values(input);
  return Number(result[0].insertId);
}

export async function createA11AgentJob(input: typeof a11AgentJobs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");
  const result = await db.insert(a11AgentJobs).values(input);
  return Number(result[0].insertId);
}

export async function getA11AgentJob(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");
  const result = await db.select().from(a11AgentJobs).where(eq(a11AgentJobs.id, id)).limit(1);
  return result[0];
}

export async function updateA11AgentJob(id: number, values: Partial<typeof a11AgentJobs.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Command-center storage is temporarily unavailable");
  await db.update(a11AgentJobs).set(values).where(eq(a11AgentJobs.id, id));
}
