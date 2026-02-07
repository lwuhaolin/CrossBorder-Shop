import React, { useEffect, useState } from "react";
import { Row, Col, Pagination, Select, Spin, Empty, Input } from "antd";
import { useSearchParams } from "@umijs/renderer-react";
import { getProductList } from "@/services/product";
import { getCategoryList } from "@/services/category";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/models/product";
import type { Category } from "@/models/category";
import styles from "./index.module.css";

const { Search } = Input;
const { Option } = Select;

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<string>("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category) {
      setCategoryId(Number(category));
    }
    if (search) {
      setSearchText(search);
    }
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [page, categoryId, searchText, sortBy]);

  const loadCategories = async () => {
    try {
      const response = await getCategoryList();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        pageSize,
      };

      if (categoryId) {
        params.categoryId = categoryId;
      }

      if (searchText) {
        params.keyword = searchText;
      }

      if (sortBy) {
        const [field, order] = sortBy.split("-");
        params.sortBy = field;
        params.sortOrder = order;
      }

      const response = await getProductList(params);
      const data = response.data;
      setProducts(data.list);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: number) => {
    setCategoryId(value || undefined);
    setPage(1);
    if (value) {
      setSearchParams({ category: value.toString() });
    } else {
      setSearchParams({});
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <div className={styles.productListPage}>
      <div className={styles.container}>
        {/* Filters */}
        <div className={styles.filters}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search products..."
                allowClear
                enterButton
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="Category"
                allowClear
                style={{ width: "100%" }}
                value={categoryId}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="Sort by"
                allowClear
                style={{ width: "100%" }}
                value={sortBy}
                onChange={handleSortChange}
              >
                <Option value="price-asc">Price: Low to High</Option>
                <Option value="price-desc">Price: High to Low</Option>
                <Option value="name-asc">Name: A to Z</Option>
                <Option value="name-desc">Name: Z to A</Option>
              </Select>
            </Col>
          </Row>
        </div>

        {/* Product Grid */}
        <Spin spinning={loading}>
          {products.length > 0 ? (
            <>
              <Row gutter={[16, 16]} className={styles.productGrid}>
                {products.map((product) => (
                  <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div className={styles.pagination}>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} products`}
                />
              </div>
            </>
          ) : (
            <Empty
              description="No products found"
              style={{ margin: "64px 0" }}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default ProductListPage;
