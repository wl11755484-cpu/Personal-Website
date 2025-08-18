# 产品需求文档（PRD）——个人网站与后台

## 1. 项目概述
- 使命：构建一个稳定、可扩展、可自我管理的个人网站与轻量后台，用于展示与沉淀个人内容（关于我、相册、笔记、时间轴），并支持邮箱登录与基础权限管控。
- 目标：上线可用的公开站点与后台；支持无密码邮箱登录、内容 CRUD、基础统计与权限；具备良好性能与可维护性。
- 范围：前台站点（展示与浏览）、后台（内容管理）、认证授权、基础数据存储、部署与监控。
- 非目标：复杂多媒体处理、复杂协作编辑、支付、电商。

## 2. 目标用户与场景
- 用户画像：
  - 访客：浏览公开信息与作品。
  - 登录用户（自用）：管理与发布内容。
  - 管理员（自用）：系统与权限配置。
- 核心场景：
  - 访客访问主页/关于我/时间轴与公开相册、笔记。
  - 管理员通过后台创建、编辑、发布内容。
  - 登录用户查看草稿、私有条目。

## 3. 核心功能与优先级
- M0（可用）：
  - 邮箱魔法链接登录；路由保护；主页/关于我/时间轴展示；相册与笔记基础列表与详情；后台登录与基础 CRUD；部署上云。
- M1（体验）：
  - 个人资料页；相册图片懒加载与响应式；笔记标签、草稿、搜索；时间轴筛选；分页与加载状态；错误与空态。
- M2（进阶）：
  - RBAC 角色细化；审计日志；统计看板（访客量、内容数）；对象存储（S3/OSS）；Webhook/导出。

## 4. 页面结构与信息架构
- 路由结构（示例）：
  - /（主页）
  - /about（关于我）
  - /album（相册列表）/album/[id]
  - /notes（笔记列表）/notes/[id]
  - /timeline（时间轴）
  - /login（登录）
  - /admin（后台入口）
    - /admin/dashboard
    - /admin/photos
    - /admin/notes
    - /admin/timeline
- 交互要点：
  - 登录后重定向到来源页或后台；受保护路由未登录则重定向 /login；表单支持保存、发布、下线。

## 5. 权限与访问控制
- 角色：
  - guest（未登录）：仅访问公开内容。
  - user（登录）：可见私有内容（自用）。
  - admin（管理员）：后台与系统设置。
- 策略：
  - 中间件仅做路由保护（Edge 兼容），认证逻辑在服务器端处理；后台接口统一鉴权；资源级权限校验（仅管理员可写）。

## 6. 技术栈与架构
- 前端与框架：Next.js 15（App Router）、React Server/Client Components、TypeScript；样式：Tailwind 或 CSS Modules（可选）。
- 认证：Auth.js v5（Email Provider，无密码登录）；配置分离（auth.config.ts、auth.ts、middleware.ts），Edge 兼容；PrismaAdapter。
- 数据：Prisma（dev: SQLite；prod: Postgres）；模型含 User/Account/Session/VerificationToken 及业务模型。
- 部署：Vercel（推荐）或 Node 环境；环境变量与密钥管理（不入库/不日志）。
- 监控：Vercel Analytics/自建日志（后续）。

## 7. 数据模型（简要）
- User(id, email, name, image, role[guest|user|admin], createdAt, updatedAt)
- Account/Session/VerificationToken（Auth.js 标准表）
- Photo(id, url, title, description, tags[], isPublic, createdAt, updatedAt)
- Note(id, title, content, tags[], status[draft|published], isPublic, createdAt, updatedAt)
- TimelineItem(id, type[event|milestone|post], title, content, date, visibility[public|private], createdAt)

## 8. API 设计（简要）
- Auth：/api/auth/*（由 Auth.js 提供）
- 个人资料：GET/PUT /api/me（需登录）
- Photos：GET/POST/PUT/DELETE /api/photos[/:id]（写操作需 admin）
- Notes：GET/POST/PUT/DELETE /api/notes[/:id]（写操作需 admin）
- Timeline：GET/POST/PUT/DELETE /api/timeline[/:id]（写操作需 admin）
- 响应规范：{ success: boolean, data?: any, error?: { code, message } }

## 9. 非功能需求
- 性能：FCP < 1.5s，LCP < 2.5s（移动端 4G 基线）；SSR/SSG、图片优化、懒加载、缓存。
- 安全：CSRF/XSS 防护；接口速率限制；密码学安全令牌；最小权限原则；不记录敏感数据。
- 可靠性：错误边界与降级；健康检查；备份策略（数据库每日备份）。
- 可维护性：ESLint/Prettier；约定式路由与模块划分；日志可观测；文档化与提交规范。

## 10. 里程碑与计划（建议节奏）
- M0（1–2 周）：框架搭建、认证打通、基础模型与公开页面、后台骨架、部署与环境。
- M1（1–2 周）：后台 CRUD、标签与搜索、分页与状态、图片优化、基本统计。
- M2（1–2 周）：RBAC 强化、审计日志、云存储与备份、稳定性与性能优化。
- 每个里程碑包含：开发、自测、预发验证、回归与验收。

## 11. 预算估算（基于免费层）
- 免费层：Vercel、Neon、Cloudflare R2、Resend（100 封/天）
- 域名：约 $1–1.5/月

### 11.1 免费层配额与超量提醒
- Vercel（Hobby）：
  - 关注点：Serverless 执行时长与并发限制、构建次数与带宽配额、冷启动时延。
  - 超量策略：对非关键接口进行缓存或静态化；高峰期降级动态渲染为 SSG/ISR；限制管理端批量操作频率。
- Neon（Postgres 免费层）：
  - 关注点：存储容量、活跃连接数、计算配额（空闲自动休眠）、备份/保留策略。
  - 超量策略：连接池与短连接；归档历史数据；对列表分页与索引优化；读多写少场景使用缓存。
- Cloudflare R2（对象存储）：
  - 关注点：存储容量、请求（Class A/B）配额、跨地域与外网出流量计费；公共读取带宽。
  - 超量策略：图片预处理与裁剪、懒加载与 CDN 缓存；避免高频小文件写入；批处理/合并写。
- Resend：
  - 关注点：免费层日发送上限（示例：100 封/天）、域名验证（SPF/DKIM）、退信与投诉率。
  - 超量策略：加入队列与指数退避重试；非关键通知合并发送；超量时自动降级为站内通知/日志。

### 11.2 监控与告警建议（≥ 当月配额 80% 告警）
- 指标面板：
  - Vercel：调用次数、平均/尾时延、5xx 比例、带宽与构建用量。
  - Neon：连接数、慢查询、CPU/IO 占比、磁盘使用、错误率。
  - R2：存储占用、Class A/B 请求量、出流量、热文件命中率。
  - Resend：日发送量、退信/延迟、失败原因分布、域名信誉状态。
- 自动化动作：
  - 达阈值时：启用更强缓存（Cache-Control/ISR）、降低图片清晰度、限制批量导入、暂停非必需邮件。
  - 运维：开通账单提醒与用量阈值告警；每日/每周用量快照入库。

### 11.3 升级与成本控制
- 升级路径：
  - Vercel Hobby → Pro；Neon 免费层 → 付费层；R2 免费层 → 按量；Resend 免费层 → 付费层或自建 SMTP 兜底。
- 成本防线：
  - 先设置账单上限与预算提醒；再做“分级流量”策略（公开内容优先、后台任务延后）。
  - 以官方定价与当期免费配额为准，月度复核并滚动调整。

### 11.4 用量阈值建议（按免费层动态调整）
- Vercel：
  - 每日请求数：近 7 日 P95 峰值的 80%（预警）/90%（严重）。
  - 带宽与构建：当月配额 80%/90% 告警；监控构建失败率与平均构建时长。
  - Serverless：函数错误率 > 2% 或 P95 时延 > 2s 告警；冷启动比例显著上升时提示静态化/预热。
- Neon（Postgres）：
  - 存储：预计容量的 70%/85%/95% 阶梯告警；建议定期清理归档表与旧版本。
  - 连接数：活跃连接达到配额 80%/90% 告警；开启连接池与短连接策略。
  - 性能：慢查询 > 200ms 计数触发；索引命中率显著下降时提示优化。
- Cloudflare R2：
  - 请求量：Class A/B 达免费配额的 80%/90% 告警；月出流量达 80%/90% 告警。
  - 命中率：热门文件 CDN 命中率 < 60% 告警，提示调高缓存与使用版本化 URL。
- Resend（示例：免费层 100 封/天，实际以官方为准）：
  - 发送量：日配额 70%/85%/95% 阶梯告警；退信率 > 2% 或投诉率 > 0.1% 告警并自动降频。

### 11.5 部署环境变量清单模板（按环境：Local/Preview/Prod）
- 通用/应用：
  - NODE_ENV=development|production
  - NEXT_PUBLIC_SITE_URL=https://example.com
- 认证 Auth.js / NextAuth：
  - AUTH_SECRET=（强随机）
  - AUTH_URL=（生产为站点域名，Vercel 可用 NEXTAUTH_URL 等价）
  - AUTH_TRUST_HOST=true
  - EMAIL_FROM=no-reply@example.com
- Resend（邮件）：
  - RESEND_API_KEY=...
  - EMAIL_FROM=no-reply@example.com（与 Resend 验证域一致）
  - EMAIL_REPLY_TO=contact@example.com（可选）
- 数据库（Neon/Postgres）：
  - DATABASE_URL=postgres://user:pass@host/db
  - DIRECT_URL=postgres://user:pass@host/db（Prisma Migrate 用）
- Prisma（可选）：
  - PRISMA_LOG_LEVEL=query|info|warn|error（本地调试使用）
- 对象存储（Cloudflare R2）：
  - R2_ACCOUNT_ID=...
  - R2_ACCESS_KEY_ID=...
  - R2_SECRET_ACCESS_KEY=...
  - R2_BUCKET_NAME=...
  - R2_PUBLIC_BASE_URL=https://r2-cdn.example.com

注意：
- 不要提交任何密钥到仓库；使用 Vercel 环境变量管理，区分 Preview 与 Production；为访问密钥设置最小权限。
- 本地开发用 .env.local，CI/生产通过平台注入，保密与审计分离。

### 11.6 免费层下缓存与静态化策略清单
- 页面（App Router）：
  - /（主页）：SSG + ISR（revalidate: 60s–5m），内容更新时以 revalidatePath('/') 触发再生成。
  - /about：SSG（不频繁变更）。
  - /album：列表页 SSG + ISR（5m）；/album/[id] 详情页 ISR（5m），图片走 R2 + CDN，Cache-Control: public, max-age=30d, stale-while-revalidate=1d，URL 使用版本号避免脏缓存。
  - /notes：列表页 SSG + ISR（5m）；/notes/[id] ISR（5m）。涉及私有/草稿内容的视图使用 SSR + no-store。
  - /timeline：SSG + ISR（5m）。
  - /login 与 /admin/*：SSR + no-store（鉴权敏感，不缓存）。
- API：
  - GET 列表接口：设置 s-maxage=60、stale-while-revalidate=300，并提供 ETag/Last-Modified；详情接口 s-maxage=300。
  - 变更类接口（POST/PUT/DELETE）：Cache-Control: no-store，并在成功后触发 revalidateTag/revalidatePath 精确失效。
- 数据获取：
  - fetch 默认 cache:'force-cache' 用于静态数据；动态数据加上 { next: { revalidate: N } } 或 cache:'no-store'。
  - 对受保护资源与个性化内容禁用缓存；CDN 缓存基于 URL 与鉴权头自动跳过。
- 图片与资源：
  - next/image 配置 remotePatterns 指向 R2 域名，images.sizes 与 deviceSizes 合理设置；静态资源使用长期缓存与指纹文件名。
- 保护预算：
  - 高峰时段自动延长 revalidate 周期；查得多写得少的接口启用秒级缓存；后台批量操作加速率限制与队列。

## 12. 风险与对策
- Edge 与 Node 依赖冲突：配置分离，中间件避免 Node-only 包；Email/Adapter 仅在 Node 环境使用。
- 邮件送达率：配置可信 SMTP、SPF/DKIM，支持重发与可观测退信。
- 数据安全与丢失：最小权限连接、每日备份、只读副本（后续）。
- 性能波动：关键视图 SSG/缓存、图片处理与懒加载、监控报警。

## 13. 验收标准
- 登录：邮箱链接 10 分钟有效；错误与过期提示清晰；登录后重定向合理。
- 权限：未授权访问受保护路由自动重定向；后台写操作仅 admin 可用。
- 数据：相册/笔记/时间轴 CRUD 正常；异常返回结构化错误；前端状态反馈完整。
- 质量：Lighthouse ≥ 90（Performance/Accessibility/Best Practices/SEO）。

## 14. 开放问题与后续规划
- UI 组件库选择（Tailwind + Headless/UI 库？）
- 评论与互动（是否需要）
- 国际化 i18n 与多语言内容
- 媒体与附件的长期存储策略

—— 完 ——