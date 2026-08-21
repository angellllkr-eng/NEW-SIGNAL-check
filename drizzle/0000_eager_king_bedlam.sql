CREATE TABLE `conversion_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(120),
	`eventName` varchar(100) NOT NULL,
	`path` varchar(320),
	`leadId` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversion_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(160),
	`role` varchar(120),
	`businessStage` varchar(80),
	`need` varchar(120),
	`urgency` varchar(80),
	`message` text,
	`source` varchar(80) NOT NULL DEFAULT 'website',
	`diagnosticScore` int,
	`diagnosticLabel` varchar(100),
	`signalMap` text,
	`consent` boolean NOT NULL DEFAULT false,
	`status` enum('new','reviewing','qualified','nurture','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
