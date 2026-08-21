CREATE TABLE `command_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(280) NOT NULL,
	`category` enum('security','release','product','growth','operations','research') NOT NULL,
	`status` enum('queued','in_progress','blocked','decided','deferred') NOT NULL DEFAULT 'queued',
	`priority` enum('p0','p1','p2','p3') NOT NULL DEFAULT 'p2',
	`effort` enum('small','medium','large','unknown') NOT NULL DEFAULT 'unknown',
	`rationale` text,
	`owner` varchar(160),
	`sourceIds` json,
	`dueAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `command_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `command_incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(240) NOT NULL,
	`severity` enum('critical','high','medium','low') NOT NULL DEFAULT 'medium',
	`status` enum('reported','investigating','contained','resolved','monitoring') NOT NULL DEFAULT 'reported',
	`verification` enum('verified','observed','unverified','blocked') NOT NULL DEFAULT 'unverified',
	`summary` text,
	`impact` text,
	`sourceIds` json,
	`openedAt` timestamp,
	`lastVerifiedAt` timestamp,
	`nextReviewAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `command_incidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `command_initiatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`productLine` varchar(160),
	`stage` enum('discovery','validation','build','release_candidate','live','paused','archived') NOT NULL DEFAULT 'discovery',
	`verification` enum('verified','observed','unverified','blocked') NOT NULL DEFAULT 'observed',
	`revenueState` enum('not_assessed','hypothesis','ready_to_validate','revenue_observed','blocked') NOT NULL DEFAULT 'not_assessed',
	`owner` varchar(160),
	`primaryGoal` varchar(320),
	`summary` text,
	`sourceUrl` varchar(2048),
	`lastVerifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `command_initiatives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `command_repositories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`repoFullName` varchar(240) NOT NULL,
	`visibility` enum('public','private','internal','unknown') NOT NULL DEFAULT 'unknown',
	`primaryRole` varchar(200),
	`defaultBranch` varchar(120),
	`workflowStatus` enum('healthy','failing','unknown','unavailable') NOT NULL DEFAULT 'unknown',
	`deploymentStatus` enum('live','degraded','unknown','unavailable') NOT NULL DEFAULT 'unknown',
	`openIssueCount` int NOT NULL DEFAULT 0,
	`lastPushedAt` timestamp,
	`observedAt` timestamp NOT NULL DEFAULT (now()),
	`sourceUrl` varchar(2048),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `command_repositories_id` PRIMARY KEY(`id`),
	CONSTRAINT `command_repositories_repoFullName_unique` UNIQUE(`repoFullName`)
);
--> statement-breakpoint
CREATE TABLE `command_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`decisionId` int,
	`title` varchar(280) NOT NULL,
	`status` enum('todo','in_progress','blocked','done') NOT NULL DEFAULT 'todo',
	`owner` varchar(160),
	`dueAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `command_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `source_artifacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(240) NOT NULL,
	`kind` enum('document','repository','deployment','endpoint','log','issue','other') NOT NULL,
	`sourceType` enum('drive','github','public_web','vercel','manual','other') NOT NULL,
	`sourceUrl` varchar(2048),
	`sourceRef` varchar(320),
	`sensitivity` enum('private','restricted','public') NOT NULL DEFAULT 'private',
	`verification` enum('verified','observed','unverified','blocked') NOT NULL DEFAULT 'observed',
	`freshness` enum('current','aging','stale','unknown') NOT NULL DEFAULT 'unknown',
	`summary` text,
	`tags` json,
	`observedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `source_artifacts_id` PRIMARY KEY(`id`)
);
