import React, { useEffect, useState } from "react";
import request from "@/utils/request";
import { Spin } from "antd";

const XinPrice: React.FC<{
  orderId: number;
}> = (props) => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    request(`/v1/order/${props.orderId}/entry`, {
      params: {
        current: 1,
        pageSize: 1024,
      },
    })
      .then((response) => response.data)
      .then((body) =>
        setValue(
          body.data.reduce(
            (previousValue: number, currentValue: Record<string, any>) => {
              return previousValue + currentValue.price * currentValue.amount;
            },
            0
          )
        )
      );
  }, [props.orderId]);

  return <Spin spinning={!value}>{value}</Spin>;
};

export default XinPrice;
