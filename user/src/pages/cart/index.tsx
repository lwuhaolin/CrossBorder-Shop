import React, { useEffect, useState } from "react";
import { Card, Table, InputNumber, Button, message, Empty } from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "@/utils/request";
import styles from "./index.module.css";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = (productId: number) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId,
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    message.success(t("cart.removeItem"));
    window.dispatchEvent(new Event("storage"));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
    message.success(t("cart.clearCart"));
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning(t("cart.empty"));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      message.warning(t("checkout.loginRequired"));
      navigate("/user/login");
      return;
    }

    navigate("/checkout");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    return cartItems.length > 0 ? 10 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const columns = [
    {
      title: t("cart.items"),
      dataIndex: "name",
      key: "name",
      render: (name: string, record: CartItem) => (
        <div className={styles.productCell}>
          <img
            src={getImageUrl(record.image)}
            alt={name}
            className={styles.productImage}
          />
          <span className={styles.productName}>{name}</span>
        </div>
      ),
    },
    {
      title: t("cart.price"),
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: t("cart.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateQuantity(record.productId, value || 1)}
        />
      ),
    },
    {
      title: t("cart.subtotal"),
      key: "subtotal",
      render: (record: CartItem) =>
        `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: t("common.edit"),
      key: "action",
      render: (record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.productId)}
        >
          {t("cart.remove")}
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
              description={t("cart.empty")}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => navigate("/products")}>
                {t("cart.startShopping")}
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
        <h1 className={styles.title}>{t("cart.title")}</h1>

        <Card className={styles.card}>
          <Table
            dataSource={cartItems}
            columns={columns}
            rowKey="productId"
            pagination={false}
          />

          <div className={styles.actions}>
            <Button danger onClick={clearCart}>
              {t("cart.clearCart")}
            </Button>
            <Button onClick={() => navigate("/products")}>
              {t("cart.continueShopping")}
            </Button>
          </div>
        </Card>

        <Card className={styles.summaryCard}>
          <h2>{t("cart.orderSummary")}</h2>
          <div className={styles.summaryRow}>
            <span>{t("cart.subtotal")}:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>{t("cart.shipping")}:</span>
            <span>${calculateShipping().toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow + " " + styles.total}>
            <span>{t("cart.total")}:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <p className={styles.estimatedNote}>{t("cart.estimatedAmount")}</p>
          <Button
            type="primary"
            size="large"
            block
            icon={<ShoppingOutlined />}
            onClick={handleCheckout}
            className={styles.checkoutButton}
          >
            {t("cart.proceedToCheckout")}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;
