import React from "react";
import { Typography, Card, Row, Col, Form, Input, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Contact form submitted:", values);
    // 这里暂时不发送网络请求
    form.resetFields();
  };

  return (
    <div className={styles.contact}>
      <div className={styles.banner}>
        <CustomerServiceOutlined className={styles.bannerIcon} />
        <Title level={1} className={styles.bannerTitle}>
          联系我们
        </Title>
        <Paragraph className={styles.bannerDesc}>
          我们随时为您提供帮助和支持
        </Paragraph>
      </div>

      <div className={styles.container}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card className={styles.infoCard}>
              <Title level={2} className={styles.sectionTitle}>
                联系方式
              </Title>

              <div className={styles.contactItem}>
                <MailOutlined className={styles.contactIcon} />
                <div>
                  <Title level={4}>电子邮箱</Title>
                  <Paragraph>support@crossbordershop.com</Paragraph>
                  <Paragraph className={styles.note}>
                    我们会在24小时内回复您的邮件
                  </Paragraph>
                </div>
              </div>

              <div className={styles.contactItem}>
                <PhoneOutlined className={styles.contactIcon} />
                <div>
                  <Title level={4}>客服电话</Title>
                  <Paragraph>+86-123-4567-8900</Paragraph>
                  <Paragraph className={styles.note}>
                    服务时间：周一至周五 9:00-18:00
                  </Paragraph>
                </div>
              </div>

              <div className={styles.contactItem}>
                <EnvironmentOutlined className={styles.contactIcon} />
                <div>
                  <Title level={4}>公司地址</Title>
                  <Paragraph>中国上海市浦东新区世纪大道1000号</Paragraph>
                  <Paragraph className={styles.note}>欢迎预约到访</Paragraph>
                </div>
              </div>

              <div className={styles.contactItem}>
                <ClockCircleOutlined className={styles.contactIcon} />
                <div>
                  <Title level={4}>工作时间</Title>
                  <Paragraph>周一至周五：9:00 - 18:00</Paragraph>
                  <Paragraph>周六至周日：10:00 - 17:00</Paragraph>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card className={styles.formCard}>
              <Title level={2} className={styles.sectionTitle}>
                发送消息
              </Title>
              <Paragraph className={styles.formDesc}>
                有任何问题或建议？请填写表单，我们会尽快回复您。
              </Paragraph>

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[{ required: true, message: "请输入您的姓名" }]}
                >
                  <Input placeholder="请输入您的姓名" size="large" />
                </Form.Item>

                <Form.Item
                  label="电子邮箱"
                  name="email"
                  rules={[
                    { required: true, message: "请输入您的邮箱" },
                    { type: "email", message: "请输入有效的邮箱地址" },
                  ]}
                >
                  <Input placeholder="your@email.com" size="large" />
                </Form.Item>

                <Form.Item
                  label="主题"
                  name="subject"
                  rules={[{ required: true, message: "请输入主题" }]}
                >
                  <Input placeholder="请简要描述您的问题" size="large" />
                </Form.Item>

                <Form.Item
                  label="消息内容"
                  name="message"
                  rules={[{ required: true, message: "请输入消息内容" }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="请详细描述您的问题或建议..."
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block>
                    发送消息
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Contact;
