# 前后端API集成审计报告

**生成时间**: 2026-02-10
**项目**: CrossBorder Shop - Vue 3迁移项目
**审计范围**: 前端 API 调用与后端响应数据映射

---

## 📋 执行摘要

本审计发现了 **6 个重要问题** 和 **8 个潜在风险**，其中包括：
- ⚠️ **2个严重错误**（会导致功能无法使用）
- ⚠️ **4个数据映射问题**（会导致数据显示不正确）
- ⚠️ **2个字段缺失问题**（可能导致显示错误）

---

## 🔴 CRITICAL ISSUES（严重问题）

### 1. 密码修改API完全不兼容 ⚠️⚠️⚠️

**影响**: 用户无法修改密码
**位置**: `settings/index.vue` → `/user/password`

#### 前端实现
```typescript
// user-vue/src/services/user.ts (第42-48行)
export async function updatePassword(data: PasswordChangeDTO): Promise<Result<void>> {
  return request({
    url: '/user/password',
    method: 'PUT',
    data,  // 发送 JSON body
  })
}

// PasswordChangeDTO 结构:
{
  currentPassword: string,
  newPassword: string,
  confirmPassword?: string
}
```

#### 后端实现
```java
// UserController.java (第80-88行)
@PutMapping("/password")
public Result<Void> changePassword(
    @AuthenticationPrincipal UserPrincipal principal,
    @Parameter(description = "旧密码") @RequestParam String oldPassword,      // ❌ 错误：期望 Query Parameter
    @Parameter(description = "新密码") @RequestParam String newPassword) {     // ❌ 错误：期望 Query Parameter
    userService.changePassword(principal.getUserId(), oldPassword, newPassword);
    return Result.success();
}
```

#### 问题分析
- 前端发送：`PUT /user/password` 加 JSON body
- 后端期望：`@RequestParam` 从URL查询参数读取
- **结果**: 密码修改请求会失败，参数无法正确传递

#### 修复方案
**后端需要修改**：改用 `@RequestBody` 并创建对应 DTO

```java
@PutMapping("/password")
public Result<Void> changePassword(
    @AuthenticationPrincipal UserPrincipal principal,
    @Valid @RequestBody PasswordChangeDTO dto) {
    userService.changePassword(principal.getUserId(),
                               dto.getCurrentPassword(),
                               dto.getNewPassword());
    return Result.success();
}

// 创建 PasswordChangeDTO
@Data
public class PasswordChangeDTO {
    @NotBlank
    private String currentPassword;
    @NotBlank
    private String newPassword;
    private String confirmPassword; // 可选，前端验证
}
```

**或者前端修改**：改用 Query Parameters（不推荐）

---

### 2. 用户信息字段严重不匹配 ⚠️⚠️

**影响**: 用户个人信息页面无法正确显示
**位置**: `profile.vue` 使用的用户数据不匹配后端返回字段

#### 前端期望的 User 模型
```typescript
// user-vue/src/models/user.ts
export interface User {
  id: number
  username: string
  name?: string           // ❌ 后端返回 'nickname' 而不是 'name'
  email?: string
  phone?: string
  avatar?: string
  role?: string           // ❌ 后端返回 'roles: RoleVO[]' 而不是 'role: string'
  status?: number
  createdAt?: string      // ❌ 后端返回 'createTime: LocalDateTime' 而不是 'createdAt'
  updatedAt?: string      // ❌ 后端没有此字段
  lastLoginAt?: string    // ❌ 后端返回 'lastLoginTime: LocalDateTime' 而不是 'lastLoginAt'
}
```

#### 后端返回的 UserVO 字段
```java
// UserController.java 的 getCurrentUserInfo() 返回 UserVO
public class UserVO {
    private Long id;
    private String username;
    private String nickname;         // ✓ 前端期望 'name'
    private String email;
    private String phone;
    private String avatar;
    private Integer gender;          // ✗ 前端模型中没有
    private LocalDate birthday;      // ✗ 前端模型中没有
    private Integer status;
    private LocalDateTime lastLoginTime;    // ✓ 前端期望 'lastLoginAt'
    private String lastLoginIp;             // ✗ 前端模型中没有
    private List<RoleVO> roles;     // ✓ 前端期望 'role'（字符串）
    private LocalDateTime createTime;       // ✓ 前端期望 'createdAt'
}
```

#### 实际影响
在 `profile.vue` 中：
```typescript
// 第32行
{{ user?.role }}  // ❌ 会显示 undefined，因为后端返回的是 'roles'（数组）

// 第35行
{{ formatDate(user.createdAt) }}  // ❌ 会显示 undefined，因为后端字段是 'createTime'
```

#### 修复方案 - 方式A（推荐）：后端修改 UserVO 字段名

```java
public class UserVO {
    private Long id;
    private String username;

    @JsonProperty("name")  // 改名为 'name'
    private String nickname;

    @JsonProperty("role")  // 改为返回第一个角色
    public String getRole() {
        return roles != null && !roles.isEmpty() ? roles.get(0).getRoleName() : null;
    }

    @JsonProperty("createdAt")  // 改名为 'createdAt'
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createTime;

    @JsonProperty("lastLoginAt")  // 改名为 'lastLoginAt'
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime lastLoginTime;

    // 移除不必要的字段
    @JsonIgnore
    private LocalDate birthday;

    @JsonIgnore
    private Integer gender;

    @JsonIgnore
    private String lastLoginIp;
}
```

#### 修复方案 - 方式B：前端调整模型

```typescript
// user-vue/src/models/user.ts
export interface User {
  id: number
  username: string
  nickname?: string       // 改为 nickname
  email?: string
  phone?: string
  avatar?: string
  roles?: Role[]          // 改为 roles（数组）
  status?: number
  createTime?: string     // 改为 createTime
  lastLoginTime?: string  // 改为 lastLoginTime
  gender?: number         // 新增
  birthday?: string       // 新增
}

// profile.vue 也需要相应修改
{{ user?.roles?.[0]?.roleName }}  // 显示第一个角色
{{ formatDate(user?.createTime) }}  // 使用 createTime
```

---

## 🟠 MAJOR ISSUES（主要问题）

### 3. UserUpdateDTO 字段不匹配

**影响**: 用户更新信息时某些字段会被忽略
**位置**: `settings/index.vue` → `/user/update`

#### 前端发送
```typescript
// user-vue/src/models/user.ts
export interface UserUpdateDTO {
  username?: string    // ❌ 后端不接收此字段
  email?: string
  phone?: string
  avatar?: string
}
```

#### 后端接收
```java
// UserUpdateDTO.java
public class UserUpdateDTO {
    private String nickname;     // ❌ 前端不发送此字段
    private String email;
    private String phone;
    private String avatar;
    private Integer gender;      // 前端未提供
    private LocalDate birthday;  // 前端未提供
}
```

#### 修复方案
**后端**：修改接收的字段名或添加映射

```java
public class UserUpdateDTO {
    @JsonProperty("username")  // 接收前端的 'username'，映射为 'nickname'
    private String nickname;

    private String email;
    private String phone;
    private String avatar;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)  // 只接收，不返回
    private Integer gender;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private LocalDate birthday;
}
```

或

**前端**：修改发送的字段名

```typescript
export interface UserUpdateDTO {
  nickname?: string     // 改为 nickname
  email?: string
  phone?: string
  avatar?: string
  gender?: number
  birthday?: string
}
```

---

### 4. 登录响应格式不匹配

**影响**: 登录功能可能获取不到正确的token和用户信息
**位置**: 登录流程中的响应处理

#### 前端期望
```typescript
// user-vue/src/models/user.ts
export interface LoginResponse {
  token: string
  user: User
}
```

#### 后端返回
```java
// LoginVO
public class LoginVO {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long accessTokenExpiresIn;
    private Long refreshTokenExpiresIn;
    private UserVO userInfo;  // ❌ 前端期望 'user' 而不是 'userInfo'
}
```

#### 前端服务
```typescript
// services/user.ts (第6-14行)
export async function login(data: LoginDTO): Promise<any> {
  const response = await request({
    url: '/user/login',
    method: 'POST',
    data,
  })
  return response  // ❌ 返回 any 类型，没有类型检查
}
```

#### 修复方案 - 方式A：后端修改返回字段

```java
public class LoginVO {
    @JsonProperty("token")
    private String accessToken;

    @JsonProperty("refreshToken")
    private String refreshToken;

    @JsonIgnore
    private String tokenType;

    @JsonIgnore
    private Long accessTokenExpiresIn;

    @JsonIgnore
    private Long refreshTokenExpiresIn;

    @JsonProperty("user")  // 改为 'user'
    private UserVO userInfo;
}
```

#### 修复方案 - 方式B：前端调整处理逻辑

```typescript
// services/user.ts
export async function login(data: LoginDTO): Promise<Result<LoginVO>> {
  const response = await request({
    url: '/user/login',
    method: 'POST',
    data,
  })

  // 对响应进行字段映射
  if (response.data) {
    return {
      ...response,
      data: {
        token: response.data.accessToken,
        user: response.data.userInfo,
        // 保留其他字段供后续使用
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }
    }
  }

  return response
}
```

---

### 5. 地址模型缺失字段

**影响**: 邮编信息无法保存和显示
**位置**: `addresses/index.vue` → 地址管理功能

#### 前端模型
```typescript
export interface Address {
  id: number
  userId?: number
  receiverName: string
  receiverPhone: string
  country: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault?: boolean
  label?: string              // ✗ 后端没有此字段
  createdAt?: string
  updatedAt?: string
  // ❌ 缺少 postalCode 字段
}
```

#### 后端模型
```java
public class ShippingAddressVO {
    private Long id;
    private String receiverName;
    private String receiverPhone;
    private String country;
    private String province;
    private String city;
    private String district;
    private String detailAddress;
    private String postalCode;     // ✓ 前端缺少此字段
    private Boolean isDefault;
    private LocalDateTime createTime;
    // ❌ 没有 label 字段
}
```

#### 修复方案

**前端模型更新**：
```typescript
export interface Address {
  id: number
  userId?: number
  receiverName: string
  receiverPhone: string
  country: string
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode?: string          // 新增
  isDefault?: boolean
  // 移除 label 字段（后端不支持）
  createdAt?: string
  updatedAt?: string
}
```

---

### 6. 订单查询参数处理问题

**状态**: ⚠️ 潜在问题

**位置**: `order.ts` → `getOrderList()`

#### 前端调用
```typescript
// orders/index.vue
const params: OrderListParams = {
  page: 1,
  pageSize: 20,
  status: orderStatus.value
}
const response = await getOrderList(params)
```

#### 后端接收
```java
@GetMapping("/buyer/list")
public Result<List<OrderVO>> getBuyerOrders(
    @AuthenticationPrincipal UserPrincipal principal,
    @RequestParam(required = false) Integer orderStatus) {  // ❌ 只接收 orderStatus
    List<OrderVO> orders = orderService.getBuyerOrders(principal.getUserId(), orderStatus);
    return Result.success(orders);
}
```

#### 问题分析
- 前端发送 `page`, `pageSize`, `status` 三个参数
- 后端只接收 `orderStatus`，忽略 `page` 和 `pageSize`
- 后端没有分页返回（返回 `List<OrderVO>` 而不是 `PageResult<OrderVO>`）

#### 修复方案

**后端**：支持分页查询
```java
@GetMapping("/buyer/list")
public Result<PageResult<OrderVO>> getBuyerOrders(
    @AuthenticationPrincipal UserPrincipal principal,
    @RequestParam(defaultValue = "1") Integer pageNum,
    @RequestParam(defaultValue = "20") Integer pageSize,
    @RequestParam(required = false) Integer orderStatus) {
    PageResult<OrderVO> result = orderService.getBuyerOrders(
        principal.getUserId(), pageNum, pageSize, orderStatus);
    return Result.success(result);
}
```

**前端响应模型**：
```typescript
export interface OrderListResponse {
  list: Order[]
  total: number
  page: number
  pageSize: number
}
```

---

## 🟡 WARNINGS（警告）

### 7. 日期格式不一致

**位置**: 多个 API 响应

#### 问题
- 前端模型使用字符串：`createdAt?: string`
- 后端返回 Java LocalDateTime，需要序列化为字符串
- 日期格式未统一定义

#### 修复建议
```java
// 全局统一日期格式配置
@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ"));
        return mapper;
    }
}
```

---

### 8. Token 刷新逻辑复杂

**位置**: `request.ts` 中的 token 刷新拦截器

#### 潜在问题
- 登录响应返回格式与后端 `LoginVO` 不匹配
- Token 提取逻辑: `const { accessToken } = data.data || data` (第95行)
- 实际后端响应应该是 `{ code: 200, data: { accessToken, ... } }` 或直接 `{ accessToken, ... }`

#### 建议
确保统一 token 字段名称和响应格式

---

## 📊 问题汇总表

| # | 问题 | 严重级别 | 位置 | 状态 |
|---|------|--------|------|------|
| 1 | 密码修改 API 不兼容 | 🔴 严重 | `/user/password` | 需要修复 |
| 2 | User 字段映射错误 | 🔴 严重 | `User` 模型 | 需要修复 |
| 3 | UserUpdateDTO 字段不匹配 | 🟠 主要 | 用户更新 API | 需要修复 |
| 4 | 登录响应格式不匹配 | 🟠 主要 | Login API | 需要修复 |
| 5 | 地址字段缺失 | 🟠 主要 | Address 模型 | 需要修复 |
| 6 | 订单分页参数不匹配 | 🟠 主要 | Order List API | 需要修复 |
| 7 | 日期格式不一致 | 🟡 警告 | 全局 | 建议统一 |
| 8 | Token 刷新逻辑复杂 | 🟡 警告 | request.ts | 建议简化 |

---

## ✅ 优先修复计划

### 第一阶段（关键）
1. **修复密码修改 API** - 后端改用 @RequestBody
2. **修复 User 字段映射** - 后端修改 UserVO 字段名或前端调整模型
3. **修复 UserUpdateDTO** - 统一字段名称

### 第二阶段（重要）
4. **修复登录响应格式** - 统一 token 和 user 字段
5. **修复地址字段** - 前端添加 postalCode，移除 label
6. **修复订单分页** - 后端支持分页返回

### 第三阶段（优化）
7. **统一日期格式** - 全局配置
8. **简化 Token 刷新** - 优化 request.ts 逻辑

---

## 📝 建议采取的修复策略

### 推荐方案
1. **后端为主** - 大部分修复由后端调整响应格式和 DTO
2. **最小化前端变更** - 避免破坏现有逻辑
3. **添加数据映射层** - 在 request 拦截器中统一处理字段名称映射

### 快速修复脚本（前端适配）
```typescript
// utils/dataMapper.ts - 数据转换层
export function mapUserResponse(backendUser: any): User {
  return {
    id: backendUser.id,
    username: backendUser.username,
    name: backendUser.nickname,           // 字段映射
    email: backendUser.email,
    phone: backendUser.phone,
    avatar: backendUser.avatar,
    role: backendUser.roles?.[0]?.roleName,  // 取第一个角色
    status: backendUser.status,
    createdAt: backendUser.createTime,    // 字段映射
    lastLoginAt: backendUser.lastLoginTime,  // 字段映射
  }
}
```

---

## 🔧 调试建议

1. **检查网络请求**：使用浏览器开发工具查看实际请求和响应
2. **查看服务器日志**：确认后端接收到的参数
3. **打印响应数据**：在 request 拦截器中记录 API 响应格式
4. **类型检查**：启用 TypeScript strict 模式捕获类型错误

---

## 📚 参考资源

- 前端 API 服务文件：`user-vue/src/services/`
- 前端模型定义：`user-vue/src/models/`
- 后端 Controller：`.backend/src/main/java/.../controller/`
- 后端 VO/DTO：`.backend/src/main/java/.../vo/`, `dto/`

---

**审计完成日期**: 2026-02-10
**建议复查日期**: 修复后7天内
