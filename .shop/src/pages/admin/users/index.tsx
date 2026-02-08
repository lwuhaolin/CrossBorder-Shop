import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Form, Input } from 'antd';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { listUsers, adminUpdateUser, adminDeleteUser, adminToggleUserStatus } from '@/services/user';
import type { User } from '@/models/user';
import dayjs from 'dayjs';

const AdminUsers: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [form] = Form.useForm();

  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '角色',
      dataIndex: ['roles', 0, 'roleName'],
      key: 'role',
      width: 100,
      render: (_, record) => (
        <>
          {record.roles && record.roles.map((role) => (
            <span key={role.id}>{role.roleName}</span>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '禁用', status: 'error' },
        1: { text: '启用', status: 'success' },
        2: { text: '锁定', status: 'warning' },
      },
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      width: 180,
      hideInSearch: true,
      render: (text) => text && typeof text === 'string' ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      hideInSearch: true,
      render: (text) => text && typeof text === 'string' ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                username: record.username,
                nickname: record.nickname,
                email: record.email,
                phone: record.phone,
                status: record.status,
              });
              setEditModalVisible(true);
            }}
          >
            编辑
          </Button>
          {record.status === 1 ? (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => {
                Modal.confirm({
                  title: '禁用用户',
                  content: `确定要禁用用户 ${record.username} 吗？`,
                  okText: '确定',
                  cancelText: '取消',
                  onOk: async () => {
                    try {
                      await adminToggleUserStatus(record.id!, 0);
                      message.success('用户已禁用');
                      actionRef.current?.reload();
                    } catch (error) {
                      message.error('操作失败');
                    }
                  },
                });
              }}
            >
              禁用
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: '启用用户',
                  content: `确定要启用用户 ${record.username} 吗？`,
                  okText: '确定',
                  cancelText: '取消',
                  onOk: async () => {
                    try {
                      await adminToggleUserStatus(record.id!, 1);
                      message.success('用户已启用');
                      actionRef.current?.reload();
                    } catch (error) {
                      message.error('操作失败');
                    }
                  },
                });
              }}
            >
              启用
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: '删除用户',
                content: `确定要删除用户 ${record.username} 吗？此操作不可恢复。`,
                okText: '确定',
                cancelText: '取消',
                okButtonProps: { danger: true },
                onOk: async () => {
                  try {
                    await adminDeleteUser(record.id!);
                    message.success('用户已删除');
                    actionRef.current?.reload();
                  } catch (error) {
                    message.error('操作失败');
                  }
                },
              });
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onOk={async () => {
          try {
            setEditLoading(true);
            const values = await form.validateFields();
            if (editingUser?.id) {
              await adminUpdateUser(editingUser.id, {
                nickname: values.nickname,
                email: values.email,
                phone: values.phone,
              });
              message.success('用户信息已更新');
              setEditModalVisible(false);
              actionRef.current?.reload();
            }
          } catch (error) {
            message.error('更新失败');
          } finally {
            setEditLoading(false);
          }
        }}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingUser(null);
        }}
        width={500}
        confirmLoading={editLoading}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
          >
            <Input disabled placeholder="用户名不可修改" />
          </Form.Item>
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            label="电话"
            name="phone"
          >
            <Input placeholder="请输入电话号码" />
          </Form.Item>
        </Form>
      </Modal>

      <ProTable<User>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          try {
            const response = await listUsers({
              page: params.current || 1,
              pageSize: params.pageSize || 20,
              keyword: params.username,
              status: params.status,
            });
            if (response.data) {
              return {
                data: response.data.list,
                success: true,
                total: response.data.total,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        rowKey="id"
        pagination={{
          pageSize: 20,
        }}
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="string"
        headerTitle="用户管理"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              message.info('新增用户功能待实现');
            }}
          >
            新增用户
          </Button>,
        ]}
      />
    </>
  );
};

export default AdminUsers;
