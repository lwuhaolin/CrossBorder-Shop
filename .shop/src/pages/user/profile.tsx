import { Card, Descriptions, Button, Space, Tag } from 'antd';
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

  const getStatusTag = (status?: number) => {
    if (status === 1) {
      return <Tag color="success">正常</Tag>;
    }
    return <Tag color="error">禁用</Tag>;
  };

  return (
    <Card
      title="个人信息"
      extra={
        <Space>
          <Button type="primary" icon={<EditOutlined />} disabled>
            编辑资料
          </Button>
        </Space>
      }
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="用户ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
        {user.name && (
          <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
        )}
        <Descriptions.Item label="邮箱">{user.email || '-'}</Descriptions.Item>
        <Descriptions.Item label="手机号">{user.phone || '-'}</Descriptions.Item>
        <Descriptions.Item label="角色">{user.role || '管理员'}</Descriptions.Item>
        <Descriptions.Item label="状态">{getStatusTag(user.status)}</Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>
          {user.createdAt || '-'}
        </Descriptions.Item>
        {user.lastLoginAt && (
          <Descriptions.Item label="最后登录时间" span={2}>
            {user.lastLoginAt}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default UserProfile;
