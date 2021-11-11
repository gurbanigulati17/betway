-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 23, 2021 at 03:56 AM
-- Server version: 5.7.34
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lordproe_lords`
--
CREATE DATABASE IF NOT EXISTS `lords` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `lords`;

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE `activity` (
  `username` varchar(10) NOT NULL,
  `IP_Address` varchar(40) DEFAULT NULL,
  `action` enum('login','logout') DEFAULT NULL,
  `status` enum('success','failure') DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `country` varchar(20) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `name` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `username` enum('admin') NOT NULL,
  `coins_generated` bigint(20) NOT NULL DEFAULT '0',
  `coins_withdrawn` bigint(20) NOT NULL DEFAULT '0',
  `password` varchar(70) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `adsetransactions`
--

CREATE TABLE `adsetransactions` (
  `transaction_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deposited` decimal(11,2) DEFAULT NULL,
  `withdrawn` decimal(11,2) DEFAULT NULL,
  `description` varchar(120) NOT NULL,
  `type` enum('fc','se','pl') NOT NULL DEFAULT 'fc',
  `balance` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `alltransactions`
--

CREATE TABLE `alltransactions` (
  `transaction_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deposited` decimal(11,2) DEFAULT NULL,
  `withdrawn` decimal(11,2) DEFAULT NULL,
  `description` varchar(150) NOT NULL,
  `type` enum('fc','se','pl') NOT NULL DEFAULT 'fc',
  `balance` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `betmap`
--

CREATE TABLE `betmap` (
  `username` varchar(10) NOT NULL,
  `bet_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bets`
--

CREATE TABLE `bets` (
  `bet_id` int(11) NOT NULL,
  `event` varchar(60) NOT NULL,
  `event_id` varchar(15) NOT NULL,
  `market` varchar(30) DEFAULT NULL,
  `market_id` varchar(18) DEFAULT NULL,
  `runner` varchar(60) NOT NULL,
  `runner_id` varchar(28) NOT NULL,
  `odds` decimal(5,2) NOT NULL,
  `selection` enum('back','lay') NOT NULL,
  `stake` decimal(9,2) NOT NULL,
  `user_rate` decimal(4,0) DEFAULT NULL,
  `winner` varchar(60) DEFAULT NULL,
  `pass` decimal(4,0) DEFAULT NULL,
  `IP_Address` varchar(40) NOT NULL,
  `type` enum('exchange','bookmaker','fancy') NOT NULL,
  `sport` varchar(15) NOT NULL,
  `state` enum('matched','unmatched','void','settled') NOT NULL,
  `profit_loss` decimal(9,2) DEFAULT NULL,
  `profit_loss_wc` decimal(9,2) DEFAULT NULL,
  `placed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `settled_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `blockedfancies`
--

CREATE TABLE `blockedfancies` (
  `eventId` varchar(20) NOT NULL,
  `sessionId` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `clientbook`
--

CREATE TABLE `clientbook` (
  `id` int(11) NOT NULL,
  `runner` varchar(15) NOT NULL,
  `netProfit` decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `clientbookmap`
--

CREATE TABLE `clientbookmap` (
  `id` int(11) NOT NULL,
  `username` varchar(10) NOT NULL,
  `event` varchar(15) NOT NULL,
  `market` varchar(18) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eventexposure`
--

CREATE TABLE `eventexposure` (
  `id` int(11) NOT NULL,
  `event_exposure` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `fancy`
--

CREATE TABLE `fancy` (
  `id` varchar(20) NOT NULL,
  `min` decimal(9,2) NOT NULL DEFAULT '100.00',
  `max` decimal(9,2) NOT NULL DEFAULT '50000.00',
  `status` enum('on','off') NOT NULL DEFAULT 'on',
  `timer` decimal(3,1) NOT NULL DEFAULT '2.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `isclient`
--

CREATE TABLE `isclient` (
  `uplink` varchar(10) NOT NULL,
  `downlink` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `limitfancyrisk`
--

CREATE TABLE `limitfancyrisk` (
  `id` int(11) NOT NULL,
  `min_stake` decimal(9,2) NOT NULL DEFAULT '100.00',
  `max_stake` decimal(9,2) NOT NULL DEFAULT '500000.00',
  `max_profit` decimal(9,2) NOT NULL DEFAULT '500000.00',
  `status` enum('on','off') NOT NULL DEFAULT 'on',
  `timer` decimal(3,1) NOT NULL DEFAULT '2.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `limitmap`
--

CREATE TABLE `limitmap` (
  `id` int(11) NOT NULL,
  `username` varchar(10) NOT NULL,
  `event_type` enum('1','2','4','5') NOT NULL,
  `last_up_by` enum('def','1','2','3','4') NOT NULL DEFAULT 'def'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `limitrisk`
--

CREATE TABLE `limitrisk` (
  `id` int(11) NOT NULL,
  `min_stake` decimal(9,2) NOT NULL DEFAULT '100.00',
  `max_stake` decimal(9,2) NOT NULL DEFAULT '100000.00',
  `max_profit` decimal(9,2) NOT NULL DEFAULT '2000000.00',
  `adv_max_profit` decimal(9,2) NOT NULL DEFAULT '25000.00',
  `adv_max_stake` decimal(9,2) NOT NULL DEFAULT '25000.00',
  `min_odds` decimal(5,2) NOT NULL DEFAULT '1.01',
  `max_odds` decimal(6,2) NOT NULL DEFAULT '100.00',
  `status` enum('on','off') NOT NULL DEFAULT 'on',
  `timer` decimal(3,1) NOT NULL DEFAULT '5.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `limitsports`
--

CREATE TABLE `limitsports` (
  `id` int(11) NOT NULL,
  `status` enum('on','off') NOT NULL DEFAULT 'on'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `market`
--

CREATE TABLE `market` (
  `id` varchar(20) NOT NULL,
  `name` varchar(45) NOT NULL,
  `marketStartTime` varchar(30) NOT NULL,
  `match_id` varchar(20) NOT NULL,
  `min` decimal(7,2) NOT NULL DEFAULT '100.00',
  `max` decimal(10,2) NOT NULL DEFAULT '100000.00',
  `adv_max` decimal(9,2) NOT NULL DEFAULT '25000.00',
  `status` enum('off','on') NOT NULL DEFAULT 'on',
  `manual` enum('yes','no') NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `id` varchar(20) NOT NULL,
  `name` varchar(60) NOT NULL,
  `openDate` varchar(30) NOT NULL,
  `series_id` varchar(20) NOT NULL,
  `status` enum('on','off') NOT NULL DEFAULT 'on',
  `timer` decimal(3,1) NOT NULL DEFAULT '5.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `runner`
--

CREATE TABLE `runner` (
  `selectionId` varchar(28) NOT NULL,
  `market_id` varchar(20) NOT NULL,
  `name` varchar(60) NOT NULL,
  `sort_priority` tinyint(4) NOT NULL,
  `back` decimal(4,2) DEFAULT NULL,
  `lay` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

CREATE TABLE `series` (
  `id` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `competitionRegion` varchar(15) NOT NULL,
  `sport` enum('1','2','4') NOT NULL,
  `cupRate` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sports`
--

CREATE TABLE `sports` (
  `event_type` enum('1','2','4','5') NOT NULL,
  `name` varchar(30) NOT NULL,
  `status` enum('on','off') NOT NULL DEFAULT 'on'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `stakelabel`
--

CREATE TABLE `stakelabel` (
  `username` varchar(10) NOT NULL,
  `stake1` varchar(12) NOT NULL DEFAULT '100',
  `stake2` varchar(12) NOT NULL DEFAULT '200',
  `stake3` varchar(12) NOT NULL DEFAULT '300',
  `stake4` varchar(12) NOT NULL DEFAULT '500',
  `stake5` varchar(12) NOT NULL DEFAULT '1000',
  `stake6` varchar(12) NOT NULL DEFAULT '10000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `stakevalue`
--

CREATE TABLE `stakevalue` (
  `username` varchar(10) NOT NULL,
  `stake1` decimal(7,2) NOT NULL DEFAULT '100.00',
  `stake2` decimal(7,2) NOT NULL DEFAULT '200.00',
  `stake3` decimal(7,2) NOT NULL DEFAULT '300.00',
  `stake4` decimal(7,2) NOT NULL DEFAULT '500.00',
  `stake5` decimal(8,2) NOT NULL DEFAULT '1000.00',
  `stake6` decimal(8,2) NOT NULL DEFAULT '10000.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `superadmin`
--

CREATE TABLE `superadmin` (
  `username` enum('superadmin') NOT NULL DEFAULT 'superadmin',
  `password` varchar(70) NOT NULL,
  `message` varchar(200) NOT NULL DEFAULT 'Welcome'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transactionmap`
--

CREATE TABLE `transactionmap` (
  `transaction_id` int(11) NOT NULL,
  `username` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(10) NOT NULL,
  `usertype` enum('2','3','4','5') NOT NULL,
  `password` varchar(80) NOT NULL,
  `fullname` varchar(45) NOT NULL,
  `credit_limit` decimal(12,2) NOT NULL DEFAULT '0.00',
  `balance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `credit_ref` decimal(12,2) NOT NULL DEFAULT '0.00',
  `exposure` decimal(10,2) NOT NULL DEFAULT '0.00',
  `winnings` decimal(10,2) NOT NULL DEFAULT '0.00',
  `suspended` tinyint(1) NOT NULL DEFAULT '0',
  `bet_suspended` tinyint(1) NOT NULL DEFAULT '0',
  `password_changed` tinyint(1) NOT NULL DEFAULT '0',
  `token` varchar(350) DEFAULT NULL,
  `r_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `commission` decimal(4,3) DEFAULT '0.020',
  `any_odds` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`username`,`time`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `adsetransactions`
--
ALTER TABLE `adsetransactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `created_at_index` (`created_at`);

--
-- Indexes for table `alltransactions`
--
ALTER TABLE `alltransactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `created_index` (`created_at`);

--
-- Indexes for table `betmap`
--
ALTER TABLE `betmap`
  ADD PRIMARY KEY (`bet_id`),
  ADD KEY `client_username_idx` (`username`);

--
-- Indexes for table `bets`
--
ALTER TABLE `bets`
  ADD PRIMARY KEY (`bet_id`),
  ADD KEY `sport_index` (`sport`),
  ADD KEY `event_index` (`event_id`,`market_id`,`runner_id`,`state`);

--
-- Indexes for table `blockedfancies`
--
ALTER TABLE `blockedfancies`
  ADD PRIMARY KEY (`eventId`,`sessionId`);

--
-- Indexes for table `clientbook`
--
ALTER TABLE `clientbook`
  ADD PRIMARY KEY (`id`,`runner`);

--
-- Indexes for table `clientbookmap`
--
ALTER TABLE `clientbookmap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_index` (`username`,`event`,`market`);

--
-- Indexes for table `eventexposure`
--
ALTER TABLE `eventexposure`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fancy`
--
ALTER TABLE `fancy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `isclient`
--
ALTER TABLE `isclient`
  ADD KEY `uplink_user_idx` (`uplink`),
  ADD KEY `down_user_idx` (`downlink`);

--
-- Indexes for table `limitfancyrisk`
--
ALTER TABLE `limitfancyrisk`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `limitmap`
--
ALTER TABLE `limitmap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_user_idx` (`username`),
  ADD KEY `event_type_idx` (`event_type`);

--
-- Indexes for table `limitrisk`
--
ALTER TABLE `limitrisk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `limit_id_idx` (`id`);

--
-- Indexes for table `limitsports`
--
ALTER TABLE `limitsports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `market`
--
ALTER TABLE `market`
  ADD PRIMARY KEY (`id`),
  ADD KEY `match_id_idx` (`match_id`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `series_idx` (`series_id`);

--
-- Indexes for table `runner`
--
ALTER TABLE `runner`
  ADD PRIMARY KEY (`selectionId`,`market_id`),
  ADD KEY `market_idx` (`market_id`);

--
-- Indexes for table `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sport_id_idx` (`sport`);

--
-- Indexes for table `sports`
--
ALTER TABLE `sports`
  ADD PRIMARY KEY (`event_type`);

--
-- Indexes for table `stakelabel`
--
ALTER TABLE `stakelabel`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `stakevalue`
--
ALTER TABLE `stakevalue`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `superadmin`
--
ALTER TABLE `superadmin`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `transactionmap`
--
ALTER TABLE `transactionmap`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `username_idx` (`username`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adsetransactions`
--
ALTER TABLE `adsetransactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `betmap`
--
ALTER TABLE `betmap`
  MODIFY `bet_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bets`
--
ALTER TABLE `bets`
  MODIFY `bet_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientbookmap`
--
ALTER TABLE `clientbookmap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `limitmap`
--
ALTER TABLE `limitmap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactionmap`
--
ALTER TABLE `transactionmap`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity`
--
ALTER TABLE `activity`
  ADD CONSTRAINT `user` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `alltransactions`
--
ALTER TABLE `alltransactions`
  ADD CONSTRAINT `transaction_id` FOREIGN KEY (`transaction_id`) REFERENCES `transactionmap` (`transaction_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `betmap`
--
ALTER TABLE `betmap`
  ADD CONSTRAINT `client_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `bets`
--
ALTER TABLE `bets`
  ADD CONSTRAINT `betId` FOREIGN KEY (`bet_id`) REFERENCES `betmap` (`bet_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blockedfancies`
--
ALTER TABLE `blockedfancies`
  ADD CONSTRAINT `matchId` FOREIGN KEY (`eventId`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `clientbook`
--
ALTER TABLE `clientbook`
  ADD CONSTRAINT `book_id` FOREIGN KEY (`id`) REFERENCES `clientbookmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eventexposure`
--
ALTER TABLE `eventexposure`
  ADD CONSTRAINT `bookId` FOREIGN KEY (`id`) REFERENCES `clientbookmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `fancy`
--
ALTER TABLE `fancy`
  ADD CONSTRAINT `event_ID` FOREIGN KEY (`id`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `isclient`
--
ALTER TABLE `isclient`
  ADD CONSTRAINT `down_user` FOREIGN KEY (`downlink`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `up_user` FOREIGN KEY (`uplink`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `limitfancyrisk`
--
ALTER TABLE `limitfancyrisk`
  ADD CONSTRAINT `limit_key` FOREIGN KEY (`id`) REFERENCES `limitmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `limitmap`
--
ALTER TABLE `limitmap`
  ADD CONSTRAINT `client_user` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_type` FOREIGN KEY (`event_type`) REFERENCES `sports` (`event_type`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `limitrisk`
--
ALTER TABLE `limitrisk`
  ADD CONSTRAINT `limit_id` FOREIGN KEY (`id`) REFERENCES `limitmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `limitsports`
--
ALTER TABLE `limitsports`
  ADD CONSTRAINT `another_limit_id` FOREIGN KEY (`id`) REFERENCES `limitmap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `market`
--
ALTER TABLE `market`
  ADD CONSTRAINT `match_id` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `series` FOREIGN KEY (`series_id`) REFERENCES `series` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `runner`
--
ALTER TABLE `runner`
  ADD CONSTRAINT `market` FOREIGN KEY (`market_id`) REFERENCES `market` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `series`
--
ALTER TABLE `series`
  ADD CONSTRAINT `sport_id` FOREIGN KEY (`sport`) REFERENCES `sports` (`event_type`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stakelabel`
--
ALTER TABLE `stakelabel`
  ADD CONSTRAINT `client` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stakevalue`
--
ALTER TABLE `stakevalue`
  ADD CONSTRAINT `c_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactionmap`
--
ALTER TABLE `transactionmap`
  ADD CONSTRAINT `cl_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
