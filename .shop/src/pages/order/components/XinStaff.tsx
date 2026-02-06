import React, { useEffect, useState } from "react";
import request from "@/utils/request";
import { Spin } from "antd";

const XinStaff: React.FC<{
  staffId: number;
}> = (props) => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    request(`/v1/staff/${props.staffId}`)
      .then((response) => response.data)
      .then((body) => setValue(body.name));
  }, [props.staffId]);

  return <Spin spinning={!value}>{value}</Spin>;
};

export default XinStaff;
