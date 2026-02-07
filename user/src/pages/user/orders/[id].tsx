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
import { getOrderDetail } from "@/services/order";
import type { Order } from "@/models/order";
import { OrderStatus } from "@/models/order";
import styles from "./[id].module.css";

const { Step } = Steps;

const OrderDetailPage: React.FC = () => {
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
      message.error("Failed to load order");
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
      [OrderStatus.PENDING]: "PENDING",
      [OrderStatus.PAID]: "PAID",
      [OrderStatus.SHIPPED]: "SHIPPED",
      [OrderStatus.COMPLETED]: "COMPLETED",
      [OrderStatus.CANCELED]: "CANCELED",
      [OrderStatus.REFUNDING]: "REFUNDING",
      [OrderStatus.REFUNDED]: "REFUNDED",
    };
    return textMap[status] || "UNKNOWN";
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
      title: "Product",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Subtotal",
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
        <Empty description="Order not found" />
      </div>
    );
  }

  return (
    <div className={styles.orderDetailPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Order Details</h1>

        <Card className={styles.card}>
          <Descriptions title="Order Information" bordered column={2}>
            <Descriptions.Item label="Order ID">#{order.id}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Order Date">
              {new Date(order.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              ${order.totalAmount.toFixed(2)}
            </Descriptions.Item>
          </Descriptions>

          {order.status !== OrderStatus.CANCELED && (
            <div className={styles.steps}>
              <Steps current={getStatusStep(order.status)}>
                <Step title="Pending" description="Order received" />
                <Step title="Confirmed" description="Order confirmed" />
                <Step title="Shipped" description="On the way" />
                <Step title="Delivered" description="Completed" />
              </Steps>
            </div>
          )}

          <div className={styles.section}>
            <h3>Order Items</h3>
            <Table
              dataSource={order.items}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </div>

          {order.shippingAddress && (
            <div className={styles.section}>
              <h3>Shipping Address</h3>
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
