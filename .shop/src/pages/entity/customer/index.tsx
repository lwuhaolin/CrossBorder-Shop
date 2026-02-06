import React, { useRef } from "react";
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { Button, message, Modal, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Creator from "@/pages/entity/customer/components/Creator";
import request from "@/utils/request";

const EntityCustomer: React.FC = () => {
  const holder = useRef<ActionType>();

  const columns: ProColumns<Record<string, any>>[] = [
    {
      title: "编号",
      dataIndex: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "性别",
      dataIndex: "sex",
      valueType: "segmented",
      valueEnum: {
        0: {
          text: "女",
          status: "success",
        },
        1: {
          text: "男",
          status: "processing",
        },
        2: {
          text: "未知",
          status: "default",
        },
      },
    },
    {
      title: "联系电话",
      valueType: "text",
      dataIndex: "phone",
      render: (_, entity) => <a href={`tel:${entity.phone}`}>{entity.phone}</a>,
    },
    {
      title: "住址",
      ellipsis: true,
      copyable: true,
      valueType: "text",
      dataIndex: "address",
    },
    {
      title: "会员卡号",
      dataIndex: "cardId",
    },
    {
      title: "出生于",
      dataIndex: "birthedAt",
      valueType: "dateTime",
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
      width: 120,
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
          title="真的要删除这个客户么"
          description="它真的会消失很久很久"
          onConfirm={() =>
            request(`/v1/customer/${entity.id}`, {
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
        title: "客户",
      }}
      extra={[
        <Button
          key="create"
          type="primary"
          onClick={() =>
            Modal.info({
              title: "无法这样操作",
              content:
                "由于需要绑定会员卡信息，应先让用户使用微信小程序登录后再编辑自动创建的用户，而不是直接创建用户",
            })
          }
        >
          添加客户
        </Button>,
      ]}
    >
      <ProTable<Record<string, any>>
        actionRef={holder}
        columns={columns}
        request={(params) =>
          request("/v1/customer", {
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

export default EntityCustomer;
