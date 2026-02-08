import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { useTranslation } from "react-i18next";
import { register } from "@/services/user";
import styles from "./register.module.css";

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await register(values);

      message.success(t("register.success"));
      navigate("/user/login");
    } catch (error: any) {
      message.error(error.message || t("register.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <h1>{t("register.title")}</h1>
            <p>{t("register.welcome")}</p>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: t("login.usernameRequired") },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder={t("register.username")} />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: t("register.email") },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder={t("register.email")} />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: t("login.passwordRequired") },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t("register.password")}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t("register.confirmPassword")}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {t("register.submit")}
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.footer}>
            <span>{t("register.haveAccount")}</span>
            <Button type="link" onClick={() => navigate("/user/login")}>
              {t("register.loginNow")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
