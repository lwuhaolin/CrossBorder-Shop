package com.crossborder.shop.security;

import com.crossborder.shop.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT 认证过滤器
 * 用于解析并验证 JWT Token，设置 Spring Security 上下文
 *
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        try {
            // 从请求头中获取 Token
            String token = jwtUtil.getTokenFromRequest(request);

            // 校验 Token
            if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
                // 解析用户名
                String username = jwtUtil.getUsernameFromToken(token);

                // 判断 Token 类型是否为 AccessToken
                String tokenType = jwtUtil.getTokenTypeFromToken(token);
                if ("access".equals(tokenType)) {
                    Long userId = jwtUtil.getUserIdFromToken(token);
                    List<String> roleCodes = jwtUtil.getRoleCodesFromToken(token);
                    UserPrincipal userPrincipal = new UserPrincipal(
                            userId,
                            username,
                            "",
                            roleCodes,
                            true,
                            false);

                    // 构建认证信息
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userPrincipal,
                            null,
                            userPrincipal.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 设置到 SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    log.debug("JWT 认证成功: {}", username);
                }
            }
        } catch (Exception e) {
            log.error("JWT 认证失败: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
