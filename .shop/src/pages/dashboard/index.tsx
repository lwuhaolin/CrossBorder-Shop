import React, { useEffect, useState } from "react";
import { ProCard, StatisticCard } from "@ant-design/pro-components";
import { ShoppingOutlined, ShoppingCartOutlined, UserOutlined, DollarOutlined, RiseOutlined } from "@ant-design/icons";
import { Spin, message, Row, Col, Card, Statistic } from "antd";
import RcResizeObserver from "rc-resize-observer";
import { Pie, Column } from "@ant-design/charts";
import { getSystemStats, getSellerStats } from "@/services/settings";
import { getUserInfo } from "@/utils/request";
import type { SystemStats, SellerStats } from "@/models/settings";

const Dashboard: React.FC = () => {
  const [responsive, setResponsive] = React.useState(false);
  const [adminStats, setAdminStats] = useState<SystemStats | null>(null);
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getUserInfo();
  const roleCodes = (user?.roles || []).map((role: any) => role.roleCode);
  const isAdmin = roleCodes.includes("ADMIN");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      if (isAdmin) {
        const response = await getSystemStats();
        setAdminStats(response.data ?? null);
      } else {
        const response = await getSellerStats();
        setSellerStats(response.data ?? null);
      }
    } catch (error) {
      console.error("Failed to load statistics:", error);
      message.error("加载统计数据失败");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const stats = isAdmin ? adminStats : sellerStats;

  // 计算百分比数据
  const getProductPercent = () => {
    if (!stats || stats.totalProducts === 0) return 0;
    return Math.round(((stats.activeProducts || 0) / stats.totalProducts) * 100);
  };

  const getOrderPercent = () => {
    if (!stats || stats.totalOrders === 0) return 0;
    const completed = (stats.totalOrders || 0) - (stats.pendingOrders || 0);
    return Math.round((completed / stats.totalOrders) * 100);
  };

  const getRevenueTrendPercent = () => {
    if (!stats || !stats.totalRevenue || stats.totalRevenue === 0) return 0;
    const todayRevenue = parseFloat((stats.revenueToday || 0).toString());
    const totalRevenue = parseFloat(stats.totalRevenue.toString());
    return Math.round((todayRevenue / totalRevenue) * 100);
  };

  // 商品分布数据
  const productData = [
    { type: '在售商品', value: stats?.activeProducts || 0 },
    { type: '已下架商品', value: (stats?.totalProducts || 0) - (stats?.activeProducts || 0) },
  ];

  // 订单分布数据
  const orderData = [
    { type: '已完成', value: (stats?.totalOrders || 0) - (stats?.pendingOrders || 0) },
    { type: '待处理', value: stats?.pendingOrders || 0 },
  ];

  // 商品活跃度饼图配置
  const productPieConfig = {
    data: productData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      content: '{percentage}',
    },
    statistic: {
      title: {
        offsetY: 8,
        content: '商品活跃度',
        style: {
          fontSize: '14px',
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '22px',
        },
        formatter: () => {
          const percent = getProductPercent();
          return `${percent}%`;
        },
      },
    },
  };

  // 订单完成率饼图配置
  const orderPieConfig = {
    data: orderData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      content: '{percentage}',
    },
    statistic: {
      title: {
        offsetY: 8,
        content: '订单完成率',
        style: {
          fontSize: '14px',
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '22px',
        },
        formatter: () => {
          const percent = getOrderPercent();
          return `${percent}%`;
        },
      },
    },
  };

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <div style={{ background: '#f5f5f5', padding: '20px' }}>
        {/* 顶部数据卡片 */}
        <ProCard
          title={isAdmin ? "系统数据概览" : "我的经营数据"}
          extra="实时数据"
          headerBordered
          style={{ marginBottom: '20px' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                statistic={{
                  title: '商品总数',
                  value: stats?.totalProducts || 0,
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
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                statistic={{
                  title: '在售商品',
                  value: stats?.activeProducts || 0,
                  status: 'success',
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                statistic={{
                  title: '订单总数',
                  value: stats?.totalOrders || 0,
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
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                statistic={{
                  title: '销售额',
                  value: stats?.totalRevenue ? parseFloat(stats.totalRevenue.toString()) : 0,
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
            </Col>
          </Row>

          {isAdmin && (
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col xs={24} sm={12} md={6}>
                <StatisticCard
                  statistic={{
                    title: '用户总数',
                    value: (adminStats?.totalUsers || 0),
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
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatisticCard
                  statistic={{
                    title: '活跃用户',
                    value: (adminStats?.activeUsers || 0),
                    status: 'processing',
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatisticCard
                  statistic={{
                    title: '今日新增',
                    value: (adminStats?.newUsersToday || 0),
                    status: 'default',
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatisticCard
                  statistic={{
                    title: '今日销售',
                    value: stats?.revenueToday ? parseFloat(stats.revenueToday.toString()) : 0,
                    precision: 2,
                    status: 'default',
                  }}
                />
              </Col>
            </Row>
          )}

          {!isAdmin && (
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col xs={24} sm={12} md={6}>
                <StatisticCard
                  statistic={{
                    title: '销售总数',
                    value: (sellerStats?.totalSales || 0),
                    icon: (
                      <RiseOutlined
                        style={{
                          color: '#faad14',
                          fontSize: '32px',
                        }}
                      />
                    ),
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatisticCard
                  statistic={{
                    title: '今日销售',
                    value: stats?.revenueToday ? parseFloat(stats.revenueToday.toString()) : 0,
                    precision: 2,
                    status: 'default',
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatisticCard
                  statistic={{
                    title: '本月销售',
                    value: sellerStats?.revenueThisMonth ? parseFloat(sellerStats.revenueThisMonth.toString()) : 0,
                    precision: 2,
                    status: 'success',
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatisticCard
                  statistic={{
                    title: '待发货',
                    value: stats?.pendingOrders || 0,
                    status: 'processing',
                  }}
                />
              </Col>
            </Row>
          )}
        </ProCard>

        {/* 数据分析区域 - 饼图 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          {/* 商品活跃度饼图 */}
          <Col xs={24} sm={12} md={8}>
            <Card title="商品分布" bordered style={{ height: '100%' }}>
              <Pie {...productPieConfig} />
            </Card>
          </Col>

          {/* 订单完成率饼图 */}
          <Col xs={24} sm={12} md={8}>
            <Card title="订单分布" bordered style={{ height: '100%' }}>
              <Pie {...orderPieConfig} />
            </Card>
          </Col>

          {/* 收入概览 */}
          <Col xs={24} sm={12} md={8}>
            <Card title="收入概览" bordered style={{ height: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Statistic
                    title="总销售额"
                    value={stats?.totalRevenue ? parseFloat(stats.totalRevenue.toString()) : 0}
                    precision={2}
                    prefix="¥"
                    valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                  />
                </Col>
                <Col xs={24}>
                  <Statistic
                    title="今日销售"
                    value={stats?.revenueToday ? parseFloat(stats.revenueToday.toString()) : 0}
                    precision={2}
                    prefix="¥"
                    valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* 柱状图展示 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          {/* 商品统计柱状图 */}
          <Col xs={24} lg={12}>
            <Card title="商品统计" bordered>
              <Column
                data={[
                  { category: '商品总数', value: stats?.totalProducts || 0 },
                  { category: '在售商品', value: stats?.activeProducts || 0 },
                  { category: '已下架', value: (stats?.totalProducts || 0) - (stats?.activeProducts || 0) },
                ]}
                xField="category"
                yField="value"
                seriesField="category"
                color={['#1890ff', '#52c41a', '#ff4d4f']}
                label={{
                  position: 'top' as const,
                  style: {
                    fill: '#000000aa',
                  },
                }}
              />
            </Card>
          </Col>

          {/* 订单统计柱状图 */}
          <Col xs={24} lg={12}>
            <Card title="订单统计" bordered>
              <Column
                data={[
                  { category: '订单总数', value: stats?.totalOrders || 0 },
                  { category: '已完成', value: (stats?.totalOrders || 0) - (stats?.pendingOrders || 0) },
                  { category: '待处理', value: stats?.pendingOrders || 0 },
                ]}
                xField="category"
                yField="value"
                seriesField="category"
                color={['#1890ff', '#52c41a', '#faad14']}
                label={{
                  position: 'top' as const,
                  style: {
                    fill: '#000000aa',
                  },
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* 详细统计信息 */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="详细统计" bordered>
              <Row gutter={[32, 32]}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="商品在售比例"
                    value={getProductPercent()}
                    suffix="%"
                    valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="订单完成比例"
                    value={getOrderPercent()}
                    suffix="%"
                    valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="今日销售占比"
                    value={getRevenueTrendPercent()}
                    suffix="%"
                    valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                  />
                </Col>
                {sellerStats && (
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="销售总数"
                      value={sellerStats.totalSales || 0}
                      valueStyle={{ color: '#722ed1', fontSize: '20px' }}
                    />
                  </Col>
                )}
                {adminStats && (
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="用户总数"
                      value={adminStats.totalUsers || 0}
                      valueStyle={{ color: '#722ed1', fontSize: '20px' }}
                    />
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </RcResizeObserver>
  );
};

export default Dashboard;
