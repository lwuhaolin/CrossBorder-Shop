import React, { useEffect, useState } from "react";
import { Row, Col, Carousel, Typography, Spin, Card } from "antd";
import { useTranslation } from "react-i18next";
import { getProductList, getLatestProducts } from "@/services/product";
import { getAppConfig } from "@/services/settings";
import ProductCard from "@/components/ProductCard";
import CategoryNav from "@/components/CategoryNav";
import type { Product } from "@/models/product";
import { getImageUrl } from "@/utils/request";
import styles from "./index.module.css";

const { Title } = Typography;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
    loadCarousel();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductList({ page: 1, pageSize: 8 });
      const data = response.data;

      // Simulate hot products (first 4)
      setHotProducts(data.list.slice(0, 4));

      // Load latest products (use new API)
      const latestResponse = await getLatestProducts(4);
      setNewProducts(latestResponse.data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCarousel = async () => {
    try {
      const response = await getAppConfig();
      const images = response.data?.carouselImages || [];
      setCarouselImages(images);
    } catch (error) {
      setCarouselImages([]);
    }
  };

  return (
    <div className={styles.homePage}>
      <CategoryNav />

      {/* Hero Carousel */}
      <div className={styles.hero}>
        {carouselImages.length > 0 ? (
          <Carousel autoplay className={styles.carousel}>
            {carouselImages.map((img, index) => (
              <div key={`${img}-${index}`} className={styles.carouselItem}>
                <div
                  className={styles.carouselBg}
                  style={{ backgroundImage: `url(${getImageUrl(img)})` }}
                />
                <img
                  className={styles.carouselImage}
                  src={getImageUrl(img)}
                  alt={`carousel-${index}`}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className={styles.carouselEmpty}>
            <div className={styles.carouselContent}>
              <h1>{t("home.carouselEmptyTitle")}</h1>
              <p>{t("home.carouselEmptyDesc")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className={styles.container}>
        <Spin spinning={loading}>
          {/* Hot Products */}
          <section className={styles.section}>
            <Title level={2} className={styles.sectionTitle}>
              🔥 {t("home.hotProducts")}
            </Title>
            <Row gutter={[16, 16]}>
              {hotProducts.map((product) => (
                <Col xs={12} sm={12} md={6} lg={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </section>

          {/* New Arrivals */}
          <section className={styles.section}>
            <Title level={2} className={styles.sectionTitle}>
              ✨ {t("home.newArrivals")}
            </Title>
            <Row gutter={[16, 16]}>
              {newProducts.map((product) => (
                <Col xs={12} sm={12} md={6} lg={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </section>

          {/* Features */}
          <section className={styles.section}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8}>
                <Card className={styles.featureCard}>
                  <div className={styles.featureIcon}>🚚</div>
                  <h3>{t("home.freeShipping")}</h3>
                  <p>{t("home.freeShippingDesc")}</p>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className={styles.featureCard}>
                  <div className={styles.featureIcon}>🔒</div>
                  <h3>{t("home.securePayment")}</h3>
                  <p>{t("home.securePaymentDesc")}</p>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className={styles.featureCard}>
                  <div className={styles.featureIcon}>🎁</div>
                  <h3>{t("home.bestQuality")}</h3>
                  <p>{t("home.bestQualityDesc")}</p>
                </Card>
              </Col>
            </Row>
          </section>
        </Spin>
      </div>
    </div>
  );
};

export default HomePage;
