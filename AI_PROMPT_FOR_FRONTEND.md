# 跨境日用小商品订货系统 · 前端改造与扩展 AI Prompt

## 项目概述

### 项目基本信息

- **项目名称**：跨境日用小商品订货系统（CrossBorder Shop）
- **项目类型**：前端改造与扩展项目
- **主要目标**：改写管理端前端（shop）并创建全新用户端前端（user）
- **后端API文档**：`default_OpenAPI.json`（OpenAPI 3.0.1 规范）
- **后端基础URL**：`http://localhost:8080/api`

---

## 一、现有管理端项目分析

### 1.1 技术栈

- **框架**：Umi 4 (基于 React 18)
- **UI组件库**：Ant Design 5 + Ant Design Pro Components
- **开发语言**：TypeScript 5
- **包管理**：npm
- **HTTP客户端**：axios
- **状态管理**：(需确认现有实现)
- **工具库**：ahooks、lodash、luxon、react-countup、@antv/l7、@ant-design/charts

### 1.2 现有项目结构

```
.shop/
├── src/
│   ├── pages/
│   │   ├── dashboard/          # 仪表盘模块（包含各类统计卡片）
│   │   ├── order/              # 订单管理模块
│   │   └── entity/             # 实体管理模块
│   ├── layouts/                # 布局组件
│   ├── utils/                  # 工具函数
│   ├── assets/                 # 静态资源
│   └── .umi/                   # Umi框架生成的配置
├── package.json
└── ...
```

### 1.3 现有管理端特点

- 使用 Ant Design Pro Components 提供企业级UI
- 支持统计图表（销售、库存、损坏等）
- 仪表盘设计完整，模块化布局
- TypeScript 全量覆盖，类型安全

---

## 二、管理端改写任务（Shop Admin）

### 2.1 改写范围

基于现有花店管理端代码结构和风格，改写为通用的跨境日用小商品订货系统管理端。

### 2.2 功能模块清单

#### 2.2.1 用户管理模块 (User Management)

**API端点**：

- `PUT /user/update` - 更新用户信息
- `PUT /user/password` - 修改密码
- `GET /user/info` - 获取用户信息
- `POST /user/logout` - 登出

**页面需求**：

- [ ] 用户登录页面（用户名/密码登录，JWT Token处理）
- [ ] 用户个人信息页（查看、修改基本信息）
- [ ] 密码修改页面（安全验证）
- [ ] 权限管理界面（显示用户角色和权限）

**功能特性**：

- JWT Token 自动刷新机制
- 会话超时提示与自动登出
- 用户头像展示
- 登出清除本地数据

---

#### 2.2.2 商品管理模块 (Product Management)

**API端点**：

- `POST /product/create` - 创建商品
- `PUT /product/{id}` - 更新商品
- `DELETE /product/{id}` - 删除商品
- `GET /product/{id}` - 获取商品详情
- `GET /product/list` - 获取商品列表（分页、筛选）
- `POST /product/upload-images` - 上传商品图片
- `PUT /product/{id}/status` - 更新商品状态（上架/下架）

**页面需求**：

- [ ] 商品列表页（表格展示，支持分页、搜索、过滤）
- [ ] 商品编辑页（创建/编辑商品，富文本编辑器）
- [ ] 商品图片管理（多图上传、拖拽排序、主图设置）
- [ ] 商品分类选择（树形选择器）
- [ ] 商品详情预览

**功能特性**：

- 支持批量操作（批量上架/下架/删除）
- 图片拖拽上传预览
- 库存实时显示和修改
- 价格区间筛选
- 状态快速切换

---

#### 2.2.3 商品分类管理 (Category Management)

**API端点**：

- `POST /category/create` - 创建分类
- `PUT /category/{id}` - 更新分类
- `DELETE /category/{id}` - 删除分类
- `GET /category/tree` - 获取分类树（含子分类）
- `GET /category/list` - 获取分类列表

**页面需求**：

- [ ] 分类树形管理页面（拖拽排序、展开收起）
- [ ] 分类编辑对话框（增删改）
- [ ] 分类排序页面

**功能特性**：

- 树形结构展示与编辑
- 父子分类关联
- 支持多级分类（1-2级）
- 批量操作

---

#### 2.2.4 订单管理模块 (Order Management)

**API端点**：

- `GET /order/list` - 获取订单列表（分页、筛选）
- `GET /order/{id}` - 获取订单详情
- `PUT /order/{id}/status` - 更新订单状态
- `PUT /order/{id}/ship` - 发货操作
- `PUT /order/{id}/cancel` - 取消订单
- `POST /order/{id}/refund` - 退款申请

**页面需求**：

- [ ] 订单列表页（支持高级筛选：状态、时间、金额、买家等）
- [ ] 订单详情页（订单信息、商品列表、地址、时间轴）
- [ ] 订单操作页（发货、取消、退款等）
- [ ] 订单物流追踪页

**功能特性**：

- 多条件复杂搜索
- 订单状态流转可视化
- 发货单生成与打印
- 物流实时更新
- 订单导出（Excel）
- 订单备注与沟通记录

---

#### 2.2.5 购物车管理模块 (Cart Management - 可选后端)

**API端点**：

- `POST /cart/add` - 添加商品到购物车
- `GET /cart/{userId}` - 获取购物车
- `PUT /cart/item/{id}` - 更新购物车商品
- `DELETE /cart/item/{id}` - 删除购物车商品
- `DELETE /cart/clear` - 清空购物车

**页面需求**：

- [ ] 购物车管理页面（管理员视角，支持用户购物车查看）

---

#### 2.2.6 收货地址管理 (Shipping Address)

**API端点**：

- `GET /address/list` - 获取地址列表
- `POST /address/create` - 新增地址
- `PUT /address/{id}` - 更新地址
- `DELETE /address/{id}` - 删除地址
- `PUT /address/{id}/default` - 设置默认地址

**页面需求**：

- [ ] 地址管理页面（列表、编辑、新增、删除）
- [ ] 地址表单组件（省市区选择器）

---

#### 2.2.7 仪表盘 (Dashboard)

**页面需求**：

- [ ] 数据概览卡片（总销售额、订单数、用户数、商品数）
- [ ] 销售趋势图表（折线图，支持时间范围选择）
- [ ] 热销商品排行（柱状图，TOP 10）
- [ ] 订单状态分布（饼图/环形图）
- [ ] 库存预警提示（库存不足的商品列表）
- [ ] 最近订单列表（快速查看）

**功能特性**：

- 支持时间范围选择（日/周/月/自定义）
- 数据实时刷新
- 图表导出
- 关键指标对比（环比/同比）

---

### 2.3 改写标准与规范

#### 2.3.1 代码规范

- **命名规范**：
  - 文件夹：kebab-case（如：user-management）
  - 组件/页面：PascalCase（如：UserManagement.tsx）
  - 变量/函数：camelCase（如：getUserList）
  - 常量：UPPER_SNAKE_CASE（如：API_BASE_URL）

- **文件组织**：
  ```
  src/
  ├── pages/                # 页面组件
  │   ├── dashboard/
  │   ├── products/
  │   ├── categories/
  │   ├── orders/
  │   ├── addresses/
  │   └── user/
  ├── components/           # 公共组件
  │   ├── Form/
  │   ├── Table/
  │   ├── Modal/
  │   └── ...
  ├── services/             # API服务层
  │   ├── user.ts
  │   ├── product.ts
  │   ├── order.ts
  │   └── ...
  ├── models/               # 数据模型与类型定义
  │   ├── user.ts
  │   ├── product.ts
  │   └── ...
  ├── hooks/                # 自定义Hooks
  │   ├── useRequest.ts
  │   └── ...
  ├── utils/                # 工具函数
  │   ├── request.ts        # axios拦截器配置
  │   ├── auth.ts           # 认证工具
  │   └── ...
  ├── styles/               # 全局样式
  └── layouts/              # 布局组件
  ```

#### 2.3.2 UI/UX规范

- 继承现有Ant Design Pro风格
- 所有列表使用 ProTable（支持排序、筛选、分页）
- 所有表单使用 ProForm（自动布局、校验）
- 所有模态框使用 ProModal（统一风格）
- 响应式设计，支持移动端预览

#### 2.3.3 API集成规范

- 所有API调用封装在 `services/` 目录
- 统一的错误处理和重试机制
- JWT Token在请求头中自动携带
- Token过期自动刷新（refresh token）
- 请求/响应拦截器统一处理

#### 2.3.4 类型安全

- 所有API响应定义TypeScript接口
- 所有Props定义接口并导出
- 不使用 `any` 类型，优先使用 `unknown` + 类型守卫

#### 2.3.5 性能优化

- 使用 React.memo 避免不必要的重渲染
- 使用 useCallback 缓存回调函数
- 列表虚拟滚动（大数据场景）
- 图片懒加载

---

## 三、用户端新建项目任务（Shop User）

### 3.1 项目初始化

- **项目名**：`user`
- **位置**：与 `.shop/` 同级
- **技术栈**：保持一致（Umi 4 + React 18 + TypeScript 5 + Ant Design 5）
- **包管理**：npm

### 3.2 功能模块清单

#### 3.2.1 首页与商品浏览 (Home & Product Browsing)

**API端点**：

- `GET /product/list` - 获取商品列表（分页、筛选、搜索）
- `GET /product/{id}` - 获取商品详情
- `GET /category/tree` - 获取分类树

**页面需求**：

- [ ] 首页（轮播图、热销推荐、分类导航）
- [ ] 商品列表页（网格/列表切换、分类筛选、搜索、排序）
- [ ] 商品详情页（图片预览、规格选择、价格显示、库存状态）
- [ ] 分类浏览页（分类树形导航）

**功能特性**：

- 商品图片预览与放大
- 规格选择与库存实时检查
- 价格比较与折扣展示
- 评分与评论展示
- 收藏夹功能
- 分享功能（社交媒体）

---

#### 3.2.2 购物车 (Shopping Cart)

**API端点**：

- `POST /cart/add` - 添加商品到购物车
- `GET /cart/{userId}` - 获取购物车
- `PUT /cart/item/{id}` - 更新购物车商品
- `DELETE /cart/item/{id}` - 删除购物车商品
- `DELETE /cart/clear` - 清空购物车
- `GET /cart/calculate` - 计算购物车总价（含运费、优惠）

**页面需求**：

- [ ] 购物车页面（左侧购物车列表、右侧结算面板）
- [ ] 购物车编辑（修改数量、删除商品、收藏商品）
- [ ] 结算信息预览（小计、运费、优惠、总计）

**功能特性**：

- 实时更新价格和库存
- 支持批量删除
- 支持优惠券选择
- 支持礼物消息卡片
- 库存不足提示与推荐替代品

---

#### 3.2.3 用户认证与账户 (User Authentication & Account)

**API端点**：

- `POST /user/register` - 注册
- `POST /user/login` - 登录（返回JWT Token）
- `POST /user/logout` - 登出
- `PUT /user/update` - 更新用户信息
- `PUT /user/password` - 修改密码
- `GET /user/info` - 获取用户信息

**页面需求**：

- [ ] 注册页面（邮箱/手机号注册、验证码、密码确认）
- [ ] 登录页面（用户名/邮箱登录、社交登录、找回密码）
- [ ] 忘记密码页面（邮箱重置密码流程）
- [ ] 个人中心页面（个人信息、订单历史、收藏、地址管理）
- [ ] 账户设置页（修改密码、邮箱绑定、手机绑定）

**功能特性**：

- 社交登录集成（可选：Google、Facebook等）
- 邮箱验证与激活
- 密码强度提示
- 会话管理与登出
- 登录设备管理
- 支持两步验证（可选）

---

#### 3.2.4 订单与结算 (Order & Checkout)

**API端点**：

- `POST /order/create` - 创建订单
- `GET /order/list` - 获取用户订单列表
- `GET /order/{id}` - 获取订单详情
- `PUT /order/{id}/cancel` - 取消订单
- `POST /order/{id}/refund` - 申请退款
- `GET /logistics/{orderId}` - 获取物流信息

**页面需求**：

- [ ] 结算页面（地址选择、运费计算、优惠券应用、支付方式选择）
- [ ] 订单确认页（订单预览、价格详情、条款同意）
- [ ] 订单列表页（筛选：待支付、已支付、已发货、已完成、已取消）
- [ ] 订单详情页（订单信息、商品列表、收货地址、物流追踪）
- [ ] 退货退款申请页（申请原因、图片上传、进度跟踪）

**功能特性**：

- 地址簿管理（新增、编辑、删除、快速选择）
- 运费自动计算（基于地址和重量）
- 多种支付方式集成（支付宝、微信、PayPal等）
- 订单时间轴展示
- 物流实时跟踪
- 订单取消与退款流程
- 发票申请与下载

---

#### 3.2.5 收货地址管理 (Shipping Address)

**API端点**：

- `GET /address/list` - 获取地址列表
- `POST /address/create` - 新增地址
- `PUT /address/{id}` - 更新地址
- `DELETE /address/{id}` - 删除地址
- `PUT /address/{id}/default` - 设置默认地址

**页面需求**：

- [ ] 地址簿页面（地址列表、编辑、删除、设置默认）
- [ ] 地址编辑对话框（省市区级联选择、详细地址、姓名、电话）
- [ ] 地址快速选择器（在结算页面中使用）

**功能特性**：

- 省市区三级级联选择
- 默认地址高亮显示
- 地址编辑与删除确认
- 地址标签（家、公司等）
- 地址搜索与排序

---

#### 3.2.6 用户收藏与历史 (Favorites & History)

**API端点**：

- `POST /user/favorite/{productId}` - 收藏商品
- `DELETE /user/favorite/{productId}` - 取消收藏
- `GET /user/favorites` - 获取收藏列表
- `GET /user/history` - 获取浏览历史

**页面需求**：

- [ ] 收藏夹页面（收藏商品列表、删除、加入购物车）
- [ ] 浏览历史页面（最近浏览商品、清空历史）

**功能特性**：

- 实时同步服务端与本地存储
- 快速操作（加入购物车、删除）
- 按分类整理收藏

---

#### 3.2.7 评价与反馈 (Reviews & Feedback)

**API端点**：

- `POST /product/{id}/review` - 提交商品评价
- `GET /product/{id}/reviews` - 获取商品评价列表

**页面需求**：

- [ ] 订单评价页面（星级评分、文本评价、图片上传）
- [ ] 商品评价列表（评分筛选、图片预览）

**功能特性**：

- 星级评分与文本评价
- 评价图片与视频上传
- 匿名评价选项
- 评价点赞与帮助投票

---

#### 3.2.8 多币种支持 (Multi-Currency Support)

**API端点**：

- `GET /currency/list` - 获取可用币种
- `GET /currency/rate/{from}/{to}` - 获取汇率
- `POST /order/convert-currency` - 订单货币转换

**功能需求**：

- [ ] 货币选择器（页面右上角或设置中）
- [ ] 价格实时转换显示
- [ ] 订单结算时确认汇率与目标币种

**功能特性**：

- 自动检测用户地区与推荐币种
- 实时汇率展示
- 订单原币种与换算币种对比显示
- 手续费透明显示

---

### 3.3 用户端UI/UX设计规范

#### 3.3.1 整体风格

- **配色方案**：清爽、现代，适合电商场景
- **主色调**：根据品牌调整（如：鲜花主题可用紫/粉色）
- **布局**：响应式设计，移动优先
- **交互**：简洁直观，减少用户学习成本

#### 3.3.2 必备组件

- 导航栏（顶部导航 + 分类导航）
- 轮播图（首页）
- 商品卡片（网格/列表）
- 购物车悬浮球（快速访问）
- 返回顶部按钮
- 页脚（联系方式、友情链接、ICP备案）
- 加载状态与空状态提示
- Toast 通知提示

#### 3.3.3 移动端适配

- 底部标签栏导航（移动端）
- 侧滑菜单（移动端）
- 手指友好的点击区域
- 竖屏与横屏适配

---

## 四、全局开发要求

### 4.1 API集成与数据流

- **API文档来源**：`default_OpenAPI.json`
- **请求库**：axios
- **拦截器实现**：
  - 请求拦截器：自动添加JWT Token到Authorization头
  - 响应拦截器：统一处理错误，自动刷新Token
  - 错误处理：统一的错误提示和日志记录

### 4.2 状态管理

- **方案**：推荐使用 ahooks 的 useRequest + localStorage 结合
- **全局状态**：用户信息、认证状态、购物车（可选）
- **本地存储**：购物车、浏览历史、用户偏好

### 4.3 路由设计

**管理端路由结构**：

```
/
├── /login                  # 管理员登录
├── /dashboard              # 仪表盘
├── /products               # 商品管理
│   ├── /list               # 列表
│   ├── /create             # 新建
│   └── /:id/edit           # 编辑
├── /categories             # 分类管理
├── /orders                 # 订单管理
│   ├── /list               # 列表
│   └── /:id                # 详情
├── /addresses              # 地址管理
├── /user                   # 用户设置
│   ├── /profile            # 个人资料
│   ├── /password           # 修改密码
│   └── /logout             # 登出
└── /*                      # 404页面
```

**用户端路由结构**：

```
/
├── /                       # 首页
├── /login                  # 登录
├── /register               # 注册
├── /forgot-password        # 忘记密码
├── /products               # 商品列表
│   ├── /?category=:id      # 分类筛选
│   └── /?search=:keyword   # 搜索结果
├── /product/:id            # 商品详情
├── /cart                   # 购物车
├── /checkout               # 结算
├── /user                   # 用户中心
│   ├── /profile            # 个人资料
│   ├── /orders             # 订单列表
│   ├── /order/:id          # 订单详情
│   ├── /addresses          # 地址管理
│   ├── /favorites          # 收藏夹
│   ├── /history            # 浏览历史
│   ├── /settings           # 账户设置
│   └── /logout             # 登出
└── /*                      # 404页面
```

### 4.4 错误处理与日志

- 统一的错误边界（Error Boundary）
- 用户友好的错误提示
- 开发环境详细日志，生产环境精简日志
- 关键操作的审计日志

### 4.5 安全性要求

- **JWT Token 处理**：
  - 存储在 localStorage（考虑安全性，可选 sessionStorage）
  - 自动刷新机制（refresh token）
  - 登出清除Token
- **密码安全**：
  - 前端验证最小长度、复杂度
  - HTTPS传输
  - 不在代码中硬编码敏感信息
- **CORS配置**：
  - 仅允许后端配置的来源

### 4.6 性能指标

- **页面加载时间**：< 3 秒（3G网络）
- **FCP (First Contentful Paint)**：< 1.5 秒
- **LCP (Largest Contentful Paint)**：< 2.5 秒
- **交互响应时间**：< 100ms

### 4.7 浏览器兼容性

- Chrome（最新2个版本）
- Firefox（最新2个版本）
- Safari（最新2个版本）
- Edge（最新2个版本）
- 移动端浏览器（iOS Safari、Chrome Mobile）

---

## 五、项目交付清单

### 5.1 管理端 (.shop) 交付清单

- [ ] 完整的页面组件（上述所有模块）
- [ ] 完整的API服务层 (services/)
- [ ] 完整的数据模型与类型定义 (models/)
- [ ] 统一的错误处理与日志系统
- [ ] 完整的响应式设计与移动端适配
- [ ] README.md（开发指南、启动说明、贡献指南）
- [ ] .env.example（环境变量模板）
- [ ] API集成测试（可选）
- [ ] 单元测试（关键函数，覆盖率 > 70%）

### 5.2 用户端 (user) 交付清单

- [ ] 完整的页面组件（上述所有模块）
- [ ] 完整的API服务层 (services/)
- [ ] 完整的数据模型与类型定义 (models/)
- [ ] 完整的响应式设计与移动端适配
- [ ] 购物流程完整性测试
- [ ] 支付流程集成（演示环境支持测试账户）
- [ ] README.md（开发指南、启动说明、贡献指南）
- [ ] .env.example（环境变量模板）
- [ ] 用户文档（FAQ、操作指南）

### 5.3 通用交付物

- [ ] 共享的公共组件库 (common-components/)
- [ ] 共享的工具函数库 (common-utils/)
- [ ] TypeScript 类型定义文件 (types/)
- [ ] API 类型定义文件（根据 OpenAPI 生成）
- [ ] 项目整体README.md（包含架构说明、部署指南）

---

## 六、开发工作流建议

### 6.1 开发顺序

1. **第一阶段**：搭建项目框架、API层、公共组件
2. **第二阶段**：开发管理端核心模块（用户、商品、订单）
3. **第三阶段**：开发用户端核心模块（首页、商品浏览、购物车、订单）
4. **第四阶段**：优化、测试、性能调优
5. **第五阶段**：部署与上线

### 6.2 每日进度检查点

- 开发的功能模块数量
- 代码覆盖率
- 已解决的Bug与Issue数
- 性能指标是否达标

### 6.3 代码审查清单

- [ ] 代码风格符合规范
- [ ] TypeScript类型完整无 `any`
- [ ] 错误处理完善
- [ ] 性能优化到位
- [ ] 单元测试覆盖
- [ ] 可访问性（Accessibility）考虑

---

## 七、参考资源

- **Umi 文档**：https://umijs.org/
- **Ant Design 文档**：https://ant.design/
- **Ant Design Pro Components 文档**：https://procomponents.ant.design/
- **React 官方文档**：https://react.dev/
- **TypeScript 官方文档**：https://www.typescriptlang.org/
- **后端 OpenAPI 规范**：`default_OpenAPI.json`
- **项目后端 README**：`.backend/README.md`

---

## 八、注意事项与最佳实践

### 8.1 开发注意事项

1. **不要硬编码API地址**：使用环境变量 `REACT_APP_API_BASE_URL`
2. **不要在代码中存储敏感信息**：使用 .env 文件
3. **及时清理临时分支**：保持仓库整洁
4. **编写有意义的提交信息**：便于后期查找

### 8.2 最佳实践

1. **组件复用**：优先创建可复用组件而非复制代码
2. **性能优化**：使用 React.lazy + Suspense 实现路由懒加载
3. **类型安全**：积极使用 TypeScript 的高级特性
4. **测试驱动**：关键功能先写测试再实现
5. **文档同步**：及时更新注释与文档

---

## 附录：快速命令参考

```bash
# 安装依赖
npm install

# 开发环境启动（管理端）
cd .shop && npm run dev

# 开发环境启动（用户端）
cd user && npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test

# 代码格式化
npm run format

# Lint检查
npm run lint
```

---

**文档版本**：v1.0  
**最后更新**：2026-02-06  
**维护者**：CrossBorder开发团队
