package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

/**
 * 文件控制器
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
@Tag(name = "文件管理", description = "文件上传和删除")
public class FileController {

    private final FileService fileService;

    @Value("${file.upload.path}")
    private String uploadPath;

    @PostMapping("/upload")
    @Operation(summary = "上传文件", description = "上传图片，支持jpg/png/jpeg/gif，最多10MB")
    public Result<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileService.uploadImage(file);
        return Result.success(fileUrl);
    }

    @PostMapping("/upload/batch")
    @Operation(summary = "批量上传", description = "批量上传多个文件")
    public Result<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> files) {
        List<String> fileUrls = fileService.uploadImages(files);
        return Result.success(fileUrls);
    }

    @GetMapping("/download")
    @Operation(summary = "下载文件", description = "根据相对路径下载文件")
    public void downloadFile(@RequestParam String filePath, HttpServletResponse response) {
        try {
            String fullPath = uploadPath + filePath;
            File file = new File(fullPath);

            if (!file.exists()) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "文件不存在");
                return;
            }

            // 设置响应头
            response.setContentType(Files.probeContentType(file.toPath()));
            response.setHeader("Content-Disposition", "inline; filename=" + file.getName());
            response.setContentLength((int) file.length());

            // 输出文件内容
            try (InputStream input = new FileInputStream(file)) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = input.read(buffer)) != -1) {
                    response.getOutputStream().write(buffer, 0, bytesRead);
                }
                response.getOutputStream().flush();
            }

            log.info("文件下载成功: {}", filePath);
        } catch (IOException e) {
            log.error("文件下载失败: {}", filePath, e);
        }
    }

    @DeleteMapping
    @Operation(summary = "删除文件", description = "根据URL删除文件")
    public Result<Void> deleteFile(@RequestParam String fileUrl) {
        fileService.deleteFile(fileUrl);
        return Result.success();
    }
}
