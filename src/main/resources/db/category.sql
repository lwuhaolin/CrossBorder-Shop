-- 商品分类表
DROP TABLE IF EXISTS tb_category;
CREATE TABLE tb_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID，0表示根分类',
    category_name VARCHAR(50) NOT NULL COMMENT '分类名称',
    category_code VARCHAR(50) NOT NULL COMMENT '分类编码',
    level INT DEFAULT 1 COMMENT '分类层级，1-一级分类，2-二级分类',
    sort INT DEFAULT 0 COMMENT '排序号',
    icon VARCHAR(255) COMMENT '分类图标URL',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    description VARCHAR(500) COMMENT '分类描述',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除',
    UNIQUE KEY uk_category_code (category_code),
    KEY idx_parent_id (parent_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- 插入初始分类数据
INSERT INTO tb_category (id, parent_id, category_name, category_code, level, sort, status, description) VALUES
(1, 0, '家居日用', 'HOME', 1, 1, 1, '家庭日常用品'),
(2, 0, '厨房用品', 'KITCHEN', 1, 2, 1, '厨房餐饮用品'),
(3, 0, '个护美妆', 'BEAUTY', 1, 3, 1, '个人护理和化妆品'),
(4, 0, '文具办公', 'STATIONERY', 1, 4, 1, '文具和办公用品'),
(5, 0, '清洁用品', 'CLEANING', 1, 5, 1, '家庭清洁用品'),
(11, 1, '收纳整理', 'HOME_STORAGE', 2, 1, 1, '收纳盒、收纳箱等'),
(12, 1, '家居装饰', 'HOME_DECOR', 2, 2, 1, '装饰品、摆件等'),
(21, 2, '餐具', 'TABLEWARE', 2, 1, 1, '碗筷盘碟等'),
(22, 2, '厨具', 'COOKWARE', 2, 2, 1, '锅铲刀具等'),
(31, 3, '护肤品', 'SKINCARE', 2, 1, 1, '面霜、精华等'),
(32, 3, '彩妆', 'MAKEUP', 2, 2, 1, '口红、眼影等');
