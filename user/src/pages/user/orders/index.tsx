import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, message, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getOrders } from '@/services/order';
import type { Order } from '@/models/order';
import styles from './index.module.css';

const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders({ page, pageSize });
      setOrders(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load orders:', error);
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'orange',
      confirmed: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red',
    };
    return colorMap[status] || 'default';
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => history.push(`/user/orders/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.orderListPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Orders</h1>

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
              showTotal: (total) => `Total ${total} orders`,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default OrderListPage;
