import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormSelect,
  ProFormUploadButton,
  ProFormRadio,
  type ProFormInstance,
} from "@ant-design/pro-components";
import { Card, message, Spin } from "antd";
import { useNavigate, useParams, useLocation } from "umi";
import { useRequest } from "ahooks";
import {
  getProductDetail,
  updateProduct,
  uploadProductImages,
} from "@/services/product";
import { getCategoryList } from "@/services/category";
import type { ProductUpdateDTO, Product } from "@/models/product";
import { ProductStatus } from "@/models/product";
import type { UploadFile } from "antd";
import { useState, useEffect, useRef } from "react";

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "0");
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [productData, setProductData] = useState<Product | null>(
    (location.state as any)?.product || null,
  );
  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
  const staticBaseUrl = apiBaseUrl.endsWith("/api")
    ? apiBaseUrl
    : `${apiBaseUrl}/api`;

  const normalizeImageUrl = (url?: string | null) => {
    if (!url) {
      return undefined;
    }
    if (url.startsWith("http")) {
      return url;
    }
    return `${staticBaseUrl}${url}`;
  };

  const normalizeImageForSave = (url?: string | null) => {
    if (!url) {
      return undefined;
    }
    if (url.startsWith(staticBaseUrl)) {
      return url.slice(staticBaseUrl.length);
    }
    // handle http base without /api
    const altBaseUrl = apiBaseUrl.replace(/\/api$/, "");
    if (url.startsWith(altBaseUrl)) {
      return url.slice(altBaseUrl.length);
    }
    return url;
  };

  // 编辑页始终请求详情，确保图片等字段最新
  const { data: response, loading } = useRequest(
    () => getProductDetail(productId),
    {
      ready: !!productId,
      refreshDeps: [productId],
    },
  );

  useEffect(() => {
    if (response?.data) {
      setProductData(response.data);
    }
  }, [response]);

  const product = productData;

  useEffect(() => {
    if (!product) return;
    formRef.current?.setFieldsValue({
      ...product,
      name: product.name,
      images: product.images?.map((url, index) => ({
        uid: `${index}`,
        name: `image-${index}`,
        status: "done",
        url: normalizeImageUrl(url),
      })),
    });
  }, [product]);

  const handleSubmit = async (values: any) => {
    try {
      const imageUrls = Array.from(
        new Set(
          (values.images || [])
            .map((file: UploadFile) => file.response?.data || file.url)
            .map((url: string) => normalizeImageForSave(url))
            .filter(Boolean),
        ),
      ) as string[];

      if (!imageUrls || imageUrls.length === 0) {
        message.error("请至少上传一张商品图片");
        return false;
      }

      const data: ProductUpdateDTO = {
        id: productId,
        productName: values.name,
        description: values.description,
        price: values.price,
        originalPrice: values.originalPrice,
        currency: values.currency,
        stock: values.stock,
        categoryId: values.categoryId,
        imageUrls,
        mainImageIndex: 0,
      };

      await updateProduct(productId, data);
      message.success("商品更新成功");
      navigate(`/products/${productId}`);
      return true;
    } catch (error) {
      message.error("商品更新失败");
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
      throw new Error("上传失败");
    } catch (error) {
      setUploading(false);
      message.error("图片上传失败");
      throw error;
    }
  };

  if (loading) {
    return (
      <Card>
        <Spin
          size="large"
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        />
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px" }}>商品不存在</div>
      </Card>
    );
  }

  return (
    <Card title="编辑商品" bordered={false}>
      <ProForm
        formRef={formRef}
        initialValues={{
          ...product,
          images: product.images?.map((url, index) => ({
            uid: `${index}`,
            name: `image-${index}`,
            status: "done",
            url,
          })),
        }}
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: "保存",
            resetText: "取消",
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
            { required: true, message: "请输入商品名称" },
            { max: 100, message: "商品名称不能超过100个字符" },
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
            prefix: "¥",
          }}
          rules={[{ required: true, message: "请输入售价" }]}
        />

        <ProFormDigit
          name="originalPrice"
          label="原价"
          placeholder="请输入原价"
          min={0}
          fieldProps={{
            precision: 2,
            prefix: "¥",
          }}
        />

        <ProFormSelect
          name="currency"
          label="币种"
          placeholder="请选择币种"
          options={[
            { label: "人民币 (CNY)", value: "CNY" },
            { label: "美元 (USD)", value: "USD" },
            { label: "欧元 (EUR)", value: "EUR" },
            { label: "日元 (JPY)", value: "JPY" },
          ]}
          initialValue="CNY"
        />

        <ProFormDigit
          name="stock"
          label="库存"
          placeholder="请输入库存数量"
          min={0}
          fieldProps={{
            precision: 0,
          }}
          rules={[{ required: true, message: "请输入库存数量" }]}
        />

        <ProFormSelect
          name="categoryId"
          label="商品分类"
          placeholder="请选择商品分类"
          rules={[{ required: true, message: "请选择商品分类" }]}
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
            { label: "草稿", value: ProductStatus.DRAFT },
            { label: "上架", value: ProductStatus.ACTIVE },
            { label: "下架", value: ProductStatus.INACTIVE },
          ]}
        />

        <ProFormUploadButton
          name="images"
          label="商品图片"
          max={5}
          rules={[{ required: true, message: "请上传商品图片" }]}
          fieldProps={{
            name: "file",
            listType: "picture-card",
            customRequest: async ({ file, onSuccess, onError }) => {
              try {
                const url = await handleUpload(file as File);
                onSuccess?.({ data: url });
              } catch (error) {
                onError?.(error as Error);
              }
            },
          }}
          extra="最多上传5张图片，第一张为主图（必填）"
        />
      </ProForm>
    </Card>
  );
};

export default EditProduct;
