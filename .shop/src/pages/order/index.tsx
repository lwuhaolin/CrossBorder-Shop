import React, { useRef } from "react";
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import request from "@/utils/request";
import Changer from "@/pages/order/components/Changer";
import OrderEntry from "@/pages/order/components/OrderEntry";
import XinPrice from "@/pages/order/components/XinPrice";
import XinStaff from "@/pages/order/components/XinStaff";
import XinPeer from "@/pages/order/components/XinPeer";

export const OrderStatus: ProColumns["valueEnum"] = {
  0: {
    text: "打开",
    status: "processing",
  },
  1: {
    text: "关闭",
    status: "error",
  },
  2: {
    text: "已完成",
    status: "success",
  },
};

export const ResourceType: ProColumns["valueEnum"] = {
  0: {
    text: "鲜花",
    status: "success",
  },
  1: {
    text: "包装材料",
    status: "warning",
  },
};

export const PeerType: ProColumns["valueEnum"] = {
  0: {
    text: "供应商",
    status: "warning",
  },
  1: {
    text: "顾客",
    status: "processing",
  },
};

const Order: React.FC = () => {
  const holder = useRef<ActionType>();

  const columns: ProColumns<Record<string, any>>[] = [
    {
      title: "订单编号",
      dataIndex: "id",
    },
    {
      title: "校验码",
      dataIndex: "uuid",
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "对端类型",
      dataIndex: "peerType",
      valueType: "select",
      valueEnum: PeerType,
    },
    {
      key: "peer",
      title: "对端名称",
      render: (_, entity) => (
        <XinPeer peerId={entity.peerId} peerType={entity.peerType} />
      ),
    },
    {
      key: "staff",
      title: "订单创建者",
      tooltip: "员工名称",
      render: (_, entity) => <XinStaff staffId={entity.staffId} />,
    },
    {
      key: "price",
      title: "总金额",
      render: (_, entity) => <XinPrice orderId={entity.id} />,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "select",
      valueEnum: OrderStatus,
    },
    {
      title: "创建于",
      dataIndex: "createdAt",
      valueType: "dateTime",
    },
    {
      title: "更新于",
      dataIndex: "updatedAt",
      valueType: "dateTime",
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      render: (_, entity) => [
        <Changer
          key="change"
          holder={holder}
          entity={entity}
          trigger={<Button type="dashed" icon={<EditOutlined />} />}
        />,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        title: "订单",
      }}
    >
      <ProCard ghost gutter={[6, 6]} direction="column">
        <ProTable<Record<string, any>>
          actionRef={holder}
          columns={columns}
          request={(params) =>
            request("/v1/order", {
              params,
            }).then((response) => response.data)
          }
          options={{
            search: true,
          }}
          expandable={{
            expandedRowRender: (entity) => <OrderEntry orderId={entity.id} />,
          }}
          rowKey="id"
          search={false}
        />
      </ProCard>
    </PageContainer>
  );
};

export default Order;
