# 部署指南

本文档描述了如何将个人网站部署到生产环境。

## 部署前检查清单

### 1. 环境变量配置

复制 `.env.example` 到 `.env.local` 并配置以下必需的环境变量：

```bash
# NextAuth 配置
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-strong-random-secret-at-least-32-chars

# 数据库配置（生产环境推荐 PostgreSQL）
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# 邮件服务配置
EMAIL_SERVER_HOST=smtp.your-provider.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@domain.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM="Your Name <no-reply@your-domain.com>"
```

### 2. 数据库迁移

```bash
# 生成 Prisma 客户端
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 推送数据库架构（如果使用 db push）
npm run db:push
```

### 3. 构建测试

```bash
# 安装依赖
npm install

# 运行构建
npm run build

# 本地测试生产构建
npm run start
```

## Vercel 部署（推荐）

### 1. 准备工作

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 控制台连接 GitHub 仓库
3. 配置环境变量

### 2. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

- `NEXTAUTH_URL`: `https://your-app.vercel.app`
- `NEXTAUTH_SECRET`: 强随机字符串（至少32字符）
- `DATABASE_URL`: PostgreSQL 连接字符串
- `EMAIL_SERVER_HOST`: SMTP 服务器地址
- `EMAIL_SERVER_PORT`: SMTP 端口
- `EMAIL_SERVER_USER`: SMTP 用户名
- `EMAIL_SERVER_PASSWORD`: SMTP 密码
- `EMAIL_FROM`: 发件人邮箱

### 3. 数据库设置

推荐使用以下 PostgreSQL 服务：
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [PlanetScale](https://planetscale.com/)
- [Railway](https://railway.app/)

### 4. 部署步骤

1. 在 Vercel 中导入项目
2. 配置环境变量
3. 部署项目
4. 运行数据库迁移（在 Vercel 函数中或本地）

## 传统服务器部署

### 1. 服务器要求

- Node.js 18+ 
- PostgreSQL 12+
- 反向代理（Nginx 推荐）
- SSL 证书

### 2. 部署步骤

```bash
# 1. 克隆代码
git clone <your-repo-url>
cd site

# 2. 安装依赖
npm install --production

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件

# 4. 数据库迁移
npx prisma migrate deploy

# 5. 构建项目
npm run build

# 6. 启动服务
npm run start
```

### 3. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. PM2 进程管理

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "personal-site" -- start

# 设置开机自启
pm2 startup
pm2 save
```

## 部署后验证

### 1. 功能测试

- [ ] 首页加载正常
- [ ] 邮箱登录功能正常
- [ ] Admin 后台访问正常
- [ ] API 接口响应正常
- [ ] 数据库连接正常

### 2. 性能测试

```bash
# 使用 Lighthouse 测试性能
npx lighthouse https://your-domain.com --view

# 或使用在线工具
# https://pagespeed.web.dev/
```

### 3. 安全检查

- [ ] HTTPS 证书有效
- [ ] 环境变量未泄露
- [ ] 数据库连接安全
- [ ] 邮件服务配置正确

## 监控和维护

### 1. 日志监控

- 应用日志：检查 Next.js 和 Prisma 日志
- 服务器日志：检查 Nginx/Apache 访问日志
- 数据库日志：监控数据库性能和错误

### 2. 备份策略

```bash
# 数据库备份脚本示例
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
pg_dump $DATABASE_URL > backup_$DATE.sql

# 定期清理旧备份
find /path/to/backups -name "backup_*.sql" -mtime +7 -delete
```

### 3. 更新流程

```bash
# 1. 备份数据库
# 2. 拉取最新代码
git pull origin main

# 3. 安装依赖
npm install

# 4. 运行迁移
npx prisma migrate deploy

# 5. 重新构建
npm run build

# 6. 重启服务
pm2 restart personal-site
```

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 `DATABASE_URL` 配置
   - 确认数据库服务运行正常
   - 检查网络连接和防火墙设置

2. **邮件发送失败**
   - 检查 SMTP 配置
   - 确认邮箱服务商设置
   - 检查防火墙和端口设置

3. **认证问题**
   - 检查 `NEXTAUTH_SECRET` 配置
   - 确认 `NEXTAUTH_URL` 正确
   - 检查 cookie 和 session 设置

4. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确认所有依赖安装正确
   - 检查 TypeScript 类型错误

### 获取帮助

- 查看应用日志：`pm2 logs personal-site`
- 查看数据库日志
- 检查 Vercel 部署日志（如果使用 Vercel）
- 参考 Next.js 和 Prisma 官方文档