import { PlusOutlined, DeleteOutlined, EditOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormText, ProFormSwitch } from '@ant-design/pro-components';
import { Button, Space, message, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import { getAddressList, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/services/address';
import type { Address, AddressCreateDTO, AddressUpdateDTO } from '@/models/address';

const AddressManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | undefined>(undefined);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个地址吗？',
      onOk: async () => {
        try {
          await deleteAddress(id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      message.success('设置默认地址成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('设置失败');
    }
  };

  const handleCreate = async (values: AddressCreateDTO) => {
    try {
      await createAddress(values);
      message.success('创建成功');
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('创建失败');
      return false;
    }
  };

  const handleUpdate = async (values: AddressUpdateDTO) => {
    if (!currentAddress) return false;
    
    try {
      await updateAddress(currentAddress.id, values);
      message.success('更新成功');
      setEditModalVisible(false);
      setCurrentAddress(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('更新失败');
      return false;
    }
  };

  const columns: ProColumns<Address>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '收货人',
      dataIndex: 'receiverName',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'receiverPhone',
      width: 130,
    },
    {
      title: '所在地区',
      width: 200,
      search: false,
      render: (_, record) => `${record.province} ${record.city} ${record.district}`,
    },
    {
      title: '详细地址',
      dataIndex: 'detailAddress',
      width: 250,
      ellipsis: true,
      search: false,
    },
    {
      title: '标签',
      dataIndex: 'label',
      width: 100,
      search: false,
      render: (label: string) => label ? <Tag>{label}</Tag> : '-',
    },
    {
      title: '默认地址',
      dataIndex: 'isDefault',
      width: 100,
      search: false,
      render: (isDefault: boolean) => (
        isDefault ? <Tag color="gold" icon={<StarFilled />}>默认</Tag> : '-'
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space size="small">
          {!record.isDefault && (
            <Button
              type="link"
              size="small"
              icon={<StarOutlined />}
              onClick={() => handleSetDefault(record.id)}
            >
              设为默认
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentAddress(record);
              setEditModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await getAddressList();
      const addresses = response.data || [];

      return {
        data: addresses,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
      };
    }
  };

  return (
    <>
      <ProTable<Address>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={fetchData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        dateFormatter="string"
        headerTitle="地址管理"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建地址
          </Button>,
        ]}
      />

      <ModalForm
        title="新建地址"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleCreate}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="receiverName"
          label="收货人"
          placeholder="请输入收货人姓名"
          rules={[{ required: true, message: '请输入收货人姓名' }]}
        />

        <ProFormText
          name="receiverPhone"
          label="联系电话"
          placeholder="请输入联系电话"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
          ]}
        />

        <ProFormText
          name="province"
          label="省份"
          placeholder="请输入省份"
          rules={[{ required: true, message: '请输入省份' }]}
        />

        <ProFormText
          name="city"
          label="城市"
          placeholder="请输入城市"
          rules={[{ required: true, message: '请输入城市' }]}
        />

        <ProFormText
          name="district"
          label="区/县"
          placeholder="请输入区/县"
          rules={[{ required: true, message: '请输入区/县' }]}
        />

        <ProFormText
          name="detailAddress"
          label="详细地址"
          placeholder="请输入详细地址"
          rules={[{ required: true, message: '请输入详细地址' }]}
        />

        <ProFormText
          name="label"
          label="地址标签"
          placeholder="如：家、公司、学校"
        />

        <ProFormSwitch
          name="isDefault"
          label="设为默认地址"
          initialValue={false}
        />
      </ModalForm>

      <ModalForm
        title="编辑地址"
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) setCurrentAddress(undefined);
        }}
        initialValues={currentAddress}
        onFinish={handleUpdate}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="receiverName"
          label="收货人"
          placeholder="请输入收货人姓名"
          rules={[{ required: true, message: '请输入收货人姓名' }]}
        />

        <ProFormText
          name="receiverPhone"
          label="联系电话"
          placeholder="请输入联系电话"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
          ]}
        />

        <ProFormText
          name="province"
          label="省份"
          placeholder="请输入省份"
          rules={[{ required: true, message: '请输入省份' }]}
        />

        <ProFormText
          name="city"
          label="城市"
          placeholder="请输入城市"
          rules={[{ required: true, message: '请输入城市' }]}
        />

        <ProFormText
          name="district"
          label="区/县"
          placeholder="请输入区/县"
          rules={[{ required: true, message: '请输入区/县' }]}
        />

        <ProFormText
          name="detailAddress"
          label="详细地址"
          placeholder="请输入详细地址"
          rules={[{ required: true, message: '请输入详细地址' }]}
        />

        <ProFormText
          name="label"
          label="地址标签"
          placeholder="如：家、公司、学校"
        />

        <ProFormSwitch
          name="isDefault"
          label="设为默认地址"
        />
      </ModalForm>
    </>
  );
};

export default AddressManagement;
