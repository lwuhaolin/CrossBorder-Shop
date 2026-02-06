import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  ProTable,
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Button, Space, message, Modal } from "antd";
import { useRef, useState } from "react";
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category";
import type {
  Category,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "@/models/category";

const CategoryManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(
    undefined,
  );

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个分类吗？删除后，该分类下的子分类也会被删除。",
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success("删除成功");
          actionRef.current?.reload();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  const handleCreate = async (values: CategoryCreateDTO) => {
    try {
      // 自动计算层级
      let level = 1; // 默认为顶级分类
      if (values.parentId) {
        // 如果有父分类，获取父分类信息
        const response = await getCategoryList();
        const categories = response.data || [];
        const parentCategory = categories.find(
          (cat) => cat.id === values.parentId,
        );
        if (parentCategory) {
          level = (parentCategory.level || 1) + 1;
        }
      }

      // 添加层级到提交数据
      const submitData = {
        ...values,
        level,
        parentId: values.parentId || 0, // 如果没有父分类，设为0
      };

      await createCategory(submitData);
      message.success("创建成功");
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || "";
      message.error(errorMsg || "创建失败");
      return false;
    }
  };

  const handleUpdate = async (values: CategoryUpdateDTO) => {
    if (!currentCategory) return false;

    try {
      // 自动计算层级
      let level = 1; // 默认为顶级分类
      if (values.parentId) {
        // 如果有父分类，获取父分类信息
        const response = await getCategoryList();
        const categories = response.data || [];
        const parentCategory = categories.find(
          (cat) => cat.id === values.parentId,
        );
        if (parentCategory) {
          level = (parentCategory.level || 1) + 1;
        }
      }

      // 添加层级到提交数据
      const submitData = {
        ...values,
        level,
        parentId: values.parentId || 0, // 如果没有父分类，设为0
      };

      await updateCategory(currentCategory.id, submitData);
      message.success("更新成功");
      setEditModalVisible(false);
      setCurrentCategory(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      // 检查是否是重复编码错误
      const errorMsg = error?.response?.data?.message || error?.message || "";
      if (
        errorMsg.includes("Duplicate") ||
        errorMsg.includes("重复") ||
        errorMsg.includes("uk_category_code")
      ) {
        message.error("分类编码已存在，请使用其他编码");
      } else {
        message.error(errorMsg || "更新失败");
      }
      return false;
    }
  };

  const columns: ProColumns<Category>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "分类名称",
      dataIndex: "categoryName",
      width: 200,
    },
    {
      title: "分类编码",
      dataIndex: "categoryCode",
      width: 150,
      search: false,
    },
    {
      title: "层级",
      dataIndex: "level",
      width: 80,
      search: false,
    },
    {
      title: "排序",
      dataIndex: "sort",
      width: 80,
      search: false,
    },
    {
      title: "图标",
      dataIndex: "icon",
      width: 100,
      search: false,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180,
      search: false,
      valueType: "dateTime",
    },
    {
      title: "操作",
      width: 150,
      fixed: "right",
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
      const buildTree = (parentId?: number | null): Category[] => {
        return categories
          .filter((cat) => {
            // 处理顶级分类：parentId为0、null或undefined都视为顶级
            if (parentId === undefined || parentId === null || parentId === 0) {
              return (
                cat.parentId === 0 ||
                cat.parentId === null ||
                cat.parentId === undefined
              );
            }
            return cat.parentId === parentId;
          })
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
          .map((cat) => ({
            ...cat,
            children: buildTree(cat.id),
          }));
      };

      const tree = buildTree(0);

      return {
        data: tree,
        success: true,
      };
    } catch (error) {
      console.error("获取分类列表失败:", error);
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
          labelWidth: "auto",
        }}
        pagination={false}
        dateFormatter="string"
        headerTitle="分类管理"
        expandable={{
          defaultExpandAllRows: true,
        }}
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
          name="categoryName"
          label="分类名称"
          placeholder="请输入分类名称"
          rules={[
            { required: true, message: "请输入分类名称" },
            { max: 50, message: "分类名称不能超过50个字符" },
          ]}
        />

        <ProFormText
          name="categoryCode"
          label="分类编码"
          placeholder="请输入分类编码（英文大写，如：FLOWER）"
          tooltip="分类编码必须唯一，不能与已有分类重复"
          rules={[
            { required: true, message: "请输入分类编码" },
            {
              pattern: /^[A-Z_]+$/,
              message: "分类编码只能包含大写字母和下划线",
            },
            { max: 50, message: "分类编码不能超过50个字符" },
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
                { label: "无（顶级分类）", value: undefined },
                ...categories.map((cat) => ({
                  label: cat.categoryName,
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
          placeholder="请输入排序值（数字越小越靠前）"
          tooltip="用于控制分类显示顺序，数字越小越靠前"
          min={0}
          fieldProps={{
            precision: 0,
          }}
          initialValue={1}
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
          name="categoryName"
          label="分类名称"
          placeholder="请输入分类名称"
          rules={[
            { required: true, message: "请输入分类名称" },
            { max: 50, message: "分类名称不能超过50个字符" },
          ]}
        />

        <ProFormText
          name="categoryCode"
          label="分类编码"
          placeholder="请输入分类编码（英文大写，如：FLOWER）"
          tooltip="分类编码必须唯一，不能与已有分类重复"
          rules={[
            { required: true, message: "请输入分类编码" },
            {
              pattern: /^[A-Z_]+$/,
              message: "分类编码只能包含大写字母和下划线",
            },
            { max: 50, message: "分类编码不能超过50个字符" },
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
              const filtered = categories.filter(
                (cat) => cat.id !== currentCategory?.id,
              );
              return [
                { label: "无（顶级分类）", value: undefined },
                ...filtered.map((cat) => ({
                  label: cat.categoryName,
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
          placeholder="请输入排序值（数字越小越靠前）"
          tooltip="用于控制分类显示顺序，数字越小越靠前"
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
