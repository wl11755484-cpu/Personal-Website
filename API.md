# API 接口文档

本文档描述了个人网站的所有 API 接口。

## 基础信息

- **Base URL**: `https://your-domain.com/api`
- **认证方式**: NextAuth.js Session-based Authentication
- **数据格式**: JSON
- **HTTP 状态码**: 标准 HTTP 状态码

## 认证接口

### NextAuth.js 认证

```
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/session
GET  /api/auth/providers
GET  /api/auth/csrf
```

**说明**: 由 NextAuth.js 自动处理的认证相关接口

## 公开接口（无需认证）

### 照片接口

#### 获取照片列表
```
GET /api/photos
```

**查询参数**:
- `limit` (可选): 返回数量限制，默认 20，最大 100
- `offset` (可选): 偏移量，默认 0

**响应示例**:
```json
{
  "photos": [
    {
      "id": "1",
      "title": "美丽的日落",
      "description": "在海边拍摄的日落照片",
      "imageUrl": "/images/sunset.jpg",
      "tags": ["日落", "海边", "自然"],
      "location": "青岛海边",
      "takenAt": "2024-01-15T18:30:00Z",
      "createdAt": "2024-01-16T10:00:00Z",
      "isPublic": true
    }
  ],
  "total": 50,
  "hasMore": true
}
```

#### 获取单个照片详情
```
GET /api/photos/[id]
```

**路径参数**:
- `id`: 照片 ID

**响应**: 单个照片对象（格式同上）

### 笔记接口

#### 获取笔记列表
```
GET /api/notes
```

**查询参数**:
- `limit` (可选): 返回数量限制，默认 20，最大 100
- `offset` (可选): 偏移量，默认 0

**响应示例**:
```json
{
  "notes": [
    {
      "id": "1",
      "title": "学习 Next.js 的心得",
      "content": "今天学习了 Next.js 的 App Router...",
      "excerpt": "今天学习了 Next.js 的 App Router，感觉很有用...",
      "tags": ["Next.js", "React", "学习"],
      "createdAt": "2024-01-16T10:00:00Z",
      "updatedAt": "2024-01-16T10:00:00Z",
      "isPublic": true
    }
  ],
  "total": 25,
  "hasMore": true
}
```

#### 获取单个笔记详情
```
GET /api/notes/[id]
```

**路径参数**:
- `id`: 笔记 ID

**响应**: 单个笔记对象（格式同上）

### 时间轴接口

#### 获取时间轴列表
```
GET /api/timeline
```

**查询参数**:
- `limit` (可选): 返回数量限制，默认 20，最大 100
- `offset` (可选): 偏移量，默认 0

**响应示例**:
```json
{
  "timeline": [
    {
      "id": "1",
      "title": "开始学习 Web 开发",
      "description": "决定转行做前端开发，开始学习 HTML、CSS 和 JavaScript",
      "date": "2023-06-01T00:00:00Z",
      "type": "milestone",
      "tags": ["学习", "前端", "转行"],
      "createdAt": "2024-01-16T10:00:00Z",
      "isPublic": true
    }
  ],
  "total": 15,
  "hasMore": false
}
```

## 用户接口（需要认证）

### 个人资料接口

#### 获取当前用户信息
```
GET /api/me
```

**响应示例**:
```json
{
  "id": "user123",
  "name": "张三",
  "email": "zhangsan@example.com",
  "image": "/avatars/user123.jpg",
  "bio": "一个热爱编程的开发者",
  "website": "https://zhangsan.dev",
  "location": "北京",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-16T10:00:00Z"
}
```

#### 更新当前用户信息
```
PUT /api/me
```

**请求体**:
```json
{
  "name": "张三",
  "bio": "一个热爱编程的全栈开发者",
  "website": "https://zhangsan.dev",
  "location": "上海"
}
```

**响应**: 更新后的用户信息

## 管理员接口（需要管理员权限）

### 照片管理

#### 创建照片
```
POST /api/admin/photos
```

**请求体**:
```json
{
  "title": "美丽的日落",
  "description": "在海边拍摄的日落照片",
  "imageUrl": "/images/sunset.jpg",
  "tags": ["日落", "海边", "自然"],
  "location": "青岛海边",
  "takenAt": "2024-01-15T18:30:00Z",
  "isPublic": true
}
```

#### 获取所有照片（包括私有）
```
GET /api/admin/photos
```

#### 更新照片
```
PATCH /api/admin/photos/[id]
```

#### 删除照片
```
DELETE /api/admin/photos/[id]
```

### 笔记管理

#### 创建笔记
```
POST /api/admin/notes
```

**请求体**:
```json
{
  "title": "学习 Next.js 的心得",
  "content": "今天学习了 Next.js 的 App Router...",
  "tags": ["Next.js", "React", "学习"],
  "isPublic": true
}
```

#### 获取所有笔记（包括私有）
```
GET /api/admin/notes
```

#### 更新笔记
```
PATCH /api/admin/notes/[id]
```

#### 删除笔记
```
DELETE /api/admin/notes/[id]
```

### 时间轴管理

#### 创建时间轴项目
```
POST /api/admin/timeline
```

**请求体**:
```json
{
  "title": "开始学习 Web 开发",
  "description": "决定转行做前端开发",
  "date": "2023-06-01T00:00:00Z",
  "type": "milestone",
  "tags": ["学习", "前端", "转行"],
  "isPublic": true
}
```

#### 获取所有时间轴项目（包括私有）
```
GET /api/admin/timeline
```

#### 更新时间轴项目
```
PATCH /api/admin/timeline/[id]
```

#### 删除时间轴项目
```
DELETE /api/admin/timeline/[id]
```

## 错误响应格式

所有接口在出错时都会返回统一的错误格式：

```json
{
  "error": "错误类型",
  "message": "详细错误信息",
  "code": "ERROR_CODE"
}
```

### 常见错误码

- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未认证或认证失败
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `422 Unprocessable Entity`: 数据验证失败
- `500 Internal Server Error`: 服务器内部错误

## 使用示例

### JavaScript/TypeScript

```typescript
// 获取公开照片列表
const response = await fetch('/api/photos?limit=10&offset=0');
const data = await response.json();

// 创建新照片（需要管理员权限）
const createPhoto = async (photoData: any) => {
  const response = await fetch('/api/admin/photos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(photoData),
  });
  return response.json();
};

// 更新用户资料
const updateProfile = async (profileData: any) => {
  const response = await fetch('/api/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  return response.json();
};
```

### cURL 示例

```bash
# 获取照片列表
curl -X GET "https://your-domain.com/api/photos?limit=10"

# 创建新照片（需要认证）
curl -X POST "https://your-domain.com/api/admin/photos" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "title": "测试照片",
    "imageUrl": "/images/test.jpg",
    "isPublic": true
  }'
```

## 速率限制

- 公开接口: 每分钟 100 次请求
- 认证接口: 每分钟 200 次请求
- 管理员接口: 每分钟 500 次请求

## 版本控制

当前 API 版本: `v1`

未来如有重大变更，会通过 URL 路径进行版本控制：
- `https://your-domain.com/api/v1/photos`
- `https://your-domain.com/api/v2/photos`

## 支持

如有问题或建议，请通过以下方式联系：
- 邮箱: admin@your-domain.com
- GitHub Issues: https://github.com/your-username/site/issues