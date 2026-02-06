-- 商品主表
DROP TABLE IF EXISTS tb_product;
CREATE TABLE tb_product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '商品ID',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    product_code VARCHAR(100) NOT NULL COMMENT '商品编码',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    seller_id BIGINT NOT NULL COMMENT '卖家用户ID',
    brand VARCHAR(100) COMMENT '品牌',
    price DECIMAL(10, 2) NOT NULL COMMENT '销售价格',
    original_price DECIMAL(10, 2) COMMENT '原价',
    cost_price DECIMAL(10, 2) COMMENT '成本价',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '币种：CNY-人民币，USD-美元，EUR-欧元',
    stock INT DEFAULT 0 COMMENT '库存数量',
    sales INT DEFAULT 0 COMMENT '销量',
    unit VARCHAR(20) DEFAULT '件' COMMENT '单位',
    weight DECIMAL(10, 2) COMMENT '重量（克）',
    volume DECIMAL(10, 2) COMMENT '体积（立方厘米）',
    description TEXT COMMENT '商品描述',
    detail TEXT COMMENT '商品详情',
    status TINYINT DEFAULT 0 COMMENT '状态：0-草稿，1-上架，2-下架，3-售罄',
    is_recommend TINYINT DEFAULT 0 COMMENT '是否推荐：0-否，1-是',
    is_new TINYINT DEFAULT 0 COMMENT '是否新品：0-否，1-是',
    is_hot TINYINT DEFAULT 0 COMMENT '是否热销：0-否，1-是',
    version INT DEFAULT 0 COMMENT '版本号（乐观锁）',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_product_code (product_code),
    KEY idx_category_id (category_id),
    KEY idx_seller_id (seller_id),
    KEY idx_status (status),
    KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品主表';

-- 商品图片表
DROP TABLE IF EXISTS tb_product_image;
CREATE TABLE tb_product_image (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '图片ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
    sort INT DEFAULT 0 COMMENT '排序号',
    is_main TINYINT DEFAULT 0 COMMENT '是否主图：0-否，1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    KEY idx_product_id (product_id),
    KEY idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品图片表';

-- 商品SKU表（可选，用于多规格商品）
DROP TABLE IF EXISTS tb_product_sku;
CREATE TABLE tb_product_sku (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'SKU ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    sku_code VARCHAR(100) NOT NULL COMMENT 'SKU编码',
    sku_name VARCHAR(200) COMMENT 'SKU名称',
    attributes VARCHAR(500) COMMENT 'SKU属性JSON，如：{"颜色":"红色","尺寸":"M"}',
    price DECIMAL(10, 2) NOT NULL COMMENT 'SKU价格',
    stock INT DEFAULT 0 COMMENT 'SKU库存',
    image_url VARCHAR(500) COMMENT 'SKU图片',
    version INT DEFAULT 0 COMMENT '版本号（乐观锁）',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_sku_code (sku_code),
    KEY idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品SKU表';
