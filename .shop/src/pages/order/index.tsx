import { EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'umi';
import { getOrderList } from '@/services/order';
import type { Order, OrderListParams } from '@/models/order';
import { OrderStatus, PaymentStatus, ShippingStatus } from '@/models/order';
import type { PageResult } from '@/models/common';

const OrderList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();

  const getOrderStatusTag = (status: OrderStatus) => {
    const statusMap = {
      [OrderStatus.PENDING]: { color: 'default', text: '待支付' },
      [OrderStatus.PAID]: { color: 'processing', text: '已支付' },
      [OrderStatus.SHIPPED]: { color: 'blue', text: '已发货' },
      [OrderStatus.COMPLETED]: { color: 'success', text: '已完成' },
      [OrderStatus.CANCELED]: { color: 'error', text: '已取消' },
      [OrderStatus.REFUNDING]: { color: 'warning', text: '退款中' },
      [OrderStatus.REFUNDED]: { color: 'default', text: '已退款' },
    };
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPaymentStatusTag = (status?: PaymentStatus) => {
    if (status === undefined) return '-';
    const statusMap = {
      [PaymentStatus.UNPAID]: { color: 'default', text: '未支付' },
      [PaymentStatus.PAID]: { color: 'success', text: '已支付' },
      [PaymentStatus.REFUNDED]: { color: 'error', text: '已退款' },
    };
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getShippingStatusTag = (status?: ShippingStatus) => {
    if (status === undefined) return '-';
    const statusMap = {
      [ShippingStatus.PENDING]: { color: 'default', text: '待发货' },
      [ShippingStatus.SHIPPED]: { color: 'processing', text: '已发货' },
      [ShippingStatus.DELIVERED]: { color: 'success', text: '已送达' },
    };
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ProColumns<Order>[] = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 180,
      copyable: true,
    },
    {
      title: '用户',
      dataIndex: 'username',
      width: 120,
      search: false,
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      width: 120,
      search: false,
      render: (_, record) => `¥${record.totalAmount.toFixed(2)}`,
    },
    {
      title: '实付金额',
      dataIndex: 'actualAmount',
      width: 120,
      search: false,
      render: (_, record) => `¥${record.actualAmount.toFixed(2)}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        [OrderStatus.PENDING]: { text: '待支付', status: 'Default' },
        [OrderStatus.PAID]: { text: '已支付', status: 'Processing' },
        [OrderStatus.SHIPPED]: { text: '已发货', status: 'Processing' },
        [OrderStatus.COMPLETED]: { text: '已完成', status: 'Success' },
        [OrderStatus.CANCELED]: { text: '已取消', status: 'Error' },
        [OrderStatus.REFUNDING]: { text: '退款中', status: 'Warning' },
        [OrderStatus.REFUNDED]: { text: '已退款', status: 'Default' },
      },
      render: (_, record) => getOrderStatusTag(record.status),
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 100,
      search: false,
      render: (_, record) => getPaymentStatusTag(record.paymentStatus),
    },
    {
      title: '发货状态',
      dataIndex: 'shippingStatus',
      width: 100,
      search: false,
      render: (_, record) => getShippingStatusTag(record.shippingStatus),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/orders/${record.id}`)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = async (params: OrderListParams & { pageSize?: number; current?: number }) => {
    try {
      const { current, pageSize, ...rest } = params;
      const response = await getOrderList({
        page: current,
        pageSize,
        ...rest,
      });

      const data: PageResult<Order> = response.data || { list: [], total: 0, page: 1, pageSize: 10 };

      return {
        data: data.list || [],
        success: true,
        total: data.total || 0,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  return (
    <ProTable<Order>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={fetchData}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
      dateFormatter="string"
      headerTitle="订单列表"
    />
  );
};

export default OrderList;
