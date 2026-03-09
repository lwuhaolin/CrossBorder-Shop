# 项目启动与部署指南

## 1. 后端配置与部署指南

### 1.1 技术栈

| 分类 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 编程语言 | Java | 17+ | 后端开发 |
| 框架 | Spring Boot | 3.x | 应用框架 |
| 数据库 | MySQL | 8.0+ | 数据存储 |

| ORM | MyBatis-Plus | 3.x | 数据库操作 |
| API文档 | Swagger | 3.x | 接口文档 |
| 安全 | Spring Security | 6.x | 安全管理 |
| 跨域 | Spring Cloud Gateway | 4.x | 网关服务 |

### 1.2 目录结构

```
.backend/
├── src/
│   ├── main/
│   │   ├── java/com/crossborder/shop/  # 源代码目录
│   │   ├── resources/                  # 资源文件目录
│   │   │   ├── application.yml         # 主配置文件
│   │   │   ├── application-dev.yml     # 开发环境配置
│   │   │   ├── application-prod.yml    # 生产环境配置
│   │   │   └── mapper/                 # MyBatis映射文件
│   └── test/                           # 测试代码目录
├── pom.xml                             # Maven依赖配置
└── target/                             # 构建输出目录
```

### 1.3 配置文件关键参数

#### 主配置文件：`src/main/resources/application.yml`

| 配置项 | 说明 | 默认值 | 需要修改 |
|--------|------|--------|----------|
| `server.port` | 服务端口 | 8080 | 可选 |
| `spring.datasource.url` | 数据库连接URL | jdbc:mysql://localhost:3306/crossborder_shop | 是 |
| `spring.datasource.username` | 数据库用户名 | root | 是 |
| `spring.datasource.password` | 数据库密码 | 123456 | 是 |

| `jwt.secret` | JWT密钥 | your-secret-key | 是 |
| `jwt.expire` | JWT过期时间 | 3600000 | 可选 |

#### 开发环境配置：`src/main/resources/application-dev.yml`

| 配置项 | 说明 | 默认值 | 需要修改 |
|--------|------|--------|----------|
| `logging.level` | 日志级别 | debug | 可选 |
| `spring.servlet.multipart.max-file-size` | 文件上传大小限制 | 10MB | 可选 |

#### 生产环境配置：`src/main/resources/application-prod.yml`

| 配置项 | 说明 | 默认值 | 需要修改 |
|--------|------|--------|----------|
| `logging.level` | 日志级别 | info | 可选 |
| `server.servlet.context-path` | 应用上下文路径 | /api | 可选 |

### 1.4 环境搭建步骤

#### 1.4.1 安装依赖

```bash
# 进入后端目录
cd .backend

# 使用Maven安装依赖
mvn clean install
```

#### 1.4.2 环境变量配置

**Windows系统：**

```powershell
# 设置环境变量
set DB_USERNAME=your-database-username
set DB_PASSWORD=your-database-password
set JWT_SECRET=your-secret-key
```

**Linux/Mac系统：**

```bash
# 设置环境变量
export DB_USERNAME=your-database-username
export DB_PASSWORD=your-database-password
export JWT_SECRET=your-secret-key
```

### 1.5 后端服务启动

#### 1.5.1 开发环境启动

```bash
# 使用Maven启动
mvn spring-boot:run -Dspring.profiles.active=dev

# 或使用IDE直接运行CrossBorderShopApplication.java
```

#### 1.5.2 测试环境启动

```bash
mvn spring-boot:run -Dspring.profiles.active=test
```

#### 1.5.3 生产环境启动

```bash
# 构建生产环境包
mvn clean package -DskipTests -Pprod

# 运行jar包
java -jar target/crossborder-shop-1.0.0.jar --spring.profiles.active=prod
```

## 2. 前端配置与部署指南

### 2.1 前端项目结构

#### 2.1.1 shop-vue（商店前端）

```
shop-vue/
├── public/             # 静态资源
├── src/
│   ├── assets/         # 项目资源文件
│   ├── components/     # 公共组件
│   ├── views/          # 页面视图
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── services/       # API服务
│   ├── utils/          # 工具函数
│   ├── models/         # 数据模型
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── .env                # 环境变量
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
├── package.json        # 项目依赖
├── vite.config.ts      # Vite配置
└── tsconfig.json       # TypeScript配置
```

**功能定位：** 商店管理系统，包含商品管理、订单管理、物流管理等功能。

#### 2.1.2 user-vue（用户前端）

```
user-vue/
├── public/             # 静态资源
├── src/
│   ├── assets/         # 项目资源文件
│   ├── components/     # 公共组件
│   ├── views/          # 页面视图
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── services/       # API服务
│   ├── utils/          # 工具函数
│   ├── models/         # 数据模型
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── .env                # 环境变量
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
├── package.json        # 项目依赖
├── vite.config.ts      # Vite配置
└── tsconfig.json       # TypeScript配置
```

**功能定位：** 用户端系统，包含商品浏览、购物车、订单提交、支付等功能。

### 2.2 环境要求

| 环境 | 版本 | 推荐版本 |
|------|------|----------|
| Node.js | >= 14.0.0 | 16.18.0 |
| npm | >= 6.0.0 | 8.19.2 |
| yarn | >= 1.22.0 | 1.22.19 |

### 2.3 依赖安装

#### 2.3.1 shop-vue依赖安装

```bash
# 进入shop-vue目录
cd shop-vue

# 使用npm安装依赖
npm install

# 或使用yarn安装依赖
yarn install
```

#### 2.3.2 user-vue依赖安装

```bash
# 进入user-vue目录
cd user-vue

# 使用npm安装依赖
npm install

# 或使用yarn安装依赖
yarn install
```

### 2.4 前端配置文件

#### 2.4.1 环境变量配置

**开发环境：`.env.development`**

```env
# API基础路径
VITE_API_BASE_URL=http://localhost:8080/api

# 环境标识
VITE_ENV=development

# 调试模式
VITE_DEBUG=true
```

**生产环境：`.env.production`**

```env
# API基础路径
VITE_API_BASE_URL=http://your-production-api.com/api

# 环境标识
VITE_ENV=production

# 调试模式
VITE_DEBUG=false
```

#### 2.4.2 Vite配置

**vite.config.ts**

| 配置项 | 说明 | 默认值 | 需要修改 |
|--------|------|--------|----------|
| `server.port` | 开发服务器端口 | 3000 (shop-vue) / 3001 (user-vue) | 可选 |
| `server.proxy` | API代理配置 | 见下方 | 可选 |

```typescript
// shop-vue/vite.config.ts示例
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### 2.5 前端项目启动与构建

#### 2.5.1 开发环境启动

**shop-vue：**

```bash
# 进入shop-vue目录
cd shop-vue

# 启动开发服务器
npm run dev
# 或
yarn dev
```

**user-vue：**

```bash
# 进入user-vue目录
cd user-vue

# 启动开发服务器
npm run dev
# 或
yarn dev
```

#### 2.5.2 生产环境构建

**shop-vue：**

```bash
# 进入shop-vue目录
cd shop-vue

# 构建生产环境
npm run build
# 或
yarn build

# 构建输出目录：dist/
```

**user-vue：**

```bash
# 进入user-vue目录
cd user-vue

# 构建生产环境
npm run build
# 或
yarn build

# 构建输出目录：dist/
```

#### 2.5.3 部署方法

1. **Nginx部署：**

```nginx
# shop-vue配置
server {
    listen 80;
    server_name shop.your-domain.com;
    
    location / {
        root /path/to/shop-vue/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

# user-vue配置
server {
    listen 80;
    server_name www.your-domain.com;
    
    location / {
        root /path/to/user-vue/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

2. **静态文件部署：**
   - 将`dist`目录下的文件上传到静态文件服务器
   - 配置服务器支持SPA路由（如Nginx的`try_files`配置）

### 2.6 调试方法与常见问题

#### 2.6.1 调试方法

1. **浏览器调试：**
   - 使用Chrome DevTools（F12）查看网络请求、控制台输出
   - 使用Vue DevTools扩展查看组件状态

2. **Vite调试：**
   - 开发模式下支持热更新
   - 可在`vite.config.ts`中配置sourcemap

#### 2.6.2 常见问题解决方案

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 依赖安装失败 | Node.js版本不兼容 | 升级Node.js到推荐版本 |
| API请求失败 | 后端服务未启动 | 先启动后端服务 |
| 跨域错误 | 跨域配置问题 | 检查后端CORS配置或前端代理配置 |
| 页面空白 | 路由配置错误 | 检查路由配置和浏览器控制台错误 |
| 构建失败 | 代码语法错误 | 检查TypeScript编译错误 |

## 3. 整体项目启动流程

### 3.1 Step-by-Step 操作指南

#### 步骤1：环境准备

1. **安装Java 17+**：确保系统已安装Java 17或更高版本
2. **安装MySQL 8.0+**：安装并启动MySQL服务，创建数据库
3. **安装Node.js 16+**：确保系统已安装Node.js 16或更高版本
4. **安装Maven 3.6+**：确保系统已安装Maven 3.6或更高版本

#### 步骤2：后端配置与启动

1. **配置数据库**：
   - 创建数据库：`CREATE DATABASE crossborder_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   - 导入初始化SQL（如果有）

2. **配置后端**：
   - 修改`src/main/resources/application.yml`中的数据库连接信息
   - 配置环境变量或修改配置文件中的其他关键参数

3. **安装后端依赖**：
   ```bash
   cd .backend
   mvn clean install
   ```

4. **启动后端服务**：
   ```bash
   mvn spring-boot:run -Dspring.profiles.active=dev
   ```

#### 步骤3：前端配置与启动

1. **安装前端依赖**：
   ```bash
   # 安装shop-vue依赖
   cd shop-vue
   npm install
   
   # 安装user-vue依赖
   cd ../user-vue
   npm install
   ```

2. **配置前端**：
   - 修改`.env.development`中的API基础路径（如果需要）

3. **启动前端开发服务器**：
   ```bash
   # 启动shop-vue
   cd shop-vue
   npm run dev
   
   # 启动user-vue
   cd ../user-vue
   npm run dev
   ```

### 3.2 启动顺序要求

1. **先启动后端服务**：确保后端API服务正常运行
2. **后启动前端服务**：前端需要连接后端API

### 3.3 启动成功验证

#### 3.3.1 后端验证

- **服务启动**：控制台输出"应用启动成功"
- **API文档**：访问 `http://localhost:8080/api/doc.html` 查看Swagger文档
- **健康检查**：访问 `http://localhost:8080/actuator/health` 查看健康状态

#### 3.3.2 前端验证

- **shop-vue**：访问 `http://localhost:3000` 查看商店管理系统
- **user-vue**：访问 `http://localhost:3001` 查看用户端系统
- **API连接**：检查浏览器控制台是否有API请求错误

### 3.4 常见启动问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 后端启动失败 | 数据库连接错误 | 检查数据库服务是否启动，连接信息是否正确 |
| 后端启动失败 | 端口被占用 | 修改`application.yml`中的`server.port` |
| 前端无法连接后端 | 后端服务未启动 | 先启动后端服务 |
| 前端无法连接后端 | API基础路径错误 | 检查前端环境变量中的`VITE_API_BASE_URL` |
| 前端页面空白 | 依赖安装不完整 | 删除`node_modules`目录，重新安装依赖 |
| 前端构建失败 | TypeScript编译错误 | 检查代码中的TypeScript语法错误 |

### 3.5 项目启动成功预期结果

1. **后端服务**：
   - 控制台输出启动成功信息
   - Swagger文档可正常访问
   - 健康检查接口返回正常状态

2. **前端服务**：
   - 开发服务器成功启动
   - 页面可正常访问
   - API请求无错误
   - 功能模块可正常使用

3. **整体系统**：
   - 前后端联调正常
   - 数据流转顺畅
   - 核心功能可正常使用

## 4. 附录

### 4.1 项目技术栈总览

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 后端 | Java | 17+ | 后端开发 |
| 后端 | Spring Boot | 3.x | 应用框架 |
| 后端 | MySQL | 8.0+ | 数据存储 |

| 后端 | MyBatis-Plus | 3.x | ORM框架 |
| 后端 | Swagger | 3.x | API文档 |
| 后端 | Spring Security | 6.x | 安全管理 |
| 前端 | Vue.js | 3.x | 前端框架 |
| 前端 | TypeScript | 5.x | 类型系统 |
| 前端 | Vite | 4.x | 构建工具 |
| 前端 | Axios | 1.x | HTTP客户端 |
| 前端 | Vue Router | 4.x | 路由管理 |
| 前端 | Pinia | 2.x | 状态管理 |
| 前端 | Ant Design Vue | 3.x | UI组件库 |

### 4.2 开发工具推荐

| 类别 | 工具 | 版本 | 用途 |
|------|------|------|------|
| IDE | IntelliJ IDEA | 2023+ | Java开发 |
| IDE | Visual Studio Code | 1.80+ | 前端开发 |
| 数据库 | Navicat Premium | 16+ | 数据库管理 |
| API测试 | Postman | 10+ | API测试 |
| 版本控制 | Git | 2.30+ | 版本管理 |

### 4.3 联系方式

如有任何问题或建议，请联系项目维护人员：
- 邮箱：contact@crossborder-shop.com
- 文档更新时间：2026年2月22日
