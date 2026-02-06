import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'umi';
import { login } from '@/services/user';
import { setToken, setUserInfo } from '@/utils/request';
import type { LoginDTO } from '@/models/user';
import './index.less';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginDTO) => {
    setLoading(true);
    try {
      const response = await login(values);
      if (response?.data) {
        const { token, user } = response.data;
        
        // Save token and user info
        setToken(token);
        setUserInfo(user);
        
        message.success('登录成功');
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      message.error(error?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>跨境日用小商品订货系统</h1>
          <p>管理端登录</p>
        </div>
        <LoginForm
          title=""
          subTitle=""
          onFinish={handleSubmit}
          loading={loading}
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
}
