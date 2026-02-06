import React from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Image } from "antd";
import ResourcePool from "@/pages/dashboard/components/ResourcePool";
import SaleStatistics from "@/pages/dashboard/components/SaleStatistics";
import SimpleSide from "@/pages/dashboard/components/SimpleSide";
import LossStatistics from "@/pages/dashboard/components/LossStatistics";
import InventoryStatistics from "@/pages/dashboard/components/InventoryStatistics";

const Dashboard: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: "仪表盘",
      }}
    >
      <ProCard ghost gutter={[24, 24]} direction="column">
        <ProCard ghost>
          <Image
            preview={false}
            src="//res.hc-cdn.com/tiny-pro-vue/1.0.82.20230310160618/vue-pro/pages/assets/woker.58473cfe.png"
          />
        </ProCard>
        {/* (学习规划 && 学习辅导) && 生活小助手 */}
        <ProCard ghost gutter={[6, 6]}>
          <ProCard ghost direction="column" gutter={[24, 24]} colSpan={19}>
            <ResourcePool title="自定义统计卡片 A" />
            <InventoryStatistics title="库存预警 B" />
          </ProCard>
          <SimpleSide title="自定义统计卡片 C" headerBordered colSpan={5} />
        </ProCard>
        {/* (学习转正 && 学习实践) && 新员工之家 */}
        <ProCard ghost gutter={[6, 6]}>
          <ProCard ghost direction="column" gutter={[24, 24]} colSpan={19}>
            <SaleStatistics title="销售统计 D" />
            <ResourcePool title="自定义统计卡片 E" />
          </ProCard>
          <SimpleSide title="自定义统计卡片 F" headerBordered colSpan={5} />
        </ProCard>
        {/* 学习集训 && 操作指导 */}
        <ProCard ghost gutter={[6, 6]}>
          <ProCard ghost colSpan={19}>
            <LossStatistics title="损坏统计 G" />
          </ProCard>
          <SimpleSide
            title="自定义统计卡片 H"
            headerBordered
            colSpan={5}
            at={3}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Dashboard;
