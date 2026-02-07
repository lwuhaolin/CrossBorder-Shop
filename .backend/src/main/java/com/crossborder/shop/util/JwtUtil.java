package com.crossborder.shop.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * JWT工具类
 * 支持AccessToken和RefreshToken双Token机制
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    @Value("${jwt.header}")
    private String header;

    @Value("${jwt.prefix}")
    private String prefix;

    /**
     * 生成AccessToken
     *
     * @param userId   用户ID
     * @param username 用户名
     * @return AccessToken
     */
    public String generateAccessToken(Long userId, String username) {
        return generateAccessToken(userId, username, Collections.emptyList());
    }

    /**
     * 生成AccessToken（包含角色）
     *
     * @param userId    用户ID
     * @param username  用户名
     * @param roleCodes 角色编码列表
     * @return AccessToken
     */
    public String generateAccessToken(Long userId, String username, List<String> roleCodes) {
        return generateToken(userId, username, accessTokenExpiration, "access", roleCodes);
    }

    /**
     * 生成RefreshToken
     *
     * @param userId   用户ID
     * @param username 用户名
     * @return RefreshToken
     */
    public String generateRefreshToken(Long userId, String username) {
        return generateToken(userId, username, refreshTokenExpiration, "refresh", null);
    }

    /**
     * 生成Token
     *
     * @param userId     用户ID
     * @param username   用户名
     * @param expiration 过期时间
     * @param tokenType  Token类型
     * @return Token
     */
    private String generateToken(Long userId, String username, Long expiration, String tokenType,
            List<String> roleCodes) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("tokenType", tokenType);
        if (roleCodes != null) {
            claims.put("roles", roleCodes);
        }

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    /**
     * 从Token中获取Claims
     *
     * @param token Token
     * @return Claims
     */
    public Claims getClaimsFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.error("解析Token失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从Token中获取用户ID
     *
     * @param token Token
     * @return 用户ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims != null ? claims.get("userId", Long.class) : null;
    }

    /**
     * 从Token中获取用户名
     *
     * @param token Token
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims != null ? claims.getSubject() : null;
    }

    /**
     * 从Token中获取Token类型
     *
     * @param token Token
     * @return Token类型
     */
    public String getTokenTypeFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims != null ? claims.get("tokenType", String.class) : null;
    }

    /**
     * 从Token中获取角色编码列表
     *
     * @param token Token
     * @return 角色编码列表
     */
    @SuppressWarnings("unchecked")
    public List<String> getRoleCodesFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        if (claims == null) {
            return Collections.emptyList();
        }
        Object roles = claims.get("roles");
        if (roles instanceof List) {
            return (List<String>) roles;
        }
        return Collections.emptyList();
    }

    /**
     * 验证Token是否有效
     *
     * @param token Token
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims != null && !isTokenExpired(claims);
        } catch (Exception e) {
            log.error("Token验证失败: {}", e.getMessage())  ;
            return false;
        }
    }

    /**
     * 判断Token是否过期
     *
     * @param token Token字符串
     * @return 是否过期
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims == null && isTokenExpired(claims);
        } catch (Exception e) {
            log.error("Token过期检查失败: {}", e.getMessage());
            return true; // 如果解析失败，认为已过期
        }
    }

    /**
     * 判断Token是否过期
     *
     * @param claims Claims
     * @return 是否过期
     */
    private boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        return expiration.before(new Date());
    }

    /**
     * 从请求头中获取Token
     *
     * @param request HTTP请求
     * @return Token
     */
    public String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(header);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(prefix + " ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * 获取AccessToken过期时间
     *
     * @return 过期时间（毫秒）
     */
    public Long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    /**
     * 获取RefreshToken过期时间
     *
     * @return 过期时间（毫秒）
     */
    public Long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }
}
