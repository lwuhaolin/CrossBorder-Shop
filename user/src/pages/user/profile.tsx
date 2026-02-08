import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button, message, Avatar } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { getCurrentUser } from "@/services/user";
import type { User } from "@/models/user";
import styles from "./profile.module.css";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      message.error(t("profile.failedToLoad"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("profile.myProfile")}</h1>

        <Card loading={loading} className={styles.card}>
          <div className={styles.header}>
            <Avatar size={80} icon={<UserOutlined />} />
            <div className={styles.info}>
              <h2>{user?.username}</h2>
              <p>{user?.email}</p>
            </div>
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate("/user/settings")}
            >
              {t("profile.editProfile")}
            </Button>
          </div>

          <Descriptions bordered column={1} style={{ marginTop: 24 }}>
            <Descriptions.Item label={t("profile.username")}>
              {user?.username}
            </Descriptions.Item>
            <Descriptions.Item label={t("profile.email")}>{user?.email}</Descriptions.Item>
            <Descriptions.Item label={t("profile.phone")}>
              {user?.phone || t("common.info")}
            </Descriptions.Item>
            <Descriptions.Item label={t("profile.role")}>{user?.role}</Descriptions.Item>
            <Descriptions.Item label={t("profile.memberSince")}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
