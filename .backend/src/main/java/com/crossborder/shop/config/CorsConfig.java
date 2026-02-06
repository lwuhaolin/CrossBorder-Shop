package com.crossborder.shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 跨域配置�?
 * 允许前端跨域访问后端API
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Configuration
public class CorsConfig {

    /**
     * 配置跨域过滤�?
     */
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    /**
     * 提供给 Spring Security 的 CORS 配置
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 允许所有域名跨域（生产环境建议配置具体的域名）
        config.addAllowedOriginPattern("*");

        // 允许所有请求头
        config.addAllowedHeader("*");

        // 允许所有请求方�?
        config.addAllowedMethod("*");

        // 允许携带认证信息（cookies�?
        config.setAllowCredentials(true);

        // 预检请求的有效期，单位为�?
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
