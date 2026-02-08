import React, { useEffect, useState } from "react";
import { Card, Empty, Button, Row, Col, message } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "@/utils/request";
import styles from "./index.module.css";

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const data = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(data);
  };

  const handleRemove = (id: number) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    message.success(t("favorite.removed"));
  };

  const handleAddToCart = (item: FavoriteItem) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(
      (cartItem: any) => cartItem.productId === item.id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    message.success(t("favorite.addedToCart"));
    window.dispatchEvent(new Event("storage"));
  };

  if (favorites.length === 0) {
    return (
      <div className={styles.favoritesPage}>
        <div className={styles.container}>
          <Card>
            <Empty
              description={t("favorite.empty")}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => navigate("/products")}>
                {t("favorite.browseProducts")}
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("favorite.myFavorites")}</h1>

        <Row gutter={[16, 16]}>
          {favorites.map((item) => (
            <Col xs={12} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.name}
                    src={getImageUrl(item.imageUrl)}
                    className={styles.image}
                    onClick={() => navigate(`/products/${item.id}`)}
                  />
                }
                actions={[
                  <Button
                    type="text"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(item)}
                  >
                    {t("favorite.addToCart")}
                  </Button>,
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(item.id)}
                  >
                    {t("favorite.remove")}
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={item.name}
                  description={`$${item.price.toFixed(2)}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default FavoritesPage;
