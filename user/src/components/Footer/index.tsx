import React from 'react';
import { Layout, Row, Col, Space } from 'antd';
import { GithubOutlined, TwitterOutlined, FacebookOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter className={styles.footer}>
      <div className={styles.container}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <h3>About Us</h3>
            <p>Your trusted cross-border shopping platform for daily goods.</p>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h3>Customer Service</h3>
            <ul className={styles.links}>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
              <li><a href="/returns">Returns</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h3>Quick Links</h3>
            <ul className={styles.links}>
              <li><a href="/products">All Products</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h3>Follow Us</h3>
            <Space size="large">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <GithubOutlined className={styles.socialIcon} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterOutlined className={styles.socialIcon} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookOutlined className={styles.socialIcon} />
              </a>
            </Space>
          </Col>
        </Row>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} CrossBorder Shop. All rights reserved.</p>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
