import React from "react";
import { Typography, Card, Row, Col, Timeline } from "antd";
import {
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
  HeartOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  const { t } = useTranslation();

  const milestones = [
    {
      year: "2020",
      title: "公司成立",
      description: "CrossBorder Shop在上海正式成立，开始跨境电商之旅",
    },
    {
      year: "2021",
      title: "业务扩展",
      description: "服务范围扩展至亚洲10个国家和地区",
    },
    {
      year: "2022",
      title: "用户突破",
      description: "注册用户突破100万，月销售额破千万",
    },
    {
      year: "2023",
      title: "全球化",
      description: "业务覆盖全球50多个国家和地区",
    },
    {
      year: "2024",
      title: "技术创新",
      description: "推出AI智能推荐系统，提升用户体验",
    },
    {
      year: "2025",
      title: "行业领先",
      description: "成为跨境电商行业的领军企业",
    },
  ];

  return (
    <div className={styles.about}>
      <div className={styles.banner}>
        <RocketOutlined className={styles.bannerIcon} />
        <Title level={1} className={styles.bannerTitle}>
          关于我们
        </Title>
        <Paragraph className={styles.bannerDesc}>
          打造全球领先的跨境电商购物平台
        </Paragraph>
      </div>

      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2} className={styles.sectionTitle}>
            公司简介
          </Title>
          <Paragraph className={styles.paragraph}>
            CrossBorder Shop成立于2020年，是一家专注于跨境电商的创新型企业。
            我们致力于为全球消费者提供优质的商品和卓越的购物体验。
          </Paragraph>
          <Paragraph className={styles.paragraph}>
            通过先进的技术和完善的服务体系，我们已经成为跨境电商行业的领军企业。
            我们的使命是连接全球好物，让每个人都能享受到世界各地的优质产品。
          </Paragraph>
        </Card>

        <Row gutter={[24, 24]} className={styles.valuesRow}>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.valueCard}>
              <GlobalOutlined className={styles.valueIcon} />
              <Title level={3}>全球视野</Title>
              <Paragraph>连接世界各地的优质商品</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.valueCard}>
              <HeartOutlined className={styles.valueIcon} />
              <Title level={3}>用户至上</Title>
              <Paragraph>始终将用户体验放在首位</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.valueCard}>
              <TrophyOutlined className={styles.valueIcon} />
              <Title level={3}>品质保证</Title>
              <Paragraph>严格把控每一件商品质量</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.valueCard}>
              <TeamOutlined className={styles.valueIcon} />
              <Title level={3}>团队协作</Title>
              <Paragraph>专业团队提供优质服务</Paragraph>
            </Card>
          </Col>
        </Row>

        <Card className={styles.card}>
          <Title level={2} className={styles.sectionTitle}>
            发展历程
          </Title>
          <Timeline mode="left" className={styles.timeline}>
            {milestones.map((milestone, index) => (
              <Timeline.Item
                key={index}
                label={
                  <span className={styles.timelineYear}>{milestone.year}</span>
                }
              >
                <Title level={4}>{milestone.title}</Title>
                <Paragraph>{milestone.description}</Paragraph>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        <Card className={styles.card}>
          <Title level={2} className={styles.sectionTitle}>
            我们的优势
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div className={styles.advantage}>
                <Title level={4}>🌐 全球供应链</Title>
                <Paragraph>
                  与全球500+优质供应商合作，确保商品来源可靠，品质优良。
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={styles.advantage}>
                <Title level={4}>🚀 高效物流</Title>
                <Paragraph>
                  自建物流体系，与国际知名物流公司合作，确保快速配送。
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={styles.advantage}>
                <Title level={4}>💎 品质保障</Title>
                <Paragraph>
                  严格的质检流程，100%正品保证，7天无理由退换货。
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={styles.advantage}>
                <Title level={4}>🎯 智能推荐</Title>
                <Paragraph>
                  AI智能推荐系统，为您精准推荐感兴趣的商品。
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default About;
