import { Card, Descriptions, Image, Tag, Space, Button, Spin } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'umi';
import { useRequest } from 'ahooks';
import { getProductDetail } from '@/services/product';
import { ProductStatus } from '@/models/product';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || '0');

  const { data: product, loading } = useRequest(
    () => getProductDetail(productId),
    {
      ready: !!productId,
      refreshDeps: [productId],
      formatResult: (res) => res.data,
    }
  );

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

  const getStatusTag = (status: ProductStatus) => {
    const statusMap = {
      [ProductStatus.DRAFT]: { color: 'default', text: '草稿' },
      [ProductStatus.ACTIVE]: { color: 'green', text: '上架' },
      [ProductStatus.INACTIVE]: { color: 'red', text: '下架' },
    };
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card
        title="商品详情"
        extra={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/products')}
            >
              返回列表
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/products/${productId}/edit`)}
            >
              编辑商品
            </Button>
          </Space>
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="商品ID">{product.id}</Descriptions.Item>
          <Descriptions.Item label="商品名称">{product.name}</Descriptions.Item>
          <Descriptions.Item label="商品分类">{product.categoryName || '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">{getStatusTag(product.status)}</Descriptions.Item>
          <Descriptions.Item label="售价">¥{product.price.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="原价">
            {product.originalPrice ? `¥${product.originalPrice.toFixed(2)}` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="库存">
            <Tag color={product.stock > 0 ? 'green' : 'red'}>{product.stock}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="销量">{product.sales || 0}</Descriptions.Item>
          <Descriptions.Item label="评分">
            {product.rating ? `${product.rating.toFixed(1)} 分` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{product.createdAt}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{product.updatedAt}</Descriptions.Item>
          <Descriptions.Item label="商品描述" span={2}>
            {product.description || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {product.images && product.images.length > 0 && (
        <Card title="商品图片">
          <Image.PreviewGroup>
            <Space size="middle" wrap>
              {product.images.map((img, index) => (
                <Image
                  key={index}
                  width={150}
                  height={150}
                  src={img}
                  fallback="/placeholder.png"
                  style={{ objectFit: 'cover' }}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        </Card>
      )}
    </Space>
  );
};

export default ProductDetail;
