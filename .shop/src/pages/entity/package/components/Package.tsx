import React from "react";
import {
  ProColumns,
  ProTable,
  ProTableProps,
} from "@ant-design/pro-components";
import request, { instance } from "@/utils/request";
import { Button, message, Popconfirm } from "antd";
import Creator from "@/pages/entity/package/components/Creator";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import XinInventory from "@/pages/entity/flower/components/XinInventory";

const Package: React.FC<ProTableProps<any, any>> = (props) => {
  const columns: ProColumns<Record<string, any>>[] = [
    {
      title: "编号",
      dataIndex: "id",
    },
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "解释",
      dataIndex: "description",
    },
    {
      title: "预览图",
      valueType: "image",
      dataIndex: "picture",
      renderText: (text) =>
        instance.getUri({
          url: `/v1/resource/${text}`,
        }),
    },
    {
      title: "单价",
      valueType: "money",
      dataIndex: "price",
    },
    {
      title: "库存",
      key: "remained",

      render: (_, entity) => (
        <XinInventory noStyle resourceId={entity.id} resourceType={1} />
      ),
    },
    ...(props.actionRef
      ? ([
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
                // @ts-ignore
                holder={props.actionRef}
                entity={entity}
                trigger={<Button type="dashed" icon={<EditOutlined />} />}
              />,
              <Popconfirm
                key="delete"
                title="真的要删除这个包装材料么"
                description="它真的会消失很久很久"
                onConfirm={() =>
                  request(`/v1/package/${entity.id}`, {
                    method: "DELETE",
                  }).then(() => {
                    message.success("删除成功");
                    // @ts-ignore
                    props.actionRef.current?.reload();
                  })
                }
              >
                <Button danger type="dashed" icon={<DeleteOutlined />} />
              </Popconfirm>,
            ],
          },
        ] as ProColumns[])
      : []),
  ];

  return (
    <ProTable<Record<string, any>>
      columns={columns}
      request={(params) =>
        request("/v1/package", {
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

export default Package;
