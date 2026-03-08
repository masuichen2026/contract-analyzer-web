# Vercel 部署指南

Vercel 是最简单、最推荐的部署平台。

## 前置准备

1. 注册 Vercel 账号
   - 访问：https://vercel.com
   - 使用 GitHub、GitLab 或 Bitbucket 账号登录

2. 准备代码仓库
   - 将 `contract-analyzer-web` 推送到 GitHub
   - 确保仓库是公开的（或设置为私有）

## 部署步骤

### 步骤 1：创建 vercel.json 配置文件

在项目根目录创建 `vercel.json`：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "PORT": "3000"
  },
  "functions": {
    "server.js": {
      "maxDuration": 60
    }
  }
}
```

### 步骤 2：在 Vercel 创建新项目

1. 登录 Vercel 控制台
2. 点击 "Add New" -> "Project"
3. 导入你的 GitHub 仓库
4. 选择 `contract-analyzer-web` 目录
5. 点击 "Import"

### 步骤 3：配置环境变量

在项目设置中添加环境变量：

1. 进入项目页面
2. 点击 "Settings" -> "Environment Variables"
3. 添加以下变量：

```
NODE_ENV = production
PORT = 3000
```

4. 点击 "Save"

### 步骤 4：修改 package.json

确保 package.json 包含正确的启动脚本：

```json
{
  "name": "contract-analyzer-web",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### 步骤 5：部署

1. Vercel 会自动检测 Node.js 项目
2. 点击 "Deploy" 按钮
3. 等待部署完成（通常 1-2 分钟）
4. 部署完成后，Vercel 会提供访问 URL

### 步骤 6：配置自定义域名（可选）

1. 进入 "Settings" -> "Domains"
2. 添加你的域名（如：contract.yourdomain.com）
3. 按照提示配置 DNS 记录

## Vercel 免费套餐限制

- **带宽：** 100GB/月
- **构建时长：** 6000 分钟/月
- **函数执行时间：** 10 秒（无服务器）-> 60 秒（Pro）
- **并发请求：** 无限制
- **存储：** 无

**对于合同分析应用，免费套餐完全够用！**

## 常见问题

### Q1: 文件上传大小限制

Vercel 无服务器函数默认请求体限制 4.5MB。需要调整：

在 `vercel.json` 中添加：

```json
{
  "functions": {
    "server.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

**注意：** 如果需要上传大于 4.5MB 的文件，建议：
1. 使用对象存储服务（如 AWS S3、阿里云 OSS）
2. 或者将应用部署到传统服务器

### Q2: 持续部署

Vercel 自动配置持续部署：
- 每次推送到主分支自动部署
- Pull Request 自动预览
- 回滚到历史版本

### Q3: 自定义域名

1. 购买域名（阿里云、腾讯云、GoDaddy 等）
2. 在 Vercel 添加域名
3. 配置 DNS 记录：
   ```
   Type: CNAME
   Name: contract
   Value: cname.vercel-dns.com
   ```

### Q4: 监控和日志

1. 进入项目页面
2. 点击 "Logs" 查看实时日志
3. 点击 "Analytics" 查看访问统计
4. 设置告警通知

## Vercel CLI 部署（高级）

如果你更喜欢命令行：

### 安装 Vercel CLI

```bash
npm install -g vercel
```

### 登录

```bash
vercel login
```

### 部署

```bash
cd contract-analyzer-web
vercel
```

### 生产环境部署

```bash
vercel --prod
```

### 查看部署

```bash
vercel ls
```

### 查看日志

```bash
vercel logs
```

## 性能优化

### 1. 启用缓存

在 `vercel.json` 中添加缓存规则：

```json
{
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 2. 压缩静态资源

Vercel 自动压缩，无需额外配置。

### 3. 使用 Edge Functions

对于简单请求，可以使用 Edge Functions 提高性能：

```javascript
// api/analyze.js
export default async function handler(req, res) {
  // Edge Function 逻辑
}
```

## 安全最佳实践

1. **启用 HTTPS**
   - Vercel 自动提供免费 SSL 证书
   - 强制 HTTPS 重定向

2. **添加速率限制**

   在 server.js 中添加：

   ```javascript
   const rateLimit = require('express-rate-limit');

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 分钟
     max: 100 // 最多 100 个请求
   });

   app.use('/api/analyze', limiter);
   ```

3. **添加请求验证**

   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

4. **环境变量保护**

   - 不要在代码中硬编码敏感信息
   - 使用 Vercel 环境变量存储密钥
   - 设置 `.env` 文件为本地开发使用

## 成本

**Hobby（免费）**
- 100GB 带宽/月
- 无限部署
- 0-5 美元/月（可选）

**Pro（20 美元/月）**
- 1TB 带宽/月
- 优先支持
- 无限团队成员

对于小型应用，免费套餐完全够用！

## 总结

Vercel 是部署 Node.js 应用的最佳选择：
- ✅ 完全免费
- ✅ 零配置
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动 CI/CD
- ✅ 易于使用

**开始使用 Vercel，只需 5 分钟！**
