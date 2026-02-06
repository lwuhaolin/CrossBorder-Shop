import React, { useEffect, useState } from "react";
import request from "@/utils/request";
import { Progress, Skeleton, Tooltip } from "antd";

const XinInventory: React.FC<{
  resourceId: number;
  resourceType: number;
  noStyle?: boolean;
}> = (props) => {
  const [value, setValue] = useState<number[]>();

  useEffect(() => {
    Promise.all(
      [1, 0].map((peerType) =>
        request(`/v1.1/order/-1/entry/96f07c6a-22b9-4f3f-8e08-943ec8b303c9`, {
          params: {
            peerType,
            resourceId: props.resourceId,
            resourceType: props.resourceType,
          },
        }).then((response) => response.data)
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
      .then(setValue);
  }, [props.resourceId]);

  return value ? (
    <Tooltip title={`${value[1] - value[0]} / ${value[1]}`}>
      <Progress
        style={
          props.noStyle
            ? {}
            : {
                width: "50%",
                marginTop: -0.5,
                marginLeft: 6.04,
                marginInlineEnd: 0,
                marginBottom: 0,
              }
        }
        percent={Number(((value[1] - value[0]) / value[1]).toFixed(2)) * 100}
        showInfo={!!props.noStyle}
      />
    </Tooltip>
  ) : (
    <Skeleton.Button active size="small" />
  );
};

export default XinInventory;
