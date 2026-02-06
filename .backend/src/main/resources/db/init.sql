-- ========================================
-- 跨境电商订货系统 - 数据库初始化脚本
-- 创建日期：2026-02-04
-- 版本：v1.0
-- ========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `crossborder_shop` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `crossborder_shop`;

-- ========================================
-- 用户模块表结构
-- ========================================

-- 1. 用户表
DROP TABLE IF EXISTS `tb_user`;
CREATE TABLE `tb_user` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码（BCrypt加密）',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `gender` TINYINT(1) DEFAULT 0 COMMENT '性别（0:未知 1:男 2:女）',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态（0:禁用 1:正常 2:锁定）',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人ID',
  `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人ID',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标志（0:未删除 1:已删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 2. 角色表
DROP TABLE IF EXISTS `tb_role`;
CREATE TABLE `tb_role` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `role_code` VARCHAR(50) NOT NULL COMMENT '角色编码（BUYER/SELLER/ADMIN）',
  `description` VARCHAR(200) DEFAULT NULL COMMENT '角色描述',
  `sort` INT(11) DEFAULT 0 COMMENT '显示排序',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态（0:禁用 1:正常）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人ID',
  `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人ID',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标志',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 3. 用户角色关联表
DROP TABLE IF EXISTS `tb_user_role`;
CREATE TABLE `tb_user_role` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `role_id` BIGINT(20) NOT NULL COMMENT '角色ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- ========================================
-- 初始化数据
-- ========================================

-- 插入默认角色
INSERT INTO `tb_role` (`id`, `role_name`, `role_code`, `description`, `sort`) VALUES
(1, '管理员', 'ADMIN', '系统管理员，拥有所有权限', 1),
(2, '卖家', 'SELLER', '商品卖家，可以发布和管理商品', 2),
(3, '买家', 'BUYER', '普通买家，可以浏览和购买商品', 3);

-- 插入测试用户（密码都是：123456，使用BCrypt加密）
-- BCrypt加密后的123456: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi
INSERT INTO `tb_user` (`id`, `username`, `password`, `nickname`, `email`, `phone`, `status`) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员', 'admin@crossborder.shop', '13800000000', 1),
(2, 'seller01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '卖家01', 'seller01@crossborder.shop', '13800000001', 1),
(3, 'buyer01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '买家01', 'buyer01@crossborder.shop', '13800000002', 1);

-- 分配用户角色
INSERT INTO `tb_user_role` (`user_id`, `role_id`) VALUES
(1, 1), -- admin -> ADMIN
(2, 2), -- seller01 -> SELLER  
(3, 3); -- buyer01 -> BUYER

-- ========================================
-- 测试账号说明
-- ========================================
-- 用户名: admin     密码: 123456  角色: 管理员
-- 用户名: seller01  密码: 123456  角色: 卖家
-- 用户名: buyer01   密码: 123456  角色: 买家
-- ========================================
