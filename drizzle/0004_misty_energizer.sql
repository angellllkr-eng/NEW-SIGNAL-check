CREATE TABLE `command_claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`statement` text NOT NULL,
	`category` enum('security','product','commercial','public_footprint','operational','other') NOT NULL DEFAULT 'other',
	`verification` enum('verified','observed','unverified','blocked') NOT NULL DEFAULT 'unverified',
	`confidence` enum('high','medium','low','unknown') NOT NULL DEFAULT 'unknown',
	`sourceIds` json,
	`notes` text,
	`lastReviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `command_claims_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `command_decisions` ADD `priorityScore` int;--> statement-breakpoint
ALTER TABLE `command_decisions` ADD `prioritySignals` json;