import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, message, Avatar } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getUserProfile } from '@/services/user';
import type { User } from '@/models/user';
import styles from './profile.module.css';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setUser(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Profile</h1>

        <Card loading={loading} className={styles.card}>
          <div className={styles.header}>
            <Avatar size={80} icon={<UserOutlined />} />
            <div className={styles.info}>
              <h2>{user?.username}</h2>
              <p>{user?.email}</p>
            </div>
            <Button icon={<EditOutlined />} onClick={() => history.push('/user/settings')}>
              Edit Profile
            </Button>
          </div>

          <Descriptions bordered column={1} style={{ marginTop: 24 }}>
            <Descriptions.Item label="Username">{user?.username}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{user?.phone || 'Not set'}</Descriptions.Item>
            <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>
            <Descriptions.Item label="Member Since">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
