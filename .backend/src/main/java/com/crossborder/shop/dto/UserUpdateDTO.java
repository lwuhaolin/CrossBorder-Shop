package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

/**
 * 用户更新DTO
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Data
@Schema(description = "用户更新DTO")
public class UserUpdateDTO {

    @Schema(description = "昵称", example = "新昵称")
    private String nickname;

    @Email(message = "邮箱格式不正确")
    @Schema(description = "邮箱", example = "newemail@example.com")
    private String email;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "手机号", example = "13900139000")
    private String phone;

    @Schema(description = "头像URL")
    private String avatar;

    @Schema(description = "性别�?:未知 1:�?2:女）", example = "1")
    private Integer gender;

    @Schema(description = "生日", example = "1990-01-01")
    private LocalDate birthday;
}
