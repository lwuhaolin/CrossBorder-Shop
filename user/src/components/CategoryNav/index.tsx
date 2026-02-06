import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';
import { getCategories } from '@/services/category';
import type { Category } from '@/models/category';
import styles from './index.module.css';

const CategoryNav: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    history.push(`/products?category=${categoryId}`);
  };

  const items = [
    {
      key: 'all',
      icon: <AppstoreOutlined />,
      label: 'All Products',
      onClick: () => history.push('/products'),
    },
    ...categories.map((category) => ({
      key: category.id.toString(),
      label: category.name,
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
