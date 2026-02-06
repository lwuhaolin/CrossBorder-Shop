package com.crossborder.shop.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 统一响应状态码枚举
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    /* 成功状态码 */
    SUCCESS(200, "操作成功"),

    /* 客户端错误：400-499 */
    FAIL(400, "操作失败"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权，请先登录"),
    FORBIDDEN(403, "没有权限访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不支持"),
    CONFLICT(409, "数据冲突"),
    VALIDATION_ERROR(422, "参数校验失败"),

    /* 服务端错误：500-599 */
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务暂时不可用"),

    /* 业务错误码：1000-1999 用户相关 */
    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXISTS(1002, "用户已存在"),
    USERNAME_OR_PASSWORD_ERROR(1003, "用户名或密码错误"),
    PASSWORD_ERROR(1004, "密码错误"),
    ACCOUNT_DISABLED(1005, "账号已被禁用"),
    ACCOUNT_LOCKED(1006, "账号已被锁定"),
    TOKEN_EXPIRED(1007, "Token已过期"),
    TOKEN_INVALID(1008, "Token无效"),
    CAPTCHA_ERROR(1009, "验证码错误"),

    /* 业务错误码：2000-2999 商品相关 */
    PRODUCT_NOT_FOUND(2001, "商品不存在"),
    PRODUCT_NOT_EXISTS(2001, "商品不存在"),
    PRODUCT_STOCK_NOT_ENOUGH(2002, "商品库存不足"),
    PRODUCT_STOCK_INSUFFICIENT(2002, "商品库存不足"),
    PRODUCT_OFF_SHELF(2003, "商品已下架"),
    PRODUCT_NOT_BELONG_TO_SELLER(2004, "该商品不属于当前卖家"),
    CATEGORY_NOT_FOUND(2005, "分类不存在"),
    CATEGORY_HAS_CHILDREN(2006, "该分类下存在子分类，无法删除"),
    CATEGORY_HAS_PRODUCTS(2007, "该分类下存在商品，无法删除"),

    /* 业务错误码：3000-3999 订单相关 */
    ORDER_NOT_FOUND(3001, "订单不存在"),
    ORDER_STATUS_ERROR(3002, "订单状态错误"),
    ORDER_CANNOT_CANCEL(3003, "订单不可取消"),
    ORDER_ALREADY_PAID(3004, "订单已支付"),
    ORDER_PAYMENT_FAILED(3005, "订单支付失败"),

    /* 业务错误码：4000-4999 支付相关 */
    PAYMENT_FAILED(4001, "支付失败"),
    PAYMENT_TIMEOUT(4002, "支付超时"),
    REFUND_FAILED(4003, "退款失败"),

    /* 业务错误码：5000-5999 物流相关 */
    LOGISTICS_NOT_FOUND(5001, "物流信息不存在"),
    SHIPPING_ADDRESS_NOT_FOUND(5002, "收货地址不存在"),

    /* 业务错误码：6000-6999 系统相关 */
    FILE_UPLOAD_FAILED(6001, "文件上传失败"),
    FILE_TYPE_NOT_SUPPORTED(6002, "不支持的文件类型"),
    FILE_SIZE_EXCEEDED(6003, "文件大小超出限制"),
    CURRENCY_NOT_SUPPORTED(6004, "不支持的货币类型"),
    EXCHANGE_RATE_NOT_FOUND(6005, "汇率信息不存在");

    /**
     * 状态码
     */
    private final Integer code;

    /**
     * 消息
     */
    private final String message;
}
