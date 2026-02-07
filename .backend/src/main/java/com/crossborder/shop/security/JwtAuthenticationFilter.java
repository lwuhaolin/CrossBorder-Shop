package com.crossborder.shop.security;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Skip JWT processing for certain endpoints
        String requestPath = request.getRequestURI();
        if (requestPath.contains("/user/login") ||
                requestPath.contains("/user/register") ||
                requestPath.contains("/user/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

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
            } else if (StringUtils.hasText(token)) {
                // Token 存在但验证失败，检查是否过期
                if (isTokenExpired(token)) {
                    // Token 已过期，返回 1007 错误码
                    log.warn("Token已过期，返回1007错误码");
                    sendTokenExpiredResponse(response);
                    return;
                }
            }
        } catch (Exception e) {
            log.error("JWT 认证失败: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * 检查 Token 是否已过期
     */
    private boolean isTokenExpired(String token) {
        return jwtUtil.isTokenExpired(token);
    }

    /**
     * 发送 Token 已过期的响应
     */
    private void sendTokenExpiredResponse(HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK); // 返回 200 状态码

        Result<Void> result = Result.fail(ResultCode.TOKEN_EXPIRED);
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
