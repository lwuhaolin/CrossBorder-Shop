import React, { useEffect, useState } from "react";
import { useParams } from "@umijs/renderer-react";
import {
  Card,
  Descriptions,
  Steps,
  Table,
  Tag,
  Spin,
  Empty,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import { getOrderDetail } from "@/services/order";
import type { Order } from "@/models/order";
import { OrderStatus } from "@/models/order";
import styles from "./[id].module.css";

const { Step } = Steps;

const OrderDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getStatusStep = (status: OrderStatus) => {
    const stepMap: Record<OrderStatus, number> = {
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

  const getStatusText = (status: OrderStatus) => {
    const textMap: Record<OrderStatus, string> = {
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

  const getStatusColor = (status: OrderStatus) => {
    const colorMap: Record<OrderStatus, string> = {
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
      render: (record: any) =>
        `$${(record.price * record.quantity).toFixed(2)}`,
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
            <Descriptions.Item label={t("order.orderId")}>#{order.id}</Descriptions.Item>
            <Descriptions.Item label={t("order.status")}>
              <Tag color={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("order.createdAt")}>
              {new Date(order.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t("order.total")}>
              ${order.totalAmount.toFixed(2)}
            </Descriptions.Item>
          </Descriptions>

          {order.status !== OrderStatus.CANCELED && (
            <div className={styles.steps}>
              <Steps current={getStatusStep(order.status)}>
                <Step title={t("order.pending")} description={t("common.info")} />
                <Step title={t("order.paid")} description={t("common.info")} />
                <Step title={t("order.shipped")} description={t("common.info")} />
                <Step title={t("order.delivered")} description={t("common.info")} />
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

          {order.shippingAddress && (
            <div className={styles.section}>
              <h3>{t("order.shippingAddress")}</h3>
              <p>
                {order.shippingAddress.receiverName} -{" "}
                {order.shippingAddress.receiverPhone}
                <br />
                {order.shippingAddress.detailAddress}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                {order.shippingAddress.district}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
