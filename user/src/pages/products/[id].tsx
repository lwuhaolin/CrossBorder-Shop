import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "@umijs/renderer-react";
import {
  Row,
  Col,
  Button,
  InputNumber,
  message,
  Spin,
  Descriptions,
  Tabs,
  Card,
  Empty,
} from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import { getProductDetail } from "@/services/product";
import type { Product } from "@/models/product";
import styles from "./[id].module.css";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductDetail(Number(id));
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to load product:", error);
      message.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      message.warning("Product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      message.warning(`Only ${product.stock} items available`);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(
      (item: any) => item.productId === product.id,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    message.success("Added to cart");
    window.dispatchEvent(new Event("storage"));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleAddToFavorites = () => {
    if (!product) return;

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const exists = favorites.find((item: any) => item.id === product.id);

    if (exists) {
      message.info("Already in favorites");
      return;
    }

    favorites.push({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.mainImage,
    });

    localStorage.setItem("favorites", JSON.stringify(favorites));
    message.success("Added to favorites");
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.empty}>
        <Empty description="Product not found" />
      </div>
    );
  }

  const tabItems = [
    {
      key: "description",
      label: "Description",
      children: (
        <div className={styles.tabContent}>
          <p>{product.description || "No description available."}</p>
        </div>
      ),
    },
    {
      key: "specifications",
      label: "Specifications",
      children: (
        <div className={styles.tabContent}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Product ID">
              {product.id}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {product.categoryId}
            </Descriptions.Item>
            <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
            <Descriptions.Item label="Price">
              ${product.price.toFixed(2)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: "reviews",
      label: "Reviews",
      children: (
        <div className={styles.tabContent}>
          <Empty description="No reviews yet" />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.productDetailPage}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <Row gutter={[32, 32]}>
            {/* Product Image */}
            <Col xs={24} md={12}>
              <div className={styles.imageWrapper}>
                <img
                  src={
                    product.mainImage ||
                    "https://via.placeholder.com/600x600?text=Product"
                  }
                  alt={product.name}
                  className={styles.image}
                />
              </div>
            </Col>

            {/* Product Info */}
            <Col xs={24} md={12}>
              <div className={styles.productInfo}>
                <h1 className={styles.productName}>{product.name}</h1>

                <div className={styles.price}>
                  <span className={styles.priceLabel}>Price:</span>
                  <span className={styles.priceValue}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className={styles.stock}>
                  <span className={styles.stockLabel}>Stock:</span>
                  <span className={styles.stockValue}>
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </span>
                </div>

                <div className={styles.description}>
                  <h3>Description</h3>
                  <p>{product.description || "No description available."}</p>
                </div>

                <div className={styles.quantity}>
                  <span className={styles.quantityLabel}>Quantity:</span>
                  <InputNumber
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    disabled={product.stock === 0}
                  />
                </div>

                <div className={styles.actions}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    block
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="large"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    block
                    style={{ marginTop: 16 }}
                  >
                    Buy Now
                  </Button>
                  <Button
                    size="large"
                    icon={<HeartOutlined />}
                    onClick={handleAddToFavorites}
                    block
                    style={{ marginTop: 16 }}
                  >
                    Add to Favorites
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Tabs */}
          <div className={styles.tabs}>
            <Tabs items={tabItems} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
