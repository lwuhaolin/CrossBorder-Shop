import React from "react";
import { Card, Button, message } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { getImageUrl, getToken } from "@/utils/request";
import { addToCart } from "@/services/cart";
import type { Product } from "@/models/product";
import styles from "./index.module.css";

const { Meta } = Card;

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (product.stock === 0) {
      message.warning(t("product.outOfStock"));
      return;
    }

    // Check if user is logged in
    const token = getToken();
    if (!token) {
      message.warning(t("checkout.loginRequired"));
      navigate("/user/login");
      return;
    }

    try {
      // Call backend API to add to cart
      await addToCart({
        productId: product.id,
        quantity: 1,
      });

      // Also update local cart for offline support
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find(
        (item: any) => item.productId === product.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.mainImage,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      message.success(t("common.addedToCart"));

      if (onAddToCart) {
        onAddToCart(product);
      }

      window.dispatchEvent(new Event("storage"));
    } catch (error: any) {
      message.error(error?.message || t("common.error"));
    }
  };

  const handleViewDetail = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card
      hoverable
      className={styles.card}
      cover={
        <div className={styles.imageWrapper}>
          <img
            alt={product.name}
            src={getImageUrl(product.mainImage)}
            className={styles.image}
          />
          {product.stock === 0 && (
            <div className={styles.outOfStock}>{t("product.outOfStock")}</div>
          )}
        </div>
      }
      actions={[
        <Button type="text" icon={<EyeOutlined />} onClick={handleViewDetail}>
          {t("product.view")}
        </Button>,
        <Button
          type="text"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {t("product.addToCart")}
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
              {t("product.stock")}: {product.stock}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
