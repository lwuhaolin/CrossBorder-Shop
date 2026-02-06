import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Switch, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAddressList, createAddress, updateAddress, deleteAddress } from '@/services/address';
import type { Address } from '@/models/address';
import styles from './index.module.css';

const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await getAddressList();
      setAddresses(response.data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      message.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAddress(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.setFieldsValue(address);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
      message.success('Address deleted successfully');
      loadAddresses();
    } catch (error) {
      message.error('Failed to delete address');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingAddress) {
        await updateAddress(editingAddress.id, values);
        message.success('Address updated successfully');
      } else {
        await createAddress(values);
        message.success('Address created successfully');
      }
      
      setModalVisible(false);
      loadAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'receiverName',
      key: 'receiverName',
    },
    {
      title: 'Phone',
      dataIndex: 'receiverPhone',
      key: 'receiverPhone',
    },
    {
      title: 'Address',
      key: 'address',
      render: (record: Address) =>
        `${record.detailAddress}, ${record.city}, ${record.province}`,
    },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault: boolean) => (isDefault ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Address) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.addressesPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Addresses</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Address
          </Button>
        </div>

        <Card className={styles.card}>
          <Table
            dataSource={addresses}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Card>

        <Modal
          title={editingAddress ? 'Edit Address' : 'Add Address'}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="receiverName"
              label="Receiver Name"
              rules={[{ required: true, message: 'Please enter receiver name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="receiverPhone"
              label="Phone"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="detailAddress"
              label="Detail Address"
              rules={[{ required: true, message: 'Please enter detail address' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="province"
              label="Province"
              rules={[{ required: true, message: 'Please enter province' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="district"
              label="District"
            >
              <Input />
            </Form.Item>
            <Form.Item name="isDefault" label="Set as Default" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AddressesPage;
