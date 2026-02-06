import React, { useState } from "react";
import type { ProCardProps } from "@ant-design/pro-components";
import { ProCard } from "@ant-design/pro-components";
import { Area } from "@ant-design/charts";
import { useMount } from "ahooks";
import request from "@/utils/request";
import _ from "lodash";
import { DateTime } from "luxon";

const SaleStatistics: React.FC<ProCardProps> & {
  isProCard: boolean;
} = (props) => {
  const [data, setData] = useState<Record<string, any>[]>([]);

  useMount(() => {
    request(`/v1.1/order/-1/entry/96f07c6a-22b9-4f3f-8e08-943ec8b303c9`, {
      params: {
        peerType: 1,
      },
    })
      .then((response) => response.data)
      .then((body) => body.data)
      .then((orderEntries) =>
        _.groupBy(
          orderEntries,
          (element) => DateTime.fromISO(element.createdAt).day
        )
      )
      .then((groupedEntries) => {
        Object.keys(groupedEntries).forEach((day) => {
          setData((_data_) => [
            ..._data_,
            {
              x: day,
              type: "出库资源数量",
              y: groupedEntries[day].reduce(
                (previousValue, currentValue) =>
                  previousValue + currentValue.amount,
                0
              ),
            },
            {
              x: day,
              type: "总金额",
              y: groupedEntries[day].reduce(
                (previousValue, currentValue) =>
                  previousValue + currentValue.amount * currentValue.price,
                0
              ),
            },
          ]);
        });
      });
  });

  return (
    <ProCard headerBordered {...props}>
      <Area
        smooth
        autoFit
        xField="x"
        yField="y"
        animation={{}}
        seriesField="type"
        data={data}
      />
    </ProCard>
  );
};

SaleStatistics.isProCard = true;

export default SaleStatistics;
