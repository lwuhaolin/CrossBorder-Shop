package com.crossborder.shop;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@MapperScan("com.crossborder.shop.mapper")
public class CrossBorderShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrossBorderShopApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("应用启动成功");
        System.out.println("API地址: http://localhost:8080/api/doc.html");
        System.out.println("Druid地址: http://localhost:8080/api/druid");
        System.out.println("========================================\n");
    }
}
