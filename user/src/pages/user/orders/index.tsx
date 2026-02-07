import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, message, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { getOrderList } from "@/services/order";
import type { Order } from "@/models/order";
import styles from "./index.module.css";

const OrderListPage: React.FC = () => {
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
      message.error("加载订单列表失败");
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      0: "待支付",
      1: "已支付",
      2: "已发货",
      3: "已完成",
      4: "已取消",
      5: "退款中",
      6: "已退款",
    };
    return statusMap[status] || "未知";
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
      title: "订单号",
      dataIndex: "orderNo",
      key: "orderNo",
      render: (orderNo: string) => orderNo || "-",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleString("zh-CN") : "-",
    },
    {
      title: "订单金额",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `¥${(amount || 0).toFixed(2)}`,
    },
    {
      title: "实付金额",
      dataIndex: "actualAmount",
      key: "actualAmount",
      render: (amount: number) => `¥${(amount || 0).toFixed(2)}`,
    },
    {
      title: "订单状态",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/user/orders/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.orderListPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>我的订单</h1>

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
              showTotal: (total) => `共 ${total} 条订单`,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default OrderListPage;
