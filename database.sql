-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 12, 2025 at 02:57 AM
-- Server version: 11.4.8-MariaDB
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hostvoch_webapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` varchar(50) NOT NULL DEFAULT 'records',
  `daily_value` int(11) DEFAULT 0,
  `daily_date` timestamp NULL DEFAULT NULL,
  `monthly_value` int(11) DEFAULT 0,
  `monthly_date` timestamp NULL DEFAULT NULL,
  `seasonal_value` int(11) DEFAULT 0,
  `seasonal_date` timestamp NULL DEFAULT NULL,
  `yearly_value` int(11) DEFAULT 0,
  `yearly_date` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `daily_value`, `daily_date`, `monthly_value`, `monthly_date`, `seasonal_value`, `seasonal_date`, `yearly_value`, `yearly_date`, `updated_at`) VALUES
('records', 0, NULL, 0, NULL, 0, NULL, 0, NULL, '2025-08-19 01:06:37');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `image_hint` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaign_analytics`
--

CREATE TABLE `campaign_analytics` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `campaign_id` varchar(36) DEFAULT NULL,
  `visitor_id` varchar(36) DEFAULT NULL,
  `conversion_type` varchar(50) DEFAULT NULL,
  `conversion_value` decimal(10,2) DEFAULT NULL,
  `attributed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `click_events`
--

CREATE TABLE `click_events` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `product_id` varchar(36) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_type` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `referrer` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deal_requests`
--

CREATE TABLE `deal_requests` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `user_email` varchar(255) DEFAULT NULL,
  `service_type` varchar(100) DEFAULT NULL,
  `provider_name` varchar(255) DEFAULT NULL,
  `additional_notes` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_campaigns`
--

CREATE TABLE `email_campaigns` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `template_id` int(11) DEFAULT NULL,
  `status` enum('draft','scheduled','sending','sent','cancelled') DEFAULT 'draft',
  `recipient_count` int(11) DEFAULT 0,
  `sent_count` int(11) DEFAULT 0,
  `open_count` int(11) DEFAULT 0,
  `click_count` int(11) DEFAULT 0,
  `bounce_count` int(11) DEFAULT 0,
  `scheduled_at` datetime DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_campaign_recipients`
--

CREATE TABLE `email_campaign_recipients` (
  `id` int(11) NOT NULL,
  `campaign_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` enum('pending','sent','opened','clicked','bounced','failed') DEFAULT 'pending',
  `sent_at` datetime DEFAULT NULL,
  `opened_at` datetime DEFAULT NULL,
  `clicked_at` datetime DEFAULT NULL,
  `bounce_reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_capture_events`
--

CREATE TABLE `email_capture_events` (
  `id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `source` varchar(100) NOT NULL,
  `item_id` varchar(255) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `captured_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_capture_events`
--

INSERT INTO `email_capture_events` (`id`, `contact_id`, `source`, `item_id`, `item_name`, `captured_at`) VALUES
(1, 1, 'template_download', '1', 'Modern Restaurant', '2025-08-23 20:33:08'),
(2, 2, 'template_download', '3', 'Creative Portfolio', '2025-08-23 20:58:20');

-- --------------------------------------------------------

--
-- Table structure for table `email_marketing`
--

CREATE TABLE `email_marketing` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL COMMENT 'template_download, newsletter, contact_form, etc',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `status` enum('active','unsubscribed','bounced') DEFAULT 'active',
  `last_email_sent_at` datetime DEFAULT NULL,
  `email_open_count` int(11) DEFAULT 0,
  `email_click_count` int(11) DEFAULT 0,
  `subscribed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `unsubscribed_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_marketing`
--

INSERT INTO `email_marketing` (`id`, `email`, `name`, `phone`, `source`, `tags`, `status`, `last_email_sent_at`, `email_open_count`, `email_click_count`, `subscribed_at`, `unsubscribed_at`, `notes`) VALUES
(1, 'test@example.com', 'Test User', NULL, 'template_download', NULL, 'active', NULL, 0, 0, '2025-08-23 20:33:08', NULL, NULL),
(2, 'hahdh@gmial.com', 'shdn', NULL, 'template_download', NULL, 'active', NULL, 0, 0, '2025-08-23 20:58:20', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `gamification_users`
--

CREATE TABLE `gamification_users` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(255) DEFAULT NULL,
  `eth_address` varchar(255) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `share_count` int(11) DEFAULT 0,
  `total_clicks` int(11) DEFAULT 0,
  `last_active` timestamp NULL DEFAULT current_timestamp(),
  `nft_claimed` tinyint(1) DEFAULT 0,
  `nft_awarded_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hostvoucher_testimonials`
--

CREATE TABLE `hostvoucher_testimonials` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `testimonial` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `submitted_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketing_campaigns`
--

CREATE TABLE `marketing_campaigns` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `campaign_name` varchar(255) DEFAULT NULL,
  `campaign_source` varchar(100) DEFAULT NULL,
  `campaign_medium` varchar(100) DEFAULT NULL,
  `campaign_content` varchar(255) DEFAULT NULL,
  `utm_source` varchar(100) DEFAULT NULL,
  `utm_medium` varchar(100) DEFAULT NULL,
  `utm_campaign` varchar(100) DEFAULT NULL,
  `utm_term` varchar(100) DEFAULT NULL,
  `utm_content` varchar(100) DEFAULT NULL,
  `target_countries` text DEFAULT NULL,
  `target_demographics` text DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mining_tasks`
--

CREATE TABLE `mining_tasks` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_url` varchar(500) DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `task_limit` varchar(50) DEFAULT 'unlimited',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `enabled` tinyint(1) DEFAULT 1,
  `cooldown` int(11) DEFAULT 24,
  `task_type` varchar(100) DEFAULT 'custom',
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `mining_tasks`
--

INSERT INTO `mining_tasks` (`id`, `title`, `description`, `points`, `icon`, `icon_url`, `link`, `task_limit`, `created_at`, `enabled`, `cooldown`, `task_type`, `requirements`) VALUES
('89fe1f87-7321-4015-b813-946757877147', 'Screenshot Contributor', 'Submits proof of purchase and usage.', 25000000, '📸', NULL, NULL, 'unlimited', '2025-08-23 12:11:17', 1, 168, 'proof_submission', '[\"Screenshot of purchase\",\"Usage proof\",\"Service review\"]');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscriptions`
--

CREATE TABLE `newsletter_subscriptions` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(255) DEFAULT NULL,
  `subscribed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nft_redemption_requests`
--

CREATE TABLE `nft_redemption_requests` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `nft_id` varchar(255) DEFAULT NULL,
  `request_type` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `details` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nft_showcase`
--

CREATE TABLE `nft_showcase` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(255) DEFAULT NULL,
  `nft_image_url` varchar(500) DEFAULT NULL,
  `marketplace_link` varchar(500) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT current_timestamp(),
  `user_email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `page_views`
--

CREATE TABLE `page_views` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `visitor_id` varchar(36) DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `page_url` varchar(500) DEFAULT NULL,
  `page_title` varchar(255) DEFAULT NULL,
  `referrer` text DEFAULT NULL,
  `time_on_page` int(11) DEFAULT 0,
  `scroll_depth` int(11) DEFAULT 0,
  `clicks_count` int(11) DEFAULT 0,
  `viewed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `payment_id` varchar(255) NOT NULL,
  `payment_method` enum('paypal','crypto') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `crypto_amount` decimal(20,8) DEFAULT NULL,
  `crypto_currency` varchar(10) DEFAULT NULL,
  `payment_address` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','completed','failed','expired','cancelled') NOT NULL DEFAULT 'pending',
  `item_id` varchar(255) NOT NULL,
  `item_type` enum('template','service','product') NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `payer_id` varchar(255) DEFAULT NULL,
  `transaction_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`transaction_data`)),
  `error_message` text DEFAULT NULL,
  `manual_confirmation` tinyint(1) DEFAULT 0,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `captured_at` datetime DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `tier` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount` varchar(50) DEFAULT NULL,
  `features` text DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `target_url` varchar(500) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `provider_logo` varchar(500) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `num_reviews` int(11) DEFAULT 0,
  `clicks` int(11) DEFAULT 0,
  `code` varchar(100) DEFAULT NULL,
  `short_link` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `catalog_number` int(11) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `button_color` varchar(50) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `show_on_landing` tinyint(1) DEFAULT 1,
  `display_style` enum('vertical','horizontal') DEFAULT 'vertical',
  `catalog_image` text DEFAULT NULL,
  `brand_logo` text DEFAULT NULL,
  `brand_logo_text` varchar(100) DEFAULT NULL,
  `display_order` int(11) DEFAULT 999,
  `show_on_home` tinyint(1) DEFAULT 1,
  `shake_animation` tinyint(1) DEFAULT 0,
  `shake_intensity` enum('normal','intense') DEFAULT 'normal'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `title`, `provider`, `type`, `tier`, `price`, `original_price`, `discount`, `features`, `link`, `target_url`, `image`, `provider_logo`, `rating`, `num_reviews`, `clicks`, `code`, `short_link`, `seo_title`, `seo_description`, `catalog_number`, `color`, `button_color`, `is_featured`, `created_at`, `updated_at`, `show_on_landing`, `display_style`, `catalog_image`, `brand_logo`, `brand_logo_text`, `display_order`, `show_on_home`, `shake_animation`, `shake_intensity`) VALUES
('035af4cd-31ba-450b-94de-ff6314573060', '.org Domain', '.org Domain', 'Namecheap', 'Domain', 'Popular Domains (.com, .net)', 8.88, NULL, NULL, '[\"Free WHOIS Protection\",\"Email Forwarding\"]', '#', '#', NULL, NULL, 4.6, 2000000, 0, NULL, NULL, '.org Domain', '.org Domain', 83, NULL, NULL, 0, '2025-08-23 11:37:29', '2025-08-25 10:29:25', 1, 'horizontal', 'https://example.com/catalog-image.jpg', 'https://example.com/brand-logo.png', 'SAMPLE BRAND', 999, 1, 0, 'normal'),
('0763f650-c48d-4159-8550-0ed3e539b1a9', 'KVM 8 VPS', 'KVM 8 VPS', 'Hostinger', 'Featured', 'Featured Deals', 18.99, NULL, NULL, '[]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://placehold.co/400x300/FF0000/FFFFFF?text=Hostinger+VPS', NULL, 4.8, 19543, 0, NULL, NULL, 'KVM 8 VPS', 'KVM 8 VPS', 65, NULL, NULL, 0, '2025-08-23 11:20:46', '2025-08-23 11:20:46', 1, NULL, 'https://placehold.co/400x300/FF0000/FFFFFF?text=Hostinger+VPS', NULL, NULL, 999, 1, 0, 'normal'),
('083e27fb-e08e-4ee9-9c52-4fcdba7e14e5', 'BLUEHOSTWP', 'Special deal for Bluehost WordPress Hosting.', 'Bluehost', 'Coupon', 'WordPress Hosting', 0.00, NULL, NULL, '[]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, NULL, 0, 0, 'BLUEHOSTWP', NULL, 'Special deal for Bluehost WordPress Hosting.', 'Special deal for Bluehost WordPress Hosting.', 61, NULL, NULL, 0, '2025-08-23 11:20:45', '2025-08-23 11:20:45', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('0ef6a0ce-0c72-4d77-8724-e0671f5892df', 'Hetzner CX11', 'Hetzner CX11', 'Hetzner', 'VPS', 'Budget VPS', 2.96, NULL, NULL, '[\"1 vCPU\",\"4 GB RAM\",\"20 GB SSD\",\"20 TB Traffic\"]', '#', '#', NULL, NULL, 4.7, 8900, 0, NULL, NULL, 'Hetzner CX11', 'Hetzner CX11', 78, NULL, NULL, 0, '2025-08-23 11:37:27', '2025-08-23 11:37:27', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('0fd355bd-f359-475e-9667-9f900c069588', '.com Domain', '.com Domain', 'Hostinger', 'Domain', 'Popular Domains (.com, .net)', 4.99, 9.99, '50%', '[\"Free WHOIS Protection\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.7, 19543, 0, NULL, NULL, '.com Domain', '.com Domain', 53, NULL, NULL, 0, '2025-08-23 11:20:42', '2025-08-23 11:20:42', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('12155b8d-ce0a-421b-b9fb-fdd66430f946', 'Learn Procreate: The Ultimate Guide', 'Learn Procreate: The Ultimate Guide', 'Digital Learning', 'Digital Product', 'Educational Ebooks', 15.00, 29.99, '50%', '[\"Complete Procreate Tutorial\",\"Step-by-step Guide\",\"Professional Techniques\",\"Bonus Resources\"]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.', 'https://placehold.co/400x300/34D399/FFFFFF.png?text=Learn+Procreate+Guide', NULL, 4.9, 1245, 0, NULL, NULL, 'Learn Procreate: The Ultimate Guide - Digital Art Mastery', 'Master digital illustration with our comprehensive Procreate ebook guide', 95, 'green', 'green', 1, '2025-08-23 13:23:26', '2025-08-23 13:23:26', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('123a01bc-dc05-466b-a17b-bdd401d2ddea', 'Personalized Birthday Video Greeting', 'Personalized Birthday Video Greeting', 'HostVoucher', 'Digital Product', 'Custom Services', 19.99, NULL, NULL, '[]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personalized%20Birthday%20Video%20Greeting%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personalized%20Birthday%20Video%20Greeting%22.', 'https://placehold.co/100x100/F472B6/FFFFFF?text=Birthday', NULL, 4.9, 971, 0, NULL, NULL, 'Personalized Birthday Video Greeting', 'Surprise your loved ones with a fun, animated greeting.', 27, NULL, NULL, 0, '2025-08-23 11:20:31', '2025-08-23 11:20:31', 1, NULL, 'https://placehold.co/100x100/F472B6/FFFFFF?text=Birthday', NULL, NULL, 999, 1, 0, 'normal'),
('18864673-27ef-4c7c-8a53-1784aca26a21', 'Lite Shared Hosting', 'Lite Shared Hosting', 'A2 Hosting', 'Web Hosting', 'Starter Plans', 2.99, 10.99, '73%', '[\"1 Website\",\"100 GB SSD\",\"Free SSL\",\"Anytime Money Back Guarantee\"]', 'https://www.a2hosting.com/web-hosting', 'https://www.a2hosting.com/web-hosting', NULL, NULL, 4.5, 7458, 0, NULL, NULL, 'Lite Shared Hosting', 'Lite Shared Hosting', 30, NULL, NULL, 0, '2025-08-23 11:20:33', '2025-08-23 11:20:33', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('1a8deb1a-78e9-4eac-9f4c-01699b28cef2', 'GrowBig Plan', 'GrowBig Plan', 'SiteGround', 'Web Hosting', 'Business & Pro Plans', 4.99, 24.99, '80%', '[\"Unlimited Websites\",\"20GB Web Space\",\"On-demand Backups\",\"Staging\"]', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', NULL, NULL, 4.9, 12155, 0, NULL, NULL, 'GrowBig Plan', 'GrowBig Plan', 35, NULL, NULL, 0, '2025-08-23 11:20:35', '2025-08-23 11:20:35', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('1d36102b-cf78-4ec0-93aa-b2069e8d2252', 'Professional Object Removal', 'Professional Object Removal', 'Photo Services', 'Digital Product', 'Photo Editing Services', 9.99, 19.99, '50%', '[\"Professional Editing\",\"Natural Results\",\"Fast Turnaround\",\"Unlimited Revisions\"]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Professional%20Object%20Removal%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Professional%20Object%20Removal%22.', 'https://placehold.co/400x300/FBBF24/FFFFFF.png?text=Object+Removal', NULL, 4.7, 543, 0, NULL, NULL, 'Professional Object Removal - Clean Photo Editing', 'Remove unwanted objects or people from your photos professionally', 99, 'yellow', 'yellow', 0, '2025-08-23 13:25:03', '2025-08-23 13:25:03', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('1e53e9b5-1904-46f2-8938-b18912bc96a6', 'WordPress Pro Hosting', NULL, 'WP Engine', 'WordPress Hosting', 'Business', 25.00, NULL, NULL, '[\"Managed WordPress\",\"Daily Backups\",\"SSL Certificate\",\"CDN Included\"]', NULL, 'https://wpengine.com', NULL, NULL, 4.9, 2987, 0, NULL, NULL, NULL, 'Premium managed WordPress hosting with enterprise features', 4, NULL, NULL, 0, '2025-08-22 15:51:45', '2025-08-22 16:25:18', 1, 'horizontal', 'https://example.com/catalog-image.jpg', 'https://example.com/brand-logo.png', 'SAMPLE BRAND', 999, 1, 0, 'normal'),
('203b0069-6470-44cb-bb08-1783424589a5', '.org Domain', NULL, 'GoDaddy', 'Domain', 'Personal', 12.99, NULL, NULL, '[\"Domain Privacy\",\"24/7 Support\",\"Easy Management\",\"Free Email\"]', NULL, 'https://godaddy.com', NULL, NULL, 4.5, 876, 0, NULL, NULL, NULL, 'Professional domain registration services', 11, NULL, NULL, 0, '2025-08-22 15:51:46', '2025-08-22 15:51:46', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('215eb518-5238-4845-a489-75bba8f4a9d2', 'Cloud VPS Pro', NULL, 'DigitalOcean', 'Cloud Hosting', 'Business', 20.00, NULL, NULL, '[\"SSD Storage\",\"Load Balancers\",\"Monitoring\",\"API Access\"]', NULL, 'https://digitalocean.com', NULL, NULL, 4.8, 2234, 0, NULL, NULL, NULL, 'Scalable cloud hosting for developers', 6, NULL, NULL, 0, '2025-08-22 15:51:45', '2025-08-22 15:51:45', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('25fb0b0c-a699-4d51-87db-fcb6d5c5bb77', 'WP Engine Startup', 'WP Engine Startup', 'WP Engine', 'WordPress Hosting', 'Managed WordPress', 20.00, 30.00, '33%', '[\"1 Site\",\"10 GB Storage\",\"CDN Included\",\"Daily Backups\"]', '#', '#', NULL, NULL, 4.7, 3200, 0, NULL, NULL, 'WP Engine Startup', 'WP Engine Startup', 70, NULL, NULL, 0, '2025-08-23 11:37:23', '2025-08-23 11:37:23', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('2d7525bb-807f-4cc6-942a-0d510e0121b8', 'Social Media Templates', 'Social Media Templates', 'HostVoucher', 'Digital Product', 'Design Resources', 29.99, NULL, NULL, '[\"50+ Templates\",\"Instagram & Facebook\",\"Editable PSD Files\",\"Commercial License\"]', '#', '#', NULL, NULL, 4.6, 680, 0, NULL, NULL, 'Social Media Templates', 'Social Media Templates', 81, NULL, NULL, 0, '2025-08-23 11:37:28', '2025-08-23 11:37:28', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('2f17d240-3817-4407-9565-5b26437b0f30', 'Custom Animated Wedding Invitation', 'Custom Animated Wedding Invitation', 'HostVoucher', 'Digital Product', 'Custom Services', 50.00, NULL, NULL, '[]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Custom%20Animated%20Wedding%20Invitation%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Custom%20Animated%20Wedding%20Invitation%22.', 'https://placehold.co/100x100/F472B6/FFFFFF?text=Wedding', NULL, 5.0, 832, 0, NULL, NULL, 'Custom Animated Wedding Invitation', 'A beautiful, unique video invitation for your special day.', 23, NULL, NULL, 0, '2025-08-23 11:20:29', '2025-08-23 11:20:29', 1, NULL, 'https://placehold.co/100x100/F472B6/FFFFFF?text=Wedding', NULL, NULL, 999, 1, 0, 'normal'),
('2f834584-d412-430f-adf0-f2dd8d941869', '.net Domain', '.net Domain', 'Hostinger', 'Domain', 'Popular Domains (.com, .net)', 5.99, 12.99, '54%', '[\"Free WHOIS Protection\",\"DNS Management\"]', '#', '#', NULL, NULL, 4.7, 19543, 0, NULL, NULL, '.net Domain', '.net Domain', 82, NULL, NULL, 0, '2025-08-23 11:37:29', '2025-08-23 11:37:29', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('301b5e3d-1431-49d7-8cfd-64cd43b17e40', 'Turbo Boost Hosting', 'Turbo Boost Hosting', 'A2 Hosting', 'Web Hosting', 'Business & Pro Plans', 6.99, 20.99, '67%', '[\"Unlimited Websites\",\"Unlimited SSD\",\"Turbo (20X Faster)\",\"Free Migrations\"]', 'https://www.a2hosting.com/web-hosting', 'https://www.a2hosting.com/web-hosting', NULL, NULL, 4.7, 7458, 0, NULL, NULL, 'Turbo Boost Hosting', 'Turbo Boost Hosting', 31, NULL, NULL, 0, '2025-08-23 11:20:33', '2025-08-23 11:20:33', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('307adb6c-eccf-48e6-9cf9-6314fcfef943', 'KVM 2', 'KVM 2', 'Hostinger', 'VPS', 'Medium VPS', 5.99, 21.99, '72%', '[\"2 vCPU Cores\",\"8GB RAM\",\"100 GB NVMe SSD\",\"2TB Bandwidth\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.7, 19543, 0, NULL, NULL, 'KVM 2', 'KVM 2', 47, NULL, NULL, 0, '2025-08-23 11:20:40', '2025-08-23 11:20:40', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('3252fffb-c67f-4602-9184-b2d6bce04d44', 'Premium Shared Hosting', 'Premium Shared Hosting', 'Hostinger', 'Web Hosting', 'Starter Plans', 2.99, 11.99, '75%', '[\"100 Websites\",\"100 GB NVMe Storage\",\"Weekly Backups\",\"Free SSL\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.7, 19543, 0, NULL, NULL, 'Premium Shared Hosting', 'Premium Shared Hosting', 28, NULL, NULL, 0, '2025-08-23 11:20:32', '2025-08-23 11:20:32', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('34359167-49be-4b59-be5c-a0dbfb4070e6', 'Basic Plan', 'Basic Plan', 'Bluehost', 'Web Hosting', 'Starter Plans', 2.95, 9.99, '70%', '[\"1 Website\",\"10 GB SSD Storage\",\"Free Domain for 1st Year\",\"Free CDN\"]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, 4.1, 5321, 0, NULL, NULL, 'Basic Plan', 'Basic Plan', 32, NULL, NULL, 0, '2025-08-23 11:20:34', '2025-08-23 11:20:34', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('34cd639a-acfc-41d1-b036-797f98b62fe8', '.io Domain', '.io Domain', 'SiteGround', 'Domain', 'Premium Domains', 39.99, NULL, NULL, '[\"Tech-Focused TLD\",\"Premium DNS\"]', '#', '#', NULL, NULL, 4.5, 12155, 0, NULL, NULL, '.io Domain', '.io Domain', 84, NULL, NULL, 0, '2025-08-23 11:37:29', '2025-08-23 11:37:29', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('35e72d7c-915a-4e95-b389-1859d481564d', 'Business Cloud', 'Business Cloud', 'Namecheap', 'Cloud Hosting', 'Business Cloud', 8.88, NULL, NULL, '[\"2 Cores\",\"40 GB SSD\",\"2 GB RAM\",\"Managed Cloud Environment\"]', 'https://www.namecheap.com/hosting/vps/', 'https://www.namecheap.com/hosting/vps/', NULL, NULL, 4.5, 2000000, 0, NULL, NULL, 'Business Cloud', 'Business Cloud', 45, NULL, NULL, 0, '2025-08-23 11:20:39', '2025-08-23 11:20:39', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('3684c892-525a-41bc-8355-e6577cc77552', 'SAVE50HOST', 'SAVE50HOST', 'HostGator', 'Coupon', 'Web Hosting', 0.00, NULL, NULL, '[]', '#', '#', NULL, NULL, NULL, 0, 0, 'SAVE50HOST', NULL, 'SAVE50HOST', 'Save 50% on all hosting plans this month!', 85, NULL, NULL, 0, '2025-08-23 11:37:30', '2025-08-23 11:37:30', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('3d3978e6-21e3-4ee9-b1db-d41c8e6d4f49', 'Choice Plus', 'Choice Plus', 'Bluehost', 'Web Hosting', 'Business & Pro Plans', 5.45, 14.99, '63%', '[\"Unlimited Websites\",\"40 GB SSD\",\"Free Domain & SSL\",\"Free CDN\"]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, 4.2, 5321, 0, NULL, NULL, 'Choice Plus', 'Choice Plus', 33, NULL, NULL, 0, '2025-08-23 11:20:34', '2025-08-23 11:20:34', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('3f63b0ac-fe39-4e4b-acdd-ff006eaa8674', 'Ghibli Style Portrait', 'Ghibli Style Portrait', 'Art Services', 'Digital Product', 'Custom Art Services', 25.00, 49.99, '50%', '[\"Studio Ghibli Style\",\"High Resolution\",\"Multiple Revisions\",\"Digital Delivery\"]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Ghibli%20Style%20Portrait%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Ghibli%20Style%20Portrait%22.', 'https://placehold.co/400x300/60A5FA/FFFFFF.png?text=Ghibli+Portrait', NULL, 4.8, 2109, 0, NULL, NULL, 'Ghibli Style Portrait - Magical Anime Artwork', 'Transform your photo into magical Ghibli-inspired artwork', 98, 'blue', 'blue', 0, '2025-08-23 13:25:03', '2025-08-23 13:25:03', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('3fff3dce-7e2f-4ec2-bba9-b2458e83d4ac', 'Stellar Plan', 'Stellar Plan', 'Namecheap', 'Web Hosting', 'Starter Plans', 1.98, 4.48, '56%', '[\"3 Websites\",\"20 GB SSD\",\"Free CDN\",\"Domain Included\"]', 'https://www.namecheap.com/hosting/shared/', 'https://www.namecheap.com/hosting/shared/', NULL, NULL, 4.7, 2000000, 0, NULL, NULL, 'Stellar Plan', 'Stellar Plan', 34, NULL, NULL, 0, '2025-08-23 11:20:34', '2025-08-23 11:20:34', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('4585f6ef-2777-4a41-86f4-feb2702feb40', 'Learn Procreate: The Ultimate Guide', 'Learn Procreate: The Ultimate Guide', 'HostVoucher', 'Digital Product', 'Educational', 15.00, NULL, NULL, '[]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.', 'https://placehold.co/100x100/34D399/FFFFFF?text=Ebook', NULL, 4.9, 1245, 0, NULL, NULL, 'Learn Procreate: The Ultimate Guide', 'Master digital illustration with our comprehensive ebook.', 22, NULL, NULL, 0, '2025-08-23 11:20:29', '2025-08-23 11:20:29', 1, NULL, 'https://placehold.co/100x100/34D399/FFFFFF?text=Ebook', NULL, NULL, 999, 1, 0, 'normal'),
('4a67f3bf-9c44-47fc-ad45-9a55f61f8d6b', 'OVH VPS Starter', 'OVH VPS Starter', 'OVH', 'VPS', 'Budget VPS', 3.50, NULL, NULL, '[\"1 vCore\",\"2 GB RAM\",\"20 GB SSD\",\"Unlimited Bandwidth\"]', '#', '#', NULL, NULL, 4.1, 5400, 0, NULL, NULL, 'OVH VPS Starter', 'OVH VPS Starter', 77, NULL, NULL, 0, '2025-08-23 11:37:26', '2025-08-23 11:37:26', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('4ed7d1bc-8727-463b-bdc8-bca28679889e', 'Learn Procreate: The Ultimate Guide', 'Learn Procreate: The Ultimate Guide', 'Digital Learning', 'Digital Product', 'Educational Ebooks', 15.00, 29.99, '50%', '[\"Complete Procreate Tutorial\",\"Step-by-step Guide\",\"Professional Techniques\",\"Bonus Resources\"]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.', 'https://placehold.co/400x300/34D399/FFFFFF.png?text=Learn+Procreate+Guide', NULL, 4.9, 1245, 0, NULL, NULL, 'Learn Procreate: The Ultimate Guide - Digital Art Mastery', 'Master digital illustration with our comprehensive Procreate ebook guide', 96, 'green', 'green', 1, '2025-08-23 13:25:02', '2025-08-23 13:25:02', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('4f199408-d377-4613-ae36-233f009adeba', 'BLUEHOSTVPS', 'Save on Bluehost VPS hosting for your growing site.', 'Bluehost', 'Coupon', 'VPS', 0.00, NULL, NULL, '[]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, NULL, 0, 0, 'BLUEHOSTVPS', NULL, 'Save on Bluehost VPS hosting for your growing site.', 'Save on Bluehost VPS hosting for your growing site.', 63, NULL, NULL, 0, '2025-08-23 11:20:46', '2025-08-23 11:20:46', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('5107d138-dab6-448d-82ba-f01d6ab6fead', 'WPDEAL25', '25% discount on annual WordPress Hosting plans.', 'Hostinger', 'Coupon', 'WordPress Hosting', 0.00, NULL, NULL, '[]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, NULL, 0, 0, 'WPDEAL25', NULL, '25% discount on annual WordPress Hosting plans.', '25% discount on annual WordPress Hosting plans.', 57, NULL, NULL, 0, '2025-08-23 11:20:43', '2025-08-23 11:20:43', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('5300b41d-6b43-4dae-bf0d-20dac4cf1b2c', 'HostGator Baby Plan', 'HostGator Baby Plan', 'HostGator', 'Web Hosting', 'Starter Plans', 3.95, 12.95, '69%', '[\"Unlimited Websites\",\"Unlimited Storage\",\"Free SSL\",\"Free Domain\"]', '#', '#', NULL, NULL, 4.2, 8500, 0, NULL, NULL, 'HostGator Baby Plan', 'HostGator Baby Plan', 67, NULL, NULL, 0, '2025-08-23 11:37:21', '2025-08-23 11:37:21', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('5581b4cd-0e06-4c48-a503-1d6243aa1c12', 'Cloud Plan', 'Cloud Plan', 'SiteGround', 'Cloud Hosting', 'High-Performance Cloud', 100.00, NULL, NULL, '[\"4 CPU Cores\",\"8 GB Memory\",\"40 GB SSD Space\",\"5 TB Data Transfer\"]', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', NULL, NULL, 4.9, 12155, 0, NULL, NULL, 'Cloud Plan', 'Cloud Plan', 46, NULL, NULL, 0, '2025-08-23 11:20:39', '2025-08-23 11:20:39', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('5a30fdd1-a93a-4d0c-a28e-b93ad6702305', 'Standard VPS', 'Standard VPS', 'Bluehost', 'VPS', 'Medium VPS', 31.99, NULL, NULL, '[\"2 Cores\",\"4GB RAM\",\"120GB SSD\",\"2TB Bandwidth\"]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, 4.1, 5321, 0, NULL, NULL, 'Standard VPS', 'Standard VPS', 49, NULL, NULL, 0, '2025-08-23 11:20:40', '2025-08-23 11:20:40', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('5ef56c35-8128-47db-88a7-6b43bbc929c2', 'Contabo VPS S', 'Contabo VPS S', 'Contabo', 'VPS', 'Budget VPS', 3.99, NULL, NULL, '[\"4 vCPU Cores\",\"8 GB RAM\",\"200 GB SSD\",\"Unlimited Traffic\"]', '#', '#', NULL, NULL, 4.3, 7200, 0, NULL, NULL, 'Contabo VPS S', 'Contabo VPS S', 76, NULL, NULL, 0, '2025-08-23 11:37:26', '2025-08-23 11:37:26', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('5f2f0404-564f-483e-b40c-a90a84886c22', 'DigitalOcean Droplet', 'DigitalOcean Droplet', 'DigitalOcean', 'Cloud Hosting', 'Performance Cloud', 5.00, NULL, NULL, '[\"1 vCPU\",\"1 GB RAM\",\"25 GB SSD\",\"1 TB Transfer\"]', '#', '#', NULL, NULL, 4.6, 15000, 0, NULL, NULL, 'DigitalOcean Droplet', 'DigitalOcean Droplet', 73, NULL, NULL, 0, '2025-08-23 11:37:24', '2025-08-23 11:37:24', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('60ac24eb-bfcd-44cc-8d30-9e44223555d2', 'fast hosting', '', 'hostinger', 'Web Hosting', 'personal', 23.00, 89.00, '65% off', '[\"free ssl\",\"free domain\",\".com\"]', '', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', '', '', 5.0, 1247777777, 0, 'dealhostinger', 'hostinger', '', '', 1, 'blue', 'orange', 0, '2025-08-20 05:00:29', '2025-08-23 00:26:09', 0, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('63617301-f79d-432e-a318-3dbebd00e324', 'Business Hosting', 'Business Hosting', 'Hostinger', 'Web Hosting', 'Business & Pro Plans', 3.99, 13.99, '71%', '[\"200 GB NVMe Storage\",\"Daily Backups\",\"Free CDN\",\"Enhanced Security\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.8, 19543, 0, NULL, NULL, 'Business Hosting', 'Business Hosting', 29, NULL, NULL, 0, '2025-08-23 11:20:32', '2025-08-23 11:20:32', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('64d2bfde-ac84-44bb-9a73-3e05360a3d03', '.com Domain', NULL, 'Namecheap', 'Domain', 'Personal', 8.88, NULL, NULL, '[\"Free WHOIS Privacy\",\"DNS Management\",\"Email Forwarding\",\"URL Forwarding\"]', NULL, 'https://namecheap.com', NULL, NULL, 4.6, 1456, 0, NULL, NULL, NULL, 'Affordable domain registration with privacy protection', 10, NULL, NULL, 0, '2025-08-22 15:51:46', '2025-08-22 15:51:46', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('68dc035f-e028-4fa7-a92f-fedba58248e4', 'DreamHost Shared Starter', 'DreamHost Shared Starter', 'DreamHost', 'Web Hosting', 'Starter Plans', 2.59, 7.99, '68%', '[\"1 Website\",\"Fast SSD Storage\",\"Free Domain\",\"24/7 Support\"]', '#', '#', NULL, NULL, 4.4, 6200, 0, NULL, NULL, 'DreamHost Shared Starter', 'DreamHost Shared Starter', 68, NULL, NULL, 0, '2025-08-23 11:37:22', '2025-08-23 11:37:22', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('68e83621-363f-4d5d-b597-5efc96c38029', 'HOSTCLOUD30', 'Save 30% on Hostinger Cloud Hosting plans!', 'Hostinger', 'Coupon', 'Cloud Hosting', 0.00, NULL, NULL, '[]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, NULL, 0, 0, 'HOSTCLOUD30', NULL, 'Save 30% on Hostinger Cloud Hosting plans!', 'Save 30% on Hostinger Cloud Hosting plans!', 56, NULL, NULL, 0, '2025-08-23 11:20:43', '2025-08-23 11:20:43', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('6db2f2a1-88a2-40b2-9a5e-dade15c65323', 'EasyWP Starter', 'EasyWP Starter', 'Namecheap', 'WordPress Hosting', 'Managed WordPress', 4.88, 9.88, '50%', '[\"50 GB SSD Storage\",\"99.9% Uptime\",\"Easy Backups\",\"Free CDN & SSL\"]', 'https://www.namecheap.com/wordpress/', 'https://www.namecheap.com/wordpress/', NULL, NULL, 4.6, 2000000, 0, NULL, NULL, 'EasyWP Starter', 'EasyWP Starter', 39, NULL, NULL, 0, '2025-08-23 11:20:36', '2025-08-23 11:20:36', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('6fad7d35-9fe4-461a-b8ec-127bbc0667a3', 'HOSTVPS10', '10% OFF your first VPS plan from Hostinger.', 'Hostinger', 'Coupon', 'VPS', 0.00, NULL, NULL, '[]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, NULL, 0, 0, 'HOSTVPS10', NULL, '10% OFF your first VPS plan from Hostinger.', '10% OFF your first VPS plan from Hostinger.', 59, NULL, NULL, 0, '2025-08-23 11:20:44', '2025-08-23 11:20:44', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('706def8c-20d4-4fe9-a0a4-ffeae9a23317', 'CLOUDBOOST', 'CLOUDBOOST', 'DigitalOcean', 'Coupon', 'Cloud Hosting', 0.00, NULL, NULL, '[]', '#', '#', NULL, NULL, NULL, 0, 0, NULL, NULL, 'CLOUDBOOST', 'Get 30% off cloud hosting for new customers.', 87, NULL, NULL, 0, '2025-08-23 11:37:31', '2025-08-23 11:37:31', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('724e3053-d781-4ca7-b5a3-eac33db3d003', 'Managed WordPress Lite', 'Managed WordPress Lite', 'A2 Hosting', 'WordPress Hosting', 'Managed WordPress', 7.99, 14.99, '47%', '[\"1 Site\",\"50 GB NVMe SSD\",\"Free Jetpack Personal\",\"Managed Updates\"]', 'https://www.a2hosting.com/wordpress-hosting', 'https://www.a2hosting.com/wordpress-hosting', NULL, NULL, 4.6, 7458, 0, NULL, NULL, 'Managed WordPress Lite', 'Managed WordPress Lite', 37, NULL, NULL, 0, '2025-08-23 11:20:36', '2025-08-23 11:20:36', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('77b8918f-5c27-4bb3-b676-e8ef3de29208', 'Cloud Startup', 'Cloud Startup', 'Hostinger', 'Cloud Hosting', 'Business Cloud', 9.99, 29.99, '67%', '[\"300 Websites\",\"200 GB NVMe Storage\",\"Daily Backups\",\"Dedicated IP Address\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.8, 19543, 0, NULL, NULL, 'Cloud Startup', 'Cloud Startup', 41, NULL, NULL, 0, '2025-08-23 11:20:37', '2025-08-23 11:20:37', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('782797f8-7f88-4509-b871-991ce3f80ddd', 'StartUp WP', 'StartUp WP', 'SiteGround', 'WordPress Hosting', 'Managed WordPress', 2.99, 14.99, '80%', '[\"1 Website\",\"10 GB Web Space\",\"Free WP Installation\",\"Managed WordPress\"]', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', NULL, NULL, 4.8, 12155, 0, NULL, NULL, 'StartUp WP', 'StartUp WP', 40, NULL, NULL, 0, '2025-08-23 11:20:37', '2025-08-23 11:20:37', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('7a9ad958-fc62-47fa-860a-dbad07fbf7b0', 'BLUEHOSTPRO', 'Up to 70% off Bluehost Choice Plus Plan!', 'Bluehost', 'Coupon', 'Web Hosting', 0.00, NULL, NULL, '[]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, NULL, 0, 0, 'BLUEHOSTPRO', NULL, 'Up to 70% off Bluehost Choice Plus Plan!', 'Up to 70% off Bluehost Choice Plus Plan!', 55, NULL, NULL, 0, '2025-08-23 11:20:43', '2025-08-23 11:20:43', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('81c06ca0-67ea-4ecc-bf5f-0218c736c117', 'WP Pro Grow', 'WP Pro Grow', 'Bluehost', 'Featured', 'Featured Deals', 24.95, NULL, NULL, '[]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://placehold.co/400x300/0000FF/FFFFFF?text=Bluehost+WP', NULL, 4.4, 5321, 0, NULL, NULL, 'WP Pro Grow', 'WP Pro Grow', 66, NULL, NULL, 0, '2025-08-23 11:20:47', '2025-08-23 11:20:47', 1, NULL, 'https://placehold.co/400x300/0000FF/FFFFFF?text=Bluehost+WP', NULL, NULL, 999, 1, 0, 'normal'),
('83a7e370-d492-4b0c-9093-d31669680d37', 'DOMAINPRO', 'DOMAINPRO', 'Namecheap', 'Coupon', 'Domain', 0.00, NULL, NULL, '[]', '#', '#', NULL, NULL, NULL, 0, 0, NULL, NULL, 'DOMAINPRO', 'Professional domains at discounted rates.', 89, NULL, NULL, 0, '2025-08-23 11:37:32', '2025-08-23 11:37:32', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('850451d2-3665-4227-a108-f322ed41f75d', '.com Domain', '.com Domain', 'SiteGround', 'Domain', 'Popular Domains (.com, .net)', 19.99, NULL, NULL, '[\"Private DNS management\"]', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', NULL, NULL, 4.8, 12155, 0, NULL, NULL, '.com Domain', '.com Domain', 52, NULL, NULL, 0, '2025-08-23 11:20:41', '2025-08-23 11:20:41', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('86885c39-64e8-4558-aeb3-113ae805a0bf', 'Personal Landing Page Website', 'Personal Landing Page Website', 'HostVoucher', 'Digital Product', 'Web Development', 199.00, NULL, NULL, '[]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personal%20Landing%20Page%20Website%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personal%20Landing%20Page%20Website%22.', 'https://placehold.co/100x100/A78BFA/FFFFFF?text=WebDev', NULL, 5.0, 150, 0, NULL, NULL, 'Personal Landing Page Website', 'Get a stunning, fast, one-page website for your brand.', 26, NULL, NULL, 0, '2025-08-23 11:20:31', '2025-08-23 11:20:31', 1, NULL, 'https://placehold.co/100x100/A78BFA/FFFFFF?text=WebDev', NULL, NULL, 999, 1, 0, 'normal'),
('8a891ff9-27af-4ac6-b701-ba344261159f', 'ExpressVPN', NULL, 'Express', 'VPN', 'Business', 8.32, NULL, NULL, '[\"3000+ Servers\",\"Split Tunneling\",\"24/7 Support\",\"5 Devices\"]', NULL, 'https://expressvpn.com', NULL, NULL, 4.8, 2345, 0, NULL, NULL, NULL, 'Fast and secure VPN service', 9, NULL, NULL, 0, '2025-08-22 15:51:46', '2025-08-22 15:51:46', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('8bb4147e-a2f1-461c-9087-4b40e2319b00', 'KVM 4', 'KVM 4', 'Hostinger', 'VPS', 'High-Performance VPS', 10.99, 43.99, '75%', '[\"4 vCPU Cores\",\"16GB RAM\",\"200 GB NVMe SSD\",\"4TB Bandwidth\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.8, 19543, 0, NULL, NULL, 'KVM 4', 'KVM 4', 48, NULL, NULL, 0, '2025-08-23 11:20:40', '2025-08-23 11:20:40', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('8c39f446-4f76-45df-86d5-adeaf3ad075d', 'Logo Design Package', 'Logo Design Package', 'HostVoucher', 'Digital Product', 'Design Services', 75.00, NULL, NULL, '[\"3 Logo Concepts\",\"Unlimited Revisions\",\"Vector Files\",\"Brand Guidelines\"]', '#', '#', NULL, NULL, 4.9, 450, 0, NULL, NULL, 'Logo Design Package', 'Logo Design Package', 79, NULL, NULL, 0, '2025-08-23 11:37:27', '2025-08-23 11:37:27', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('90b1c44b-2a86-4c44-8663-1f3f4ead966f', 'SITEGROUNDCLOUD', 'Exclusive discount on SiteGround Cloud Hosting.', 'SiteGround', 'Coupon', 'Cloud Hosting', 0.00, NULL, NULL, '[]', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', NULL, NULL, NULL, 0, 0, 'SITEGROUNDCLOUD', NULL, 'Exclusive discount on SiteGround Cloud Hosting.', 'Exclusive discount on SiteGround Cloud Hosting.', 62, NULL, NULL, 0, '2025-08-23 11:20:45', '2025-08-23 11:20:45', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('90e1f020-b10a-4fbf-913d-3313e7941096', 'Hostinger Premium Hosting', 'Premium Web Hosting Plan', 'Hostinger', 'Web Hosting', 'Premium Plans', 2.99, 11.99, '75%', '[\"100 Websites\",\"Unlimited Bandwidth\",\"Free SSL\",\"Free Domain\"]', 'https://hostinger.com', 'https://hostinger.com', 'https://logo.clearbit.com/hostinger.com', 'https://logo.clearbit.com/hostinger.com', 4.8, 15420, 0, NULL, NULL, 'Hostinger Premium Hosting - 75% Off', 'Get premium web hosting from Hostinger at 75% discount', 91, 'purple', 'purple', 1, '2025-08-23 13:08:14', '2025-08-23 13:08:14', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('91f2caba-6841-482f-9843-899524636ac2', 'VPSPOWER', 'VPSPOWER', 'Linode', 'Coupon', 'VPS', 0.00, NULL, NULL, '[]', '#', '#', NULL, NULL, NULL, 0, 0, NULL, NULL, 'VPSPOWER', 'Power up with 25% off VPS hosting plans.', 88, NULL, NULL, 0, '2025-08-23 11:37:31', '2025-08-23 11:37:31', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('961ef9aa-75d6-4d3b-8091-333df9394e15', 'AWS Lightsail', NULL, 'Amazon', 'Cloud Hosting', 'Enterprise', 15.00, NULL, NULL, '[\"AWS Integration\",\"Auto Scaling\",\"Load Balancing\",\"CDN\"]', NULL, 'https://aws.amazon.com/lightsail', NULL, NULL, 4.7, 1987, 0, NULL, NULL, NULL, 'Simple cloud hosting by Amazon Web Services', 7, NULL, NULL, 0, '2025-08-22 15:51:46', '2025-08-22 15:51:46', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('96373c6b-5f12-41dd-817a-be3f76d0b9df', 'LIMITED TIME: Premium Hosting 90% OFF!', 'Premium Hosting Special Deal', 'SuperHost', 'Web Hosting', 'Premium Plans', 2.99, 29.99, '90%', '[\"Unlimited Bandwidth\",\"Free SSL\",\"24/7 Support\",\"Free Domain\"]', '#', '#', NULL, NULL, 4.9, 1250, 0, NULL, NULL, 'Premium Hosting Special Deal', 'Get premium hosting at 90% off - limited time offer!', 90, 'red', 'red', 1, '2025-08-23 12:26:51', '2025-08-23 12:26:51', 1, 'vertical', NULL, NULL, NULL, 999, 1, 1, 'intense'),
('9847cd0a-307b-428a-aa29-449d1048574e', 'hosting hostinger', '', 'hostinger', 'Voucher', 'personal', 23.00, 89.00, '65% off', '[\"free ssl\",\"free domain\",\".com\"]', '', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', '', 'https://hostvocher.com/uploads/images/1755908705977_OIP.webp', 5.0, 89277777, 0, 'dealhostinger1', 'hostinger', '', '', 2, 'orange', 'orange', 1, '2025-08-20 05:01:21', '2025-08-23 00:25:16', 0, 'vertical', NULL, 'https://hostvocher.com/uploads/images/1755908709833_OIP.webp', NULL, 999, 1, 0, 'normal'),
('99180b32-7ffa-11f0-a945-00163e0960bf', 'Shared Hosting Starter', 'Perfect for Small Websites & Blogs', 'HostGator', 'Web Hosting', 'Personal', 2.75, 10.95, '75% OFF', '[\"1 Website\",\"10 GB Storage\",\"Free SSL Certificate\",\"Unmetered Bandwidth\",\"24/7 Support\",\"cPanel Control Panel\"]', 'https://hostgator.com/shared-hosting', 'https://hostgator.com/shared-hosting', 'https://i.ibb.co/qkjH8vL/hostgator-shared.jpg', 'https://i.ibb.co/9yKvpQs/hostgator-logo.png', 4.5, 1250, 0, 'SAVE75NOW', NULL, NULL, NULL, 13, 'blue', 'orange', 1, '2025-08-23 08:24:31', '2025-08-23 08:24:31', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('99261ffe-7ffa-11f0-a945-00163e0960bf', 'Basic Web Hosting', 'Reliable Hosting for Personal Sites', 'Bluehost', 'Web Hosting', 'Personal', 3.95, 9.99, '60% OFF', '[\"1 Website\",\"50 GB Storage\",\"Free Domain for 1 Year\",\"Free SSL Certificate\",\"WordPress Optimized\",\"24/7 Chat Support\"]', 'https://bluehost.com/hosting/shared', 'https://bluehost.com/hosting/shared', 'https://i.ibb.co/2qvH8mL/bluehost-basic.jpg', 'https://i.ibb.co/8xKvpQs/bluehost-logo.png', 4.7, 2100, 0, 'BLUE60OFF', NULL, NULL, NULL, 14, 'blue', 'blue', 1, '2025-08-23 08:24:31', '2025-08-23 08:24:31', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('99394c04-7ffa-11f0-a945-00163e0960bf', 'Personal Hosting Plan', 'Fast & Secure Personal Hosting', 'SiteGround', 'Web Hosting', 'Personal', 4.99, 14.99, '67% OFF', '[\"1 Website\",\"10 GB Storage\",\"Free SSL & CDN\",\"Daily Backups\",\"Email Accounts\",\"WordPress Staging\"]', 'https://siteground.com/web-hosting', 'https://siteground.com/web-hosting', 'https://i.ibb.co/3qvH8mL/siteground-personal.jpg', 'https://i.ibb.co/7xKvpQs/siteground-logo.png', 4.8, 3500, 0, 'SITE67OFF', NULL, NULL, NULL, 15, 'green', 'green', 1, '2025-08-23 08:24:31', '2025-08-23 08:24:31', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('9947ba04-7ffa-11f0-a945-00163e0960bf', 'Business Hosting Pro', 'Powerful Hosting for Growing Businesses', 'HostGator', 'Web Hosting', 'Business', 5.95, 16.95, '65% OFF', '[\"Unlimited Websites\",\"Unlimited Storage\",\"Free SSL Certificate\",\"Free Domain\",\"Marketing Credits $200\",\"SEO Tools\",\"Advanced Analytics\"]', 'https://hostgator.com/business-hosting', 'https://hostgator.com/business-hosting', 'https://i.ibb.co/4qvH8mL/hostgator-business.jpg', 'https://i.ibb.co/9yKvpQs/hostgator-logo.png', 4.6, 1800, 0, 'BIZPRO65', NULL, NULL, NULL, 16, 'orange', 'orange', 1, '2025-08-23 08:24:31', '2025-08-23 08:24:31', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('9957cea2-7ffa-11f0-a945-00163e0960bf', 'Choice Plus Hosting', 'Complete Business Solution', 'Bluehost', 'Web Hosting', 'Business', 7.45, 18.99, '61% OFF', '[\"Unlimited Websites\",\"Unlimited Storage\",\"Free Domain Privacy\",\"CodeGuard Backup\",\"Spam Experts\",\"Office 365 Email\"]', 'https://bluehost.com/hosting/choice-plus', 'https://bluehost.com/hosting/choice-plus', 'https://i.ibb.co/5qvH8mL/bluehost-choice.jpg', 'https://i.ibb.co/8xKvpQs/bluehost-logo.png', 4.7, 2400, 0, 'CHOICE61', NULL, NULL, NULL, 17, 'blue', 'blue', 1, '2025-08-23 08:24:31', '2025-08-23 08:24:31', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('9966f136-7ffa-11f0-a945-00163e0960bf', 'GrowBig Business', 'Advanced Business Hosting', 'SiteGround', 'Web Hosting', 'Business', 9.99, 24.99, '60% OFF', '[\"Unlimited Websites\",\"20 GB Storage\",\"Premium Support\",\"On-Demand Backups\",\"Staging & Git\",\"White-label Caching\"]', 'https://siteground.com/growbig-hosting', 'https://siteground.com/growbig-hosting', 'https://i.ibb.co/6qvH8mL/siteground-growbig.jpg', 'https://i.ibb.co/7xKvpQs/siteground-logo.png', 4.9, 4200, 0, 'GROWBIG60', NULL, NULL, NULL, 18, 'green', 'green', 1, '2025-08-23 08:24:32', '2025-08-23 08:24:32', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('997696b8-7ffa-11f0-a945-00163e0960bf', 'Enterprise Hosting Elite', 'Maximum Performance & Security', 'HostGator', 'Web Hosting', 'Enterprise', 14.99, 39.99, '62% OFF', '[\"Unlimited Everything\",\"Free Dedicated IP\",\"Private SSL\",\"Priority Support\",\"Advanced Security\",\"Performance Monitoring\",\"Custom Integrations\"]', 'https://hostgator.com/enterprise-hosting', 'https://hostgator.com/enterprise-hosting', 'https://i.ibb.co/7qvH8mL/hostgator-enterprise.jpg', 'https://i.ibb.co/9yKvpQs/hostgator-logo.png', 4.8, 950, 0, 'ELITE62OFF', NULL, NULL, NULL, 19, 'red', 'red', 1, '2025-08-23 08:24:32', '2025-08-23 08:24:32', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('998325b0-7ffa-11f0-a945-00163e0960bf', 'Pro Enterprise Plan', 'Ultimate Business Performance', 'Bluehost', 'Web Hosting', 'Enterprise', 18.95, 49.99, '62% OFF', '[\"High Performance\",\"Dedicated Resources\",\"Enhanced Security\",\"Priority Support\",\"Advanced Analytics\",\"Custom Solutions\",\"SLA Guarantee\"]', 'https://bluehost.com/hosting/pro', 'https://bluehost.com/hosting/pro', 'https://i.ibb.co/8qvH8mL/bluehost-pro.jpg', 'https://i.ibb.co/8xKvpQs/bluehost-logo.png', 4.9, 1200, 0, 'PROPRO62', NULL, NULL, NULL, 20, 'purple', 'purple', 1, '2025-08-23 08:24:32', '2025-08-23 08:24:32', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('9990f864-7ffa-11f0-a945-00163e0960bf', 'GoGeek Enterprise', 'Premium Enterprise Solution', 'SiteGround', 'Web Hosting', 'Enterprise', 24.99, 59.99, '58% OFF', '[\"Premium Resources\",\"40 GB Storage\",\"White-label Options\",\"Priority Support\",\"Advanced Caching\",\"Custom PHP Settings\",\"Enterprise Security\"]', 'https://siteground.com/gogeek-hosting', 'https://siteground.com/gogeek-hosting', 'https://i.ibb.co/9qvH8mL/siteground-gogeek.jpg', 'https://i.ibb.co/7xKvpQs/siteground-logo.png', 4.9, 2800, 0, 'GOGEEK58', NULL, NULL, NULL, 21, 'purple', 'purple', 1, '2025-08-23 08:24:32', '2025-08-23 08:24:32', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('99a47c59-edae-497b-a84a-b984aa2b6f65', 'GoGeek Plan', 'GoGeek Plan', 'SiteGround', 'Featured', 'Featured Deals', 7.99, NULL, NULL, '[]', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://placehold.co/400x300/EF4444/FFFFFF?text=GoGeek', NULL, 4.8, 12155, 0, NULL, NULL, 'GoGeek Plan', 'GoGeek Plan', 64, NULL, NULL, 0, '2025-08-23 11:20:46', '2025-08-23 11:20:46', 1, NULL, 'https://placehold.co/400x300/EF4444/FFFFFF?text=GoGeek', NULL, NULL, 999, 1, 0, 'normal'),
('9d775abd-153f-4014-bdef-cf920a43cc8d', 'SEO Audit Report', 'SEO Audit Report', 'HostVoucher', 'Digital Product', 'Marketing Services', 49.99, NULL, NULL, '[\"Complete Site Analysis\",\"Keyword Research\",\"Competitor Analysis\",\"Action Plan\"]', '#', '#', NULL, NULL, 4.8, 320, 0, NULL, NULL, 'SEO Audit Report', 'SEO Audit Report', 80, NULL, NULL, 0, '2025-08-23 11:37:28', '2025-08-23 11:37:28', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('9e00ea1b-9956-43c4-b555-65f07ff92ba2', 'SGWPRO', 'Special discount on all SiteGround WordPress plans.', 'SiteGround', 'Coupon', 'WordPress Hosting', 0.00, NULL, NULL, '[]', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', NULL, NULL, NULL, 0, 0, 'SGWPRO', NULL, 'Special discount on all SiteGround WordPress plans.', 'Special discount on all SiteGround WordPress plans.', 58, NULL, NULL, 0, '2025-08-23 11:20:44', '2025-08-23 11:20:44', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('a46760bb-d87a-49f9-8253-96828a0872f4', '.com Domain', '.com Domain', 'Hostinger', 'Domain', 'Popular Domains (.com, .net)', 4.99, 9.99, '50%', '[\"Free with hosting plans\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.7, 19543, 0, NULL, NULL, '.com Domain', '.com Domain', 50, NULL, NULL, 0, '2025-08-23 11:20:41', '2025-08-23 11:20:41', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('a9599a7c-d157-4615-9987-9b0e93c8fd7a', 'Personalized Birthday Video Greeting', 'Personalized Birthday Video Greeting', 'Video Services', 'Digital Product', 'Custom Video Services', 19.99, 39.99, '50%', '[\"Custom Animation\",\"Personal Message\",\"HD Quality\",\"Multiple Formats\"]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personalized%20Birthday%20Video%20Greeting%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personalized%20Birthday%20Video%20Greeting%22.', 'https://placehold.co/400x300/F472B6/FFFFFF.png?text=Birthday+Video', NULL, 4.9, 971, 0, NULL, NULL, 'Personalized Birthday Video Greeting - Custom Animated Messages', 'Surprise loved ones with fun, animated birthday greetings', 101, 'pink', 'pink', 0, '2025-08-23 13:25:04', '2025-08-23 13:25:04', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('be73e2ac-2c5b-47e7-b823-b9984ee3dc86', 'SiteGround GrowBig', 'GrowBig Hosting Plan', 'SiteGround', 'Web Hosting', 'Business & Pro Plans', 6.99, 19.99, '65%', '[\"Unlimited Websites\",\"Premium Support\",\"Free CDN\",\"Daily Backups\"]', 'https://siteground.com', 'https://siteground.com', 'https://logo.clearbit.com/siteground.com', 'https://logo.clearbit.com/siteground.com', 4.9, 12500, 0, NULL, NULL, 'SiteGround GrowBig - 65% Off', 'Premium hosting from SiteGround with 65% discount', 93, 'green', 'green', 1, '2025-08-23 13:08:15', '2025-08-23 13:08:15', 1, 'vertical', NULL, NULL, NULL, 999, 1, 1, 'normal'),
('c590c9b0-3edd-4072-ab63-53d786541e74', 'WordPress Starter', NULL, 'Kinsta', 'WordPress Hosting', 'Personal', 30.00, NULL, NULL, '[\"Google Cloud Platform\",\"Free SSL\",\"Daily Backups\",\"24/7 Support\"]', NULL, 'https://kinsta.com', NULL, NULL, 4.8, 1834, 0, NULL, NULL, NULL, 'Fast WordPress hosting powered by Google Cloud', 5, NULL, NULL, 0, '2025-08-22 15:51:45', '2025-08-22 15:51:45', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('c7c80709-a290-487d-92f3-2a323dc5442b', 'Custom Animated Wedding Invitation', 'Custom Animated Wedding Invitation', 'Creative Services', 'Digital Product', 'Custom Design Services', 50.00, 99.99, '50%', '[\"Personalized Animation\",\"HD Video Quality\",\"Multiple Formats\",\"Fast Delivery\"]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Custom%20Animated%20Wedding%20Invitation%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Custom%20Animated%20Wedding%20Invitation%22.', 'https://placehold.co/400x300/F472B6/FFFFFF.png?text=Wedding+Invitation', NULL, 5.0, 832, 0, NULL, NULL, 'Custom Animated Wedding Invitation - Beautiful Video Invites', 'Create beautiful, unique video invitations for your special day', 97, 'pink', 'pink', 1, '2025-08-23 13:25:02', '2025-08-23 13:25:02', 1, 'vertical', NULL, NULL, NULL, 999, 1, 1, 'normal'),
('cde1973a-1a68-4792-b507-2fad355a1db7', '.com Domain', '.com Domain', 'Bluehost', 'Domain', 'Popular Domains (.com, .net)', 12.99, NULL, NULL, '[\"Free for 1st year with hosting\"]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, 4.1, 5321, 0, NULL, NULL, '.com Domain', '.com Domain', 51, NULL, NULL, 0, '2025-08-23 11:20:41', '2025-08-23 11:20:41', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('ce170616-3faf-419b-96e4-f301fea21e45', 'Flywheel Tiny', 'Flywheel Tiny', 'Flywheel', 'WordPress Hosting', 'Managed WordPress', 13.00, NULL, NULL, '[\"1 Site\",\"5 GB Disk Space\",\"Free SSL\",\"Staging Sites\"]', '#', '#', NULL, NULL, 4.5, 1800, 0, NULL, NULL, 'Flywheel Tiny', 'Flywheel Tiny', 72, NULL, NULL, 0, '2025-08-23 11:37:24', '2025-08-23 11:37:24', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('ce466224-708e-40d7-96d1-5c6cb53de0db', 'SPECIAL15', '15% off Hostinger Business Hosting!', 'Hostinger', 'Coupon', 'Web Hosting', 0.00, NULL, NULL, '[]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, NULL, 0, 0, 'SPECIAL15', NULL, '15% off Hostinger Business Hosting!', '15% off Hostinger Business Hosting!', 54, NULL, NULL, 0, '2025-08-23 11:20:42', '2025-08-23 11:20:42', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('cfbfdd2b-8817-4df6-9aaf-a46ff67ce84d', 'Supersonic Cloud', 'Supersonic Cloud', 'A2 Hosting', 'Cloud Hosting', 'Performance Cloud', 12.99, 29.99, '57%', '[\"Unlimited Websites\",\"Turbo Servers (20X Faster)\",\"Free Site Migration\",\"99.9% Uptime Commitment\"]', 'https://www.a2hosting.com/cloud-hosting', 'https://www.a2hosting.com/cloud-hosting', NULL, NULL, 4.5, 7458, 0, NULL, NULL, 'Supersonic Cloud', 'Supersonic Cloud', 43, NULL, NULL, 0, '2025-08-23 11:20:38', '2025-08-23 11:20:38', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('d3ca0510-eeef-4431-a614-ca5ae89ff646', 'SITEDOMAIN', 'Get a .com for $19.99 at SiteGround.', 'SiteGround', 'Coupon', 'Domain', 0.00, NULL, NULL, '[]', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', NULL, NULL, NULL, 0, 0, 'SITEDOMAIN', NULL, 'Get a .com for $19.99 at SiteGround.', 'Get a .com for $19.99 at SiteGround.', 60, NULL, NULL, 0, '2025-08-23 11:20:44', '2025-08-23 11:20:44', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal');
INSERT INTO `products` (`id`, `name`, `title`, `provider`, `type`, `tier`, `price`, `original_price`, `discount`, `features`, `link`, `target_url`, `image`, `provider_logo`, `rating`, `num_reviews`, `clicks`, `code`, `short_link`, `seo_title`, `seo_description`, `catalog_number`, `color`, `button_color`, `is_featured`, `created_at`, `updated_at`, `show_on_landing`, `display_style`, `catalog_image`, `brand_logo`, `brand_logo_text`, `display_order`, `show_on_home`, `shake_animation`, `shake_intensity`) VALUES
('d54da172-7890-48d5-b43d-cee02930ab3b', 'Professional Object Removal', 'Professional Object Removal', 'HostVoucher', 'Digital Product', 'Photo Editing', 9.99, NULL, NULL, '[]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Professional%20Object%20Removal%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Professional%20Object%20Removal%22.', 'https://placehold.co/100x100/FBBF24/FFFFFF?text=Remove', NULL, 4.7, 543, 0, NULL, NULL, 'Professional Object Removal', 'Remove any unwanted object or person from your photos.', 25, NULL, NULL, 0, '2025-08-23 11:20:30', '2025-08-23 11:20:30', 1, NULL, 'https://placehold.co/100x100/FBBF24/FFFFFF?text=Remove', NULL, NULL, 999, 1, 0, 'normal'),
('d6483a34-3b36-435a-aa8e-a6000fd2fffe', 'Linode Nanode', 'Linode Nanode', 'Linode', 'Cloud Hosting', 'Performance Cloud', 5.00, NULL, NULL, '[\"1 vCPU\",\"1 GB RAM\",\"25 GB SSD\",\"1 TB Transfer\"]', '#', '#', NULL, NULL, 4.5, 12000, 0, NULL, NULL, 'Linode Nanode', 'Linode Nanode', 74, NULL, NULL, 0, '2025-08-23 11:37:25', '2025-08-23 11:37:25', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('d7455a65-567e-4bac-9a82-94f6e30d425e', 'Bluehost Choice Plus', 'Choice Plus Hosting Plan', 'Bluehost', 'Web Hosting', 'Business & Pro Plans', 5.45, 13.95, '61%', '[\"Unlimited Websites\",\"Unmetered Bandwidth\",\"Free SSL\",\"Domain Privacy\"]', 'https://bluehost.com', 'https://bluehost.com', 'https://logo.clearbit.com/bluehost.com', 'https://logo.clearbit.com/bluehost.com', 4.6, 8900, 0, NULL, NULL, 'Bluehost Choice Plus - 61% Off', 'Professional hosting from Bluehost with 61% discount', 92, 'blue', 'blue', 0, '2025-08-23 13:08:14', '2025-08-23 13:08:14', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('d79231ef-b8a7-44f9-90e9-3f480e235791', 'Vultr Regular Performance', 'Vultr Regular Performance', 'Vultr', 'Cloud Hosting', 'Performance Cloud', 6.00, NULL, NULL, '[\"1 vCPU\",\"1 GB RAM\",\"25 GB SSD\",\"1 TB Bandwidth\"]', '#', '#', NULL, NULL, 4.4, 9500, 0, NULL, NULL, 'Vultr Regular Performance', 'Vultr Regular Performance', 75, NULL, NULL, 0, '2025-08-23 11:37:26', '2025-08-23 11:37:26', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('d8f61a5e-e084-4f84-a4ac-c21a235a565a', 'Managed WordPress Starter', 'Managed WordPress Starter', 'Hostinger', 'WordPress Hosting', 'Managed WordPress', 1.99, 9.99, '80%', '[\"100 Websites\",\"100 GB SSD Storage\",\"Managed WordPress\",\"WP-CLI & SSH\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.8, 19543, 0, NULL, NULL, 'Managed WordPress Starter', 'Managed WordPress Starter', 36, NULL, NULL, 0, '2025-08-23 11:20:35', '2025-08-23 11:20:35', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('da903758-7590-499f-b0d3-9a74274324ed', 'Choice Plus WP', 'Choice Plus WP', 'Bluehost', 'WordPress Hosting', 'Managed WordPress', 5.45, 16.99, '67%', '[\"3 Websites\",\"40 GB SSD Storage\",\"Free Domain Privacy\",\"Daily Website Backup\"]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, 4.3, 5321, 0, NULL, NULL, 'Choice Plus WP', 'Choice Plus WP', 38, NULL, NULL, 0, '2025-08-23 11:20:36', '2025-08-23 11:20:36', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('de0592b1-12fb-41c3-ad2a-dc5ba18073dc', 'Personal Landing Page Website', 'Personal Landing Page Website', 'Web Development', 'Digital Product', 'Website Development', 199.00, 399.99, '50%', '[\"Responsive Design\",\"SEO Optimized\",\"Fast Loading\",\"Mobile Friendly\"]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personal%20Landing%20Page%20Website%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personal%20Landing%20Page%20Website%22.', 'https://placehold.co/400x300/A78BFA/FFFFFF.png?text=Landing+Page', NULL, 5.0, 150, 0, NULL, NULL, 'Personal Landing Page Website - Professional Web Development', 'Get a stunning, fast, one-page website for your brand', 100, 'purple', 'purple', 1, '2025-08-23 13:25:04', '2025-08-23 13:25:04', 1, 'vertical', NULL, NULL, NULL, 999, 1, 1, 'intense'),
('deal-1', 'Shared Hosting Pro', 'Professional Shared Hosting', 'HostGator', 'Web Hosting', 'Business', 5.95, 12.95, '54% OFF', '[\"Unlimited Bandwidth\",\"Free SSL Certificate\",\"24/7 Support\",\"1-Click WordPress Install\"]', 'https://hostgator.com', 'https://hostgator.com', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop', 'https://logo.clearbit.com/hostgator.com', 4.5, 1250, 89, NULL, NULL, NULL, NULL, 1001, NULL, NULL, 1, '2025-08-23 23:32:40', '2025-08-23 23:32:40', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('deal-2', 'Cloud VPS Premium', 'High-Performance Cloud VPS', 'DigitalOcean', 'VPS', 'Enterprise', 24.00, 40.00, '40% OFF', '[\"8GB RAM\",\"4 CPU Cores\",\"160GB SSD\",\"8TB Transfer\"]', 'https://digitalocean.com', 'https://digitalocean.com', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', 'https://logo.clearbit.com/digitalocean.com', 4.8, 890, 156, NULL, NULL, NULL, NULL, 1002, NULL, NULL, 1, '2025-08-23 23:32:41', '2025-08-23 23:32:41', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('deal-3', 'WordPress Hosting', 'Managed WordPress Hosting', 'WP Engine', 'WordPress Hosting', 'Business', 20.00, 30.00, '33% OFF', '[\"Managed Updates\",\"Daily Backups\",\"CDN Included\",\"Expert Support\"]', 'https://wpengine.com', 'https://wpengine.com', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', 'https://logo.clearbit.com/wpengine.com', 4.7, 2100, 234, NULL, NULL, NULL, NULL, 1003, NULL, NULL, 1, '2025-08-23 23:32:41', '2025-08-23 23:32:41', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('e043f4a6-7c2f-4e42-b9e5-101d93af30d7', 'bluehost vps', '', 'bluehost', 'VPS', 'Personal', 7.00, 9.00, '65% off', '[\"free domain\",\"ssl\",\"email business\",\".com\",\"ssh\"]', '', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', '', '', 4.9, 3789, 0, 'blu65', '', '', '', 3, 'blue', 'blue', 1, '2025-08-20 19:02:07', '2025-08-22 15:50:20', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('e52183c1-e2b4-4f96-8a38-fc1ac3cb5153', 'WPSPECIAL', 'WPSPECIAL', 'DreamHost', 'Coupon', 'WordPress Hosting', 0.00, NULL, NULL, '[]', '#', '#', NULL, NULL, NULL, 0, 0, 'WPSPECIAL', NULL, 'WPSPECIAL', 'Special WordPress hosting discount - 40% off!', 86, NULL, NULL, 0, '2025-08-23 11:37:30', '2025-08-23 11:37:30', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('e5f88fde-8dda-4c20-8015-e3563bf9f85a', 'hosting', '', 'elementor', 'Web Hosting', 'personal', 8.00, 13.00, '75% off', '[\"free domain\",\"free ssl\",\"free ssh\",\"email business\"]', '', 'https://elementor.com/pages/elementor-wordpress-hosting/?cxd=7481_1677375&utm_source=elementor&utm_medium=affiliate&utm_campaign=7481&utm_content=cx&affid=7481', '', '', 5.0, 10000000, 0, '', 'elementor', '', '', 12, 'blue', 'red', 0, '2025-08-23 03:41:22', '2025-08-23 03:41:22', 0, 'vertical', '', '', 'elementor', 999, 1, 0, 'normal'),
('e9838ab8-06ca-474d-8441-aeb8b4be5266', 'InMotion Hosting Launch', 'InMotion Hosting Launch', 'InMotion', 'Web Hosting', 'Business & Pro Plans', 6.99, 15.99, '56%', '[\"2 Websites\",\"100 GB SSD\",\"Free SSL\",\"Website Builder\"]', '#', '#', NULL, NULL, 4.6, 4800, 0, NULL, NULL, 'InMotion Hosting Launch', 'InMotion Hosting Launch', 69, NULL, NULL, 0, '2025-08-23 11:37:22', '2025-08-23 11:37:22', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('ebc89314-e19f-480c-aa88-6c33ae175b33', 'DigitalOcean Droplet', 'Basic Cloud Droplet', 'DigitalOcean', 'Cloud Hosting', 'Performance Cloud', 5.00, NULL, NULL, '[\"1 vCPU\",\"1 GB RAM\",\"25 GB SSD\",\"1 TB Transfer\"]', 'https://digitalocean.com', 'https://digitalocean.com', 'https://logo.clearbit.com/digitalocean.com', 'https://logo.clearbit.com/digitalocean.com', 4.7, 18600, 0, NULL, NULL, 'DigitalOcean Cloud Hosting', 'Reliable cloud hosting from DigitalOcean', 94, 'blue', 'blue', 0, '2025-08-23 13:08:16', '2025-08-23 13:08:16', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('ee2983dc-e68a-4456-9af5-574295a44a4d', 'Cloud Hosting Basic', 'Cloud Hosting Basic', 'Bluehost', 'Cloud Hosting', 'Business Cloud', 19.95, NULL, NULL, '[\"Optimized Cloud Servers\",\"High Performance\",\"Scalable Resources\",\"Free Domain & SSL\"]', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', NULL, NULL, 4.3, 5321, 0, NULL, NULL, 'Cloud Hosting Basic', 'Cloud Hosting Basic', 44, NULL, NULL, 0, '2025-08-23 11:20:39', '2025-08-23 11:20:39', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('f121a787-3b1e-450c-bfa5-7ebc48e7257b', 'NordVPN Premium', NULL, 'NordVPN', 'VPN', 'Personal', 3.99, NULL, NULL, '[\"5500+ Servers\",\"No Logs Policy\",\"Kill Switch\",\"6 Devices\"]', NULL, 'https://nordvpn.com', NULL, NULL, 4.7, 1654, 0, NULL, NULL, NULL, 'Secure VPN with global server network', 8, NULL, NULL, 0, '2025-08-22 15:51:46', '2025-08-22 15:51:46', 1, 'vertical', NULL, NULL, NULL, 999, 1, 0, 'normal'),
('f530dfa7-6fac-4545-b6ce-48e107b08fc3', 'Ghibli Style Portrait', 'Ghibli Style Portrait', 'HostVoucher', 'Digital Product', 'Art & Design', 25.00, NULL, NULL, '[]', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Ghibli%20Style%20Portrait%22.', 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Ghibli%20Style%20Portrait%22.', 'https://placehold.co/100x100/60A5FA/FFFFFF?text=Ghibli', NULL, 4.8, 2109, 0, NULL, NULL, 'Ghibli Style Portrait', 'Turn your photo into a magical Ghibli-inspired artwork.', 24, NULL, NULL, 0, '2025-08-23 11:20:30', '2025-08-23 11:20:30', 1, NULL, 'https://placehold.co/100x100/60A5FA/FFFFFF?text=Ghibli', NULL, NULL, 999, 1, 0, 'normal'),
('fdfca66e-59da-4cb1-a0f3-199b02172256', 'Kinsta Starter', 'Kinsta Starter', 'Kinsta', 'WordPress Hosting', 'Managed WordPress', 30.00, NULL, NULL, '[\"1 WordPress Site\",\"10 GB SSD\",\"Google Cloud Platform\",\"Free CDN\"]', '#', '#', NULL, NULL, 4.8, 2100, 0, NULL, NULL, 'Kinsta Starter', 'Kinsta Starter', 71, NULL, NULL, 0, '2025-08-23 11:37:23', '2025-08-23 11:37:23', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal'),
('fe7b49ac-e996-4bcb-82b4-2502e7d7b4b9', 'Cloud Professional', 'Cloud Professional', 'Hostinger', 'Cloud Hosting', 'High-Performance Cloud', 14.99, 49.99, '70%', '[\"300 Websites\",\"250 GB NVMe Storage\",\"Daily Backups\",\"Dedicated IP Address\"]', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', NULL, NULL, 4.9, 19543, 0, NULL, NULL, 'Cloud Professional', 'Cloud Professional', 42, NULL, NULL, 0, '2025-08-23 11:20:38', '2025-08-23 11:20:38', 1, NULL, NULL, NULL, NULL, 999, 1, 0, 'normal');

-- --------------------------------------------------------

--
-- Table structure for table `realtime_visitors`
--

CREATE TABLE `realtime_visitors` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `page_url` varchar(500) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `last_seen` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` varchar(50) NOT NULL DEFAULT 'main_settings',
  `theme` varchar(50) DEFAULT 'system',
  `ga_id` varchar(255) DEFAULT NULL,
  `fb_pixel_id` varchar(255) DEFAULT NULL,
  `catalog_number_prefix` varchar(10) DEFAULT 'HV',
  `currency_rates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`currency_rates`)),
  `gamification_points` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gamification_points`)),
  `site_appearance` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`site_appearance`)),
  `page_banners` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`page_banners`)),
  `popup_modal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`popup_modal`)),
  `idle_sound` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`idle_sound`)),
  `nft_exchange_active` tinyint(1) DEFAULT 0,
  `require_eth_address` tinyint(1) DEFAULT 1,
  `max_points_per_user` int(11) DEFAULT 1000,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `theme`, `ga_id`, `fb_pixel_id`, `catalog_number_prefix`, `currency_rates`, `gamification_points`, `site_appearance`, `page_banners`, `popup_modal`, `idle_sound`, `nft_exchange_active`, `require_eth_address`, `max_points_per_user`, `updated_at`) VALUES
('main_settings', 'system', NULL, NULL, '#', NULL, NULL, '{\"site_title\":\"HostVoucher\",\"site_description\":\"#1 source for exclusive tech & digital service deals!\",\"logo_url\":\"/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png\",\"favicon_url\":\"/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png\",\"primary_color\":\"#f97316\",\"secondary_color\":\"#1e293b\",\"banner_image\":\"/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png\",\"banner_text\":\"Find the Best Hosting Deals in One Click\",\"footer_text\":\"© 2025 HostVoucher. All rights reserved. Built with ❤️ for the best deals.\",\"specialistImageUrl\":\"/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png\",\"floatingPromoUrl\":\"/uploads/images/1755926500003_new_promo.png\",\"popupModalImageUrl\":\"/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png\",\"brandLogoUrl\":\"/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png\",\"heroBackgroundImageUrl\":\"/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png\",\"banner_slide_1_image\":\"/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png\",\"banner_slide_1_title\":\"Welcome to HostVoucher\",\"banner_slide_1_subtitle\":\"Find the best hosting deals and save money on your web hosting needs\",\"banner_slide_1_button_text\":\"Browse Deals\",\"banner_slide_1_button_link\":\"/web-hosting\",\"banner_slide_2_image\":\"/uploads/images/1755926500003_new_promo.png\",\"banner_slide_2_title\":\"Premium Hosting Solutions\",\"banner_slide_2_subtitle\":\"Get 99.9% uptime guarantee with our trusted hosting partners\",\"banner_slide_2_button_text\":\"Get Started\",\"banner_slide_2_button_link\":\"/hosting\",\"banner_slide_3_image\":\"\",\"banner_slide_3_title\":\"\",\"banner_slide_3_subtitle\":\"\",\"banner_slide_3_button_text\":\"\",\"banner_slide_3_button_link\":\"\",\"banner_slide_4_image\":\"\",\"banner_slide_4_title\":\"\",\"banner_slide_4_subtitle\":\"\",\"banner_slide_4_button_text\":\"\",\"banner_slide_4_button_link\":\"\",\"rotation_interval\":8,\"specialist_image_url\":\"/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png\",\"floating_promo_url\":\"/uploads/images/1755926500003_new_promo.png\",\"popup_modal_image_url\":\"/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png\",\"specialist_profile\":{\"name\":\"Ah Nakamoto\",\"title\":\"Senior Hosting Specialist\",\"image_url\":\"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face\",\"bio\":\"Expert in web hosting solutions with over 8 years of experience helping businesses find the perfect hosting setup.\",\"contact_email\":\"nakamoto@hostvoucher.com\",\"specialties\":[\"Web Hosting\",\"VPS Solutions\",\"WordPress Optimization\",\"Cloud Infrastructure\"]},\"promotional_offer\":{\"enabled\":true,\"title\":\"Limited Time Offer!\",\"description\":\"Get 50% off on premium hosting plans\",\"image_url\":\"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop\",\"button_text\":\"Claim Offer\",\"button_link\":\"/promotional-vouchers\",\"expires_at\":\"2025-09-22T02:56:15.220Z\"},\"banner_subtitle\":\"We compare, you save. Discover promos for domains, VPS, cloud hosting, and more.\",\"strategySectionImages\":[\"https://i.ibb.co/qkjH8vL/digital-foundation.jpg\",\"https://i.ibb.co/2qvH8mL/wordpress-mastery.jpg\",\"https://i.ibb.co/3qvH8mL/fullscale-apps.jpg\",\"https://i.ibb.co/4qvH8mL/professional-credibility.jpg\",\"https://i.ibb.co/5qvH8mL/digital-security.jpg\"]}', '{}', '{}', '{\"enabled\":true}', 1, 1, 1000, '2025-08-23 09:14:08');

-- --------------------------------------------------------

--
-- Table structure for table `submitted_vouchers`
--

CREATE TABLE `submitted_vouchers` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `provider` varchar(255) DEFAULT NULL,
  `voucher_code` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT current_timestamp(),
  `user_email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `template_categories`
--

CREATE TABLE `template_categories` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `template_categories`
--

INSERT INTO `template_categories` (`id`, `name`, `description`, `icon`, `sort_order`, `is_active`, `created_at`) VALUES
('77c091ff-807d-11f0-a945-00163e0960bf', 'Restaurant', 'Restaurant and food service websites', 'utensils', 1, 1, '2025-08-24 00:01:19'),
('77ffea19-807d-11f0-a945-00163e0960bf', 'E-commerce', 'Online stores and shopping websites', 'shopping-cart', 2, 1, '2025-08-24 00:01:20'),
('7840f8ac-807d-11f0-a945-00163e0960bf', 'Portfolio', 'Creative and professional portfolios', 'briefcase', 3, 1, '2025-08-24 00:01:20'),
('7881007f-807d-11f0-a945-00163e0960bf', 'Business', 'Corporate and business websites', 'building', 4, 1, '2025-08-24 00:01:20'),
('78bd3016-807d-11f0-a945-00163e0960bf', 'Blog', 'Personal and professional blogs', 'edit', 5, 1, '2025-08-24 00:01:21');

-- --------------------------------------------------------

--
-- Table structure for table `template_downloads`
--

CREATE TABLE `template_downloads` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `template_id` varchar(36) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `download_count` int(11) DEFAULT 1,
  `last_downloaded` timestamp NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `template_purchases`
--

CREATE TABLE `template_purchases` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `template_id` varchar(36) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `purchase_price` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `purchased_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `review` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `role`, `review`, `image_url`, `rating`, `created_at`, `updated_at`) VALUES
('1ec308ee-6aed-440e-84de-7c2f5826afce', 'Mike Chen', 'Web Developer', 'Excellent service and great deals. The support team is very responsive and helpful. Found the perfect VPS solution for my clients.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 5, '2025-08-23 06:56:14', '2025-08-23 06:56:14'),
('21ff1b37-75d8-4cfc-acc1-108df0092f7c', 'Elena Rodriguez', 'Digital Nomad & Blogger', 'As someone who works from different countries, the VPN deals on HostVoucher are a lifesaver. I get top-tier security and access to global content at a fraction of the price.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:09', '2025-08-24 12:02:09'),
('27d9c84e-108d-4463-9d9f-d34091603b7a', 'Sarah Mills', 'E-commerce Specialist', 'The speed and uptime are phenomenal. Our online store has never been faster, and we\'ve seen a noticeable increase in conversions since switching to a provider found on HostVoucher.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:08', '2025-08-24 12:02:08'),
('293df297-3f22-4f30-823f-55f58c009673', 'Maria Garcia', 'Content Creator', 'As a content creator, website speed is crucial for my audience. The hosting provider I found through HostVoucher has been lightning fast and incredibly reliable.', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:10', '2025-08-24 12:02:10'),
('38790f74-e12e-42ef-b0b2-e2d56acdffac', 'Mike Chen', 'Lead Developer, TechStart', 'The VPS deals are unbeatable. We get the power and flexibility we need without the exorbitant costs. The curated selection on HostVoucher saved us days of research.', 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:08', '2025-08-24 12:02:08'),
('4b46f3b1-b0d9-4661-a860-d51311c9099f', 'Lisa Thompson', 'Digital Marketer', 'Professional service and competitive prices. Will definitely use again. The customer support is outstanding and very knowledgeable.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', 4, '2025-08-23 06:56:14', '2025-08-23 06:56:14'),
('4d3c9bb4-4b80-4dcf-b16e-7d37aa763e56', 'David Wilson', 'Startup Founder', 'Great platform for comparing hosting providers. Made my decision so much easier! The deals are transparent and legitimate.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', 5, '2025-08-23 06:56:14', '2025-08-23 06:56:14'),
('5c937ea6-308c-428c-9725-e371d43fe0c4', 'Sarah Johnson', 'Marketing Director', 'HostVoucher has transformed how we find hosting deals. The curated selection and exclusive discounts have saved our company thousands of dollars while maintaining top-quality service.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:07', '2025-08-24 12:02:07'),
('6e9f3cb7-e2b4-4f69-8597-2f02983832c3', 'Sarah Johnson', 'Small Business Owner', 'HostVoucher helped me find amazing hosting deals! Saved over $200 on my annual hosting costs. The platform is easy to use and the deals are genuine.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 5, '2025-08-23 06:56:14', '2025-08-23 06:56:14'),
('8b127237-be07-4edb-b6c1-d2ec6017f559', 'Mike Chen', 'Lead Developer, TechStart', 'The VPS deals are unbeatable. We get the power and flexibility we need without the exorbitant costs. The curated selection on HostVoucher saved us days of research.', 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face', 5, '2025-08-23 13:04:52', '2025-08-23 13:04:52'),
('9be2189b-382e-4def-af00-9a995a607514', 'Sarah Johnson', 'Marketing Director', 'HostVoucher has transformed how we find hosting deals. The curated selection and exclusive discounts have saved our company thousands of dollars while maintaining top-quality service.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80', 5, '2025-08-23 13:04:50', '2025-08-23 13:19:27'),
('a071b0ba-4b0c-4b0c-b038-81fdcf51a994', 'Priya Patel', 'Digital Marketing Manager', 'The SSL certificate deals alone saved our agency thousands. Plus, the hosting performance has improved our clients\' SEO rankings significantly. Absolutely fantastic service!', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:11', '2025-08-24 12:02:11'),
('ab937b85-6535-46bd-9406-3a0f88e4ca69', 'Emily Rodriguez', 'E-commerce Manager', 'Found the perfect hosting solution for my business. Highly recommend HostVoucher! The comparison tools are incredibly useful.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 4, '2025-08-23 06:56:14', '2025-08-23 06:56:14'),
('c4211e20-d7ed-4de5-bfbe-f8bc5148cdcc', 'Jack Bies', 'Creative Director', 'HostVoucher\'s Customer Success team goes above and beyond to understand my problem. Their dedication to performance and support is unmatched.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:07', '2025-08-24 12:02:07'),
('cb9e18dd-484f-47ca-8309-6cfe13f6b308', 'Charlie Low', 'Co-founder of Nohma', 'Ever since we\'ve been with HostVoucher, it\'s been amazing. We\'ve not really had any issues at all and if we ever do have a question, their customer service is incredible.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 5, '2025-08-23 13:04:51', '2025-08-23 13:04:51'),
('cc7fe1d1-1530-4e70-8345-b96a9be233c8', 'Sarah Mills', 'E-commerce Specialist', 'The speed and uptime are phenomenal. Our online store has never been faster, and we\'ve seen a noticeable increase in conversions since switching to a provider found on HostVoucher.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 5, '2025-08-23 13:04:51', '2025-08-23 13:04:51'),
('cebc8af7-25bc-4d57-bb37-292fe321f23d', 'Jack Bies', 'Creative Director', 'HostVoucher\'s Customer Success team goes above and beyond to understand my problem. Their dedication to performance and support is unmatched.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 5, '2025-08-23 13:04:51', '2025-08-23 13:04:51'),
('ebe8ca45-2b13-44c5-8c9c-4d2fcbd3e675', 'Lisa Wang', 'UX Designer', 'HostVoucher made it so easy to find the perfect hosting for my portfolio site. The interface is intuitive and the deals are genuinely valuable. Highly recommend!', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:09', '2025-08-24 12:02:09'),
('ee036ece-65fc-4197-888c-7a8df9d50f4c', 'James Wilson', 'Small Business Owner', 'Running a small business means every dollar counts. HostVoucher helped me find premium hosting at a fraction of the usual cost. My website has never performed better.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:11', '2025-08-24 12:02:11'),
('f14b9b71-11fe-4d69-b34a-e26cda8efd62', 'David Kim', 'Startup Founder', 'The hosting recommendations are spot-on. We launched our SaaS platform with confidence knowing we had the best hosting deal available. The performance has been exceptional.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:09', '2025-08-24 12:02:09'),
('f5ea36fb-d6ba-4d05-85fd-321260982004', 'Elena Rodriguez', 'Digital Nomad & Blogger', 'As someone who works from different countries, the VPN deals on HostVoucher are a lifesaver. I get top-tier security and access to global content at a fraction of the price.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 5, '2025-08-23 13:04:52', '2025-08-23 13:04:52'),
('f8cb4924-f79f-427b-97d9-fc1d58720748', 'Charlie Low', 'Co-founder of Nohma', 'Ever since we\'ve been with HostVoucher, it\'s been amazing. We\'ve not really had any issues at all and if we ever do have a question, their customer service is incredible.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:07', '2025-08-24 12:02:07'),
('fab999de-4784-4670-a9d8-7a2b9beb1d12', 'Alex Thompson', 'DevOps Engineer', 'The cloud hosting deals here are incredible. We migrated our entire infrastructure and saved 40% on costs while improving performance. The technical support guidance was invaluable.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face', 5, '2025-08-24 12:02:10', '2025-08-24 12:02:10'),
('test-1', 'Sarah Johnson', 'Web Developer', 'HostVoucher helped me find the perfect hosting deal for my client projects. The comparison feature saved me hours of research!', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 5, '2025-08-23 23:32:38', '2025-08-23 23:32:38'),
('test-2', 'Mike Chen', 'Startup Founder', 'Amazing platform! Found a great VPS deal that scaled perfectly with our growing business. Highly recommended!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 5, '2025-08-23 23:32:39', '2025-08-23 23:32:39'),
('test-3', 'Emily Rodriguez', 'Digital Marketer', 'The voucher codes saved me over $200 on hosting costs this year. HostVoucher is a game-changer!', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 4, '2025-08-23 23:32:39', '2025-08-23 23:32:39'),
('test-4', 'David Kim', 'E-commerce Owner', 'Fast, reliable hosting recommendations. My online store has never performed better!', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 5, '2025-08-23 23:32:39', '2025-08-23 23:32:39'),
('test-5', 'Lisa Wang', 'Blogger', 'Perfect for beginners! The detailed comparisons helped me choose the right WordPress hosting.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 4, '2025-08-23 23:32:40', '2025-08-23 23:32:40');

-- --------------------------------------------------------

--
-- Table structure for table `user_purchases`
--

CREATE TABLE `user_purchases` (
  `id` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `item_type` enum('template','service','product') NOT NULL,
  `item_id` varchar(255) NOT NULL,
  `payment_id` varchar(255) NOT NULL,
  `download_count` int(11) DEFAULT 0,
  `last_downloaded_at` datetime DEFAULT NULL,
  `purchased_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visitor_analytics`
--

CREATE TABLE `visitor_analytics` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `ip_address` varchar(45) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `country_code` varchar(2) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT NULL,
  `isp` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `browser_version` varchar(50) DEFAULT NULL,
  `os` varchar(100) DEFAULT NULL,
  `os_version` varchar(50) DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `device_brand` varchar(100) DEFAULT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `referrer` text DEFAULT NULL,
  `landing_page` varchar(500) DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `visit_duration` int(11) DEFAULT 0,
  `page_views` int(11) DEFAULT 1,
  `is_bot` tinyint(1) DEFAULT 0,
  `is_mobile` tinyint(1) DEFAULT 0,
  `screen_resolution` varchar(20) DEFAULT NULL,
  `language` varchar(10) DEFAULT NULL,
  `visited_at` timestamp NULL DEFAULT current_timestamp(),
  `last_activity` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `website_templates`
--

CREATE TABLE `website_templates` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `preview_image` varchar(500) DEFAULT NULL,
  `demo_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `is_free` tinyint(1) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT 0.0,
  `downloads` int(11) DEFAULT 0,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `template_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`template_files`)),
  `ai_generated` tinyint(1) DEFAULT 0,
  `ai_prompt` text DEFAULT NULL,
  `status` enum('active','inactive','pending') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `website_templates`
--

INSERT INTO `website_templates` (`id`, `name`, `category`, `description`, `preview_image`, `demo_url`, `price`, `is_free`, `rating`, `downloads`, `features`, `template_files`, `ai_generated`, `ai_prompt`, `status`, `created_at`, `updated_at`) VALUES
('4f92391c-8085-11f0-a945-00163e0960bf', 'AI Generated: web kontraktor', 'Business', 'Custom business website generated based on: \"web kontraktor\". This template includes modern design elements and functionality tailored to your specific requirements.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', NULL, 19.99, 0, 4.7, 0, '[\"Responsive Design\",\"SEO Optimized\",\"Fast Loading\"]', '{\"index.html\":\"<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n    <meta charset=\\\"UTF-8\\\">\\n    <meta name=\\\"viewport\\\" content=\\\"width=device-width, initial-scale=1.0\\\">\\n    <title>AI Generated Website - web kontraktor</title>\\n    <link rel=\\\"stylesheet\\\" href=\\\"style.css\\\">\\n</head>\\n<body>\\n    <header>\\n        <nav>\\n            <div class=\\\"logo\\\">Your Brand</div>\\n            <ul class=\\\"nav-links\\\">\\n                <li><a href=\\\"#home\\\">Home</a></li>\\n                <li><a href=\\\"#about\\\">About</a></li>\\n                <li><a href=\\\"#services\\\">Services</a></li>\\n                <li><a href=\\\"#contact\\\">Contact</a></li>\\n            </ul>\\n        </nav>\\n    </header>\\n    \\n    <main>\\n        <section id=\\\"hero\\\">\\n            <h1>Welcome to Your Business Website</h1>\\n            <p>Generated based on: web kontraktor</p>\\n            <button class=\\\"cta-button\\\">Get Started</button>\\n        </section>\\n        \\n        <section id=\\\"features\\\">\\n            <h2>Our Features</h2>\\n            <div class=\\\"feature-grid\\\">\\n                <div class=\\\"feature-card\\\">\\n                    <h3>Feature 1</h3>\\n                    <p>Description of feature 1</p>\\n                </div>\\n                <div class=\\\"feature-card\\\">\\n                    <h3>Feature 2</h3>\\n                    <p>Description of feature 2</p>\\n                </div>\\n                <div class=\\\"feature-card\\\">\\n                    <h3>Feature 3</h3>\\n                    <p>Description of feature 3</p>\\n                </div>\\n            </div>\\n        </section>\\n    </main>\\n    \\n    <footer>\\n        <p>&copy; 2024 Your Brand. All rights reserved.</p>\\n    </footer>\\n    \\n    <script src=\\\"script.js\\\"></script>\\n</body>\\n</html>\",\"style.css\":\"/* AI Generated CSS for Business */\\n* {\\n    margin: 0;\\n    padding: 0;\\n    box-sizing: border-box;\\n}\\n\\nbody {\\n    font-family: \'Arial\', sans-serif;\\n    line-height: 1.6;\\n    color: #333;\\n}\\n\\nheader {\\n    background: #1f2937;\\n    color: white;\\n    padding: 1rem 0;\\n    position: fixed;\\n    width: 100%;\\n    top: 0;\\n    z-index: 1000;\\n}\\n\\nnav {\\n    display: flex;\\n    justify-content: space-between;\\n    align-items: center;\\n    max-width: 1200px;\\n    margin: 0 auto;\\n    padding: 0 2rem;\\n}\\n\\n.logo {\\n    font-size: 1.5rem;\\n    font-weight: bold;\\n}\\n\\n.nav-links {\\n    display: flex;\\n    list-style: none;\\n    gap: 2rem;\\n}\\n\\n.nav-links a {\\n    color: white;\\n    text-decoration: none;\\n    transition: color 0.3s;\\n}\\n\\n.nav-links a:hover {\\n    color: #374151;\\n}\\n\\nmain {\\n    margin-top: 80px;\\n}\\n\\n#hero {\\n    background: linear-gradient(135deg, #1f2937, #374151);\\n    color: white;\\n    text-align: center;\\n    padding: 4rem 2rem;\\n}\\n\\n#hero h1 {\\n    font-size: 3rem;\\n    margin-bottom: 1rem;\\n}\\n\\n.cta-button {\\n    background: white;\\n    color: #1f2937;\\n    padding: 1rem 2rem;\\n    border: none;\\n    border-radius: 5px;\\n    font-size: 1.1rem;\\n    cursor: pointer;\\n    margin-top: 2rem;\\n    transition: transform 0.3s;\\n}\\n\\n.cta-button:hover {\\n    transform: translateY(-2px);\\n}\\n\\n#features {\\n    padding: 4rem 2rem;\\n    max-width: 1200px;\\n    margin: 0 auto;\\n}\\n\\n#features h2 {\\n    text-align: center;\\n    margin-bottom: 3rem;\\n    color: #1f2937;\\n}\\n\\n.feature-grid {\\n    display: grid;\\n    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\\n    gap: 2rem;\\n}\\n\\n.feature-card {\\n    background: #f8f9fa;\\n    padding: 2rem;\\n    border-radius: 10px;\\n    text-align: center;\\n    box-shadow: 0 2px 10px rgba(0,0,0,0.1);\\n    transition: transform 0.3s;\\n}\\n\\n.feature-card:hover {\\n    transform: translateY(-5px);\\n}\\n\\nfooter {\\n    background: #1f2937;\\n    color: white;\\n    text-align: center;\\n    padding: 2rem;\\n}\\n\\n@media (max-width: 768px) {\\n    .nav-links {\\n        display: none;\\n    }\\n    \\n    #hero h1 {\\n        font-size: 2rem;\\n    }\\n    \\n    .feature-grid {\\n        grid-template-columns: 1fr;\\n    }\\n}\",\"script.js\":\"// AI Generated JavaScript for Business\\ndocument.addEventListener(\'DOMContentLoaded\', function() {\\n    // Smooth scrolling for navigation links\\n    const navLinks = document.querySelectorAll(\'.nav-links a\');\\n    navLinks.forEach(link => {\\n        link.addEventListener(\'click\', function(e) {\\n            e.preventDefault();\\n            const targetId = this.getAttribute(\'href\');\\n            const targetSection = document.querySelector(targetId);\\n            if (targetSection) {\\n                targetSection.scrollIntoView({\\n                    behavior: \'smooth\'\\n                });\\n            }\\n        });\\n    });\\n\\n    // CTA button interaction\\n    const ctaButton = document.querySelector(\'.cta-button\');\\n    if (ctaButton) {\\n        ctaButton.addEventListener(\'click\', function() {\\n            alert(\'Welcome to your new Business website! This is where you would add your custom functionality.\');\\n        });\\n    }\\n\\n    // Feature cards animation on scroll\\n    const observerOptions = {\\n        threshold: 0.1,\\n        rootMargin: \'0px 0px -50px 0px\'\\n    };\\n\\n    const observer = new IntersectionObserver(function(entries) {\\n        entries.forEach(entry => {\\n            if (entry.isIntersecting) {\\n                entry.target.style.opacity = \'1\';\\n                entry.target.style.transform = \'translateY(0)\';\\n            }\\n        });\\n    }, observerOptions);\\n\\n    const featureCards = document.querySelectorAll(\'.feature-card\');\\n    featureCards.forEach(card => {\\n        card.style.opacity = \'0\';\\n        card.style.transform = \'translateY(20px)\';\\n        card.style.transition = \'opacity 0.6s ease, transform 0.6s ease\';\\n        observer.observe(card);\\n    });\\n});\",\"README.md\":\"# AI Generated Business Website\\n\\nThis website template was generated using AI based on your prompt: \\\"web kontraktor\\\"\\n\\n## Features\\n- Responsive design that works on all devices\\n- Modern CSS with smooth animations\\n- Interactive JavaScript functionality\\n- SEO-optimized structure\\n- Clean, professional design\\n\\n## Installation\\n1. Extract all files to your web server directory\\n2. Open index.html in your browser\\n3. Customize the content to match your brand\\n\\n## Customization\\n- Edit index.html to change the content\\n- Modify style.css to adjust colors and styling\\n- Update script.js to add custom functionality\\n\\n## Support\\nFor support with this template, contact: support@hostvoucher.com\\n\\n## License\\nCommercial License - Single Use\\nYou may use this template for one commercial project.\\n\\nGenerated by HostVoucher Instant Pro Website\\n2025-08-24T00:57:26.912Z\"}', 1, 'web kontraktor', 'active', '2025-08-24 00:57:28', '2025-08-24 00:57:28'),
('template-1', 'Modern Restaurant', 'Restaurant', 'Beautiful restaurant website with online menu and reservation system', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', 'https://demo.example.com/restaurant', 29.99, 0, 4.8, 1250, '[\"Responsive Design\",\"Online Menu\",\"Reservation System\",\"SEO Optimized\"]', '{\"index.html\":\"<!DOCTYPE html><html><head><title>Restaurant</title></head><body><h1>Restaurant Website</h1></body></html>\",\"style.css\":\"body { font-family: Arial, sans-serif; }\",\"script.js\":\"console.log(\\\"Restaurant website loaded\\\");\"}', 0, NULL, 'active', '2025-08-24 00:01:17', '2025-08-24 00:01:17'),
('template-2', 'E-commerce Store', 'E-commerce', 'Complete online store with shopping cart and payment integration', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', 'https://demo.example.com/ecommerce', 49.99, 0, 4.9, 2100, '[\"Shopping Cart\",\"Payment Gateway\",\"Product Catalog\",\"Admin Panel\"]', '{\"index.html\":\"<!DOCTYPE html><html><head><title>E-commerce</title></head><body><h1>Online Store</h1></body></html>\",\"style.css\":\"body { font-family: Arial, sans-serif; background: #f5f5f5; }\",\"script.js\":\"console.log(\\\"E-commerce website loaded\\\");\"}', 0, NULL, 'active', '2025-08-24 00:01:17', '2025-08-24 00:01:17'),
('template-3', 'Creative Portfolio', 'Portfolio', 'Stunning portfolio website for creative professionals', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop', 'https://demo.example.com/portfolio', 0.00, 1, 4.6, 3400, '[\"Gallery\",\"Contact Form\",\"Blog\",\"Social Media Integration\"]', '{\"index.html\":\"<!DOCTYPE html><html><head><title>Portfolio</title></head><body><h1>Creative Portfolio</h1></body></html>\",\"style.css\":\"body { font-family: Arial, sans-serif; background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); }\",\"script.js\":\"console.log(\\\"Portfolio website loaded\\\");\"}', 0, NULL, 'active', '2025-08-24 00:01:18', '2025-08-24 00:01:18'),
('template-4', 'Business Corporate', 'Business', 'Professional corporate website for businesses', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', 'https://demo.example.com/business', 39.99, 0, 4.7, 890, '[\"Corporate Design\",\"Team Section\",\"Services Page\",\"Contact Form\"]', '{\"index.html\":\"<!DOCTYPE html><html><head><title>Business</title></head><body><h1>Corporate Website</h1></body></html>\",\"style.css\":\"body { font-family: Arial, sans-serif; background: #ffffff; color: #333; }\",\"script.js\":\"console.log(\\\"Business website loaded\\\");\"}', 0, NULL, 'active', '2025-08-24 00:01:18', '2025-08-24 00:01:18'),
('template-5', 'AI Generated Coffee Shop', 'Restaurant', 'AI-generated modern coffee shop website with online ordering system', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop', 'https://demo.example.com/coffee', 24.99, 0, 4.5, 156, '[\"AI Generated\",\"Online Ordering\",\"Menu Display\",\"Location Map\"]', '{\"index.html\":\"<!DOCTYPE html><html><head><title>Coffee Shop</title></head><body><h1>AI Coffee Shop</h1></body></html>\",\"style.css\":\"body { font-family: Arial, sans-serif; background: #8B4513; color: white; }\",\"script.js\":\"console.log(\\\"AI Coffee shop website loaded\\\");\"}', 1, 'Modern coffee shop with online ordering and cozy atmosphere', 'active', '2025-08-24 00:01:19', '2025-08-24 00:01:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_blog_posts_created_at` (`created_at`);

--
-- Indexes for table `campaign_analytics`
--
ALTER TABLE `campaign_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_campaign_analytics_campaign_id` (`campaign_id`),
  ADD KEY `idx_campaign_analytics_visitor_id` (`visitor_id`);

--
-- Indexes for table `click_events`
--
ALTER TABLE `click_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_click_events_product_id` (`product_id`),
  ADD KEY `idx_click_events_timestamp` (`timestamp`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Indexes for table `deal_requests`
--
ALTER TABLE `deal_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_campaigns`
--
ALTER TABLE `email_campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_scheduled_at` (`scheduled_at`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `email_campaign_recipients`
--
ALTER TABLE `email_campaign_recipients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_campaign_id` (`campaign_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `email_capture_events`
--
ALTER TABLE `email_capture_events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_capture` (`contact_id`,`source`,`item_id`),
  ADD KEY `idx_source` (`source`),
  ADD KEY `idx_captured_at` (`captured_at`);

--
-- Indexes for table `email_marketing`
--
ALTER TABLE `email_marketing`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_source` (`source`),
  ADD KEY `idx_subscribed_at` (`subscribed_at`);

--
-- Indexes for table `gamification_users`
--
ALTER TABLE `gamification_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_gamification_users_email` (`email`);

--
-- Indexes for table `hostvoucher_testimonials`
--
ALTER TABLE `hostvoucher_testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `marketing_campaigns`
--
ALTER TABLE `marketing_campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_marketing_campaigns_active` (`is_active`);

--
-- Indexes for table `mining_tasks`
--
ALTER TABLE `mining_tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newsletter_subscriptions`
--
ALTER TABLE `newsletter_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `nft_redemption_requests`
--
ALTER TABLE `nft_redemption_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nft_showcase`
--
ALTER TABLE `nft_showcase`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page_views`
--
ALTER TABLE `page_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_page_views_visitor_id` (`visitor_id`),
  ADD KEY `idx_page_views_session_id` (`session_id`),
  ADD KEY `idx_page_views_viewed_at` (`viewed_at`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_id` (`payment_id`),
  ADD KEY `idx_payment_id` (`payment_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_item` (`item_type`,`item_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `catalog_number` (`catalog_number`),
  ADD KEY `idx_products_type` (`type`),
  ADD KEY `idx_products_catalog_number` (`catalog_number`);

--
-- Indexes for table `realtime_visitors`
--
ALTER TABLE `realtime_visitors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD KEY `idx_last_seen` (`last_seen`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `submitted_vouchers`
--
ALTER TABLE `submitted_vouchers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template_categories`
--
ALTER TABLE `template_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `template_downloads`
--
ALTER TABLE `template_downloads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_template_downloads_template_id` (`template_id`),
  ADD KEY `idx_template_downloads_user_email` (`user_email`);

--
-- Indexes for table `template_purchases`
--
ALTER TABLE `template_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_template_purchases_user_email` (`user_email`),
  ADD KEY `idx_template_purchases_template_id` (`template_id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_testimonials_created_at` (`created_at`);

--
-- Indexes for table `user_purchases`
--
ALTER TABLE `user_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_email` (`user_email`),
  ADD KEY `idx_item` (`item_type`,`item_id`),
  ADD KEY `idx_payment_id` (`payment_id`);

--
-- Indexes for table `visitor_analytics`
--
ALTER TABLE `visitor_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_visitor_analytics_ip` (`ip_address`),
  ADD KEY `idx_visitor_analytics_country` (`country_code`),
  ADD KEY `idx_visitor_analytics_visited_at` (`visited_at`),
  ADD KEY `idx_visitor_analytics_session` (`session_id`),
  ADD KEY `idx_visited_at` (`visited_at`);

--
-- Indexes for table `website_templates`
--
ALTER TABLE `website_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_website_templates_category` (`category`),
  ADD KEY `idx_website_templates_price` (`price`),
  ADD KEY `idx_website_templates_is_free` (`is_free`),
  ADD KEY `idx_website_templates_rating` (`rating`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_campaigns`
--
ALTER TABLE `email_campaigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_campaign_recipients`
--
ALTER TABLE `email_campaign_recipients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_capture_events`
--
ALTER TABLE `email_capture_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `email_marketing`
--
ALTER TABLE `email_marketing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `nft_redemption_requests`
--
ALTER TABLE `nft_redemption_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `realtime_visitors`
--
ALTER TABLE `realtime_visitors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_purchases`
--
ALTER TABLE `user_purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `click_events`
--
ALTER TABLE `click_events`
  ADD CONSTRAINT `click_events_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_campaign_recipients`
--
ALTER TABLE `email_campaign_recipients`
  ADD CONSTRAINT `email_campaign_recipients_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `email_campaigns` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_capture_events`
--
ALTER TABLE `email_capture_events`
  ADD CONSTRAINT `email_capture_events_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `email_marketing` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `template_downloads`
--
ALTER TABLE `template_downloads`
  ADD CONSTRAINT `template_downloads_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `website_templates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `template_purchases`
--
ALTER TABLE `template_purchases`
  ADD CONSTRAINT `template_purchases_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `website_templates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_purchases`
--
ALTER TABLE `user_purchases`
  ADD CONSTRAINT `user_purchases_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
