import React, { useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Switch, Button, Divider, message, Row, Col, Statistic, Space } from 'antd';
import { getAppConfig, updateAppConfig, getSystemStats } from '@/services/settings';
import type { AppConfig, SystemStats } from '@/models/settings';
import dayjs from 'dayjs';

const AdminSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState<SystemStats | null>(null);

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await getAppConfig();
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getSystemStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateAppConfig(values);
      message.success('配置已保存');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 系统统计信息 */}
      {stats && (
        <Card title="系统统计" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="总用户数" value={stats.totalUsers} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="活跃用户" value={stats.activeUsers} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="今日新用户" value={stats.newUsersToday} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="商品总数" value={stats.totalProducts} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="活跃商品" value={stats.activeProducts} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="订单总数" value={stats.totalOrders} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="待处理订单" value={stats.pendingOrders} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="总营收" value={`$${stats.totalRevenue.toFixed(2)}`} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="今日营收" value={`$${stats.revenueToday.toFixed(2)}`} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="最后更新"
                value={stats.lastUpdateTime ? dayjs(stats.lastUpdateTime).format('HH:mm') : '-'}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* 应用配置 */}
      <Card title="应用配置">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          autoComplete="off"
        >
          <Divider>基本信息</Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="应用名称" name="appName">
                <Input placeholder="应用名称" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="应用版本" name="appVersion">
                <Input placeholder="应用版本" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="应用描述" name="appDescription">
            <Input.TextArea placeholder="应用描述" rows={3} />
          </Form.Item>

          <Divider>联系方式</Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="客服邮箱" name="supportEmail">
                <Input type="email" placeholder="support@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="客服电话" name="supportPhone">
                <Input placeholder="+86-123-4567-8900" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>交易设置</Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="默认币种" name="defaultCurrency">
                <Select
                  placeholder="选择默认币种"
                  options={[
                    { label: '人民币 (CNY)', value: 'CNY' },
                    { label: '美元 (USD)', value: 'USD' },
                    { label: '欧元 (EUR)', value: 'EUR' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="满额免运费金额" name="freeshippingThreshold">
                <InputNumber placeholder="0" min={0} step={1} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="默认运费" name="shippingFee">
                <InputNumber placeholder="0" min={0} step={0.01} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="最大上传文件大小 (MB)" name="maxUploadSize">
                <InputNumber placeholder="10" min={1} step={1} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>功能开关</Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="启用用户注册" name="enableUserRegistration" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="启用卖家注册" name="enableSellerRegistration" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存配置
              </Button>
              <Button onClick={loadSettings}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default AdminSettings;
