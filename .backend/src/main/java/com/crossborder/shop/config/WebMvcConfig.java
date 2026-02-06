package com.crossborder.shop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Value("${file.upload.path}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 静态资源映射
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:" + uploadPath + (uploadPath.endsWith("/") ? "" : "/"));
        
        // 考虑 context-path /api 的情况，也注册带前缀的路径
        registry.addResourceHandler("/api/upload/**")
                .addResourceLocations("file:" + uploadPath + (uploadPath.endsWith("/") ? "" : "/"));

        // 添加 favicon 处理 - 明确指定静态资源位置
        registry.addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);
    }
}
