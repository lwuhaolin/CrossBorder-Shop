import React, { useState } from "react";
import type { ProCardProps } from "@ant-design/pro-components";
import { ProCard } from "@ant-design/pro-components";
import { Area } from "@ant-design/charts";
import { useMount } from "ahooks";
import request from "@/utils/request";
import _ from "lodash";
import { DateTime } from "luxon";

const LossStatistics: React.FC<ProCardProps> & {
  isProCard: boolean;
} = (props) => {
  const [data, setData] = useState<Record<string, any>[]>([]);

  useMount(() => {
    setData(() => []);

    request(`/v1/loss`, {
      params: {
        current: 1,
        pageSize: 1024,
      },
    })
      .then((response) => response.data)
      .then((body) => body.data)
      .then((losses) =>
        _.groupBy(losses, (element) => DateTime.fromISO(element.createdAt).day)
      )
      .then((groupedLosses) =>
        Object.keys(groupedLosses).forEach((day) =>
          setData((_data_) => [
            ...data,
            {
              x: day,
              type: "自然枯萎",
              y: groupedLosses[day]
                .filter((loss) => loss.reason === 0)
                .reduce(
                  (previousValue, currentValue) =>
                    previousValue + currentValue.amount,
                  0
                ),
            },
            {
              x: day,
              type: "人为损坏",
              y: groupedLosses[day]
                .filter((loss) => loss.reason === 1)
                .reduce(
                  (previousValue, currentValue) =>
                    previousValue + currentValue.amount,
                  0
                ),
            },
            {
              x: day,
              type: "预估亏损金额",
              y: groupedLosses[day].reduce(
                (previousValue, currentValue) =>
                  previousValue + currentValue.price,
                0
              ),
            },
          ])
        )
      );
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

LossStatistics.isProCard = true;

export default LossStatistics;
