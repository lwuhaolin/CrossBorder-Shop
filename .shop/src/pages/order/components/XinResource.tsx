import React, { useEffect, useState } from "react";
import request from "@/utils/request";
import { Spin } from "antd";

const XinResource: React.FC<{
  resourceId: number;
  resourceType: number;
}> = (props) => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    request(
      `/v1/${["flower", "package"][props.resourceType]}/${props.resourceId}`
    )
      .then((response) => response.data)
      .then((body) => setValue(body.name));
  }, [props.resourceId && props.resourceType]);

  return <Spin spinning={!value}>{value}</Spin>;
};

export default XinResource;
