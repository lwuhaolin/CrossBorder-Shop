-- 物流公司表
DROP TABLE IF EXISTS tb_logistics_company;
CREATE TABLE tb_logistics_company (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '物流公司ID',
    company_name VARCHAR(100) NOT NULL COMMENT '物流公司名称',
    company_code VARCHAR(50) NOT NULL COMMENT '物流公司编码',
    contact VARCHAR(100) COMMENT '联系方式',
    website VARCHAR(200) COMMENT '官网地址',
    logo_url VARCHAR(500) COMMENT 'Logo URL',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    sort INT DEFAULT 0 COMMENT '排序号',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_company_code (company_code),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物流公司表';

-- 插入常用物流公司
INSERT INTO tb_logistics_company (company_name, company_code, contact, website, status, sort) VALUES
('顺丰速运', 'SF', '95338', 'https://www.sf-express.com', 1, 1),
('圆通速递', 'YTO', '95554', 'https://www.yto.net.cn', 1, 2),
('中通快递', 'ZTO', '95311', 'https://www.zto.com', 1, 3),
('申通快递', 'STO', '95543', 'https://www.sto.cn', 1, 4),
('韵达速递', 'YD', '95546', 'https://www.yundaex.com', 1, 5),
('DHL', 'DHL', '400-810-8000', 'https://www.dhl.com', 1, 6),
('FedEx', 'FEDEX', '400-886-1888', 'https://www.fedex.com', 1, 7),
('UPS', 'UPS', '400-820-8388', 'https://www.ups.com', 1, 8);

-- 物流信息表（物流轨迹）
DROP TABLE IF EXISTS tb_logistics_info;
CREATE TABLE tb_logistics_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '物流信息ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    order_no VARCHAR(50) NOT NULL COMMENT '订单号',
    logistics_company_id BIGINT NOT NULL COMMENT '物流公司ID',
    tracking_number VARCHAR(100) COMMENT '物流单号',
    node_time DATETIME NOT NULL COMMENT '节点时间',
    location VARCHAR(200) COMMENT '所在位置',
    description VARCHAR(500) NOT NULL COMMENT '物流描述',
    sort INT DEFAULT 0 COMMENT '排序号（越大越新）',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    KEY idx_order_id (order_id),
    KEY idx_order_no (order_no),
    KEY idx_tracking_number (tracking_number),
    KEY idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物流信息表';

-- 收货地址表
DROP TABLE IF EXISTS tb_shipping_address;
CREATE TABLE tb_shipping_address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '地址ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    receiver_name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    country VARCHAR(50) DEFAULT 'China' COMMENT '国家',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区县',
    detail_address VARCHAR(500) NOT NULL COMMENT '详细地址',
    postal_code VARCHAR(20) COMMENT '邮编',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认地址：0-否，1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    KEY idx_user_id (user_id),
    KEY idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收货地址表';
