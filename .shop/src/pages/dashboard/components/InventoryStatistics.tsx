import React, { useState } from "react";
import type { ProCardProps } from "@ant-design/pro-components";
import { ProList } from "@ant-design/pro-components";
import { useMount } from "ahooks";
import request from "@/utils/request";
import { StarTwoTone } from "@ant-design/icons";
import { Progress, Tag, Tooltip } from "antd";

const InventoryStatistics: React.FC<ProCardProps> & {
  isProCard: boolean;
} = (props) => {
  const [data, setData] = useState<Record<string, any>[]>([]);

  useMount(() => {
    setData(() => []);

    [0, 1].forEach((resourceType) =>
      request(`/v1/${["flower", "package"][resourceType]}`, {
        params: {
          current: 1,
          pageSize: 1024,
        },
      })
        .then((response) => response.data)
        .then((body) => body.data)
        .then((resources: Record<string, any>[]) => {
          resources.forEach((resource) => {
            Promise.all(
              [0, 1].map((peerType) =>
                request(
                  `/v1.1/order/-1/entry/96f07c6a-22b9-4f3f-8e08-943ec8b303c9`,
                  {
                    params: {
                      peerType,
                      resourceType,
                      resourceId: resource.id,
                    },
                  }
                ).then((response) => response.data)
              )
            )
              .then((body) => body.map((element) => element.data))
              .then((body) =>
                body.map((element: any[]) =>
                  element.reduce(
                    (previousValue, currentValue) =>
                      previousValue + currentValue.amount,
                    0
                  )
                )
              )
              .then((result) => {
                if ((result[0] - result[1]) / result[0] < 0.2) {
                  setData((_data_) => [
                    ..._data_,
                    {
                      result,
                      resourceType,
                      ...resource,
                    },
                  ]);
                }
              });
          });
        })
    );
  });

  return (
    <ProList
      metas={{
        title: {
          dataIndex: "name",
        },
        subTitle: {
          render: (_, entity) => [
            <Tag
              key="resourceType"
              color={["lime", "aqua"][entity.resourceType]}
            >
              {["鲜花", "包装材料"][entity.resourceType]}
            </Tag>,
            entity.result[0] - entity.result[1] > 0 ? (
              <Tag key="message" color="warning">
                库存量低于阈值 20%
              </Tag>
            ) : (
              <Tag key="message" color="error">
                库存已完全耗尽
              </Tag>
            ),
          ],
        },
        avatar: {
          render: () => <StarTwoTone />,
        },
        content: {
          render: (_, entity) => (
            <Tooltip
              title={`${entity.result[0] - entity.result[1]} / ${
                entity.result[0]
              }`}
            >
              <Progress
                percent={
                  Number(
                    (
                      (entity.result[0] - entity.result[1]) /
                      entity.result[0]
                    ).toFixed(2)
                  ) * 100
                }
              />
            </Tooltip>
          ),
        },
      }}
      rowKey="id"
      pagination={{
        pageSize: 6,
      }}
      dataSource={data}
      cardProps={{
        ...props,
        headerBordered: true,
        bodyStyle: {
          paddingTop: 12,
        },
      }}
    />
  );
};

InventoryStatistics.isProCard = true;

export default InventoryStatistics;
