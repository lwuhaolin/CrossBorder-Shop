-- 操作日志表
DROP TABLE IF EXISTS tb_operation_log;
CREATE TABLE tb_operation_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    user_id BIGINT COMMENT '操作用户ID',
    username VARCHAR(50) COMMENT '操作用户名',
    operation VARCHAR(100) NOT NULL COMMENT '操作类型',
    method VARCHAR(200) COMMENT '请求方法',
    params TEXT COMMENT '请求参数',
    result TEXT COMMENT '响应结果',
    ip VARCHAR(50) COMMENT '操作IP',
    location VARCHAR(200) COMMENT 'IP位置',
    status TINYINT DEFAULT 1 COMMENT '操作状态：0-失败，1-成功',
    error_msg TEXT COMMENT '错误信息',
    execution_time INT COMMENT '执行时长（毫秒）',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    KEY idx_user_id (user_id),
    KEY idx_username (username),
    KEY idx_operation (operation),
    KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 系统配置表
DROP TABLE IF EXISTS tb_system_config;
CREATE TABLE tb_system_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL COMMENT '配置键',
    config_value TEXT NOT NULL COMMENT '配置值',
    config_type VARCHAR(20) DEFAULT 'string' COMMENT '配置类型：string-字符串，number-数字，boolean-布尔，json-JSON',
    description VARCHAR(500) COMMENT '配置描述',
    group_name VARCHAR(50) DEFAULT 'system' COMMENT '配置分组',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_config_key (config_key),
    KEY idx_group_name (group_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 插入系统配置
INSERT INTO tb_system_config (config_key, config_value, config_type, description, group_name) VALUES
('order.timeout.minutes', '15', 'number', '订单超时时间（分钟）', 'order'),
('order.auto.complete.days', '7', 'number', '订单自动完成天数（发货后）', 'order'),
('file.upload.max.size', '10', 'number', '文件上传最大尺寸（MB）', 'file'),
('file.upload.allowed.types', 'jpg,jpeg,png,gif', 'string', '允许上传的文件类型', 'file'),
('exchange.rate.update.interval', '60', 'number', '汇率更新间隔（分钟）', 'currency'),
('system.maintenance', 'false', 'boolean', '系统维护模式', 'system');

-- 每日销售统计表
DROP TABLE IF EXISTS tb_daily_statistics;
CREATE TABLE tb_daily_statistics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '统计ID',
    stat_date DATE NOT NULL COMMENT '统计日期',
    seller_id BIGINT COMMENT '卖家ID，NULL表示全平台统计',
    total_sales DECIMAL(15, 2) DEFAULT 0 COMMENT '销售总额',
    order_count INT DEFAULT 0 COMMENT '订单数量',
    product_sales_count INT DEFAULT 0 COMMENT '商品销售数量',
    buyer_count INT DEFAULT 0 COMMENT '购买用户数',
    new_buyer_count INT DEFAULT 0 COMMENT '新增购买用户数',
    avg_order_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '平均订单金额',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_date_seller (stat_date, seller_id),
    KEY idx_stat_date (stat_date),
    KEY idx_seller_id (seller_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日销售统计表';
