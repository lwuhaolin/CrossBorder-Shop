import React, { useEffect, useState } from 'react';
import { Row, Col, Carousel, Typography, Spin, Card } from 'antd';
import { getProducts } from '@/services/product';
import ProductCard from '@/components/ProductCard';
import CategoryNav from '@/components/CategoryNav';
import type { Product } from '@/models/product';
import styles from './index.module.css';

const { Title } = Typography;

const HomePage: React.FC = () => {
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ page: 1, pageSize: 8 });
      
      // Simulate hot products (first 4)
      setHotProducts(data.items.slice(0, 4));
      
      // Simulate new products (next 4)
      setNewProducts(data.items.slice(4, 8));
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.homePage}>
      <CategoryNav />
      
      {/* Hero Carousel */}
      <div className={styles.hero}>
        <Carousel autoplay className={styles.carousel}>
          <div className={styles.carouselItem}>
            <div className={styles.carouselContent}>
              <h1>Welcome to CrossBorder Shop</h1>
              <p>Your trusted platform for cross-border daily goods</p>
            </div>
          </div>
          <div className={styles.carouselItem} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className={styles.carouselContent}>
              <h1>Discover Amazing Products</h1>
              <p>Shop from thousands of products worldwide</p>
            </div>
          </div>
          <div className={styles.carouselItem} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className={styles.carouselContent}>
              <h1>Fast & Secure Delivery</h1>
              <p>Get your products delivered safely and quickly</p>
            </div>
          </div>
        </Carousel>
      </div>

      {/* Products Section */}
      <div className={styles.container}>
        <Spin spinning={loading}>
          {/* Hot Products */}
          <section className={styles.section}>
            <Title level={2} className={styles.sectionTitle}>
              🔥 Hot Products
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
              ✨ New Arrivals
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
                  <h3>Free Shipping</h3>
                  <p>Free shipping on orders over $50</p>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className={styles.featureCard}>
                  <div className={styles.featureIcon}>🔒</div>
                  <h3>Secure Payment</h3>
                  <p>100% secure payment processing</p>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className={styles.featureCard}>
                  <div className={styles.featureIcon}>🎁</div>
                  <h3>Best Quality</h3>
                  <p>High-quality products guaranteed</p>
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
