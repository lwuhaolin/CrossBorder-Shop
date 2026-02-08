import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { updateUser } from '@/services/user';
import { getUserInfo, setUserInfo } from '@/utils/request';
import type { User } from '@/models/user';
import styles from './index.module.css';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const user = getUserInfo();
    if (user) {
      form.setFieldsValue(user);
    }
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await updateUser(values);

      const user = getUserInfo();
      if (user) {
        const updatedUser = { ...user, ...values };
        setUserInfo(updatedUser);
      }

      message.success(t('settings.updated'));
    } catch (error) {
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    try {
      setLoading(true);
      message.success(t('settings.passwordChanged'));
      form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    } catch (error) {
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('settings.title')}</h1>

        <Card title={t('settings.profileInformation')} className={styles.card}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="username"
              label={t('settings.username')}
              rules={[{ required: true, message: t('common.pleaseWait') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label={t('settings.email')}
              rules={[
                { required: true, message: t('common.pleaseWait') },
                { type: 'email', message: t('common.pleaseWait') },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label={t('settings.phone')}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('settings.saveChanges')}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title={t('settings.changePassword')} className={styles.card}>
          <Form
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              name="currentPassword"
              label={t('settings.currentPassword')}
              rules={[{ required: true, message: t('common.pleaseWait') }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label={t('settings.newPassword')}
              rules={[
                { required: true, message: t('common.pleaseWait') },
                { min: 6, message: t('settings.minPasswordLength') },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={t('settings.confirmPassword')}
              dependencies={['newPassword']}
              rules={[
                { required: true, message: t('common.pleaseWait') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('settings.passwordsNotMatch')));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('settings.changePasswordBtn')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
