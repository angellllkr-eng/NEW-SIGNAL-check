CREATE TABLE `proof_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('founder_profile','credential','case_study','client_logo','testimonial') NOT NULL,
	`title` varchar(200) NOT NULL,
	`publicSummary` text,
	`evidenceUrl` varchar(2048),
	`permissionConfirmed` boolean NOT NULL DEFAULT false,
	`status` enum('draft','pending_approval','verified','published','archived') NOT NULL DEFAULT 'draft',
	`expiresAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proof_items_id` PRIMARY KEY(`id`)
);
