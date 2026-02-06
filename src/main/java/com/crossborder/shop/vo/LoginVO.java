package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录响应VO
 * 支持双Token机制（AccessToken + RefreshToken�?
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "登录响应VO")
public class LoginVO {

    @Schema(description = "访问令牌（有效期2小时）")
    private String accessToken;

    @Schema(description = "刷新令牌（有效期7天）")
    private String refreshToken;

    @Schema(description = "令牌类型", example = "Bearer")
    private String tokenType;

    @Schema(description = "访问令牌过期时间（毫秒）")
    private Long accessTokenExpiresIn;

    @Schema(description = "刷新令牌过期时间（毫秒）")
    private Long refreshTokenExpiresIn;

    @Schema(description = "用户信息")
    private UserVO userInfo;
}
