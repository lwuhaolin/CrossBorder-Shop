import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  InputNumber,
  Button,
  message,
  Empty,
  Checkbox,
} from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { getImageUrl, getUserInfo, getToken } from "@/utils/request";
import { getCart, updateCartItem } from "@/services/cart";
import { getAppConfig } from "@/services/settings";
import styles from "./index.module.css";
import type { CartItem } from "@/models/cart";

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [shippingFee, setShippingFee] = useState<number>(10);
  const [freeShippingThreshold, setFreeShippingThreshold] =
    useState<number>(99);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    loadConfig();
  }, []);

  const loadCart = async () => {
    try {
      const userInfo = getUserInfo();

      if (userInfo && userInfo.id) {
        // Load cart from backend
        const response = await getCart();
        if (response.data) {
          // Handle both direct array and wrapped data
          const cartData = Array.isArray(response.data)
            ? response.data
            : response.data.items || [];
          setCartItems(cartData as CartItem[]);

          // Initialize selected items from loaded data
          const initialSelected = new Set<number>();
          cartData.forEach((item: CartItem) => {
            if (item.selected) {
              initialSelected.add(item.productId);
            }
          });
          setSelectedItems(initialSelected);

          // Sync with localStorage
          localStorage.setItem("cart", JSON.stringify(cartData));
          return;
        }
      }
    } catch (error) {
      console.error("Failed to load cart from backend:", error);
    }

    // Fallback to localStorage if backend fails
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  const loadConfig = async () => {
    try {
      const response = await getAppConfig();
      if (response.data) {
        setShippingFee(response.data.shippingFee || 10);
        setFreeShippingThreshold(response.data.freeshippingThreshold || 99);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

  const toggleItem = (productId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(cartItems.map((item) => item.productId)));
    } else {
      setSelectedItems(new Set());
    }
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

    // Remove from selected items
    const newSelected = new Set(selectedItems);
    newSelected.delete(productId);
    setSelectedItems(newSelected);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    message.success(t("cart.removeItem"));
    window.dispatchEvent(new Event("storage"));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems(new Set());
    localStorage.setItem("cart", JSON.stringify([]));
    message.success(t("cart.clearCart"));
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      message.warning("请先选择要购买的商品");
      return;
    }

    const token = getToken();
    if (!token) {
      message.warning(t("checkout.loginRequired"));
      navigate("/user/login");
      return;
    }

    // Update selected status for all items
    try {
      for (const item of cartItems) {
        const isSelected = selectedItems.has(item.productId);
        if (isSelected) {
          await updateCartItem({
            id: item.id,
            quantity: item.quantity,
            selected: true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to update cart items:", error);
    }

    navigate("/checkout");
  };

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.productId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // 如果达到免运费门槛，返回0
    if (subtotal >= freeShippingThreshold) {
      return 0;
    }
    return shippingFee;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const isAllSelected =
    cartItems.length > 0 && selectedItems.size === cartItems.length;
  const isIndeterminate =
    selectedItems.size > 0 && selectedItems.size < cartItems.length;

  const columns = [
    {
      title: (
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={(e) => toggleSelectAll(e.target.checked)}
        />
      ),
      key: "checkbox",
      width: 50,
      render: (record: CartItem) => (
        <Checkbox
          checked={selectedItems.has(record.productId)}
          onChange={() => toggleItem(record.productId)}
        />
      ),
    },
    {
      title: t("cart.items"),
      dataIndex: "productName",
      key: "productName",
      render: (_: string, record: CartItem) => (
        <div className={styles.productCell}>
          <img
            src={getImageUrl(record.productImage)}
            alt={record.productName}
            className={styles.productImage}
          />
          <span className={styles.productName}>{record.productName}</span>
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
            disabled={selectedItems.size === 0}
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
