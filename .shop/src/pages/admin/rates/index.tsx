import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Form, Input, InputNumber, Select } from 'antd';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import type { ActionType, ProFormInstance } from '@ant-design/pro-components';
import { getExchangeRates, createExchangeRate, updateExchangeRate, deleteExchangeRate, getCurrencies } from '@/services/rate';
import type { ExchangeRate, Currency } from '@/models/rate';
import dayjs from 'dayjs';

const AdminRates: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [editingRate, setEditingRate] = React.useState<ExchangeRate | null>(null);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  React.useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    try {
      const response = await getCurrencies();
      setCurrencies(response.data);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  const currencyOptions = currencies.map(c => ({
    label: `${c.currencyCode} - ${c.currencyName}`,
    value: c.currencyCode,
  }));

  const columns: ProColumns<ExchangeRate>[] = [
    {
      title: '源币种',
      dataIndex: 'fromCurrency',
      key: 'fromCurrency',
      width: 120,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '目标币种',
      dataIndex: 'toCurrency',
      key: 'toCurrency',
      width: 120,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '汇率',
      dataIndex: 'rate',
      key: 'rate',
      width: 120,
      render: (text) => <span>{Number(text).toFixed(4)}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      hideInSearch: true,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      hideInSearch: true,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditingRate(record);
              form.setFieldsValue({
                fromCurrency: record.fromCurrency,
                toCurrency: record.toCurrency,
                rate: record.rate,
              });
              setEditModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: '删除汇率',
                content: `确定要删除汇率 ${record.fromCurrency}/${record.toCurrency} 吗？`,
                okText: '确定',
                cancelText: '取消',
                okButtonProps: { danger: true },
                onOk: async () => {
                  try {
                    await deleteExchangeRate(record.id!);
                    message.success('汇率已删除');
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
      <ProTable<ExchangeRate>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          try {
            const response = await getExchangeRates({
              page: params.current || 1,
              pageSize: params.pageSize || 20,
              fromCurrency: params.fromCurrency,
              toCurrency: params.toCurrency,
            });
            return {
              data: response.data.list,
              success: true,
              total: response.data.total,
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
        headerTitle="汇率管理"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              addForm.resetFields();
              setAddModalVisible(true);
            }}
          >
            新增汇率
          </Button>,
        ]}
      />

      {/* 编辑汇率弹窗 */}
      <Modal
        title="编辑汇率"
        open={editModalVisible}
        okText="保存"
        cancelText="取消"
        onOk={async () => {
          try {
            const values = await form.validateFields();
            if (editingRate?.id) {
              await updateExchangeRate(editingRate.id, values);
              message.success('汇率已更新');
              setEditModalVisible(false);
              actionRef.current?.reload();
            }
          } catch (error) {
            message.error('保存失败');
          }
        }}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item label="源币种" name="fromCurrency" rules={[{ required: true }]}>
            <Select disabled options={currencyOptions} />
          </Form.Item>
          <Form.Item label="目标币种" name="toCurrency" rules={[{ required: true }]}>
            <Select disabled options={currencyOptions} />
          </Form.Item>
          <Form.Item label="汇率" name="rate" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.0001} precision={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增汇率弹窗 */}
      <Modal
        title="新增汇率"
        open={addModalVisible}
        okText="保存"
        cancelText="取消"
        onOk={async () => {
          try {
            const values = await addForm.validateFields();
            await createExchangeRate(values);
            message.success('汇率已添加');
            setAddModalVisible(false);
            actionRef.current?.reload();
          } catch (error) {
            message.error('保存失败');
          }
        }}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
      >
        <Form
          form={addForm}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item label="源币种" name="fromCurrency" rules={[{ required: true, message: '请选择源币种' }]}>
            <Select placeholder="选择源币种" options={currencyOptions} />
          </Form.Item>
          <Form.Item label="目标币种" name="toCurrency" rules={[{ required: true, message: '请选择目标币种' }]}>
            <Select placeholder="选择目标币种" options={currencyOptions} />
          </Form.Item>
          <Form.Item label="汇率" name="rate" rules={[{ required: true, message: '请输入汇率' }]}>
            <InputNumber placeholder="输入汇率" min={0} step={0.0001} precision={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminRates;
