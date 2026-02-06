import React from 'react';
import { Card, Button, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { history } from 'umi';
import type { Product } from '@/models/product';
import styles from './index.module.css';

const { Meta } = Card;

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.stock === 0) {
      message.warning('Product is out of stock');
      return;
    }

    // Add to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1,
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    message.success('Added to cart');
    
    if (onAddToCart) {
      onAddToCart(product);
    }

    // Trigger storage event to update cart count in header
    window.dispatchEvent(new Event('storage'));
  };

  const handleViewDetail = () => {
    history.push(`/products/${product.id}`);
  };

  return (
    <Card
      hoverable
      className={styles.card}
      cover={
        <div className={styles.imageWrapper}>
          <img
            alt={product.name}
            src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Product'}
            className={styles.image}
          />
          {product.stock === 0 && (
            <div className={styles.outOfStock}>Out of Stock</div>
          )}
        </div>
      }
      actions={[
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={handleViewDetail}
        >
          View
        </Button>,
        <Button
          type="text"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>,
      ]}
      onClick={handleViewDetail}
    >
      <Meta
        title={
          <div className={styles.title} title={product.name}>
            {product.name}
          </div>
        }
        description={
          <div className={styles.description}>
            <div className={styles.price}>${product.price.toFixed(2)}</div>
            <div className={styles.stock}>
              Stock: {product.stock}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
