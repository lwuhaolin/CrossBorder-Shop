-- 订单主表
DROP TABLE IF EXISTS tb_order;
CREATE TABLE tb_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_number VARCHAR(50) NOT NULL COMMENT '订单号',
    buyer_id BIGINT NOT NULL COMMENT '买家用户ID',
    seller_id BIGINT NOT NULL COMMENT '卖家用户ID',
    total_amount DECIMAL(10, 2) NOT NULL COMMENT '订单总金额',
    product_amount DECIMAL(10, 2) NOT NULL COMMENT '商品总金额',
    freight_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '运费',
    discount_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '优惠金额',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '币种：CNY-人民币，USD-美元，EUR-欧元',
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000 COMMENT '汇率（相对于CNY）',
    converted_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '换算后金额',
    target_currency VARCHAR(10) DEFAULT 'CNY' COMMENT '目标币种',
    order_status TINYINT DEFAULT 0 COMMENT '订单状态：0-待支付，1-待发货，2-已发货，3-已完成，4-已取消，5-已退款',
    payment_status TINYINT DEFAULT 0 COMMENT '支付状态：0-未支付，1-已支付，2-已退款',
    payment_method VARCHAR(50) COMMENT '支付方式：alipay-支付宝，wechat-微信，paypal-贝宝',
    payment_time DATETIME COMMENT '支付时间',
    payment_transaction_id VARCHAR(100) COMMENT '支付流水号',
    ship_time DATETIME COMMENT '发货时间',
    complete_time DATETIME COMMENT '完成时间',
    remark VARCHAR(500) COMMENT '订单备注',
    buyer_message VARCHAR(500) COMMENT '买家留言',
    cancel_reason VARCHAR(500) COMMENT '取消原因',
    cancel_time DATETIME COMMENT '取消时间',
    version INT DEFAULT 0 COMMENT '版本号（乐观锁）',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（下单时间）',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_order_no (order_number),
    KEY idx_buyer_id (buyer_id),
    KEY idx_seller_id (seller_id),
    KEY idx_order_status (order_status),
    KEY idx_payment_status (payment_status),
    KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单主表';

-- 订单明细表
DROP TABLE IF EXISTS tb_order_item;
CREATE TABLE tb_order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单明细ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    order_number VARCHAR(50) NOT NULL COMMENT '订单号',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    sku_id BIGINT COMMENT 'SKU ID',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称快照',
    product_code VARCHAR(100) COMMENT '商品编码快照',
    sku_name VARCHAR(200) COMMENT 'SKU名称快照',
    image_url VARCHAR(500) COMMENT '商品图片快照',
    price DECIMAL(10, 2) NOT NULL COMMENT '商品单价',
    quantity INT NOT NULL COMMENT '购买数量',
    total_price DECIMAL(10, 2) NOT NULL COMMENT '小计金额',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    KEY idx_order_id (order_id),
    KEY idx_order_no (order_number),
    KEY idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- 订单收货地址快照表
DROP TABLE IF EXISTS tb_order_address;
CREATE TABLE tb_order_address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '地址ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    order_number VARCHAR(50) NOT NULL COMMENT '订单号',
    receiver_name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    country VARCHAR(50) DEFAULT 'China' COMMENT '国家',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区县',
    detail_address VARCHAR(500) NOT NULL COMMENT '详细地址',
    postal_code VARCHAR(20) COMMENT '邮编',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_order_id (order_id),
    KEY idx_order_no (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单收货地址快照表';

-- 订单超时任务表（兜底机制）
DROP TABLE IF EXISTS tb_order_timeout_task;
CREATE TABLE tb_order_timeout_task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '任务ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    order_number VARCHAR(50) NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    timeout_time DATETIME NOT NULL COMMENT '超时时间',
    status TINYINT DEFAULT 0 COMMENT '任务状态：0-待处理，1-已处理，2-已取消',
    process_time DATETIME COMMENT '处理时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_order_id (order_id),
    KEY idx_order_no (order_number),
    KEY idx_timeout_time (timeout_time),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单超时任务表';
