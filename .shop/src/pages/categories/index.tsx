import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormText, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { Button, Space, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/services/category';
import type { Category, CategoryCreateDTO, CategoryUpdateDTO } from '@/models/category';

const CategoryManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个分类吗？删除后，该分类下的子分类也会被删除。',
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleCreate = async (values: CategoryCreateDTO) => {
    try {
      await createCategory(values);
      message.success('创建成功');
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('创建失败');
      return false;
    }
  };

  const handleUpdate = async (values: CategoryUpdateDTO) => {
    if (!currentCategory) return false;
    
    try {
      await updateCategory(currentCategory.id, values);
      message.success('更新成功');
      setEditModalVisible(false);
      setCurrentCategory(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('更新失败');
      return false;
    }
  };

  const columns: ProColumns<Category>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '层级',
      dataIndex: 'level',
      width: 80,
      search: false,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      search: false,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 100,
      search: false,
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
      width: 150,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentCategory(record);
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
      const response = await getCategoryList();
      const categories = response.data || [];

      // Build tree structure
      const buildTree = (parentId?: number): Category[] => {
        return categories
          .filter(cat => cat.parentId === parentId)
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
          .map(cat => ({
            ...cat,
            children: buildTree(cat.id),
          }));
      };

      const tree = buildTree(undefined);

      return {
        data: tree,
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
      <ProTable<Category>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={fetchData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={false}
        dateFormatter="string"
        headerTitle="分类管理"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建分类
          </Button>,
        ]}
      />

      <ModalForm
        title="新建分类"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleCreate}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="name"
          label="分类名称"
          placeholder="请输入分类名称"
          rules={[
            { required: true, message: '请输入分类名称' },
            { max: 50, message: '分类名称不能超过50个字符' },
          ]}
        />

        <ProFormSelect
          name="parentId"
          label="父分类"
          placeholder="请选择父分类，不选则为顶级分类"
          request={async () => {
            try {
              const response = await getCategoryList();
              const categories = response.data || [];
              return [
                { label: '无（顶级分类）', value: undefined },
                ...categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                })),
              ];
            } catch (error) {
              return [];
            }
          }}
        />

        <ProFormDigit
          name="sort"
          label="排序"
          placeholder="请输入排序值"
          min={0}
          fieldProps={{
            precision: 0,
          }}
          initialValue={0}
        />

        <ProFormText
          name="icon"
          label="图标"
          placeholder="请输入图标名称或URL"
        />
      </ModalForm>

      <ModalForm
        title="编辑分类"
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) setCurrentCategory(undefined);
        }}
        initialValues={currentCategory}
        onFinish={handleUpdate}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="name"
          label="分类名称"
          placeholder="请输入分类名称"
          rules={[
            { required: true, message: '请输入分类名称' },
            { max: 50, message: '分类名称不能超过50个字符' },
          ]}
        />

        <ProFormSelect
          name="parentId"
          label="父分类"
          placeholder="请选择父分类，不选则为顶级分类"
          request={async () => {
            try {
              const response = await getCategoryList();
              const categories = response.data || [];
              // Filter out current category and its children to prevent circular reference
              const filtered = categories.filter(cat => cat.id !== currentCategory?.id);
              return [
                { label: '无（顶级分类）', value: undefined },
                ...filtered.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                })),
              ];
            } catch (error) {
              return [];
            }
          }}
        />

        <ProFormDigit
          name="sort"
          label="排序"
          placeholder="请输入排序值"
          min={0}
          fieldProps={{
            precision: 0,
          }}
        />

        <ProFormText
          name="icon"
          label="图标"
          placeholder="请输入图标名称或URL"
        />
      </ModalForm>
    </>
  );
};

export default CategoryManagement;
