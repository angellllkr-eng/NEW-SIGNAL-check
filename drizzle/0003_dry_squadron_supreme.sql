CREATE TABLE `a11_agent_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purpose` varchar(240) NOT NULL,
	`instruction` text NOT NULL,
	`inputSourceIds` json,
	`agentProfile` enum('lite','standard','max') NOT NULL DEFAULT 'standard',
	`manusTaskId` varchar(160),
	`status` enum('queued','running','needs_input','completed','failed','stopped') NOT NULL DEFAULT 'queued',
	`resultSummary` text,
	`resultUrl` varchar(2048),
	`errorMessage` text,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`lastPolledAt` timestamp,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `a11_agent_jobs_id` PRIMARY KEY(`id`)
);
