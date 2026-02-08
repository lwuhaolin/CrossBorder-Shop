import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Switch, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getAddressList, createAddress, updateAddress, deleteAddress } from '@/services/address';
import type { Address } from '@/models/address';
import styles from './index.module.css';

const AddressesPage: React.FC = () => {
  const { t } = useTranslation();
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
      message.error(t('common.error'));
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
      message.success(t('address.deleted'));
      loadAddresses();
    } catch (error) {
      message.error(t('common.error'));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingAddress) {
        await updateAddress(editingAddress.id, values);
        message.success(t('address.updated'));
      } else {
        await createAddress(values);
        message.success(t('address.created'));
      }

      setModalVisible(false);
      loadAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const columns = [
    {
      title: t('address.receiverName'),
      dataIndex: 'receiverName',
      key: 'receiverName',
    },
    {
      title: t('address.phone'),
      dataIndex: 'receiverPhone',
      key: 'receiverPhone',
    },
    {
      title: t('address.detailAddress'),
      key: 'address',
      render: (record: Address) =>
        `${record.detailAddress}, ${record.city}, ${record.province}, ${record.country}`,
    },
    {
      title: t('address.default'),
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault: boolean) => (isDefault ? t('common.yes') : t('common.no')),
    },
    {
      title: t('common.edit'),
      key: 'action',
      render: (record: Address) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('address.edit')}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            {t('address.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.addressesPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('address.myAddresses')}</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('address.addAddress')}
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
          title={editingAddress ? t('address.editAddress') : t('address.addAddress')}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="receiverName"
              label={t('address.receiverName')}
              rules={[{ required: true, message: t('common.pleaseWait') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="receiverPhone"
              label={t('address.phone')}
              rules={[{ required: true, message: t('common.pleaseWait') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="country"
              label={t('address.country')}
              rules={[{ required: true, message: t('common.pleaseWait') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="detailAddress"
              label={t('address.detailAddress')}
              rules={[{ required: true, message: t('common.pleaseWait') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city"
              label={t('address.city')}
              rules={[{ required: true, message: t('common.pleaseWait') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="province"
              label={t('address.province')}
              rules={[{ required: true, message: t('common.pleaseWait') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="district"
              label={t('address.district')}
            >
              <Input />
            </Form.Item>
            <Form.Item name="isDefault" label={t('address.setDefault')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AddressesPage;
