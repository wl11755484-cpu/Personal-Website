# 个人网站项目

一个基于 Next.js 15 的现代化个人网站，支持照片展示、笔记分享、时间轴记录等功能。

## ✨ 功能特性

### 🎨 前台展示
- **首页**: 展示最新的照片、笔记和时间轴内容
- **照片相册**: 浏览和查看照片，支持标签筛选
- **笔记博客**: 阅读技术文章和生活感悟
- **时间轴**: 记录人生重要时刻和里程碑
- **关于页面**: 个人介绍和联系方式

### 🔐 认证系统
- **邮箱登录**: 基于 NextAuth.js 的安全认证
- **会话管理**: 自动处理登录状态和权限
- **权限控制**: 区分普通用户和管理员权限

### 🛠️ 管理后台
- **内容管理**: 创建、编辑、删除照片、笔记和时间轴
- **可见性控制**: 设置内容公开或私有状态
- **批量操作**: 支持批量管理内容
- **实时预览**: 编辑时实时预览效果

### 🚀 API 接口
- **RESTful API**: 完整的 REST API 支持
- **公开接口**: 无需认证的数据获取接口
- **管理接口**: 需要管理员权限的内容管理接口
- **用户接口**: 个人资料管理接口

## 🛠️ 技术栈

### 前端技术
- **Next.js 15**: React 全栈框架，支持 App Router
- **React 19**: 最新的 React 版本
- **TypeScript**: 类型安全的 JavaScript
- **Tailwind CSS 4**: 现代化的 CSS 框架
- **Turbopack**: 极速的构建工具

### 后端技术
- **Next.js API Routes**: 服务端 API 接口
- **Prisma**: 现代化的数据库 ORM
- **SQLite/PostgreSQL**: 数据库支持
- **NextAuth.js 5**: 认证和授权系统
- **Nodemailer**: 邮件发送服务

### 开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Zod**: 数据验证库
- **Git**: 版本控制

## 📁 项目结构

```
site/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── (auth)/            # 认证相关页面组
│   │   ├── admin/             # 管理后台页面
│   │   ├── api/               # API 路由
│   │   │   ├── admin/         # 管理员 API
│   │   │   ├── auth/          # 认证 API
│   │   │   ├── photos/        # 照片公开 API
│   │   │   ├── notes/         # 笔记公开 API
│   │   │   ├── timeline/      # 时间轴公开 API
│   │   │   └── me/            # 用户资料 API
│   │   ├── albums/            # 照片相册页面
│   │   ├── notes/             # 笔记页面
│   │   ├── timeline/          # 时间轴页面
│   │   └── globals.css        # 全局样式
│   ├── lib/                   # 工具库
│   │   ├── auth.ts           # 认证配置
│   │   ├── auth-helpers.ts   # 认证辅助函数
│   │   ├── db.ts             # 数据库查询函数
│   │   └── utils.ts          # 通用工具函数
│   ├── components/            # React 组件
│   └── middleware.ts          # Next.js 中间件
├── prisma/                    # 数据库相关
│   ├── schema.prisma         # 数据库模型
│   └── migrations/           # 数据库迁移文件
├── public/                    # 静态资源
├── docs/                      # 项目文档
│   ├── API.md                # API 接口文档
│   ├── DEPLOYMENT.md         # 部署指南
│   └── PRD.md                # 产品需求文档
├── .env.example              # 环境变量示例
├── package.json              # 项目依赖
├── tailwind.config.ts        # Tailwind 配置
├── tsconfig.json             # TypeScript 配置
└── next.config.js            # Next.js 配置
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- SQLite（开发环境）或 PostgreSQL（生产环境）

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd site
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，配置必要的环境变量
```

4. **初始化数据库**
```bash
npm run db:push
```

5. **启动开发服务器**
```bash
npm run dev
```

6. **访问应用**
- 前台: http://localhost:3000
- 管理后台: http://localhost:3000/admin

## 📝 可用脚本

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查

# 数据库
npm run db:generate  # 生成 Prisma 客户端
npm run db:migrate   # 运行数据库迁移
npm run db:push      # 推送数据库架构
npm run db:studio    # 打开 Prisma Studio
```

## 🔧 配置说明

### 环境变量

必需的环境变量：
```bash
# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# 数据库
DATABASE_URL="file:./dev.db"

# 邮件服务
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM="Your Name <no-reply@example.com>"
```

### 数据库模型

主要数据模型：
- **User**: 用户信息
- **Account**: 认证账户
- **Session**: 用户会话
- **Photo**: 照片信息
- **Note**: 笔记内容
- **TimelineItem**: 时间轴项目

## 🌐 部署

### Vercel 部署（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 设置 PostgreSQL 数据库
4. 部署项目

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 传统服务器部署

支持部署到任何支持 Node.js 的服务器，包括：
- VPS 服务器
- Docker 容器
- 云服务平台

## 📚 API 文档

完整的 API 接口文档请参考 [API.md](./API.md)

### 主要接口

- `GET /api/photos` - 获取公开照片列表
- `GET /api/notes` - 获取公开笔记列表
- `GET /api/timeline` - 获取公开时间轴
- `POST /api/admin/*` - 管理员内容创建接口
- `GET /api/me` - 获取当前用户信息

## 🔒 安全特性

- **认证保护**: 所有管理功能需要认证
- **权限控制**: 区分普通用户和管理员权限
- **数据验证**: 使用 Zod 进行严格的数据验证
- **CSRF 保护**: NextAuth.js 内置 CSRF 保护
- **环境变量**: 敏感信息通过环境变量管理

## 🎨 UI/UX 特性

- **响应式设计**: 适配桌面和移动设备
- **现代化界面**: 基于 Tailwind CSS 的美观设计
- **加载状态**: 优雅的加载和错误状态处理
- **SEO 优化**: 服务端渲染和元数据优化
- **性能优化**: 图片懒加载和代码分割

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Prisma](https://prisma.io/) - 现代化数据库工具
- [NextAuth.js](https://next-auth.js.org/) - 认证解决方案
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Vercel](https://vercel.com/) - 部署平台

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: your-email@example.com
- GitHub Issues: [项目 Issues](https://github.com/your-username/site/issues)
- 个人网站: https://your-domain.com

---

**享受编码的乐趣！** 🚀
