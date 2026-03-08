# Render 部署指南

Render 是另一个优秀的免费部署平台，支持传统服务器和无服务器。

## 前置准备

1. 注册 Render 账号
   - 访问：https://render.com
   - 使用 GitHub 账号登录

2. 准备代码仓库
   - 将 `contract-analyzer-web` 推送到 GitHub
   - 确保仓库包含所有必要文件

## 部署步骤

### 方式一：Web Service（传统服务器，推荐）

**优点：**
- 完整的服务器环境
- 支持长连接
- 无请求体大小限制
- 适合文件上传应用

#### 步骤 1：准备代码

确保项目包含以下文件：

1. `package.json` - 依赖和启动脚本
2. `server.js` - 服务器代码
3. `.gitignore` - 排除不必要的文件
4. `package-lock.json` - 锁定依赖版本

#### 步骤 2：在 Render 创建 Web Service

1. 登录 Render 控制台
2. 点击 "New +" -> "Web Service"
3. 连接你的 GitHub 仓库
4. 配置构建和部署设置：

```
Name: contract-analyzer-web
Region: Singapore (或选择离你最近的)
Branch: main
Runtime: Node
Root Directory: ./ (留空)
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

#### 步骤 3：配置环境变量

在 Environment Variables 部分添加：

```
NODE_ENV = production
PORT = 3000
```

#### 步骤 4：部署

1. 点击 "Create Web Service"
2. 等待构建和部署完成（通常 2-3 分钟）
3. 部署完成后，Render 会提供访问 URL

#### 步骤 5：访问应用

Render 提供的 URL 格式：
```
https://contract-analyzer-web.onrender.com
```

### 方式二：Render CLI 部署

#### 安装 Render CLI

```bash
npm install -g render
```

#### 登录

```bash
render login
```

#### 创建部署配置

创建 `render.yaml`：

```yaml
services:
  - type: web
    name: contract-analyzer-web
    env: node
    region: singapore
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

#### 部署

```bash
render deploy
```

## Render 免费套餐限制

**Web Service Free：**
- **内存：** 512MB
- **CPU：** 0.1 CPU share
- **带宽：** 100GB/月
- **请求超时：** 15 秒（需要修改代码）
- **睡眠时间：** 15 分钟无活动后休眠
- **唤醒时间：** 30 秒

**对于合同分析应用：**
- ✅ 内存和 CPU 够用
- ✅ 带宽充足
- ⚠️ 需要处理休眠问题

## 解决休眠问题

Render 免费套餐会在 15 分钟无请求后休眠。解决方案：

### 方案 1：使用外部保活服务

创建一个健康检查端点：

```javascript
// 在 server.js 中添加
app.get('/keep-alive', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

然后使用免费保活服务：

1. UptimeRobot：https://uptimerobot.com
2. Better Uptime：https://betteruptime.com

配置每 5-10 分钟访问一次 `https://your-app.onrender.com/keep-alive`

### 方案 2：升级到付费套餐

Render Starter（7 美元/月）：
- 无休眠
- 512MB 内存
- 0.5 CPU
- 20GB 带宽

### 方案 3：使用 Cron-job.org

注册 https://cron-job.org，设置每 10 分钟访问一次。

## 配置自定义域名

### 步骤 1：购买域名

在阿里云、腾讯云或 GoDaddy 购买域名。

### 步骤 2：在 Render 添加域名

1. 进入 Web Service 设置
2. 点击 "Domains" -> "Add Domain"
3. 输入你的域名（如：contract.yourdomain.com）
4. 点击 "Add Domain"

### 步骤 3：配置 DNS

Render 会显示需要配置的 DNS 记录：

```
Type: CNAME
Name: contract
Value: cname-username.onrender.com
```

在域名提供商处添加这些记录。

### 步骤 4：等待 DNS 生效

通常需要 10 分钟到 48 小时。

## 监控和日志

### 查看日志

1. 进入 Web Service 页面
2. 点击 "Logs" 标签
3. 实时查看应用日志

### 查看指标

1. 点击 "Metrics" 标签
2. 查看 CPU、内存、带宽使用情况
3. 设置告警

### 设置告警

1. 点击 "Events" -> "New Alert"
2. 配置告警条件：
   - 内存使用 > 80%
   - 响应时间 > 5 秒
   - 错误率 > 1%

## 性能优化

### 1. 使用环境变量优化

```javascript
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'production') {
    app.use(compression());
    app.enable('trust proxy');
}
```

### 2. 启用压缩

安装 compression 中间件：

```bash
npm install compression
```

在 server.js 中使用：

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. 优化文件上传

限制并发上传数量：

```javascript
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        // 文件类型验证
        cb(null, true);
    }
});
```

## 数据库集成（可选）

Render 提供免费的 PostgreSQL 数据库：

1. 在 Render 创建 PostgreSQL 数据库
2. 在 Web Service 连接数据库
3. 使用环境变量存储连接信息：

```javascript
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
```

## 安全配置

### 1. 启用 Helmet

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 2. 配置 CORS

```javascript
const cors = require('cors');
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
```

### 3. 添加速率限制

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: '请求过于频繁，请稍后再试'
});

app.use('/api/', limiter);
```

## 故障排除

### 问题 1：部署失败

**检查项：**
1. 查看构建日志
2. 确认 package.json 正确
3. 检查依赖版本兼容性

### 问题 2：应用无法启动

**检查项：**
1. 查看运行日志
2. 确认 PORT 环境变量
3. 检查启动命令

### 问题 3：响应超时

**解决方法：**
1. 优化分析代码，减少处理时间
2. 使用异步处理
3. 考虑升级到付费套餐

### 问题 4：内存不足

**解决方法：**
1. 检查内存泄漏
2. 优化算法
3. 升级套餐

## 成本对比

| 套餐 | 月费 | 内存 | CPU | 带宽 | 休眠 |
|-----|------|------|-----|------|------|
| Free | $0 | 512MB | 0.1 | 100GB | 有 |
| Starter | $7 | 512MB | 0.5 | 20GB | 无 |
| Standard | $25 | 2GB | 1 | 100GB | 无 |
| Pro | $85 | 8GB | 4 | 500GB | 无 |

**建议：**
- 个人项目/测试：Free 套餐
- 生产环境：Starter 或 Standard

## 总结

Render 适合：
- ✅ 需要传统服务器环境的应用
- ✅ 需要长连接的应用
- ✅ 需要上传大文件的应用
- ✅ 预算有限的项目

相比 Vercel：
- ✅ 无请求体大小限制
- ✅ 更长的请求超时时间
- ✅ 完整的服务器环境
- ⚠️ 需要处理休眠问题

**Render 是 Vercel 的绝佳替代方案！**
