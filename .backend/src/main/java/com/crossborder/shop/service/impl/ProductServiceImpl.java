package com.crossborder.shop.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.crossborder.shop.common.PageResult;
import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.dto.ProductDTO;
import com.crossborder.shop.entity.Product;
import com.crossborder.shop.entity.ProductImage;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.ProductImageMapper;
import com.crossborder.shop.mapper.ProductMapper;
import com.crossborder.shop.service.ProductService;
import com.crossborder.shop.vo.ProductImageVO;
import com.crossborder.shop.vo.ProductVO;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 商品服务实现类
 * 演示：乐观锁扣库存、延迟双删、缓存策略
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Service

public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${order.stock-retry-times:3}")
    private int stockRetryTimes;

    @Value("${cache.delay-delete-millis:500}")
    private long delayDeleteMillis;

    private static final String PRODUCT_CACHE_KEY = "product:";
    private static final long PRODUCT_CACHE_EXPIRE = 30; // 分钟

    public ProductServiceImpl(ProductMapper productMapper, ProductImageMapper productImageMapper,
            RedisTemplate<String, Object> redisTemplate) {
        this.productMapper = productMapper;
        this.productImageMapper = productImageMapper;
        this.redisTemplate = redisTemplate;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long publishProduct(ProductDTO productDTO, Long sellerId) {
        // 1. 生成商品编码
        String productCode = generateProductCode();

        // 2. 创建商品
        Product product = new Product();
        BeanUtil.copyProperties(productDTO, product);
        product.setProductCode(productCode);
        product.setSellerId(sellerId);
        product.setStatus(0); // 草稿
        product.setSales(0);
        product.setVersion(0);

        productMapper.insert(product);
        log.info("商品创建成功: productId={}, productCode={}", product.getId(), productCode);

        // 3. 保存商品图片
        saveProductImages(product.getId(), productDTO.getImageUrls(), productDTO.getMainImageIndex());

        return product.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateProduct(ProductDTO productDTO, Long sellerId) {
        // 1. 查询商品并校验归属
        Product product = productMapper.selectById(productDTO.getId());
        if (product == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_EXISTS);
        }
        if (!product.getSellerId().equals(sellerId)) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_BELONG_TO_SELLER);
        }

        // 2. 更新商品信息
        BeanUtil.copyProperties(productDTO, product, "id", "productCode", "sellerId", "sales", "version");
        product.setVersion(productDTO.getVersion()); // 乐观锁版本号
        productMapper.updateById(product);

        // 3. 更新图片
        productImageMapper.deleteByProductId(product.getId());
        saveProductImages(product.getId(), productDTO.getImageUrls(), productDTO.getMainImageIndex());

        // 4. 延迟双删缓存
        deleteProductCache(product.getId());

        log.info("商品更新成功: productId={}", product.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Long id, Long sellerId) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_EXISTS);
        }
        if (!product.getSellerId().equals(sellerId)) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_BELONG_TO_SELLER);
        }

        productMapper.deleteById(id);
        productImageMapper.deleteByProductId(id);

        // 延迟双删缓存
        deleteProductCache(id);

        log.info("商品删除成功: productId={}", id);
    }

    @Override
    public void onShelf(Long id, Long sellerId) {
        updateProductStatus(id, sellerId, 1);
    }

    @Override
    public void offShelf(Long id, Long sellerId) {
        updateProductStatus(id, sellerId, 2);
    }

    @Override
    public ProductVO getProductDetail(Long id) {
        // 1. 尝试从缓存获取
        String cacheKey = PRODUCT_CACHE_KEY + id;
        ProductVO productVO = (ProductVO) redisTemplate.opsForValue().get(cacheKey);

        if (productVO != null) {
            log.debug("从缓存获取商品详情: productId={}", id);
            // 如果缓存中没有图片列表，则补充加载图片并回写缓存
            if (productVO.getImages() == null || productVO.getImages().isEmpty()) {
                List<ProductImage> images = productImageMapper.selectByProductId(id);
                if (images != null && !images.isEmpty()) {
                    List<ProductImageVO> imageVOs = images.stream().map(image -> {
                        ProductImageVO vo = new ProductImageVO();
                        BeanUtil.copyProperties(image, vo);
                        return vo;
                    }).collect(Collectors.toList());
                    productVO.setImages(imageVOs);
                    redisTemplate.opsForValue().set(cacheKey, productVO, PRODUCT_CACHE_EXPIRE, TimeUnit.MINUTES);
                }
            }
            return productVO;
        }

        // 2. 从数据库查询
        productVO = productMapper.selectVOById(id);
        if (productVO == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_EXISTS);
        }

        // 3. 查询商品图片
        List<ProductImage> images = productImageMapper.selectByProductId(id);
        if (images != null && !images.isEmpty()) {
            List<ProductImageVO> imageVOs = images.stream().map(image -> {
                ProductImageVO vo = new ProductImageVO();
                BeanUtil.copyProperties(image, vo);
                return vo;
            }).collect(Collectors.toList());
            productVO.setImages(imageVOs);
        }

        // 4. 缓存商品信息
        redisTemplate.opsForValue().set(cacheKey, productVO, PRODUCT_CACHE_EXPIRE, TimeUnit.MINUTES);

        return productVO;
    }

    @Override
    public PageResult<ProductVO> getProductPage(Long categoryId, Integer status, Long sellerId,
            String keyword, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<ProductVO> list = productMapper.selectPageList(categoryId, status, sellerId, keyword);
        PageInfo<ProductVO> pageInfo = new PageInfo<>(list);

        PageResult<ProductVO> pageResult = new PageResult<>();
        pageResult.setList(list);
        pageResult.setTotal(pageInfo.getTotal());
        pageResult.setPageNum(pageInfo.getPageNum());
        pageResult.setPageSize(pageInfo.getPageSize());
        pageResult.setPages(pageInfo.getPages());
        return pageResult;
    }

    @Override
    public boolean decreaseStock(Long productId, Integer quantity) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_EXISTS);
        }

        // 乐观锁扣减库存，支持重试
        for (int i = 0; i < stockRetryTimes; i++) {
            int result = productMapper.decreaseStock(productId, quantity, product.getVersion());
            if (result > 0) {
                log.info("库存扣减成功: productId={}, quantity={}, retry={}", productId, quantity, i);
                // 延迟双删缓存
                deleteProductCache(productId);
                return true;
            }

            // 失败后重新查询最新版本号，指数退避
            try {
                long sleepTime = (long) (50 * Math.pow(2, i)); // 50ms, 100ms, 200ms
                Thread.sleep(sleepTime);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

            product = productMapper.selectById(productId);
            if (product == null || product.getStock() < quantity) {
                break;
            }
        }

        log.warn("库存扣减失败: productId={}, quantity={}", productId, quantity);
        throw new BusinessException(ResultCode.PRODUCT_STOCK_NOT_ENOUGH);
    }

    @Override
    public void releaseStock(Long productId, Integer quantity) {
        productMapper.increaseStock(productId, quantity);
        log.info("库存释放成功: productId={}, quantity={}", productId, quantity);

        // 延迟双删缓存
        deleteProductCache(productId);
    }

    @Override
    public void deleteProductCache(Long productId) {
        String cacheKey = PRODUCT_CACHE_KEY + productId;

        // 第一次删除
        redisTemplate.delete(cacheKey);

        // 异步延迟第二次删除
        asyncDeleteCache(cacheKey);
    }

    /**
     * 异步延迟删除缓存
     */
    @Async
    public void asyncDeleteCache(String cacheKey) {
        try {
            Thread.sleep(delayDeleteMillis);
            redisTemplate.delete(cacheKey);
            log.debug("延迟双删缓存完成: key={}", cacheKey);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("延迟删除缓存失败: key={}", cacheKey, e);
        }
    }

    /**
     * 更新商品状态
     */
    private void updateProductStatus(Long id, Long sellerId, Integer status) {
        int result = productMapper.updateStatus(id, status, sellerId);
        if (result == 0) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_EXISTS);
        }

        // 延迟双删缓存
        deleteProductCache(id);

        log.info("商品状态更新: productId={}, status={}", id, status);
    }

    /**
     * 生成商品编码
     */
    private String generateProductCode() {
        return "PRD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    /**
     * 保存商品图片
     */
    private void saveProductImages(Long productId, List<String> imageUrls, Integer mainImageIndex) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        int mainIndex = (mainImageIndex != null ? mainImageIndex : 0);
        if (mainIndex < 0 || mainIndex >= imageUrls.size()) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "主图索引超出图片范围");
        }

        List<ProductImage> images = new ArrayList<>();
        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage image = new ProductImage();
            image.setProductId(productId);
            image.setImageUrl(imageUrls.get(i));
            image.setSort(i);
            image.setIsMain(i == mainIndex ? 1 : 0);
            images.add(image);
        }

        productImageMapper.batchInsert(images);
    }
}
