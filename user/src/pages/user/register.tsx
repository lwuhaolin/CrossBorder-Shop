import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { register } from '@/services/user';
import styles from './register.module.css';

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await register(values);
      
      message.success('Registration successful! Please login.');
      history.push('/user/login');
    } catch (error: any) {
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <h1>Register</h1>
            <p>Create your CrossBorder Shop account</p>
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
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Phone Number"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Register
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.footer}>
            <span>Already have an account?</span>
            <Button type="link" onClick={() => history.push('/user/login')}>
              Login now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
