package com.crossborder.shop.config;

import com.crossborder.shop.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Spring Security ?????
 * ?????????????????
 *
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CorsConfigurationSource corsConfigurationSource;

        /**
         * ?????
         * ??BCrypt????
         */
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        /**
         * ????????
         */
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                // 启用 CORS
                                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                                // ??CSRF????????????JWT???
                                .csrf(csrf -> csrf.disable())
                                // ??????????????Session???JWT?
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                // ??????
                                .authorizeHttpRequests(auth -> auth
                                                // ??Knife4j??????
                                                .requestMatchers(
                                                                "/doc.html",
                                                                "/webjars/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/swagger-resources/**",
                                                                "/favicon.ico",
                                                        "/upload/**",
                                                        "/api/upload/**")
                                                .permitAll()
                                                // ??Druid????
                                                .requestMatchers("/druid/**").permitAll()
                                                // ??????
                                                .requestMatchers("/health/**").permitAll()
                                                // ????????????Token??
                                                .requestMatchers(
                                                                "/user/login",
                                                                "/user/register",
                                                                "/user/refresh")
                                                .permitAll()
                                                // ???????????
                                                .anyRequest().authenticated())
                                // ??JWT?????
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
