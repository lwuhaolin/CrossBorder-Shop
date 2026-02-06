import React, { useEffect, useState } from "react";
import request from "@/utils/request";
import { Spin } from "antd";

const XinPeer: React.FC<{
  peerId: number;
  peerType: number;
}> = (props) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    request(`/v1/${["supplier", "customer"][props.peerType]}/${props.peerId}`)
      .then((response) => response.data)
      .then((body) => setValue(body.name));
  }, [props.peerId && props.peerType]);

  return <Spin spinning={!value}>{value}</Spin>;
};

export default XinPeer;
