import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Spin } from "antd";
import {
  TruckOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getAppConfig } from "@/services/settings";
import styles from "./index.module.css";

const { Title, Paragraph } = Typography;

const ShippingInfo: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [shippingFee, setShippingFee] = useState<number>(10);
  const [freeShippingThreshold, setFreeShippingThreshold] =
    useState<number>(99);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await getAppConfig();

      if (response.data) {
        setShippingFee(response.data.shippingFee || 10);
        setFreeShippingThreshold(response.data.freeshippingThreshold);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.shippingInfo}>
        <div className={styles.banner}>
          <TruckOutlined className={styles.bannerIcon} />
          <Title level={1} className={styles.bannerTitle}>
            {t("shipping.title")}
          </Title>
          <Paragraph className={styles.bannerDesc}>
            {t("shipping.subtitle")}
          </Paragraph>
        </div>

        <div className={styles.container}>
          <Row gutter={[24, 24]} className={styles.featuresRow}>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.featureCard}>
                <TruckOutlined className={styles.featureIcon} />
                <Title level={4}>{t("shipping.fastDelivery")}</Title>
                <Paragraph>{t("shipping.fastDeliveryDesc")}</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.featureCard}>
                <ClockCircleOutlined className={styles.featureIcon} />
                <Title level={4}>{t("shipping.onTimeDelivery")}</Title>
                <Paragraph>{t("shipping.onTimeDeliveryDesc")}</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.featureCard}>
                <DollarOutlined className={styles.featureIcon} />
                <Title level={4}>{t("shipping.freeShippingAbove")}</Title>
                <Paragraph>
                  {t("shipping.freeShippingAboveDesc", {
                    amount: freeShippingThreshold,
                  })}
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.featureCard}>
                <GlobalOutlined className={styles.featureIcon} />
                <Title level={4}>{t("shipping.globalShipping")}</Title>
                <Paragraph>{t("shipping.globalShippingDesc")}</Paragraph>
              </Card>
            </Col>
          </Row>

          <Card className={styles.card}>
            <Title level={2} className={styles.sectionTitle}>
              {t("shipping.shippingStandard")}
            </Title>
            <div className={styles.shippingInfo}>
              <div className={styles.shippingItem}>
                <div className={styles.shippingLabel}>
                  {t("shipping.standardFee")}：
                </div>
                <div className={styles.shippingValue}>¥{shippingFee}</div>
              </div>
              <div className={styles.shippingItem}>
                <div className={styles.shippingLabel}>
                  {t("shipping.freeShippingCondition")}：
                </div>
                <div className={styles.shippingValue}>
                  {t("shipping.freeShippingDetail", {
                    amount: freeShippingThreshold,
                  })}
                </div>
              </div>
              <div className={styles.shippingItem}>
                <div className={styles.shippingLabel}>
                  {t("shipping.deliveryTime")}：
                </div>
                <div className={styles.shippingValue}>
                  {t("shipping.deliveryTimeDetail")}
                </div>
              </div>
            </div>
          </Card>

          <Card className={styles.card}>
            <Title level={2} className={styles.sectionTitle}>
              {t("shipping.shippingDescription")}
            </Title>
            <div className={styles.content}>
              <Title level={4}>{t("shipping.shippingRange")}</Title>
              <Paragraph>{t("shipping.shippingRangeDesc")}</Paragraph>

              <Title level={4}>{t("shipping.deliveryEfficiency")}</Title>
              <Paragraph>{t("shipping.deliveryEfficiencyDesc")}</Paragraph>

              <Title level={4}>{t("shipping.logisticsTracking")}</Title>
              <Paragraph>{t("shipping.logisticsTrackingDesc")}</Paragraph>

              <Title level={4}>{t("shipping.signingNotes")}</Title>
              <Paragraph>{t("shipping.signingNotesDesc")}</Paragraph>

              <Title level={4}>{t("shipping.specialCases")}</Title>
              <Paragraph>{t("shipping.specialCasesDesc")}</Paragraph>
            </div>
          </Card>
        </div>
      </div>
    </Spin>
  );
};

export default ShippingInfo;
