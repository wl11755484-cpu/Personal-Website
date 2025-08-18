# 🚀 快速部署指南

你的个人网站已经完全准备就绪！选择最适合你的部署方式：

## 🌟 方案一：Vercel 部署（推荐）

**最简单的部署方式，适合大多数用户**

### 步骤：
1. **创建 GitHub 仓库**
   ```bash
   # 在 GitHub 上创建新仓库：personal-website
   git remote add origin https://github.com/YOUR_USERNAME/personal-website.git
   git branch -M main
   git push -u origin main
   ```

2. **部署到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 用 GitHub 账户登录
   - 点击 "New Project" → 导入你的仓库
   - 配置环境变量（见下方）
   - 点击 "Deploy"

3. **环境变量配置**
   ```env
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=KkC4mIHsWDkjEds/4pcgP8yPplKNcBO41O/dkxBU0q8=
   DATABASE_URL=postgresql://user:pass@host:port/db
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

**✅ 优势：** 零配置、自动 HTTPS、全球 CDN、免费 PostgreSQL

---

## 🐳 方案二：Docker 部署

**适合有服务器的用户，完全控制环境**

### 快速启动：
```bash
# 1. 克隆并构建
git clone <your-repo>
cd personal-website

# 2. 配置环境变量
cp .env.production .env
# 编辑 .env 文件

# 3. 启动服务
docker-compose up -d

# 4. 访问应用
open http://localhost:3000
```

**✅ 优势：** 完全控制、本地部署、包含数据库和缓存

---

## ⚡ 方案三：一键部署脚本

**使用我们的交互式部署脚本**

```bash
./deploy.sh
```

选择选项 4 获得完整指导！

---

## 🔧 环境变量详解

### 必需变量：
- `NEXTAUTH_URL`: 你的网站域名
- `NEXTAUTH_SECRET`: 认证密钥（已生成）
- `DATABASE_URL`: PostgreSQL 连接字符串
- `EMAIL_SERVER_*`: 邮件服务配置

### 推荐的邮件服务：

**Gmail（推荐）：**
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password  # 不是普通密码！
EMAIL_FROM=your-email@gmail.com
```

> 💡 **Gmail 设置：** 启用两步验证 → 生成应用专用密码

**SendGrid：**
```env
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

---

## 🗄️ 数据库选择

### Vercel 部署：
- **Vercel Postgres**（推荐）：集成度最高
- **Supabase**：功能丰富，有免费层
- **PlanetScale**：无服务器 MySQL

### 自托管：
- **PostgreSQL**：生产环境推荐
- **SQLite**：开发和小型部署

---

## 🚦 部署后检查清单

### ✅ 功能测试：
- [ ] 网站首页加载正常
- [ ] 用户注册/登录功能
- [ ] 邮件验证收到邮件
- [ ] 管理后台可访问
- [ ] API 接口响应正常
- [ ] 照片/笔记/时间轴显示

### ✅ 性能检查：
- [ ] 页面加载速度 < 3秒
- [ ] 移动端响应式正常
- [ ] 图片加载优化
- [ ] SEO 基础设置

### ✅ 安全检查：
- [ ] HTTPS 证书有效
- [ ] 环境变量未泄露
- [ ] 管理员权限正常
- [ ] API 速率限制生效

---

## 🆘 常见问题

### Q: 部署后无法登录？
A: 检查邮件服务配置，确保 `EMAIL_SERVER_*` 变量正确

### Q: 数据库连接失败？
A: 确认 `DATABASE_URL` 格式正确，数据库服务正常运行

### Q: 页面显示 500 错误？
A: 查看部署日志，通常是环境变量缺失或数据库未迁移

### Q: 如何添加自定义域名？
A: 在 Vercel 项目设置中添加域名，配置 DNS 记录

---

## 📞 获取帮助

- 📖 **详细文档**：`DEPLOYMENT.md`
- 🔌 **API 文档**：`API.md`
- ✅ **检查清单**：`CHECKLIST.md`
- 🛠️ **交互脚本**：`./deploy.sh`

---

## 🎉 部署成功！

恭喜！你的个人网站现在已经在线了！

**下一步：**
1. 🎨 自定义网站内容和样式
2. 📝 添加你的第一篇笔记
3. 📸 上传照片到相册
4. ⏰ 记录重要时刻到时间轴
5. 🔗 分享你的网站给朋友们

**享受你的个人数字空间吧！** ✨