import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { login } from "@/services/user";
import { setToken, setRefreshToken, setUserInfo } from "@/utils/request";
import styles from "./login.module.css";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const response = await login(values);

      if (response?.data) {
        setToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUserInfo(response.data.userInfo);

        message.success(t("login.success"));
        // Use window.location.href instead of navigate to ensure a fresh page load
        // This helps avoid token-related race conditions
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error: any) {
      message.error(error.message || t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <h1>{t("login.title")}</h1>
            <p>{t("login.welcome")}</p>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: t("login.usernameRequired") },
                { type: "string", message: t("login.usernameInvalid") },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder={t("login.username")} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: t("login.passwordRequired") },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t("login.password")}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {t("login.submit")}
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.footer}>
            <span>{t("login.noAccount")}</span>
            <Button type="link" onClick={() => navigate("/user/register")}>
              {t("login.registerNow")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
