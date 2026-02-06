import React, { useRef } from "react";
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Creator from "@/pages/entity/flower/loss/components/Creator";
import request from "@/utils/request";

export const LossReason: ProColumns["valueEnum"] = {
  0: {
    text: "自然枯萎",
    status: "warning",
  },
  1: {
    text: "人为损坏",
    status: "error",
  },
};

export const HandleMethod: ProColumns["valueEnum"] = {
  0: {
    text: "回收",
    status: "success",
  },
  1: {
    text: "丢弃",
    status: "error",
  },
  2: {
    text: "转赠",
    status: "warning",
  },
};

const EntityFlowerLoss: React.FC = () => {
  const holder = useRef<ActionType>();

  const columns: ProColumns<Record<string, any>>[] = [
    {
      title: "编号",
      dataIndex: "id",
    },
    {
      title: "状态",
      dataIndex: "reason",
      valueType: "select",
      valueEnum: LossReason,
    },
    {
      title: "处理方式",
      dataIndex: "method",
      valueType: "select",
      valueEnum: HandleMethod,
    },
    {
      title: "损坏数量",
      valueType: "digit",

      dataIndex: "amount",
    },
    {
      title: "预估亏损金额",
      valueType: "money",
      dataIndex: "price",
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
        <Creator
          key="edit"
          holder={holder}
          entity={entity}
          trigger={<Button type="dashed" icon={<EditOutlined />} />}
        />,
        <Popconfirm
          key="delete"
          title="真的要删除这条损坏记录么"
          description="它真的会消失很久很久"
          onConfirm={() =>
            request(`/v1/loss/${entity.id}`, {
              method: "DELETE",
            }).then(() => {
              message.success("删除成功");

              holder.current?.reload();
            })
          }
        >
          <Button danger type="dashed" icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        title: "损坏",
      }}
      extra={[
        <Creator
          key="create"
          holder={holder}
          trigger={<Button type="primary">添加损坏记录</Button>}
        />,
      ]}
    >
      <ProTable<Record<string, any>>
        actionRef={holder}
        columns={columns}
        request={(params) =>
          request("/v1/loss", {
            params,
          }).then((response) => response.data)
        }
        options={{
          search: true,
        }}
        rowKey="id"
        search={false}
      />
    </PageContainer>
  );
};

export default EntityFlowerLoss;
