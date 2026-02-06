package com.crossborder.shop.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBlockingQueue;
import org.redisson.api.RDelayedQueue;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Redis延迟队列服务
 * 封装Redisson延迟队列操作
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DelayQueueService {

    private final RedissonClient redissonClient;

    /**
     * 添加延迟任务到队列
     *
     * @param queueName 队列名称
     * @param task      任务对象
     * @param delay     延迟时间
     * @param timeUnit  时间单位
     * @param <T>       任务类型
     */
    public <T> void offer(String queueName, T task, long delay, TimeUnit timeUnit) {
        try {
            RBlockingQueue<T> blockingQueue = redissonClient.getBlockingQueue(queueName);
            RDelayedQueue<T> delayedQueue = redissonClient.getDelayedQueue(blockingQueue);
            delayedQueue.offer(task, delay, timeUnit);
            log.info("延迟任务已添加到队列: {}, 延迟时间: {} {}", queueName, delay, timeUnit);
        } catch (Exception e) {
            log.error("添加延迟任务失败: queueName={}, task={}", queueName, task, e);
            throw new RuntimeException("添加延迟任务失败", e);
        }
    }

    /**
     * 从队列中获取到期的任务（阻塞）
     *
     * @param queueName 队列名称
     * @param <T>       任务类型
     * @return 任务对象
     */
    public <T> T take(String queueName) {
        try {
            RBlockingQueue<T> blockingQueue = redissonClient.getBlockingQueue(queueName);
            return blockingQueue.take();
        } catch (Exception e) {
            log.error("获取延迟任务失败: queueName={}", queueName, e);
            return null;
        }
    }

    /**
     * 从队列中获取到期的任务（带超时）
     *
     * @param queueName 队列名称
     * @param timeout   超时时间
     * @param timeUnit  时间单位
     * @param <T>       任务类型
     * @return 任务对象
     */
    public <T> T poll(String queueName, long timeout, TimeUnit timeUnit) {
        try {
            RBlockingQueue<T> blockingQueue = redissonClient.getBlockingQueue(queueName);
            return blockingQueue.poll(timeout, timeUnit);
        } catch (Exception e) {
            log.error("获取延迟任务失败: queueName={}", queueName, e);
            return null;
        }
    }

    /**
     * 移除指定任务
     *
     * @param queueName 队列名称
     * @param task      任务对象
     * @param <T>       任务类型
     * @return 是否移除成功
     */
    public <T> boolean remove(String queueName, T task) {
        try {
            RBlockingQueue<T> blockingQueue = redissonClient.getBlockingQueue(queueName);
            RDelayedQueue<T> delayedQueue = redissonClient.getDelayedQueue(blockingQueue);
            boolean result = delayedQueue.remove(task);
            if (result) {
                log.info("延迟任务已从队列移除: {}, task={}", queueName, task);
            }
            return result;
        } catch (Exception e) {
            log.error("移除延迟任务失败: queueName={}, task={}", queueName, task, e);
            return false;
        }
    }

    /**
     * 获取队列大小
     *
     * @param queueName 队列名称
     * @return 队列大小
     */
    public int size(String queueName) {
        RBlockingQueue<?> blockingQueue = redissonClient.getBlockingQueue(queueName);
        return blockingQueue.size();
    }

    /**
     * 清空队列
     *
     * @param queueName 队列名称
     */
    public void clear(String queueName) {
        RBlockingQueue<?> blockingQueue = redissonClient.getBlockingQueue(queueName);
        RDelayedQueue<?> delayedQueue = redissonClient.getDelayedQueue(blockingQueue);
        delayedQueue.clear();
        blockingQueue.clear();
        log.info("延迟队列已清空: {}", queueName);
    }

    /**
     * 销毁延迟队列
     *
     * @param queueName 队列名称
     */
    public void destroy(String queueName) {
        try {
            RBlockingQueue<?> blockingQueue = redissonClient.getBlockingQueue(queueName);
            RDelayedQueue<?> delayedQueue = redissonClient.getDelayedQueue(blockingQueue);
            delayedQueue.destroy();
            log.info("延迟队列已销毁: {}", queueName);
        } catch (Exception e) {
            log.error("销毁延迟队列失败: queueName={}", queueName, e);
        }
    }
}
