import React from "react";
import type { ProCardProps } from "@ant-design/pro-components";
import { CheckCard, ProCard } from "@ant-design/pro-components";
import CountUp from "react-countup";

const SimpleSide: React.FC<
  ProCardProps & {
    at?: number;
  }
> & {
  isProCard: boolean;
} = (props) => {
  return (
    <ProCard headerBordered {...props}>
      <CheckCard.Group
        size="small"
        options={[
          {
            description: "总成交金额",
            title: <CountUp end={11354} separator="," />,
            value: "B",
          },
          {
            title: <CountUp end={128371} separator="," />,
            description: "访客数量",
            value: "A",
          },
          {
            description: "总成交订单数",
            title: <CountUp end={7745} separator="," />,
            value: "C",
          },
          {
            description: "浏览量",
            title: <CountUp end={4578925928} separator="," />,
            value: "D",
          },
        ].splice(props.at || 0)}
      />
    </ProCard>
  );
};

SimpleSide.isProCard = true;

export default SimpleSide;
