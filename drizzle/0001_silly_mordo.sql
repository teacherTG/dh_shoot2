CREATE TABLE `roster` (
	`classroom` integer NOT NULL,
	`student` integer NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`classroom`, `student`)
);
