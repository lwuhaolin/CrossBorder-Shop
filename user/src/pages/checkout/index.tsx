import React, { useEffect, useState } from "react";
import { Card, Radio, Button, message, Steps, Divider, List } from "antd";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { getAddressList } from "@/services/address";
import { createOrder } from "@/services/order";
import { getImageUrl } from "@/utils/request";
import type { Address } from "@/models/address";
import styles from "./index.module.css";

const { Step } = Steps;

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number>();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
    loadCart();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await getAddressList();
      setAddresses(response.data);
      if (response.data.length > 0) {
        const defaultAddress = response.data.find((addr) => addr.isDefault);
        setSelectedAddress(defaultAddress?.id || response.data[0].id);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  };

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      message.warning(t("checkout.emptyCart"));
      navigate("/cart");
      return;
    }
    setCartItems(cart);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    return 10;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      message.error(t("checkout.selectAddress"));
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        addressId: selectedAddress,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: calculateTotal(),
        paymentMethod,
      };

      const order = await createOrder(orderData);

      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("storage"));

      message.success(t("checkout.orderPlaced"));
      navigate(`/user/orders/${order.id}`);
    } catch (error) {
      console.error("Failed to place order:", error);
      message.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: t("checkout.step1"),
      content: (
        <div className={styles.stepContent}>
          <h3>{t("checkout.selectDeliveryAddress")}</h3>
          {addresses.length > 0 ? (
            <Radio.Group
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className={styles.addressList}
            >
              {addresses.map((address) => (
                <Radio
                  key={address.id}
                  value={address.id}
                  className={styles.addressItem}
                >
                  <div>
                    <strong>{address.receiverName}</strong> -{" "}
                    {address.receiverPhone}
                    <br />
                    {address.detailAddress}, {address.city}, {address.province}
                    {address.isDefault && (
                      <span className={styles.defaultBadge}>
                        {t("address.default")}
                      </span>
                    )}
                  </div>
                </Radio>
              ))}
            </Radio.Group>
          ) : (
            <div className={styles.noAddress}>
              <p>{t("checkout.noAddress")}</p>
              <Button
                type="primary"
                onClick={() => navigate("/user/addresses")}
              >
                {t("checkout.addAddress")}
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("checkout.step2"),
      content: (
        <div className={styles.stepContent}>
          <h3>{t("checkout.selectPaymentMethod")}</h3>
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={styles.paymentList}
          >
            <Radio value="credit_card" className={styles.paymentItem}>
              {t("checkout.creditCard")}
            </Radio>
            <Radio value="debit_card" className={styles.paymentItem}>
              {t("checkout.debitCard")}
            </Radio>
            <Radio value="paypal" className={styles.paymentItem}>
              {t("checkout.paypal")}
            </Radio>
            <Radio value="cash_on_delivery" className={styles.paymentItem}>
              {t("checkout.cashOnDelivery")}
            </Radio>
          </Radio.Group>
        </div>
      ),
    },
    {
      title: t("checkout.step3"),
      content: (
        <div className={styles.stepContent}>
          <h3>{t("checkout.orderSummary")}</h3>
          <List<CartItem>
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                  }
                  title={item.name}
                  description={`${t("checkout.quantity")}: ${item.quantity}`}
                />
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("checkout.title")}</h1>

        <div className={styles.content}>
          <div className={styles.main}>
            <Card className={styles.card}>
              <Steps current={currentStep}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <Divider />
              <div className={styles.stepsContent}>
                {steps[currentStep].content}
              </div>
              <div className={styles.stepsAction}>
                {currentStep > 0 && (
                  <Button
                    style={{ margin: "0 8px" }}
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    {t("checkout.previous")}
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    {t("checkout.next")}
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={handlePlaceOrder}
                    loading={loading}
                  >
                    {t("checkout.placeOrder")}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className={styles.sidebar}>
            <Card className={styles.summaryCard}>
              <h3>{t("checkout.orderSummary")}</h3>
              <div className={styles.summaryRow}>
                <span>{t("cart.subtotal")}:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>{t("cart.shipping")}:</span>
                <span>${calculateShipping().toFixed(2)}</span>
              </div>
              <Divider />
              <div className={styles.summaryRow + " " + styles.total}>
                <span>{t("cart.total")}:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <p className={styles.estimatedNote}>
                {t("checkout.estimatedAmount")}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
