import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormSelect,
  ProFormUploadButton,
  type ProFormInstance,
} from "@ant-design/pro-components";
import { Card, message } from "antd";
import { useNavigate } from "umi";
import { createProduct, uploadProductImages } from "@/services/product";
import { getCategoryList } from "@/services/category";
import { getCurrencies, getExchangeRateByPair } from "@/services/rate";
import type { ProductCreateDTO } from "@/models/product";
import type { UploadFile } from "antd";
import { useEffect, useRef, useState } from "react";

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [currencies, setCurrencies] = useState<
    {
      currencyCode: string;
      currencyName: string;
      symbol?: string;
      isBase?: number;
    }[]
  >([]);
  const [currencySymbol, setCurrencySymbol] = useState<string>("¥");
  const [lastCurrency, setLastCurrency] = useState<string | undefined>(
    undefined,
  );
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await getCurrencies();
        const list = response.data || [];
        setCurrencies(list);
        if (list.length > 0) {
          const baseCurrency = list.find((c) => c.isBase === 1);
          const defaultCurrency =
            baseCurrency?.currencyCode || list[0].currencyCode;
          formRef.current?.setFieldsValue({ currency: defaultCurrency });
          setLastCurrency(defaultCurrency);
          const symbol = list.find(
            (c) => c.currencyCode === defaultCurrency,
          )?.symbol;
          setCurrencySymbol(symbol || "¥");
        }
      } catch (error) {
        message.error("币种加载失败");
      }
    };

    loadCurrencies();
  }, []);

  const handleCurrencyChange = async (nextCurrency: string) => {
    if (!lastCurrency || lastCurrency === nextCurrency) {
      setLastCurrency(nextCurrency);
      const symbol = currencies.find(
        (c) => c.currencyCode === nextCurrency,
      )?.symbol;
      setCurrencySymbol(symbol || "¥");
      return;
    }

    try {
      const response = await getExchangeRateByPair(lastCurrency, nextCurrency);
      const rate = response.data;
      const rateValue = Number(rate);
      if (rate == null || Number.isNaN(rateValue)) {
        message.error("获取汇率失败");
        formRef.current?.setFieldsValue({ currency: lastCurrency });
        return;
      }

      const currentPrice = formRef.current?.getFieldValue("price");
      const currentOriginal = formRef.current?.getFieldValue("originalPrice");

      const nextPrice =
        typeof currentPrice === "number"
          ? Number((currentPrice * rateValue).toFixed(2))
          : currentPrice;
      const nextOriginal =
        typeof currentOriginal === "number"
          ? Number((currentOriginal * rateValue).toFixed(2))
          : currentOriginal;

      formRef.current?.setFieldsValue({
        price: nextPrice,
        originalPrice: nextOriginal,
      });

      setLastCurrency(nextCurrency);
      const symbol = currencies.find(
        (c) => c.currencyCode === nextCurrency,
      )?.symbol;
      setCurrencySymbol(symbol || "¥");
    } catch (error) {
      message.error("获取汇率失败");
      formRef.current?.setFieldsValue({ currency: lastCurrency });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const imageUrls = values.images
        ?.map((file: UploadFile) => file.response?.data || file.url)
        .filter(Boolean);

      if (!imageUrls || imageUrls.length === 0) {
        message.error("请至少上传一张商品图片");
        return false;
      }

      const data: ProductCreateDTO = {
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

      await createProduct(data);
      message.success("商品创建成功");
      navigate("/products");
      return true;
    } catch (error) {
      message.error("商品创建失败");
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

  return (
    <Card title="创建商品" bordered={false}>
      <ProForm
        formRef={formRef}
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: "创建",
            resetText: "取消",
          },
          resetButtonProps: {
            onClick: () => navigate("/products"),
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
            prefix: currencySymbol,
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
            prefix: currencySymbol,
          }}
        />

        <ProFormSelect
          name="currency"
          label="币种"
          placeholder="请选择币种"
          options={currencies.map((currency) => ({
            label: `${currency.currencyName} (${currency.currencyCode})`,
            value: currency.currencyCode,
          }))}
          fieldProps={{
            onChange: handleCurrencyChange,
          }}
          rules={[{ required: true, message: "请选择币种" }]}
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

export default CreateProduct;
