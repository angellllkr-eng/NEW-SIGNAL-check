import {z} from "zod";

export const agentOperatorCommandSchema = z.object({
  id: z.string().min(1),
  action: z.string().min(1),
  input: z.record(z.string(), z.unknown()),
  context: z.record(z.string(), z.unknown()).optional(),
  requested_by: z.string().optional(),
  evidence_required: z.boolean().optional(),
}).strict();

export type AgentOperatorCommand = z.infer<typeof agentOperatorCommandSchema>;

export function parseAgentOperatorCommand(value: unknown): AgentOperatorCommand {
  return agentOperatorCommandSchema.parse(value);
}
