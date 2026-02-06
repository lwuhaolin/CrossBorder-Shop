import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { useState } from 'react';

const ChangePassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return false;
    }

    setLoading(true);
    try {
      // TODO: Call change password API
      // await changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
      message.success('密码修改成功，请重新登录');
      // TODO: Redirect to login
      return true;
    } catch (error) {
      message.error('密码修改失败');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="修改密码" bordered={false}>
      <ProForm
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: '确认修改',
            resetText: '重置',
          },
        }}
        loading={loading}
        style={{ maxWidth: 500 }}
      >
        <ProFormText.Password
          name="oldPassword"
          label="原密码"
          placeholder="请输入原密码"
          rules={[{ required: true, message: '请输入原密码' }]}
        />

        <ProFormText.Password
          name="newPassword"
          label="新密码"
          placeholder="请输入新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度至少6位' },
          ]}
        />

        <ProFormText.Password
          name="confirmPassword"
          label="确认新密码"
          placeholder="请再次输入新密码"
          rules={[
            { required: true, message: '请再次输入新密码' },
            { min: 6, message: '密码长度至少6位' },
          ]}
        />
      </ProForm>
    </Card>
  );
};

export default ChangePassword;
