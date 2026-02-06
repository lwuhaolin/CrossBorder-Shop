package com.crossborder.shop.config;

import lombok.extern.slf4j.Slf4j;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Redisson配置�?
 * 提供Redis延迟队列、分布式锁等高级功能
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Configuration
public class RedissonConfig {

    /**
     * 开发环境配置：单机模式
     */
    @Bean
    @Profile("dev")
    public RedissonClient redissonClientDev(
            @Value("${redisson.single-server-config.address}") String address,
            @Value("${redisson.single-server-config.database:0}") int database,
            @Value("${redisson.single-server-config.connection-pool-size:64}") int connectionPoolSize,
            @Value("${redisson.single-server-config.connection-minimum-idle-size:10}") int connectionMinimumIdleSize,
            @Value("${redisson.single-server-config.timeout:3000}") int timeout,
            @Value("${spring.data.redis.password:}") String password) {

        log.info("初始化Redisson单机模式配置: {}", address);

        Config config = new Config();
        config.useSingleServer()
                .setAddress(address)
                .setDatabase(database)
                .setConnectionPoolSize(connectionPoolSize)
                .setConnectionMinimumIdleSize(connectionMinimumIdleSize)
                .setTimeout(timeout)
                .setRetryAttempts(3)
                .setRetryInterval(1500);

        if (password != null && !password.trim().isEmpty()) {
            config.useSingleServer().setPassword(password);
        }

        return Redisson.create(config);
    }

    /**
     * 生产环境配置：哨兵模式（可根据需要切换为集群模式�?
     */
    @Bean
    @Profile("prod")
    public RedissonClient redissonClientProd(
            @Value("${redisson.sentinel-servers-config.master-name:mymaster}") String masterName,
            @Value("${redisson.sentinel-servers-config.sentinel-addresses}") String[] sentinelAddresses,
            @Value("${redisson.sentinel-servers-config.database:0}") int database,
            @Value("${spring.data.redis.password:}") String password) {

        log.info("初始化Redisson哨兵模式配置, master: {}", masterName);

        Config config = new Config();
        config.useSentinelServers()
                .setMasterName(masterName)
                .addSentinelAddress(sentinelAddresses)
                .setDatabase(database)
                .setPassword(password)
                .setMasterConnectionPoolSize(128)
                .setMasterConnectionMinimumIdleSize(20)
                .setSlaveConnectionPoolSize(128)
                .setSlaveConnectionMinimumIdleSize(20)
                .setTimeout(3000)
                .setRetryAttempts(3)
                .setRetryInterval(1500);

        return Redisson.create(config);
    }
}
