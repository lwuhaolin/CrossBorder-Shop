import React from "react";
import { Typography, Card, Steps, Timeline } from "antd";
import {
  RollbackOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const { Title, Paragraph } = Typography;
const { Step } = Steps;

const Returns: React.FC = () => {
  const { t } = useTranslation();

  const returnSteps = [
    {
      title: "提交申请",
      description: "在订单详情页面提交退货申请",
    },
    {
      title: "等待审核",
      description: "客服会在1个工作日内审核您的申请",
    },
    {
      title: "寄回商品",
      description: "审核通过后，按照指引寄回商品",
    },
    {
      title: "质检验收",
      description: "我们会检查商品是否符合退货条件",
    },
    {
      title: "退款完成",
      description: "验收通过后，3-5个工作日内退款",
    },
  ];

  return (
    <div className={styles.returns}>
      <div className={styles.banner}>
        <RollbackOutlined className={styles.bannerIcon} />
        <Title level={1} className={styles.bannerTitle}>
          退货政策
        </Title>
        <Paragraph className={styles.bannerDesc}>
          7天无理由退货，让您购物无忧
        </Paragraph>
      </div>

      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2} className={styles.sectionTitle}>
            退货流程
          </Title>
          <Steps current={-1} className={styles.steps}>
            {returnSteps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
              />
            ))}
          </Steps>
        </Card>

        <Card className={styles.card}>
          <Title level={2} className={styles.sectionTitle}>
            退货政策
          </Title>
          <div className={styles.content}>
            <Title level={4}>
              <SafetyOutlined /> 退货条件
            </Title>
            <ul>
              <li>商品收到后7天内可申请退货</li>
              <li>商品未使用，保持原包装完整</li>
              <li>商品标签、吊牌完好无损</li>
              <li>附件、赠品等需一并退回</li>
              <li>非质量问题退货需由买家承担运费</li>
            </ul>

            <Title level={4}>
              <ClockCircleOutlined /> 退款时效
            </Title>
            <Paragraph>
              我们收到退货商品并验收通过后，会在3-5个工作日内为您办理退款。
              退款将原路返回至您的支付账户，具体到账时间取决于支付渠道。
            </Paragraph>

            <Title level={4}>不支持退货的情况</Title>
            <ul>
              <li>超过7天退货期限</li>
              <li>商品已使用或损坏</li>
              <li>商品包装不完整</li>
              <li>定制类商品</li>
              <li>特价促销商品（除质量问题外）</li>
              <li>已开封的个人护理用品</li>
            </ul>

            <Title level={4}>特殊说明</Title>
            <Paragraph>
              • 如因质量问题退货，运费由我们承担，您可以选择上门取件服务
              <br />
              • 如需换货，建议您先退货后重新下单，以确保库存充足
              <br />
              • 退货过程中如有任何问题，请随时联系客服
              <br />• 请妥善保管退货物流单号，以便查询退货进度
            </Paragraph>
          </div>
        </Card>

        <Card className={styles.card}>
          <Title level={2} className={styles.sectionTitle}>
            常见问题
          </Title>
          <div className={styles.content}>
            <Title level={4}>Q: 退货运费由谁承担？</Title>
            <Paragraph>
              A:
              如果是质量问题或发错商品，运费由我们承担；如果是个人原因（不喜欢、买错等），运费由买家承担。
            </Paragraph>

            <Title level={4}>Q: 退款什么时候到账？</Title>
            <Paragraph>
              A:
              我们收到退货商品并验收通过后，会在3-5个工作日内退款。具体到账时间取决于支付渠道，
              一般信用卡7-15个工作日，支付宝/微信支付1-3个工作日。
            </Paragraph>

            <Title level={4}>Q: 可以只退部分商品吗？</Title>
            <Paragraph>
              A:
              可以的。您可以选择只退货部分商品，退款金额将根据实际退货商品计算。
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Returns;
