package com.crossborder.shop.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 文件服务接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
public interface FileService {

    /**
     * 上传单个图片
     *
     * @param file 文件
     * @return 文件访问URL
     */
    String uploadImage(MultipartFile file);

    /**
     * 批量上传图片
     *
     * @param files 文件列表
     * @return 文件访问URL列表
     */
    List<String> uploadImages(List<MultipartFile> files);

    /**
     * 删除文件
     *
     * @param fileUrl 文件URL
     */
    void deleteFile(String fileUrl);
}
