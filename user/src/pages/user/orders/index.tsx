import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { getOrderList } from "@/services/order";
import type { Order } from "@/models/order";
import styles from "./index.module.css";

const OrderListPage: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrderList({ page, pageSize });
      console.log("订单列表响应:", response);
      if (response.data) {
        setOrders(response.data.list || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      message.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      0: t("order.pending"),
      1: t("order.paid"),
      2: t("order.shipped"),
      3: t("order.completed"),
      4: t("order.cancelled"),
      5: t("order.refunding"),
      6: t("order.refunded"),
    };
    return statusMap[status] || t("common.info");
  };

  const getStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
      0: "orange",
      1: "blue",
      2: "cyan",
      3: "green",
      4: "red",
      5: "purple",
      6: "default",
    };
    return colorMap[status] || "default";
  };

  const columns = [
    {
      title: t("order.orderNo"),
      dataIndex: "orderNo",
      key: "orderNo",
      render: (orderNo: string) => orderNo || "-",
    },
    {
      title: t("order.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleString("zh-CN") : "-",
    },
    {
      title: t("order.amount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `¥${(amount || 0).toFixed(2)}`,
    },
    {
      title: t("order.actualAmount"),
      dataIndex: "actualAmount",
      key: "actualAmount",
      render: (amount: number) => `¥${(amount || 0).toFixed(2)}`,
    },
    {
      title: t("order.status"),
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: t("common.edit"),
      key: "action",
      render: (record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/user/orders/${record.id}`)}
        >
          {t("order.viewDetails")}
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.orderListPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("order.title")}</h1>

        <Card className={styles.card}>
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              onChange: (p) => setPage(p),
              showTotal: (total) => `${t("order.totalProducts", { total })}`,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default OrderListPage;
