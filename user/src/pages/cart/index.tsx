import React, { useEffect, useState } from 'react';
import { Card, Table, InputNumber, Button, message, Empty, Space } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.module.css';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (productId: number) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Item removed from cart');
    window.dispatchEvent(new Event('storage'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    message.success('Cart cleared');
    window.dispatchEvent(new Event('storage'));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Your cart is empty');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('Please login to checkout');
      history.push('/user/login');
      return;
    }

    history.push('/checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    return cartItems.length > 0 ? 10 : 0; // Fixed shipping cost
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: CartItem) => (
        <div className={styles.productCell}>
          <img
            src={record.image || 'https://via.placeholder.com/80x80?text=Product'}
            alt={name}
            className={styles.productImage}
          />
          <span className={styles.productName}>{name}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateQuantity(record.productId, value || 1)}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (record: CartItem) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.productId)}
        >
          Remove
        </Button>
      ),
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.container}>
          <Card>
            <Empty
              description="Your cart is empty"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => history.push('/products')}>
                Start Shopping
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>

        <Card className={styles.card}>
          <Table
            dataSource={cartItems}
            columns={columns}
            rowKey="productId"
            pagination={false}
            loading={loading}
          />

          <div className={styles.actions}>
            <Button danger onClick={clearCart}>
              Clear Cart
            </Button>
            <Button onClick={() => history.push('/products')}>
              Continue Shopping
            </Button>
          </div>
        </Card>

        <Card className={styles.summaryCard}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping:</span>
            <span>${calculateShipping().toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow + ' ' + styles.total}>
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <Button
            type="primary"
            size="large"
            block
            icon={<ShoppingOutlined />}
            onClick={handleCheckout}
            className={styles.checkoutButton}
          >
            Proceed to Checkout
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;
