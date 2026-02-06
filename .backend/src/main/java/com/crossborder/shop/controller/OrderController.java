package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.dto.CreateOrderDTO;
import com.crossborder.shop.security.UserPrincipal;
import com.crossborder.shop.service.OrderService;
import com.crossborder.shop.vo.OrderVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 订单控制
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@Tag(name = "订单管理", description = "订单相关接口")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "创建订单", description = "买家从购物车创建订单")
    public Result<Long> createOrder(@AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrderDTO dto) {
        Long orderId = orderService.createOrder(principal.getUserId(), dto);
        return Result.success(orderId);
    }

    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "买家取消订单", description = "待支付状态的订单可以取消")
    public Result<Void> cancelOrder(@AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long orderId,
            @RequestParam(required = false) String reason) {
        orderService.cancelOrder(principal.getUserId(), orderId, reason);
        return Result.success();
    }

    @PostMapping("/{orderId}/pay")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "支付订单", description = "买家支付订单")
    public Result<Void> payOrder(@AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long orderId) {
        orderService.payOrder(principal.getUserId(), orderId);
        return Result.success();
    }

    @PostMapping("/{orderId}/confirm")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "确认收货", description = "买家确认收货，订单完成")
    public Result<Void> confirmOrder(@AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long orderId) {
        orderService.confirmOrder(principal.getUserId(), orderId);
        return Result.success();
    }

    @PostMapping("/{orderId}/ship")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "卖家发货", description = "卖家标记订单已发货")
    public Result<Void> shipOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long orderId) {
        orderService.shipOrder(principal.getUserId(), orderId);
        return Result.success();
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN')")
    @Operation(summary = "查询订单详情", description = "根据订单ID查询详情")
    public Result<OrderVO> getOrderById(@PathVariable Long orderId) {
        OrderVO order = orderService.getOrderById(orderId);
        return Result.success(order);
    }

    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN')")
    @Operation(summary = "根据订单号查询", description = "根据订单号查询订单详情")
    public Result<OrderVO> getOrderByNumber(@PathVariable String orderNumber) {
        OrderVO order = orderService.getOrderByNumber(orderNumber);
        return Result.success(order);
    }

    @GetMapping("/buyer/list")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "买家订单列表", description = "查询当前买家的订单列表")
    public Result<List<OrderVO>> getBuyerOrders(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer orderStatus) {
        List<OrderVO> orders = orderService.getBuyerOrders(principal.getUserId(), orderStatus);
        return Result.success(orders);
    }

    @GetMapping("/seller/list")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "卖家订单列表", description = "查询当前卖家的订单列表")
    public Result<List<OrderVO>> getSellerOrders(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer orderStatus) {
        List<OrderVO> orders = orderService.getSellerOrders(principal.getUserId(), orderStatus);
        return Result.success(orders);
    }
}
