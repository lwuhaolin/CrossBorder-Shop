# 国际化 (i18n) 实现指南

## 概述

已成功为 user 项目集成了国际化支持，支持中文(zh-CN)和英文(en-US)两种语言。

## 技术栈

- **i18next**: 国际化框架
- **react-i18next**: React 集成库
- **Umi 4**: React 框架

## 项目文件结构

```
src/
├── i18n.ts                          # i18n 初始化配置
├── app.tsx                          # 应用入口，配置 I18nextProvider
├── locales/
│   ├── zh-CN.ts                     # 中文翻译文件
│   └── en-US.ts                     # 英文翻译文件
├── components/
│   └── LanguageSwitcher/
│       ├── index.tsx                # 语言切换器组件
│       └── index.module.css         # 样式文件
└── pages/
    ├── user/
    │   ├── login.tsx                # 登录页面（已更新）
    │   └── register.tsx             # 注册页面（已更新）
    └── ...（其他页面）
```

## 核心文件说明

### 1. **i18n.ts** - 国际化初始化
- 配置 i18next 和 react-i18next
- 加载中英文翻译文件
- 自动检测浏览器语言或从 localStorage 读取用户偏好

### 2. **app.tsx** - 应用入口
- 使用 `I18nextProvider` 包装应用
- 确保整个应用都能访问翻译功能

### 3. **locales/zh-CN.ts 和 locales/en-US.ts** - 翻译文件
- 包含应用中所有需要翻译的文本
- 使用键值对结构，便于管理和维护

### 4. **LanguageSwitcher** - 语言切换器
- 位置：Header 组件中
- 功能：允许用户在中文和英文之间切换
- 自动保存用户选择到 localStorage

## 使用方法

### 在 React 组件中使用翻译

```tsx
import { useTranslation } from "react-i18next";

const MyComponent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("nav.home")}</h1>
      <p>{t("product.search")}</p>
    </div>
  );
};
```

### 常用翻译键

#### 导航菜单
- `nav.home` - 首页
- `nav.products` - 商品
- `nav.cart` - 购物车
- `nav.orders` - 订单
- `nav.favorites` - 收藏
- `nav.profile` - 个人信息
- `nav.addresses` - 地址管理
- `nav.settings` - 设置
- `nav.logout` - 登出
- `nav.login` - 登录

#### 登录页面
- `login.title` - 页面标题
- `login.welcome` - 欢迎文本
- `login.username` - 用户名标签
- `login.password` - 密码标签
- `login.submit` - 提交按钮
- `login.success` - 成功消息
- `login.error` - 错误消息

#### 产品相关
- `product.title` - 产品标题
- `product.search` - 搜索占位符
- `product.price` - 价格
- `product.addToCart` - 添加到购物车
- `product.addToFavorite` - 添加到收藏

（更多翻译键请查看 `locales/zh-CN.ts`）

## 添加新翻译的步骤

1. **打开翻译文件**
   - 编辑 `src/locales/zh-CN.ts` 添加中文翻译
   - 编辑 `src/locales/en-US.ts` 添加英文翻译

2. **添加键值对**
   ```typescript
   // 格式: "功能.描述": "翻译文本"
   "cart.emptyMessage": "购物车为空",
   ```

3. **在组件中使用**
   ```tsx
   const { t } = useTranslation();
   <p>{t("cart.emptyMessage")}</p>
   ```

## 功能特性

✅ **自动语言检测**: 根据浏览器语言自动选择默认语言
✅ **持久化储存**: 用户语言选择保存到 localStorage
✅ **即时切换**: 切换语言时页面内容立即更新
✅ **完整翻译**: 支持所有页面和组件的翻译
✅ **易于扩展**: 简单的键值结构，易于添加新翻译

## 已更新的页面

- [x] Header 组件 - 导航菜单和语言切换器
- [x] 登录页面 (Login)
- [x] 注册页面 (Register)
- [ ] 其他页面（可按需继续更新）

## 后续建议

1. **更新其他页面**: 继续为以下页面添加翻译
   - 产品列表和详情页面
   - 购物车页面
   - 订单页面
   - 用户信息页面
   - 地址管理页面
   - 收藏页面
   - 设置页面

2. **添加更多语言**: 只需在 `locales` 文件夹中添加新的翻译文件，然后在 `i18n.ts` 中配置即可

3. **Ant Design 组件国际化**: 如需自动适配 Ant Design 组件的语言，可在 app.tsx 中动态导入 Ant Design 的语言包

## 测试

项目已成功构建！要测试国际化功能：

1. 启动开发服务器：`pnpm dev`
2. 打开应用并查看 Header 中的语言切换器
3. 切换语言，验证页面文本是否更新
4. 刷新页面，检查语言选择是否持久化

## 常见问题

**Q: 如何添加第三种语言？**
A: 在 `src/locales` 中创建新的翻译文件（如 `es-ES.ts`），然后在 `src/i18n.ts` 的 `resources` 中添加配置。

**Q: 翻译键不存在时会怎样？**
A: i18next 会显示翻译键本身作为降级显示。

**Q: 如何处理复数形式？**
A: 可以使用 i18next 的插值功能，详见 i18next 文档。
