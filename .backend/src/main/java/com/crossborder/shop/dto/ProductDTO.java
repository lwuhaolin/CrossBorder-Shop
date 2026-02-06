package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 商品发布/更新DTO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@Schema(description = "商品发布/更新请求")
public class ProductDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "商品ID（更新时必填）", example = "1")
    private Long id;

    @Schema(description = "商品名称", example = "玫瑰花束")
    @NotBlank(message = "商品名称不能为空")
    @Size(max = 200, message = "商品名称长度不能超过200个字符")
    private String productName;

    @Schema(description = "分类ID", example = "10")
    @NotNull(message = "商品分类不能为空")
    private Long categoryId;

    @Schema(description = "品牌", example = "花语")
    @Size(max = 100, message = "品牌名称长度不能超过100个字符")
    private String brand;

    @Schema(description = "销售价格", example = "199.00")
    @NotNull(message = "商品价格不能为空")
    @DecimalMin(value = "0.01", message = "商品价格必须大于0")
    private BigDecimal price;

    @Schema(description = "原价", example = "259.00")
    @DecimalMin(value = "0.00", message = "原价不能为负数")
    private BigDecimal originalPrice;

    @Schema(description = "成本价", example = "120.00")
    @DecimalMin(value = "0.00", message = "成本价不能为负数")
    private BigDecimal costPrice;

    @Schema(description = "币种", example = "CNY")
    @NotBlank(message = "币种不能为空")
    private String currency;

    @Schema(description = "库存数量", example = "100")
    @NotNull(message = "库存数量不能为空")
    @Min(value = 0, message = "库存数量不能为负数")
    private Integer stock;

    @Schema(description = "单位", example = "束")
    private String unit;

    @Schema(description = "重量（克）", example = "500")
    private BigDecimal weight;

    @Schema(description = "体积（立方厘米）", example = "1200")
    private BigDecimal volume;

    @Schema(description = "商品描述", example = "精选新鲜玫瑰花束")
    @Size(max = 1000, message = "商品描述长度不能超过1000个字符")
    private String description;

    @Schema(description = "商品详情", example = "包含卡片与礼盒包装")
    private String detail;

    @Schema(description = "商品图片URL列表", example = "['https://example.com/1.jpg']")
    @NotEmpty(message = "商品图片不能为空")
    private List<String> imageUrls;

    @Schema(description = "主图索引（imageUrls列表中的索引）", example = "0")
    private Integer mainImageIndex;

    @Schema(description = "版本号（更新时需要）", example = "0")
    private Integer version;
}
