package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 商品视图对象
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@Schema(description = "商品视图对象")
public class ProductVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "商品ID", example = "1")
    private Long id;

    @Schema(description = "商品名称", example = "玫瑰花束")
    private String productName;

    @Schema(description = "商品编码", example = "PRD202602060001")
    private String productCode;

    @Schema(description = "分类ID", example = "10")
    private Long categoryId;

    @Schema(description = "分类名称", example = "鲜花")
    private String categoryName;

    @Schema(description = "卖家用户ID", example = "2001")
    private Long sellerId;

    @Schema(description = "卖家用户名", example = "seller001")
    private String sellerName;

    @Schema(description = "品牌", example = "花语")
    private String brand;

    @Schema(description = "销售价格", example = "199.00")
    private BigDecimal price;

    @Schema(description = "原价", example = "259.00")
    private BigDecimal originalPrice;

    @Schema(description = "币种", example = "CNY")
    private String currency;

    @Schema(description = "库存数量", example = "100")
    private Integer stock;

    @Schema(description = "销量", example = "20")
    private Integer sales;

    @Schema(description = "单位", example = "束")
    private String unit;

    @Schema(description = "重量（克）", example = "500")
    private BigDecimal weight;

    @Schema(description = "商品描述", example = "精选新鲜玫瑰花束")
    private String description;

    @Schema(description = "商品详情", example = "包含卡片与礼盒包装")
    private String detail;

    @Schema(description = "状态：0-草稿，1-上架，2-下架，3-售罄", example = "1")
    private Integer status;

    @Schema(description = "是否推荐", example = "0")
    private Integer isRecommend;

    @Schema(description = "是否新品", example = "0")
    private Integer isNew;

    @Schema(description = "是否热销", example = "1")
    private Integer isHot;

    @Schema(description = "创建时间", example = "2026-02-06T12:00:00")
    private LocalDateTime createTime;

    @Schema(description = "商品图片列表")
    private List<ProductImageVO> images = new ArrayList<>();

    @Schema(description = "主图URL", example = "https://example.com/1.jpg")
    private String mainImage;
}
