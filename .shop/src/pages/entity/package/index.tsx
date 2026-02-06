import React, { useRef } from "react";
import { ActionType, PageContainer } from "@ant-design/pro-components";
import { Button } from "antd";
import Creator from "@/pages/entity/package/components/Creator";
import Package from "@/pages/entity/package/components/Package";

const EntityPackage: React.FC = (props) => {
  const holder = useRef<ActionType>();

  return (
    <PageContainer
      header={{
        title: "包装材料",
      }}
      extra={[
        <Creator
          holder={holder}
          key="creator"
          trigger={<Button type="primary">添加包装材料</Button>}
        />,
      ]}
    >
      <Package actionRef={holder} />
    </PageContainer>
  );
};

export default EntityPackage;
