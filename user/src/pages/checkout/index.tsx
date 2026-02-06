import React, { useEffect, useState } from "react";
import {
  Card,
  Radio,
  Button,
  message,
  Steps,
  Divider,
  List,
  Space,
} from "antd";
import { history } from "umi";
import { getAddressList } from "@/services/address";
import { createOrder } from "@/services/order";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number>();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

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
      message.warning("Your cart is empty");
      history.push("/cart");
      return;
    }
    setCartItems(cart);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    return 10; // Fixed shipping cost
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      message.error("Please select a delivery address");
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

      // Clear cart
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("storage"));

      message.success("Order placed successfully!");
      history.push(`/user/orders/${order.id}`);
    } catch (error) {
      console.error("Failed to place order:", error);
      message.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Address",
      content: (
        <div className={styles.stepContent}>
          <h3>Select Delivery Address</h3>
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
                      <span className={styles.defaultBadge}>Default</span>
                    )}
                  </div>
                </Radio>
              ))}
            </Radio.Group>
          ) : (
            <div className={styles.noAddress}>
              <p>No delivery address found</p>
              <Button
                type="primary"
                onClick={() => history.push("/user/addresses")}
              >
                Add Address
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Payment",
      content: (
        <div className={styles.stepContent}>
          <h3>Select Payment Method</h3>
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={styles.paymentList}
          >
            <Radio value="credit_card" className={styles.paymentItem}>
              Credit Card
            </Radio>
            <Radio value="debit_card" className={styles.paymentItem}>
              Debit Card
            </Radio>
            <Radio value="paypal" className={styles.paymentItem}>
              PayPal
            </Radio>
            <Radio value="cash_on_delivery" className={styles.paymentItem}>
              Cash on Delivery
            </Radio>
          </Radio.Group>
        </div>
      ),
    },
    {
      title: "Review",
      content: (
        <div className={styles.stepContent}>
          <h3>Order Summary</h3>
          <List
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/80x80?text=Product"
                      }
                      alt={item.name}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                  }
                  title={item.name}
                  description={`Quantity: ${item.quantity}`}
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
        <h1 className={styles.title}>Checkout</h1>

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
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    Next
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={handlePlaceOrder}
                    loading={loading}
                  >
                    Place Order
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className={styles.sidebar}>
            <Card className={styles.summaryCard}>
              <h3>Order Total</h3>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping:</span>
                <span>${calculateShipping().toFixed(2)}</span>
              </div>
              <Divider />
              <div className={styles.summaryRow + " " + styles.total}>
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
