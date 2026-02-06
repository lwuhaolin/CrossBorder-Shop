import { ProForm, ProFormText, ProFormTextArea, ProFormDigit, ProFormSelect, ProFormUploadButton } from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { useNavigate } from 'umi';
import { createProduct, uploadProductImages } from '@/services/product';
import { getCategoryList } from '@/services/category';
import type { ProductCreateDTO } from '@/models/product';
import type { UploadFile } from 'antd';
import { useState } from 'react';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      const images = values.images?.map((file: UploadFile) => file.response?.data || file.url).filter(Boolean);
      const mainImage = images?.[0] || undefined;

      const data: ProductCreateDTO = {
        name: values.name,
        description: values.description,
        price: values.price,
        originalPrice: values.originalPrice,
        stock: values.stock,
        categoryId: values.categoryId,
        images,
        mainImage,
      };

      await createProduct(data);
      message.success('商品创建成功');
      navigate('/products');
      return true;
    } catch (error) {
      message.error('商品创建失败');
      return false;
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await uploadProductImages(file);
      setUploading(false);
      if (response.data) {
        return response.data;
      }
      throw new Error('上传失败');
    } catch (error) {
      setUploading(false);
      message.error('图片上传失败');
      throw error;
    }
  };

  return (
    <Card title="创建商品" bordered={false}>
      <ProForm
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: '创建',
            resetText: '取消',
          },
          resetButtonProps: {
            onClick: () => navigate('/products'),
          },
        }}
      >
        <ProFormText
          name="name"
          label="商品名称"
          placeholder="请输入商品名称"
          rules={[
            { required: true, message: '请输入商品名称' },
            { max: 100, message: '商品名称不能超过100个字符' },
          ]}
        />

        <ProFormTextArea
          name="description"
          label="商品描述"
          placeholder="请输入商品描述"
          fieldProps={{
            rows: 4,
            maxLength: 500,
            showCount: true,
          }}
        />

        <ProFormDigit
          name="price"
          label="售价"
          placeholder="请输入售价"
          min={0}
          fieldProps={{
            precision: 2,
            prefix: '¥',
          }}
          rules={[{ required: true, message: '请输入售价' }]}
        />

        <ProFormDigit
          name="originalPrice"
          label="原价"
          placeholder="请输入原价"
          min={0}
          fieldProps={{
            precision: 2,
            prefix: '¥',
          }}
        />

        <ProFormDigit
          name="stock"
          label="库存"
          placeholder="请输入库存数量"
          min={0}
          fieldProps={{
            precision: 0,
          }}
          rules={[{ required: true, message: '请输入库存数量' }]}
        />

        <ProFormSelect
          name="categoryId"
          label="商品分类"
          placeholder="请选择商品分类"
          request={async () => {
            try {
              const response = await getCategoryList();
              const categories = response.data || [];
              return categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }));
            } catch (error) {
              return [];
            }
          }}
        />

        <ProFormUploadButton
          name="images"
          label="商品图片"
          max={5}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            customRequest: async ({ file, onSuccess, onError }) => {
              try {
                const url = await handleUpload(file as File);
                onSuccess?.({ data: url });
              } catch (error) {
                onError?.(error as Error);
              }
            },
          }}
          extra="最多上传5张图片，第一张为主图"
        />
      </ProForm>
    </Card>
  );
};

export default CreateProduct;
