package com.crossborder.shop.listener;

import com.crossborder.shop.dto.OrderTimeoutTask;
import com.crossborder.shop.service.DelayQueueService;
import com.crossborder.shop.service.OrderService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 订单超时监听器
 * 监听Redis延迟队列中的订单超时任务
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderTimeoutListener {

    private final DelayQueueService delayQueueService;
    private final OrderService orderService;

    /**
     * 队列名称
     */
    private static final String QUEUE_NAME = "order:timeout:queue";

    /**
     * 运行标记
     */
    private final AtomicBoolean running = new AtomicBoolean(false);

    /**
     * 线程池
     */
    private ExecutorService executorService;

    /**
     * 启动监听
     */
    @PostConstruct
    public void start() {
        if (running.compareAndSet(false, true)) {
            executorService = Executors.newSingleThreadExecutor(r -> {
                Thread thread = new Thread(r);
                thread.setName("order-timeout-listener");
                thread.setDaemon(true);
                return thread;
            });

            executorService.submit(() -> {
                log.info("订单超时监听器启动");
                while (running.get()) {
                    try {
                        // 拉取到期任务
                        OrderTimeoutTask task = delayQueueService.take(QUEUE_NAME);
                        if (task != null) {
                            handleTimeoutOrder(task);
                        }
                    } catch (Exception e) {
                        log.error("监听任务异常", e);
                        // 异常后短暂休眠避免空转
                        try {
                            Thread.sleep(1000);
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            break;
                        }
                    }
                }
                log.info("订单超时监听器停止");
            });
        }
    }

    /**
     * 停止监听
     */
    @PreDestroy
    public void stop() {
        if (running.compareAndSet(true, false)) {
            if (executorService != null) {
                executorService.shutdown();
                log.info("订单超时监听器停止中...");
            }
        }
    }

    /**
     * 处理超时订单
     *
     * @param task 任务对象
     */
    private void handleTimeoutOrder(OrderTimeoutTask task) {
        log.info("收到超时任务: orderId={}, orderNumber={}", task.getOrderId(), task.getOrderNumber());

        try {
            // 调用OrderService取消超时订单
            orderService.cancelTimeoutOrder(task.getOrderId());
            log.info("超时订单已取消: orderId={}, orderNumber={}", task.getOrderId(), task.getOrderNumber());

        } catch (Exception e) {
            log.error("取消超时订单失败: orderId={}, orderNumber={}",
                    task.getOrderId(), task.getOrderNumber(), e);
            // 可记录失败任务用于重试
        }
    }

    /**
     * 添加超时任务
     *
     * @param task         任务对象
     * @param delayMinutes 延迟分钟
     */
    public void addTimeoutTask(OrderTimeoutTask task, long delayMinutes) {
        delayQueueService.offer(QUEUE_NAME, task, delayMinutes, TimeUnit.MINUTES);
        log.info("超时任务已添加: orderId={}, orderNumber={}, delayMinutes={}",
                task.getOrderId(), task.getOrderNumber(), delayMinutes);
    }

    /**
     * 移除超时任务
     *
     * @param task 任务对象
     * @return 是否移除成功
     */
    public boolean removeTimeoutTask(OrderTimeoutTask task) {
        boolean result = delayQueueService.remove(QUEUE_NAME, task);
        if (result) {
            log.info("超时任务已移除: orderId={}, orderNumber={}", task.getOrderId(), task.getOrderNumber());
        }
        return result;
    }
}