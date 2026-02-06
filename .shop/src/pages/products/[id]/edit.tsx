import { ProForm, ProFormText, ProFormTextArea, ProFormDigit, ProFormSelect, ProFormUploadButton, ProFormRadio } from '@ant-design/pro-components';
import { Card, message, Spin } from 'antd';
import { useNavigate, useParams } from 'umi';
import { useRequest } from 'ahooks';
import { getProductDetail, updateProduct, uploadProductImages } from '@/services/product';
import { getCategoryList } from '@/services/category';
import type { ProductUpdateDTO } from '@/models/product';
import { ProductStatus } from '@/models/product';
import type { UploadFile } from 'antd';
import { useState } from 'react';

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || '0');
  const [uploading, setUploading] = useState(false);

  const { data: product, loading } = useRequest(
    () => getProductDetail(productId),
    {
      ready: !!productId,
      refreshDeps: [productId],
      formatResult: (res) => res.data,
    }
  );

  const handleSubmit = async (values: any) => {
    try {
      const images = values.images?.map((file: UploadFile) => file.response?.data || file.url).filter(Boolean);
      const mainImage = images?.[0] || undefined;

      const data: ProductUpdateDTO = {
        id: productId,
        name: values.name,
        description: values.description,
        price: values.price,
        originalPrice: values.originalPrice,
        stock: values.stock,
        categoryId: values.categoryId,
        images,
        mainImage,
      };

      await updateProduct(productId, data);
      message.success('商品更新成功');
      navigate(`/products/${productId}`);
      return true;
    } catch (error) {
      message.error('商品更新失败');
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

  if (loading) {
    return (
      <Card>
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: '50px' }} />
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>商品不存在</div>
      </Card>
    );
  }

  return (
    <Card title="编辑商品" bordered={false}>
      <ProForm
        initialValues={{
          ...product,
          images: product.images?.map((url, index) => ({
            uid: `${index}`,
            name: `image-${index}`,
            status: 'done',
            url,
          })),
        }}
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: '保存',
            resetText: '取消',
          },
          resetButtonProps: {
            onClick: () => navigate(`/products/${productId}`),
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

        <ProFormRadio.Group
          name="status"
          label="商品状态"
          options={[
            { label: '草稿', value: ProductStatus.DRAFT },
            { label: '上架', value: ProductStatus.ACTIVE },
            { label: '下架', value: ProductStatus.INACTIVE },
          ]}
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

export default EditProduct;
