import {
  Card,
  Descriptions,
  Table,
  Tag,
  Space,
  Button,
  Timeline,
  message,
  Modal,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "umi";
import { useRequest } from "ahooks";
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  type ProFormInstance,
} from "@ant-design/pro-components";
import { useRef, useState } from "react";
import {
  getOrderDetail,
  shipOrder,
  cancelOrder,
  updateOrderStatus,
} from "@/services/order";
import {
  getLogisticsCompanies,
  generateTrackingNo,
} from "@/services/logistics";
import { OrderStatus, PaymentStatus } from "@/models/order";
import type { Order, OrderItem, OrderShipDTO } from "@/models/order";
import type { LogisticsCompany } from "@/models/logistics";

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const orderId = parseInt(params.id || "0");
  const [shipModalVisible, setShipModalVisible] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [logisticsCompanies, setLogisticsCompanies] = useState<
    LogisticsCompany[]
  >([]);

  const {
    data: order,
    loading,
    refresh,
  } = useRequest(
    async () => {
      const res = await getOrderDetail(orderId);
      return res.data;
    },
    {
      ready: !!orderId,
      refreshDeps: [orderId],
    },
  );

  useRequest(
    async () => {
      const res = await getLogisticsCompanies();
      return res.data || [];
    },
    {
      onSuccess: (data) => setLogisticsCompanies(data),
    },
  );

  const handleShip = async (values: OrderShipDTO) => {
    try {
      await shipOrder(orderId, values);
      message.success("发货成功");
      setShipModalVisible(false);
      refresh();
      return true;
    } catch (error) {
      message.error("发货失败");
      return false;
    }
  };

  const handleCancel = () => {
    Modal.confirm({
      title: "确认取消订单",
      content: "确定要取消这个订单吗？",
      onOk: async () => {
        try {
          await cancelOrder(orderId);
          message.success("订单已取消");
          refresh();
        } catch (error) {
          message.error("取消订单失败");
        }
      },
    });
  };

  const handleComplete = () => {
    Modal.confirm({
      title: "确认完成订单",
      content: "确定要完成这个订单吗？",
      onOk: async () => {
        try {
          await updateOrderStatus(orderId, { status: OrderStatus.COMPLETED });
          message.success("订单已完成");
          refresh();
        } catch (error) {
          message.error("操作失败");
        }
      },
    });
  };

  if (loading) {
    return (
      <Card>
        <Spin
          size="large"
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        />
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px" }}>订单不存在</div>
      </Card>
    );
  }

  const getOrderStatusTag = (status: OrderStatus) => {
    const statusMap = {
      [OrderStatus.PENDING]: { color: "default", text: "待支付" },
      [OrderStatus.PAID]: { color: "processing", text: "已支付" },
      [OrderStatus.SHIPPED]: { color: "blue", text: "已发货" },
      [OrderStatus.COMPLETED]: { color: "success", text: "已完成" },
      [OrderStatus.CANCELED]: { color: "error", text: "已取消" },
      [OrderStatus.REFUNDING]: { color: "warning", text: "退款中" },
      [OrderStatus.REFUNDED]: { color: "default", text: "已退款" },
    };
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPaymentStatusTag = (status?: PaymentStatus) => {
    if (status === undefined) return "-";
    const statusMap = {
      [PaymentStatus.UNPAID]: { color: "default", text: "未支付" },
      [PaymentStatus.PAID]: { color: "success", text: "已支付" },
      [PaymentStatus.REFUNDED]: { color: "error", text: "已退款" },
    };
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const itemColumns = [
    {
      title: "商品名称",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "商品图片",
      dataIndex: "productImage",
      key: "productImage",
      render: (url: string) =>
        url ? (
          <img
            src={url}
            alt=""
            style={{ width: 60, height: 60, objectFit: "cover" }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "单价",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `¥${(price || 0).toFixed(2)}`,
    },
    {
      title: "数量",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "小计",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `¥${(amount || 0).toFixed(2)}`,
    },
  ];

  const timelineItems = [
    {
      children: `订单创建 - ${order?.createTime || "-"}`,
      color: "gray",
    },
    order?.paymentTime && {
      children: `支付成功 - ${order.paymentTime}`,
      color: "green",
    },
    order?.shipTime && {
      children: `订单发货 - ${order.shipTime}`,
      color: "blue",
    },
    order?.completeTime && {
      children: `订单完成 - ${order.completeTime}`,
      color: "green",
    },
    order?.cancelTime && {
      children: `订单取消 - ${order.cancelTime}`,
      color: "red",
    },
  ].filter((item): item is { children: string; color: string } => !!item);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card
        title={`订单详情 - ${order?.orderNumber || ""}`}
        extra={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/orders")}
            >
              返回列表
            </Button>
            {order.orderStatus === OrderStatus.PAID && (
              <Button type="primary" onClick={() => setShipModalVisible(true)}>
                发货
              </Button>
            )}
            {order.orderStatus === OrderStatus.SHIPPED && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleComplete}
              >
                完成订单
              </Button>
            )}
            {(order.orderStatus === OrderStatus.PENDING ||
              order.orderStatus === OrderStatus.PAID) && (
              <Button danger icon={<CloseOutlined />} onClick={handleCancel}>
                取消订单
              </Button>
            )}
          </Space>
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="订单编号">
            {order.orderNumber}
          </Descriptions.Item>
          <Descriptions.Item label="买家ID">{order.buyerId}</Descriptions.Item>
          <Descriptions.Item label="卖家ID">
            {order.sellerId || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="订单状态">
            {getOrderStatusTag(order.orderStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="支付状态">
            {getPaymentStatusTag(order.paymentStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="支付方式">
            {order.paymentMethod || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="物流公司">
            {order.logisticsCompany || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="物流单号">
            {order.trackingNo || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">
            ¥{order.totalAmount?.toFixed(2) || "0.00"}
          </Descriptions.Item>
          <Descriptions.Item label="商品金额">
            ¥{(order.productAmount || 0).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="运费">
            ¥{(order.freightAmount || 0).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="优惠金额">
            ¥{(order.discountAmount || 0).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="原币种">
            {order.currency || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="目标币种">
            {order.targetCurrency || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {order.createTime || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="支付时间">
            {order.paymentTime || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="卖家发货地址" span={2}>
            {order.sellerAddress || "-"}
          </Descriptions.Item>
          {order.remark && (
            <Descriptions.Item label="备注" span={2}>
              {order.remark}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {order.address && (
        <Card title="收货地址">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="收货人">
              {order.address.receiverName}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {order.address.receiverPhone}
            </Descriptions.Item>
            <Descriptions.Item label="所在地区" span={2}>
              {order.address.city}
            </Descriptions.Item>
            <Descriptions.Item label="详细地址" span={2}>
              {order.address.detailAddress}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      

      <Card title="商品清单">
        <Table
          columns={itemColumns}
          dataSource={order.items || []}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card title="订单时间线">
        <Timeline items={timelineItems} />
      </Card>

      <ModalForm
        title="订单发货"
        open={shipModalVisible}
        onOpenChange={setShipModalVisible}
        onFinish={handleShip}
        formRef={formRef}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormSelect
          name="shippingCompanyCode"
          label="物流公司"
          placeholder="请选择物流公司"
          rules={[{ required: true, message: "请选择物流公司" }]}
          fieldProps={{
            options: logisticsCompanies.map((item) => ({
              label: item.companyName,
              value: item.companyCode,
            })),
            onChange: async (value) => {
              const company = logisticsCompanies.find(
                (item) => item.companyCode === value,
              );
              if (company) {
                formRef.current?.setFieldValue(
                  "shippingCompany",
                  company.companyName,
                );
                const res = await generateTrackingNo(company.companyCode);
                formRef.current?.setFieldValue("trackingNo", res.data || "");
              }
            },
          }}
        />

        <ProFormText name="shippingCompany" label="物流公司名称" disabled />

        <ProFormText
          name="trackingNo"
          label="物流单号"
          placeholder="选择物流公司后自动生成"
          rules={[{ required: true, message: "请选择物流公司生成物流单号" }]}
          disabled
        />

        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="请输入备注信息"
          fieldProps={{
            rows: 3,
          }}
        />
      </ModalForm>
    </Space>
  );
};

export default OrderDetail;
