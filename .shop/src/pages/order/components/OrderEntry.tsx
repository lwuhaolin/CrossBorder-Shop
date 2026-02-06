import React from "react";
import {
  ProColumns,
  ProTable,
  ProTableProps,
} from "@ant-design/pro-components";
import request from "@/utils/request";
import { ResourceType } from "@/pages/order";
import XinResource from "@/pages/order/components/XinResource";

const OrderEntry: React.FC<
  ProTableProps<any, any> & {
    orderId: string;
  }
> = (props) => {
  const columns: ProColumns<Record<string, any>>[] = [
    {
      title: "编号",
      dataIndex: "id",
    },
    {
      title: "校验码",
      dataIndex: "uuid",
    },
    {
      title: "资源类型",
      valueType: "select",
      valueEnum: ResourceType,
      dataIndex: "resourceType",
    },
    {
      key: "resource",
      title: "资源名称",
      render: (_, entity) => (
        <XinResource
          resourceId={entity.resourceId}
          resourceType={entity.resourceType}
        />
      ),
    },
    {
      title: "单价",
      valueType: "money",
      dataIndex: "price",
    },
    {
      title: "购买数量",
      dataIndex: "amount",
    },
    {
      key: "price",
      title: "总金额",
      renderText: (_, entity) => entity.price * entity.amount,
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
  ];

  return (
    <ProTable<Record<string, any>>
      columns={columns}
      request={(params) =>
        request(`/v1/order/${props.orderId}/entry`, {
          params,
        }).then((response) => response.data)
      }
      options={{
        search: true,
      }}
      rowKey="id"
      search={false}
      {...props}
    />
  );
};

export default OrderEntry;
