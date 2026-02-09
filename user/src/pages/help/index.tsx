import React from "react";
import { Typography, Collapse, Card, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpCenter: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: "如何下单购买商品？",
      answer:
        '浏览商品后，点击"加入购物车"按钮，然后进入购物车页面，选择您需要的商品数量，点击"去结算"完成订单。',
    },
    {
      question: "支持哪些支付方式？",
      answer:
        "我们支持多种支付方式，包括信用卡、借记卡、支付宝、微信支付等。所有支付信息均经过加密处理，确保您的资金安全。",
    },
    {
      question: "订单多久能送达？",
      answer:
        "一般情况下，订单会在1-3个工作日内发货，配送时间根据您的地址而定，通常为3-7个工作日。您可以在订单详情中查看物流信息。",
    },
    {
      question: "如何查看订单状态？",
      answer:
        '登录您的账户后，进入"我的订单"页面，可以查看所有订单的状态、物流信息等详细内容。',
    },
    {
      question: "商品有质量问题怎么办？",
      answer:
        "如果收到的商品有质量问题，请在收货后7天内联系我们的客服，我们会为您提供退换货服务。",
    },
    {
      question: "可以修改或取消订单吗？",
      answer:
        "订单提交后，如果还未发货，您可以在订单详情页面取消订单。如果订单已发货，则无法取消，但您可以在收货后申请退货。",
    },
    {
      question: "如何联系客服？",
      answer:
        "您可以通过以下方式联系我们：\n1. 客服邮箱：support@crossbordershop.com\n2. 客服电话：+86-123-4567-8900\n3. 在线客服：工作日9:00-18:00",
    },
    {
      question: "忘记密码怎么办？",
      answer:
        '在登录页面点击"忘记密码"，输入您的注册邮箱，我们会发送重置密码的链接到您的邮箱。',
    },
  ];

  return (
    <div className={styles.helpCenter}>
      <div className={styles.banner}>
        <QuestionCircleOutlined className={styles.bannerIcon} />
        <Title level={1} className={styles.bannerTitle}>
          帮助中心
        </Title>
        <Paragraph className={styles.bannerDesc}>
          常见问题解答，帮助您更好地使用我们的服务
        </Paragraph>
      </div>

      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2} className={styles.sectionTitle}>
            常见问题
          </Title>
          <Collapse accordion bordered={false} className={styles.collapse}>
            {faqs.map((faq, index) => (
              <Panel header={faq.question} key={index} className={styles.panel}>
                <Paragraph className={styles.answer}>{faq.answer}</Paragraph>
              </Panel>
            ))}
          </Collapse>
        </Card>

        <Card className={styles.card}>
          <Title level={2} className={styles.sectionTitle}>
            需要更多帮助？
          </Title>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={4}>联系客服</Title>
              <Paragraph>
                如果您没有找到问题的答案，欢迎联系我们的客服团队：
              </Paragraph>
              <ul>
                <li>客服邮箱：support@crossbordershop.com</li>
                <li>客服电话：+86-123-4567-8900</li>
                <li>工作时间：周一至周五 9:00-18:00</li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
