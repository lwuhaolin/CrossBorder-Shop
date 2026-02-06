import React, { useRef, useState } from "react";
import { ActionType, PageContainer } from "@ant-design/pro-components";
import { Button, Divider } from "antd";
import {
  FallOutlined,
  FullscreenOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useFullscreen } from "ahooks";
import Flower from "@/pages/entity/flower/components/Flower";
import Cart from "@/pages/entity/flower/components/Cart";
import Creator from "@/pages/entity/flower/components/Creator";
import { Link } from "umi";

const EntityFlower: React.FC = () => {
  const holder = useRef<ActionType>();
  const container = useRef<HTMLDivElement>(null);
  const cutter = useFullscreen(container);
  const bag = useState<Record<string, any>[]>([]);

  return (
    <PageContainer
      header={{
        title: "鲜花",
      }}
      extra={[
        <Link key="redirector" to="/entity/flower/loss">
          <Button icon={<FallOutlined />}>损失管理</Button>
        </Link>,
        <Divider key="spliter" type="vertical" />,
        <Button
          key="change"
          icon={<FullscreenOutlined />}
          onClick={cutter[1].enterFullscreen}
        >
          销售模式
        </Button>,
        <Divider key="_spliter_" type="vertical" />,
        <Creator
          holder={holder}
          key="create"
          trigger={
            <Button type="primary" icon={<PlusOutlined />}>
              添加鲜花
            </Button>
          }
        />,
      ]}
    >
      <div ref={container}>
        <Flower holder={holder} cutter={cutter} bag={bag} />
        <Cart cutter={cutter} bag={bag} />
      </div>
    </PageContainer>
  );
};

export default EntityFlower;
