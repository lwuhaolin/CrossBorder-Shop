import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
// @ts-ignore
import { useParams } from "react-router";
import { useMount } from "ahooks";
import request from "@/utils/request";
import { Empty } from "antd";

const EntitySupplier: React.FC = () => {
  const parameters = useParams();
  const [flower, setFlower] = useState<Record<string, any>>();

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

  useMount(() => {
    request(`/v1/flower/${parameters.identifier}`)
      .then((response) => response.data)
      .then(setFlower);
  });

  return (
    <PageContainer
      header={{
        title: `鲜花详情 | ${flower?.name}`,
      }}
      tabList={[
        {
          key: "history",
          tab: "进销记录",
          children: (
            <ProTable
              search={false}
              options={{
                search: true,
              }}
              columns={columns}
              request={(params) =>
                request(
                  `/v1.1/order/-1/entry/96f07c6a-22b9-4f3f-8e08-943ec8b303c9`,
                  {
                    params: {
                      ...params,
                      resourceType: 0,
                      resourceId: flower?.id,
                    },
                  }
                ).then((response) => response.data)
              }
            />
          ),
        },
        {
          tab: "分析",
          key: "analyse",
          children: (
            <ProCard>
              <Empty
                style={{
                  margin: "8.19% 0",
                }}
              />
            </ProCard>
          ),
        },
      ]}
      loading={!flower}
    />
  );
};

export default EntitySupplier;
