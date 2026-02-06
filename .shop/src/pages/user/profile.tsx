import { Card, Descriptions, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getUserInfo } from '@/utils/request';

const UserProfile: React.FC = () => {
  const user = getUserInfo();

  if (!user) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>请先登录</div>
      </Card>
    );
  }

  return (
    <Card
      title="个人信息"
      extra={
        <Space>
          <Button type="primary" icon={<EditOutlined />}>
            编辑资料
          </Button>
        </Space>
      }
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
        <Descriptions.Item label="姓名">{user.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{user.email || '-'}</Descriptions.Item>
        <Descriptions.Item label="手机号">{user.phone || '-'}</Descriptions.Item>
        <Descriptions.Item label="角色">{user.role || '管理员'}</Descriptions.Item>
        <Descriptions.Item label="状态">
          {user.status === 1 ? '正常' : '禁用'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>
          {user.createdAt || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="最后登录时间" span={2}>
          {user.lastLoginAt || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserProfile;
