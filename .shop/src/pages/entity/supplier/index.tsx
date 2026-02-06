import React, { useRef, useState } from "react";
import { ActionType, PageContainer, ProList } from "@ant-design/pro-components";
import { Button, Divider, message, Popconfirm, Tag } from "antd";
import Creator from "@/pages/entity/supplier/components/Creator";
import { PresetColors } from "antd/es/theme/interface/presetColors";
import request from "@/utils/request";
import {
  AppstoreTwoTone,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Viewer from "@/pages/entity/supplier/components/Viewer";
import OrderCreator from "@/pages/entity/supplier/components/OrderCreator";

const EntitySupplier: React.FC = () => {
  const holder = useRef<ActionType>();
  const [viewing, setViewing] = useState<Record<string, any>>();

  return (
    <PageContainer
      header={{
        title: "供应商",
      }}
      extra={[
        <Creator
          holder={holder}
          key="creator"
          trigger={<Button type="primary">添加供应商</Button>}
        />,
      ]}
    >
      <ProList<any>
        ghost
        actionRef={holder}
        itemCardProps={{
          bodyStyle: {
            padding: 6,
          },
        }}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 16,
        }}
        request={(params) =>
          request("/v1/supplier", {
            params,
          }).then((response) => response.data)
        }
        rowSelection={{}}
        grid={{ gutter: 16, column: 2 }}
        onItem={(record) => ({
          onClick: () => setViewing(record),
        })}
        metas={{
          title: {
            dataIndex: "name",
            render: (element) => <Button type="ghost">{element}</Button>,
          },
          subTitle: {
            render: (_, entity) =>
              entity.tag && (
                <Tag
                  color={
                    Array.from(PresetColors).sort(() => Math.random() - 0.5)[0]
                  }
                >
                  {entity.tag}
                </Tag>
              ),
          },
          type: {},
          avatar: {
            render: () => <Button type="ghost" icon={<AppstoreTwoTone />} />,
          },
          // content: {},
          actions: {
            render: (_, entity) => [
              <OrderCreator
                entity={entity}
                key="orderCreate"
                trigger={<Button type="dashed" icon={<PlusOutlined />} />}
              />,
              <Divider
                type="vertical"
                style={{
                  margin: 0,
                }}
              />,
              <Creator
                key="edit"
                holder={holder}
                entity={entity}
                trigger={<Button type="dashed" icon={<EditOutlined />} />}
              />,
              <Popconfirm
                key="delete"
                title="真的要删除这家供应商么"
                description="它真的会消失很久很久"
                onConfirm={() =>
                  request(`/v1/supplier/${entity.id}`, {
                    method: "DELETE",
                  }).then((response) => {
                    message.success("删除成功");
                    holder.current?.reload();
                  })
                }
              >
                <Button danger type="dashed" icon={<DeleteOutlined />} />
              </Popconfirm>,
            ],
          },
        }}
        // dataSource={data}
      />
      {/*    */}
      <Viewer
        entity={viewing}
        open={!!viewing}
        onCancel={() => setViewing(undefined)}
      />
    </PageContainer>
  );
};

export default EntitySupplier;
