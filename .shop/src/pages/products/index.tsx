import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, message, Modal, Image } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'umi';
import { getProductList, deleteProduct, updateProductStatus } from '@/services/product';
import type { Product, ProductListParams } from '@/models/product';
import { ProductStatus } from '@/models/product';
import type { PageResult } from '@/models/common';

const ProductList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个商品吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await deleteProduct(id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleStatusChange = async (id: number, status: ProductStatus) => {
    try {
      await updateProductStatus(id, status);
      message.success('状态更新成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const columns: ProColumns<Product>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '商品图片',
      dataIndex: 'mainImage',
      width: 100,
      search: false,
      render: (_, record) => (
        <Image
          width={60}
          height={60}
          src={record.mainImage || '/placeholder.png'}
          fallback="/placeholder.png"
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      width: 120,
      search: false,
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      search: false,
      render: (_, record) => `¥${record.price.toFixed(2)}`,
    },
    {
      title: '原价',
      dataIndex: 'originalPrice',
      width: 100,
      search: false,
      render: (_, record) => record.originalPrice ? `¥${record.originalPrice.toFixed(2)}` : '-',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 100,
      search: false,
      render: (_, record) => (
        <Tag color={record.stock > 0 ? 'green' : 'red'}>
          {record.stock}
        </Tag>
      ),
    },
    {
      title: '销量',
      dataIndex: 'sales',
      width: 100,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        [ProductStatus.DRAFT]: { text: '草稿', status: 'Default' },
        [ProductStatus.ACTIVE]: { text: '上架', status: 'Success' },
        [ProductStatus.INACTIVE]: { text: '下架', status: 'Error' },
      },
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
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/products/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/products/${record.id}/edit`)}
          >
            编辑
          </Button>
          {record.status === ProductStatus.ACTIVE ? (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleStatusChange(record.id, ProductStatus.INACTIVE)}
            >
              下架
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() => handleStatusChange(record.id, ProductStatus.ACTIVE)}
            >
              上架
            </Button>
          )}
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

  const fetchData = async (params: ProductListParams & { pageSize?: number; current?: number }) => {
    try {
      const { current, pageSize, ...rest } = params;
      const response = await getProductList({
        page: current,
        pageSize,
        ...rest,
      });

      const data: PageResult<Product> = response.data || { list: [], total: 0, page: 1, pageSize: 10 };

      return {
        data: data.list || [],
        success: true,
        total: data.total || 0,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  return (
    <ProTable<Product>
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
      headerTitle="商品列表"
      toolBarRender={() => [
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/products/create')}
        >
          新建商品
        </Button>,
      ]}
      rowSelection={{
        selectedRowKeys,
        onChange: setSelectedRowKeys,
      }}
      tableAlertRender={({ selectedRowKeys }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
          </span>
        </Space>
      )}
      tableAlertOptionRender={() => (
        <Space size={16}>
          <Button
            size="small"
            onClick={() => setSelectedRowKeys([])}
          >
            取消选择
          </Button>
        </Space>
      )}
    />
  );
};

export default ProductList;
