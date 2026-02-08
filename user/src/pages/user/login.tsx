import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "@umijs/renderer-react";
import { login } from "@/services/user";
import { setToken, setRefreshToken, setUserInfo } from "@/utils/request";
import styles from "./login.module.css";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const response = await login(values);

      if (response?.data) {
        setToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUserInfo(response.data.userInfo);

        message.success("登录成功");
        navigate("/");
      }
    } catch (error: any) {
      message.error(error.message || "登录失败，请检查用户名和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <h1>Login</h1>
            <p>Welcome back to CrossBorder Shop</p>
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
                { required: true, message: "Please input your username!" },
                { type: "string", message: "Please enter a valid username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.footer}>
            <span>Don't have an account?</span>
            <Button type="link" onClick={() => navigate("/user/register")}>
              Register now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
