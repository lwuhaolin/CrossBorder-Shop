import React, { useState, useEffect } from 'react';
import { Layout, Input, Badge, Dropdown, Space, Button } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, MenuOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { removeToken, removeUserInfo, getToken } from '@/utils/request';
import type { MenuProps } from 'antd';
import styles from './index.module.css';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = getToken();
    setIsLoggedIn(!!token);
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      history.push(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  const userMenuItems: MenuProps['items'] = isLoggedIn
    ? [
        {
          key: 'profile',
          label: 'Profile',
          onClick: () => history.push('/user/profile'),
        },
        {
          key: 'orders',
          label: 'My Orders',
          onClick: () => history.push('/user/orders'),
        },
        {
          key: 'addresses',
          label: 'Addresses',
          onClick: () => history.push('/user/addresses'),
        },
        {
          key: 'favorites',
          label: 'Favorites',
          onClick: () => history.push('/user/favorites'),
        },
        {
          key: 'settings',
          label: 'Settings',
          onClick: () => history.push('/user/settings'),
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          label: 'Logout',
          onClick: () => {
            removeToken();
            removeUserInfo();
            setIsLoggedIn(false);
            history.push('/');
          },
        },
      ]
    : [
        {
          key: 'login',
          label: 'Login',
          onClick: () => history.push('/user/login'),
        },
        {
          key: 'register',
          label: 'Register',
          onClick: () => history.push('/user/register'),
        },
      ];

  return (
    <AntHeader className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => history.push('/')}>
          CrossBorder Shop
        </div>

        <div className={styles.search}>
          <Search
            placeholder="Search products..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
          />
        </div>

        <div className={styles.actions}>
          <Space size="large">
            <Badge count={cartCount} showZero>
              <ShoppingCartOutlined
                className={styles.icon}
                onClick={() => history.push('/cart')}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <UserOutlined className={styles.icon} />
            </Dropdown>
          </Space>
        </div>

        <div className={styles.mobileMenu}>
          <Space size="middle">
            <Badge count={cartCount} showZero>
              <ShoppingCartOutlined
                className={styles.icon}
                onClick={() => history.push('/cart')}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <MenuOutlined className={styles.icon} />
            </Dropdown>
          </Space>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
