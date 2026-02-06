package com.crossborder.shop.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

/**
 * ??????
 * ??: yyyyMMddHHmmss + userId?4? + Redis???3?
 * ??: 20260204123456789001
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderNumberGenerator {

    private final StringRedisTemplate stringRedisTemplate;

    /**
     * Redis key??
     */
    private static final String ORDER_SEQ_KEY_PREFIX = "order:seq:";

    /**
     * ????????2??
     */
    private static final long EXPIRE_DAYS = 2;

    /**
     * ?????
     *
     * @param userId ??ID
     * @return ???
     */
    public String generateOrderNumber(Long userId) {
        // 1. ????????yyyyMMddHHmmss?
        String timestamp = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
                .format(java.time.LocalDateTime.now());

        // 2. ??userId?4????4????0?
        String userIdSuffix = String.format("%04d", userId % 10000);

        // 3. ??Redis?????????
        String dateKey = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String redisKey = ORDER_SEQ_KEY_PREFIX + dateKey;

        // Redis???????
        Long sequence = stringRedisTemplate.opsForValue().increment(redisKey);
        if (sequence == null) {
            sequence = 1L;
        }

        // ?????????????
        if (sequence == 1) {
            stringRedisTemplate.expire(redisKey, EXPIRE_DAYS, TimeUnit.DAYS);
        }

        // ???????3????3????0???3???3??
        String sequenceSuffix = String.format("%03d", sequence % 1000);

        // 4. ?????
        String orderNumber = timestamp + userIdSuffix + sequenceSuffix;

        log.debug("?????: userId={}, orderNumber={}, sequence={}", userId, orderNumber, sequence);

        return orderNumber;
    }

    /**
     * ?????????ID?4?
     *
     * @param orderNumber ???
     * @return userId?4?
     */
    public String parseUserIdSuffix(String orderNumber) {
        if (orderNumber == null || orderNumber.length() < 21) {
            return null;
        }
        return orderNumber.substring(14, 18);
    }

    /**
     * ??????????
     *
     * @param orderNumber ???
     * @return ???
     */
    public String parseSequence(String orderNumber) {
        if (orderNumber == null || orderNumber.length() < 21) {
            return null;
        }
        return orderNumber.substring(18, 21);
    }

    /**
     * ??????????
     *
     * @param orderNumber ???
     * @return ???????yyyyMMddHHmmss?
     */
    public String parseTimestamp(String orderNumber) {
        if (orderNumber == null || orderNumber.length() < 14) {
            return null;
        }
        return orderNumber.substring(0, 14);
    }
}
