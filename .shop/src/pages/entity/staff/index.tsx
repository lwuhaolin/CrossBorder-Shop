import React, { useRef } from "react";
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import Creator from "@/pages/entity/staff/components/Creator";
import request from "@/utils/request";
import Changer from "@/pages/entity/staff/components/Changer";

const EntityStaff: React.FC = (props) => {
  const holder = useRef<ActionType>();

  const columns: ProColumns<Record<string, any>>[] = [
    {
      title: "工号",
      dataIndex: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "联系方式",
      valueType: "text",
      dataIndex: "contact",
    },
    {
      title: "状态",
      valueType: "radioButton",
      valueEnum: {
        true: {
          text: "启用",
          status: "success",
        },
        false: {
          text: "禁用",
          status: "error",
        },
      },
      renderText: (_, entity) => !!entity.password,
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
          trigger={<Button type="dashed" icon={<LockOutlined />} />}
        />,
        <Creator
          key="edit"
          holder={holder}
          entity={entity}
          trigger={<Button type="dashed" icon={<EditOutlined />} />}
        />,
        <Popconfirm
          key="delete"
          title="真的要删除这个员工么"
          description="它真的会消失很久很久"
          onConfirm={() =>
            request(`/v1/staff/${entity.id}`, {
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
        title: "员工",
      }}
      extra={[
        <Creator
          key="create"
          holder={holder}
          trigger={<Button type="primary">添加员工</Button>}
        />,
      ]}
    >
      <ProTable<Record<string, any>>
        actionRef={holder}
        columns={columns}
        request={(params) =>
          request("/v1/staff", {
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

export default EntityStaff;
