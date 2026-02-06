import React from "react";
import type { ProCardProps } from "@ant-design/pro-components";
import { ProCard } from "@ant-design/pro-components";
import { Area } from "@ant-design/charts";

const ResourcePool: React.FC<ProCardProps> & {
  isProCard: boolean;
} = (props) => {
  const random = () => {
    const result = [];

    for (let i = 0; i < 64; i++) {
      result.push({
        x: i,
        y: 19 + Math.random() * 64,
        type: "default",
      });
    }

    return result;
  };

  const data = [
    {
      key: "physics",
      title: undefined,
      data: [
        {
          title: "成交订单量",
          count: 1174,
          unit: "单",
          metrics: random(),
          colSpan: {
            xs: 24,
            md: 6,
          },
        },
        {
          title: "交易额",
          count: 13.72,
          unit: "万元",
          metrics: random(),
          colSpan: {
            xs: 24,
            md: 6,
          },
        },
        {
          title: "净利润",
          count: 7.49,
          unit: "万元",
          metrics: random(),
          colSpan: {
            xs: 24,
            md: 6,
          },
        },
        {
          title: "客户留存率",
          count: 59.27,
          unit: "%",
          metrics: random(),
          colSpan: {
            xs: 24,
            md: 6,
          },
        },
      ],
    },
  ];

  return (
    <ProCard wrap ghost gutter={[12, 12]} direction="column" {...props}>
      {data.map((entity) => (
        <ProCard
          key={entity.key}
          title={entity.title}
          wrap
          ghost
          gutter={[12, 12]}
          direction="row"
        >
          {entity.data.map((entityGxw) => (
            <ProCard
              colSpan={entityGxw.colSpan}
              bodyStyle={{
                padding: "24px 0 0 0",
              }}
              bordered
              boxShadow
            >
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: 12,
                  color: "#5f708a",
                  height: 20,
                  lineHeight: "20px",
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    marginRight: 10,
                    color: "#242e42",
                    fontWeight: 700,
                  }}
                >
                  <strong
                    style={{
                      fontSize: 22,
                    }}
                  >
                    {entityGxw.count}
                  </strong>{" "}
                  {entityGxw.unit}
                </span>
                {entityGxw.title}
              </div>
              <Area
                yAxis={{
                  max: 100,
                  label: null,
                  grid: null,
                }}
                xAxis={false}
                smooth
                autoFit
                xField="x"
                yField="y"
                height={100}
                animation={{}}
                seriesField="type"
                legend={false}
                data={entityGxw.metrics}
                style={{
                  marginLeft: -2.5,
                  marginRight: -2.5,
                }}
                color={[
                  "#6897a7",
                  "#8bc0d6",
                  "#60d7a7",
                  "#dedede",
                  "#fedca9",
                  "#fab36f",
                  "#d96d6f",
                ].sort(() => Math.random() - 0.5)}
              />
            </ProCard>
          ))}
        </ProCard>
      ))}
    </ProCard>
  );
};

ResourcePool.isProCard = true;

export default ResourcePool;
