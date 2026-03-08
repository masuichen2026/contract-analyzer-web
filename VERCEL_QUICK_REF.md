# Vercel 部署快速参考卡

## 📋 部署清单

### 前置准备
- [ ] 注册 Vercel 账号（https://vercel.com）
- [ ] 准备 GitHub 账号
- [ ] 将代码推送到 GitHub

### 部署步骤（5分钟）

1. **访问 Vercel**
   - https://vercel.com/new

2. **导入项目**
   - 点击 "Import" 选择你的 GitHub 仓库
   - 选择 `contract-analyzer-web` 目录

3. **配置环境变量**
   - 在 "Environment Variables" 添加：
     ```
     NODE_ENV = production
     PORT = 3000
     ```

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待 1-2 分钟

5. **访问应用**
   - Vercel 会提供 URL，如：
     ```
     https://contract-analyzer-web.vercel.app
     ```

## 📁 必需文件

确保项目包含以下文件：

```
contract-analyzer-web/
├── server.js              ✅ 服务器主文件
├── package.json           ✅ 项目配置
├── vercel.json          ✅ Vercel 配置
├── .env.example         ✅ 环境变量示例
├── .vercelignore       ✅ 忽略文件配置
├── public/
│   └── index.html       ✅ 前端页面
└── README.md            ✅ 项目说明
```

## ⚙️ vercel.json 配置说明

```json
{
  "version": 2,                              // Vercel 版本
  "builds": [                               // 构建配置
    {
      "src": "server.js",                    // 入口文件
      "use": "@vercel/node"                 // 使用 Node.js 运行时
    }
  ],
  "routes": [                                // 路由配置
    {
      "src": "/(.*)",                       // 所有路由
      "dest": "/server.js"                   // 转发到 server.js
    }
  ],
  "env": {                                  // 环境变量
    "NODE_ENV": "production",
    "PORT": "3000"
  },
  "functions": {                             // 函数配置
    "server.js": {
      "maxDuration": 60,                     // 最大执行时间（秒）
      "memory": 1024                         // 内存（MB）
    }
  }
}
```

## 🔧 常见配置调整

### 增加文件上传限制

如果需要上传大于 4.5MB 的文件：

```json
{
  "functions": {
    "server.js": {
      "maxDuration": 120,    // 增加到 120 秒
      "memory": 2048        // 增加到 2GB
    }
  }
}
```

### 自定义域名

1. 进入项目设置
2. 点击 "Domains"
3. 添加域名（如：contract.yourdomain.com）
4. 按照提示配置 DNS

### 配置 CORS

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://yourdomain.com"
        }
      ]
    }
  ]
}
```

## 🚨 常见问题

### Q1: 部署失败

**检查：**
1. 查看构建日志
2. 确认 package.json 正确
3. 确认所有必需文件都在

### Q2: 访问 404

**原因：** 路由配置错误

**解决：** 确保 vercel.json 中 routes 配置正确

### Q3: 文件上传失败

**原因：** Vercel 默认请求体限制 4.5MB

**解决：**
1. 使用对象存储（AWS S3、阿里云 OSS）
2. 或者使用其他平台（如 Render）

### Q4: 应用休眠

**原因：** Vercel 无服务器会自动休眠

**解决：** 这是正常行为，首次访问会自动唤醒（约 1-2 秒）

## 📊 免费套餐限制

| 项目 | 限制 |
|-----|------|
| 带宽 | 100GB/月 |
| 构建 | 6000 分钟/月 |
| 函数执行 | 60 秒/请求 |
| 内存 | 1024MB/请求 |
| 并发 | 无限制 |

## 🔗 有用链接

- **Vercel 文档：** https://vercel.com/docs
- **Vercel 配置：** https://vercel.com/docs/project-settings
- **Node.js 运行时：** https://vercel.com/docs/runtimes#official-runtimes
- **环境变量：** https://vercel.com/docs/projects/environment-variables

## 💡 提示

1. **自动部署**：每次推送到主分支会自动部署
2. **预览部署**：Pull Request 会创建预览链接
3. **回滚**：可以轻松回滚到历史版本
4. **日志**：在项目页面可以查看实时日志
5. **域名**：可以配置自定义域名和 HTTPS

## 📞 获取帮助

- **Vercel 支持：** https://vercel.com/support
- **Vercel 社区：** https://vercel.com/community
- **详细教程：** 查看 `DEPLOY_VERCEL.md`

---

**快速部署，只需 5 分钟！** 🚀
