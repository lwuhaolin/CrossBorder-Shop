import React from 'react';
import { Layout, Row, Col, Space } from 'antd';
import { GithubOutlined, TwitterOutlined, FacebookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.container}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <h3>{t('footer.aboutUs')}</h3>
            <p>{t('footer.aboutDesc')}</p>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h3>{t('footer.customerService')}</h3>
            <ul className={styles.links}>
              <li><a href="/help">{t('footer.helpCenter')}</a></li>
              <li><a href="/shipping">{t('footer.shipping')}</a></li>
              <li><a href="/returns">{t('footer.returns')}</a></li>
              <li><a href="/contact">{t('footer.contact')}</a></li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h3>{t('footer.quickLinks')}</h3>
            <ul className={styles.links}>
              <li><a href="/products">{t('footer.allProducts')}</a></li>
              <li><a href="/about">{t('footer.about')}</a></li>
              <li><a href="/privacy">{t('footer.privacy')}</a></li>
              <li><a href="/terms">{t('footer.terms')}</a></li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h3>{t('footer.followUs')}</h3>
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
          <p>&copy; {new Date().getFullYear()} CrossBorder Shop. {t('footer.allRightsReserved')}.</p>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
