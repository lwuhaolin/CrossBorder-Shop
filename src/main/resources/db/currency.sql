-- 货币表
DROP TABLE IF EXISTS tb_currency;
CREATE TABLE tb_currency (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '货币ID',
    currency_code VARCHAR(10) NOT NULL COMMENT '货币代码：CNY-人民币，USD-美元，EUR-欧元',
    currency_name VARCHAR(50) NOT NULL COMMENT '货币名称',
    symbol VARCHAR(10) COMMENT '货币符号：¥, $, €',
    is_base TINYINT DEFAULT 0 COMMENT '是否基准货币：0-否，1-是（CNY为基准）',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    sort INT DEFAULT 0 COMMENT '排序号',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_currency_code (currency_code),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='货币表';

-- 插入常用货币
INSERT INTO tb_currency (currency_code, currency_name, symbol, is_base, status, sort) VALUES
('CNY', '人民币', '¥', 1, 1, 1),
('USD', '美元', '$', 0, 1, 2),
('EUR', '欧元', '€', 0, 1, 3),
('GBP', '英镑', '£', 0, 1, 4),
('JPY', '日元', '¥', 0, 1, 5),
('HKD', '港币', 'HK$', 0, 1, 6);

-- 汇率表
DROP TABLE IF EXISTS tb_exchange_rate;
CREATE TABLE tb_exchange_rate (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '汇率ID',
    from_currency VARCHAR(10) NOT NULL COMMENT '源货币代码',
    to_currency VARCHAR(10) NOT NULL COMMENT '目标货币代码',
    rate DECIMAL(10, 4) NOT NULL COMMENT '汇率（1源货币=rate目标货币）',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_currency_pair (from_currency, to_currency),
    KEY idx_from_currency (from_currency),
    KEY idx_to_currency (to_currency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='汇率表';

-- 插入初始汇率数据（以CNY为基准）
INSERT INTO tb_exchange_rate (from_currency, to_currency, rate) VALUES
-- CNY 转其他货币
('CNY', 'USD', 0.1400),
('CNY', 'EUR', 0.1300),
('CNY', 'GBP', 0.1100),
('CNY', 'JPY', 20.5000),
('CNY', 'HKD', 1.0900),
-- 其他货币转 CNY
('USD', 'CNY', 7.1500),
('EUR', 'CNY', 7.7000),
('GBP', 'CNY', 9.0900),
('JPY', 'CNY', 0.0488),
('HKD', 'CNY', 0.9174),
-- 常用货币互转
('USD', 'EUR', 0.9300),
('EUR', 'USD', 1.0750),
('USD', 'GBP', 0.7850),
('GBP', 'USD', 1.2730),
('USD', 'JPY', 146.5000),
('JPY', 'USD', 0.0068);
