import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from '@umijs/renderer-react';
import { useTranslation } from 'react-i18next';
import { getCategoryList } from '@/services/category';
import type { Category } from '@/models/category';

import styles from './index.module.css';

const CategoryNav: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategoryList();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };

  const getCategoryLabel = (category: Category) => {
    return i18n.language === 'zh-CN' ? category.categoryName : category.categoryCode;
  };

  const items = [
    {
      key: 'all',
      icon: <AppstoreOutlined />,
      label: t('product.allProducts'),
      onClick: () => navigate('/products'),
    },
    ...categories.map((category) => ({
      key: category.id.toString(),
      label: getCategoryLabel(category),
      onClick: () => handleCategoryClick(category.id),
    })),
  ];

  return (
    <div className={styles.categoryNav}>
      <Menu
        mode="horizontal"
        items={items}
        selectedKeys={[]}
        className={styles.menu}
      />
    </div>
  );
};

export default CategoryNav;
