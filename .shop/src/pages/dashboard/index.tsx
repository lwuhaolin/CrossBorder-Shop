import React from "react";
import { ProCard, StatisticCard } from "@ant-design/pro-components";
import { ShoppingOutlined, ShoppingCartOutlined, UserOutlined, DollarOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import RcResizeObserver from "rc-resize-observer";

const { Statistic } = StatisticCard;

const Dashboard: React.FC = () => {
  const [responsive, setResponsive] = React.useState(false);

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title="数据概览"
        extra="今日实时数据"
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <StatisticCard
              statistic={{
                title: '商品总数',
                value: 1234,
                icon: (
                  <ShoppingOutlined
                    style={{
                      color: '#1890ff',
                      fontSize: '32px',
                    }}
                  />
                ),
              }}
            />
          </ProCard>
          <ProCard split="vertical">
            <StatisticCard
              statistic={{
                title: '在售商品',
                value: 1156,
                status: 'success',
              }}
            />
            <StatisticCard
              statistic={{
                title: '已下架',
                value: 78,
                status: 'default',
              }}
            />
          </ProCard>
        </ProCard>
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <StatisticCard
              statistic={{
                title: '订单总数',
                value: 5678,
                icon: (
                  <ShoppingCartOutlined
                    style={{
                      color: '#52c41a',
                      fontSize: '32px',
                    }}
                  />
                ),
              }}
            />
          </ProCard>
          <ProCard split="vertical">
            <StatisticCard
              statistic={{
                title: '待发货',
                value: 234,
                status: 'processing',
              }}
            />
            <StatisticCard
              statistic={{
                title: '已完成',
                value: 5234,
                status: 'success',
              }}
            />
          </ProCard>
        </ProCard>
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <StatisticCard
              statistic={{
                title: '用户总数',
                value: 8901,
                icon: (
                  <UserOutlined
                    style={{
                      color: '#722ed1',
                      fontSize: '32px',
                    }}
                  />
                ),
              }}
            />
          </ProCard>
          <ProCard split="vertical">
            <StatisticCard
              statistic={{
                title: '今日新增',
                value: 34,
                status: 'default',
              }}
            />
            <StatisticCard
              statistic={{
                title: '活跃用户',
                value: 2341,
                status: 'processing',
              }}
            />
          </ProCard>
        </ProCard>
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <StatisticCard
              statistic={{
                title: '销售额（元）',
                value: 1234567,
                precision: 2,
                icon: (
                  <DollarOutlined
                    style={{
                      color: '#fa8c16',
                      fontSize: '32px',
                    }}
                  />
                ),
              }}
            />
          </ProCard>
          <ProCard split="vertical">
            <StatisticCard
              statistic={{
                title: '今日销售',
                value: 12345,
                precision: 2,
                status: 'default',
              }}
            />
            <StatisticCard
              statistic={{
                title: '本月销售',
                value: 234567,
                precision: 2,
                status: 'success',
              }}
            />
          </ProCard>
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
};

export default Dashboard;
