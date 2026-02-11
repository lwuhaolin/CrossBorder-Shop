package com.crossborder.shop.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 订单号生成器
 * 格式: yyyyMMddHHmmss + userId后4位 + 自增序列3位
 * 示例: 20260204123456789001
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Component
public class OrderNumberGenerator {

    /**
     * 内存自增序列号
     */
    private final AtomicLong sequence = new AtomicLong(0);

    /**
     * 当前日期标记，用于按天重置序列号
     */
    private volatile String currentDate = "";

    /**
     * 生成订单号
     *
     * @param userId 用户ID
     * @return 订单号
     */
    public String generateOrderNumber(Long userId) {
        // 1. 获取当前时间戳（yyyyMMddHHmmss）
        String timestamp = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
                .format(java.time.LocalDateTime.now());

        // 2. 取userId后4位（不足4位左补0）
        String userIdSuffix = String.format("%04d", userId % 10000);

        // 3. 获取自增序列号（按天重置）
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        if (!today.equals(currentDate)) {
            synchronized (this) {
                if (!today.equals(currentDate)) {
                    sequence.set(0);
                    currentDate = today;
                }
            }
        }
        long seq = sequence.incrementAndGet();

        // 序列号取后3位（不足3位左补0，超过3位取模）
        String sequenceSuffix = String.format("%03d", seq % 1000);

        // 4. 拼接订单号
        String orderNumber = timestamp + userIdSuffix + sequenceSuffix;

        log.debug("生成订单号: userId={}, orderNumber={}, sequence={}", userId, orderNumber, seq);

        return orderNumber;
    }

    /**
     * 从订单号解析用户ID后4位
     *
     * @param orderNumber 订单号
     * @return userId后4位
     */
    public String parseUserIdSuffix(String orderNumber) {
        if (orderNumber == null || orderNumber.length() < 21) {
            return null;
        }
        return orderNumber.substring(14, 18);
    }

    /**
     * 从订单号解析序列号
     *
     * @param orderNumber 订单号
     * @return 序列号
     */
    public String parseSequence(String orderNumber) {
        if (orderNumber == null || orderNumber.length() < 21) {
            return null;
        }
        return orderNumber.substring(18, 21);
    }

    /**
     * 从订单号解析时间戳
     *
     * @param orderNumber 订单号
     * @return 时间戳字符串（yyyyMMddHHmmss）
     */
    public String parseTimestamp(String orderNumber) {
        if (orderNumber == null || orderNumber.length() < 14) {
            return null;
        }
        return orderNumber.substring(0, 14);
    }
}
