import React, { useEffect, useState } from "react";
import request from "@/utils/request";
import { Skeleton, Typography } from "antd";

const XinSold: React.FC<{
  resourceId: number;
  resourceType: number;
  filter?: (elements: Record<string, any>[]) => Record<string, any>[];
}> = (props) => {
  const [value, setValue] = useState<number[]>();

  useEffect(() => {
    request(`/v1.1/order/-1/entry/96f07c6a-22b9-4f3f-8e08-943ec8b303c9`, {
      params: {
        peerType: 1,
        resourceId: props.resourceId,
        resourceType: props.resourceType,
      },
    })
      .then((response) => response.data)
      .then((response) => response.data)
      .then((elements) => props.filter?.(elements) || elements)
      .then((elements) =>
        setValue(
          elements.reduce(
            (previousValue: number, currentValue: Record<string, any>) =>
              previousValue + currentValue.amount,
            0
          )
        )
      );
  }, [props.resourceId]);

  return value === undefined ? (
    <Skeleton.Button active size="small" />
  ) : (
    <Typography>
      <Typography.Text>{value} </Typography.Text>
      <Typography.Text type="secondary">束</Typography.Text>
    </Typography>
  );
};

export default XinSold;
