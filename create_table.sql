/* Database backups located on /scratch/aukey2/LivEnc-db-backups on osprey1 */

-- Relationship sentence description for related keywords

CREATE TABLE `rel_sentence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_id1` int(11) DEFAULT NULL,
  `keyword_id2` int(11) DEFAULT NULL,
  `content` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`keyword_id1`) REFERENCES keyword(`id`),
  FOREIGN KEY (`keyword_id2`) REFERENCES keyword(`id`)
);

CREATE TABLE `rel_sentence_label` (
  `rel_sentence_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `label` enum('inaccurate','incorrect') NOT NULL,
  `create_time` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`rel_sentence_id`),
  KEY `LABEL` (`rel_sentence_id`,`label`),
  FOREIGN KEY (`rel_sentence_id`) REFERENCES `rel_sentence` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);


-- Keyword example sentence usage

CREATE TABLE `ex_sentence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_id` int(11) DEFAULT NULL,
  `content` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`keyword_id`) REFERENCES keyword(`id`)
);

CREATE TABLE `ex_sentence_label` (
  `ex_sentence_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `label` enum('inaccurate','incorrect') NOT NULL,
  `create_time` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`ex_sentence_id`),
  KEY `LABEL` (`ex_sentence_id`,`label`),
  FOREIGN KEY (`ex_sentence_id`) REFERENCES `ex_sentence` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);


-- Top questions asked about keyword

CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_id` int(11) DEFAULT NULL,
  `content` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`keyword_id`) REFERENCES keyword(`id`)
);

CREATE TABLE `question_label` (
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `label` enum('inaccurate','incorrect') NOT NULL,
  `create_time` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`question_id`),
  KEY `LABEL` (`question_id`,`label`),
  FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);


-- Auto-generated keyword articles

CREATE TABLE `article_section` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_id` int(11) DEFAULT NULL,
  `order` TINYINT NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`keyword_id`) REFERENCES keyword(`id`)
);

CREATE TABLE `sect_paragraph` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section_id` int(11) DEFAULT NULL,
  `order` TINYINT NOT NULL,
  `source_url` varchar(255) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`section_id`) REFERENCES `article_section` (`id`)
);

CREATE TABLE `sect_paragraph_label` (
  `sect_paragraph_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `label` enum('uninformative','irrelevant') NOT NULL,
  `create_time` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`sect_paragraph_id`),
  KEY `LABEL` (`sect_paragraph_id`,`label`),
  FOREIGN KEY (`sect_paragraph_id`) REFERENCES `sect_paragraph` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);