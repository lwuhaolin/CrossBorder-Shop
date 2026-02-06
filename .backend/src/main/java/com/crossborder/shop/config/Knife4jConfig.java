package com.crossborder.shop.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Knife4j OpenAPI 配置类
 * 适用于 Spring Boot 3.x + Knife4j 4.x
 *
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Configuration
public class Knife4jConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("跨境日用小商品订货系统API的文档")
                        .version("1.0.0")
                        .description("提供用户管理、商品管理、订单管理、多币种支持等功能的REST API接口文档")
                        .contact(new Contact()
                                .name("CrossBorder 开发团队")
                                .email("dev@crossborder.shop")
                                .url("https://www.crossborder.shop"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                // 添加JWT认证
                .addSecurityItem(new SecurityRequirement().addList("JWT"))
                .components(new Components()
                        .addSecuritySchemes("JWT", new SecurityScheme()
                                .name("Authorization")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .in(SecurityScheme.In.HEADER)
                                .description("请在下方输入JWT Token（无需添加Bearer前缀）")));
    }
}
