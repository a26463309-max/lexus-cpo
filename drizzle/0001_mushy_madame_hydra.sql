CREATE TABLE `appraisal_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`brand` varchar(50) NOT NULL,
	`model` varchar(100) NOT NULL,
	`year` varchar(10) NOT NULL,
	`mileage` varchar(20) NOT NULL,
	`relation` varchar(50) NOT NULL,
	`notes` text,
	`status` enum('pending','contacted','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appraisal_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`email` varchar(320),
	`licensePlate` varchar(20),
	`city` varchar(50),
	`district` varchar(50),
	`contactTime` varchar(50),
	`message` text,
	`status` enum('pending','contacted','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`series` varchar(20) NOT NULL,
	`model` varchar(100) NOT NULL,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`color` varchar(50) NOT NULL,
	`mileage` int NOT NULL,
	`price` int NOT NULL,
	`location` varchar(100) NOT NULL,
	`imageUrl` text,
	`engineType` varchar(50),
	`transmission` varchar(50),
	`displacement` varchar(50),
	`fuelType` varchar(50),
	`driveType` varchar(50),
	`seats` int,
	`exteriorFeatures` text,
	`interiorFeatures` text,
	`safetyFeatures` text,
	`description` text,
	`isNew` int DEFAULT 1,
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
