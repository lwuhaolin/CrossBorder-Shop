package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @DeleteMapping
    @Operation(summary = "删除文件", description = "根据URL删除文件")
    public Result<Void> deleteFile(@RequestParam String fileUrl) {
        fileService.deleteFile(fileUrl);
        return Result.success();
    }
}
