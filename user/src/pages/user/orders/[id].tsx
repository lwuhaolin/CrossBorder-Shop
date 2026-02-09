import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "@umijs/renderer-react";
import {
  Card,
  Descriptions,
  Steps,
  Table,
  Tag,
  Spin,
  Empty,
  message,
  Button,
  Space,
  Modal,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  getOrderDetail,
  payOrder,
  cancelOrder,
  confirmOrder,
} from "@/services/order";
import { clearCart } from "@/services/cart";
import type { Order } from "@/models/order";
import { OrderStatus } from "@/models/order";
import styles from "./[id].module.css";

const { Step } = Steps;

const OrderDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await getOrderDetail(Number(id));
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to load order:", error);
      message.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: number) => {
    const stepMap: Record<number, number> = {
      [OrderStatus.PENDING]: 0,
      [OrderStatus.PAID]: 1,
      [OrderStatus.SHIPPED]: 2,
      [OrderStatus.COMPLETED]: 3,
      [OrderStatus.CANCELED]: -1,
      [OrderStatus.REFUNDING]: -1,
      [OrderStatus.REFUNDED]: -1,
    };
    return stepMap[status] ?? 0;
  };

  const getStatusText = (status: number) => {
    const textMap: Record<number, string> = {
      [OrderStatus.PENDING]: t("order.pending"),
      [OrderStatus.PAID]: t("order.paid"),
      [OrderStatus.SHIPPED]: t("order.shipped"),
      [OrderStatus.COMPLETED]: t("order.completed"),
      [OrderStatus.CANCELED]: t("order.cancelled"),
      [OrderStatus.REFUNDING]: t("order.refunding"),
      [OrderStatus.REFUNDED]: t("order.refunded"),
    };
    return textMap[status] || t("common.info");
  };

  const getStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
      [OrderStatus.PENDING]: "orange",
      [OrderStatus.PAID]: "blue",
      [OrderStatus.SHIPPED]: "cyan",
      [OrderStatus.COMPLETED]: "green",
      [OrderStatus.CANCELED]: "red",
      [OrderStatus.REFUNDING]: "purple",
      [OrderStatus.REFUNDED]: "default",
    };
    return colorMap[status] || "default";
  };

  // 处理支付
  const handlePayOrder = () => {
    if (!order) return;
    Modal.confirm({
      title: t("order.confirmPay"),
      content: t("order.paymentConfirm"),
      okText: t("common.confirm"),
      cancelText: t("common.cancel"),
      onOk: async () => {
        try {
          setActionLoading(true);
          await payOrder(order.id);

          // 支付成功后清空购物车
          localStorage.setItem("cart", JSON.stringify([]));
          window.dispatchEvent(new Event("storage"));

          // 调用后端API清空购物车
          try {
            await clearCart();
          } catch (error) {
            console.warn("Failed to clear cart on backend:", error);
            // 不影响支付流程
          }

          message.success(t("order.paymentSuccess"));
          // 刷新订单信息
          loadOrder();
        } catch (error) {
          console.error("Payment failed:", error);
          message.error(t("order.paymentFailed"));
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  // 处理取消订单
  const handleCancelOrder = () => {
    if (!order) return;
    Modal.confirm({
      title: t("order.confirmCancel"),
      content: t("order.cancelConfirm"),
      okText: t("common.confirm"),
      cancelText: t("common.cancel"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setActionLoading(true);
          await cancelOrder(order.id);
          message.success(t("order.cancelSuccess"));
          // 刷新订单信息
          loadOrder();
        } catch (error) {
          console.error("Cancel failed:", error);
          message.error(t("order.cancelFailed"));
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  // 处理确认收货
  const handleConfirmOrder = () => {
    if (!order) return;
    Modal.confirm({
      title: t("order.confirmReceipt"),
      content: t("order.receiptConfirm"),
      okText: t("common.confirm"),
      cancelText: t("common.cancel"),
      onOk: async () => {
        try {
          setActionLoading(true);
          await confirmOrder(order.id);
          message.success(t("order.confirmSuccess"));
          // 刷新订单信息
          loadOrder();
        } catch (error) {
          console.error("Confirm failed:", error);
          message.error(t("order.confirmFailed"));
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  // 获取可用的操作按钮
  const getActionButtons = () => {
    if (!order) return null;

    const buttons = [];

    // 待支付状态：显示支付和取消按钮
    if (order.orderStatus === OrderStatus.PENDING) {
      buttons.push(
        <Button
          key="pay"
          type="primary"
          onClick={handlePayOrder}
          loading={actionLoading}
        >
          {t("order.pay")}
        </Button>,
      );
      buttons.push(
        <Button
          key="cancel"
          danger
          onClick={handleCancelOrder}
          loading={actionLoading}
        >
          {t("order.cancel")}
        </Button>,
      );
    }

    // 已发货状态：显示确认收货按钮
    if (order.orderStatus === OrderStatus.SHIPPED) {
      buttons.push(
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirmOrder}
          loading={actionLoading}
        >
          {t("order.confirmReceipt")}
        </Button>,
      );
    }

    return buttons.length > 0 ? <Space>{buttons}</Space> : null;
  };

  const columns = [
    {
      title: t("order.product"),
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: t("product.price"),
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: t("product.quantity"),
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: t("order.subtotal"),
      key: "subtotal",
      render: (record: any) => `$${record.totalPrice.toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.empty}>
        <Empty description={t("order.notFound")} />
      </div>
    );
  }

  return (
    <div className={styles.orderDetailPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("order.orderInformation")}</h1>

        <Card className={styles.card}>
          <Descriptions title={t("order.orderInformation")} bordered column={2}>
            <Descriptions.Item label={t("order.orderId")}>
              {order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`}
            </Descriptions.Item>
            <Descriptions.Item label={t("order.status")}>
              <Tag color={getStatusColor(order.orderStatus)}>
                {getStatusText(order.orderStatus)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("order.createdAt")}>
              {new Date(order.createTime).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t("order.total")}>
              ${order.totalAmount.toFixed(2)}
            </Descriptions.Item>
          </Descriptions>

          {order.orderStatus !== OrderStatus.CANCELED && (
            <div className={styles.steps}>
              <Steps current={getStatusStep(order.orderStatus)}>
                <Step
                  title={t("order.pending")}
                  description={t("common.info")}
                />
                <Step title={t("order.paid")} description={t("common.info")} />
                <Step
                  title={t("order.shipped")}
                  description={t("common.info")}
                />
                <Step
                  title={t("order.delivered")}
                  description={t("common.info")}
                />
              </Steps>
            </div>
          )}

          <div className={styles.section}>
            <h3>{t("order.orderItems")}</h3>
            <Table
              dataSource={order.items}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </div>

          {order.address && (
            <div className={styles.section}>
              <h3>{t("order.shippingAddress")}</h3>
              <p>
                {order.address.receiverName} - {order.address.receiverPhone}
                <br />
                {order.address.detailAddress}
                <br />
                {order.address.city}, {order.address.province}{" "}
                {order.address.district}
              </p>
            </div>
          )}

          {/* 操作按钮区域 */}
          {getActionButtons() && (
            <div className={styles.actions}>{getActionButtons()}</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
