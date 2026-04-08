CREATE TABLE `appraisal_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appraisalId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`imageType` varchar(20) NOT NULL,
	`fileName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `appraisal_images_id` PRIMARY KEY(`id`)
);
