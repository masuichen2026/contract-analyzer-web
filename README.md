# 企业合同智能分析系统

基于AI的合同风险识别与红线条款核查的Web应用。

## 功能特性

### 核心功能

1. **红线条款比对核查**
   - 逐一核对客户合同条款与公司红线条款
   - 标注存在/不存在红线条款
   - 对存在的红线条款列明详细信息

2. **客户合同风险分析**
   - 主体资格风险识别
   - 条款内容风险分析
   - 履约落地风险评估
   - 法律合规风险检查

3. **回款节点与风险管控**
   - 梳理合同中所有回款节点
   - 分析回款潜在风险
   - 制定防控策略和催收策略

4. **合同金额大小写一致性校验**
   - 验证数字金额与中文大写金额的一致性
   - 确保两者数值完全匹配

5. **合同金额与周期对应要求**
   - 根据金额确定最低合同周期要求
   - 检查合同周期是否满足最低要求

6. **风险清单汇总**
   - 汇总所有风险点
   - 高风险项目专项应对方案

## 技术栈

### 前端
- HTML5 + CSS3 + JavaScript (ES6+)
- Tailwind CSS (CDN)
- Google Fonts (Noto Serif SC, Playfair Display)

### 后端
- Node.js
- Express.js
- Multer (文件上传)

## 快速开始

### 安装依赖

```bash
cd contract-analyzer-web
npm install
```

### 启动应用

```bash
npm start
```

应用将在 `http://localhost:3000` 启动。

### 环境变量

创建 `.env` 文件（可选）：

```
PORT=3000
NODE_ENV=production
```

## 使用说明

### 上传合同文件

1. **客户合同文件**（必需）
   - 支持格式：PDF, DOC, DOCX, MD
   - 最大文件大小：10MB

2. **公司标准合同**（可选）
   - 使用公司标准合同进行比对分析
   - 如未上传，使用默认标准合同

3. **红线条款清单**（可选）
   - 使用自定义红线条款清单
   - 如未上传，使用默认红线条款清单

### 分析流程

1. 上传合同文件
2. 点击"开始分析"按钮
3. 等待系统分析完成（通常需要几秒钟）
4. 查看分析结果

### 查看结果

分析结果包含以下模块：

- **分析概览** - 快速查看主要指标
- **红线条款核查** - 查看红线条款详情
- **客户合同风险分析** - 查看各维度风险
- **回款节点与风险管控** - 查看回款风险和防控策略
- **合同金额大小写一致性校验** - 验证金额一致性
- **合同金额与周期对应要求** - 验证周期要求
- **风险清单汇总** - 查看所有风险汇总

### 导出报告

- 点击"导出 Markdown 报告"按钮导出完整报告
- 点击"分析新的合同"按钮开始新的分析

## 🚀 部署指南

### 快速选择

| 平台 | 难度 | 费用 | 适用场景 |
|-----|------|------|---------|
| **Vercel** | ⭐ 简单 | 免费 | 个人项目、快速上线 |
| **Render** | ⭐⭐ 中等 | 免费/付费 | 需要服务器环境 |
| **阿里云** | ⭐⭐⭐ 复杂 | 付费 | 生产环境、国内访问 |
| **腾讯云** | ⭐⭐⭐ 复杂 | 付费 | 生产环境、国内访问 |

### 本地部署

```bash
# 安装依赖
npm install

# 启动应用
npm start

# 访问应用
# 打开浏览器访问 http://localhost:3000
```

### 服务器部署

1. **上传文件到服务器**
```bash
scp -r contract-analyzer-web user@server:/path/to/deployment
```

2. **在服务器上安装依赖**
```bash
ssh user@server
cd /path/to/deployment/contract-analyzer-web
npm install
```

3. **启动应用**
```bash
npm start
```

4. **使用 PM2 管理进程**（推荐）
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name contract-analyzer

# 查看状态
pm2 status

# 查看日志
pm2 logs contract-analyzer

# 重启应用
pm2 restart contract-analyzer

# 停止应用
pm2 stop contract-analyzer
```

5. **配置 Nginx 反向代理**（可选）

编辑 Nginx 配置文件：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

重启 Nginx：

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Docker 部署（可选）

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

构建和运行：

```bash
# 构建镜像
docker build -t contract-analyzer .

# 运行容器
docker run -d -p 3000:3000 --name contract-analyzer contract-analyzer
```

### 云平台部署

#### 1. Vercel（推荐，最简单）

**📖 详细教程：** [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

**为什么选择 Vercel：**
- ✅ 完全免费
- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动 CI/CD

**快速开始（5分钟）：**
```bash
# 1. 推送到 GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/contract-analyzer-web.git
git push -u origin main

# 2. 在 Vercel 导入项目
# 访问 https://vercel.com/new
# 选择 GitHub 仓库
# 点击 Deploy
```

**访问地址：** `https://contract-analyzer-web.vercel.app`

---

#### 2. Render（适合需要服务器环境）

**📖 详细教程：** [DEPLOY_RENDER.md](DEPLOY_RENDER.md)

**为什么选择 Render：**
- ✅ 免费套餐
- ✅ 传统服务器环境
- ✅ 无请求体大小限制
- ✅ 适合文件上传应用

**快速开始：**
```bash
# 1. 推送到 GitHub

# 2. 在 Render 创建 Web Service
# 访问 https://dashboard.render.com
# 点击 New -> Web Service
# 连接 GitHub 仓库
# 配置：
#   - Build Command: npm install
#   - Start Command: node server.js
#   - Instance Type: Free
```

**访问地址：** `https://contract-analyzer-web.onrender.com`

---

#### 3. 阿里云（生产环境，国内访问快）

**📖 详细教程：** [DEPLOY_ALIYUN.md](DEPLOY_ALIYUN.md)

**为什么选择阿里云：**
- ✅ 国内访问速度快
- ✅ 完全控制服务器
- ✅ 无限制
- ✅ 适合生产环境

**成本估算：**
- ECS 服务器：约 100-200 元/月
- 带宽：约 30-80 元/月
- 域名：约 60 元/年

**快速开始：**
```bash
# 1. 购买阿里云 ECS 服务器
# 2. 连接服务器
ssh root@your-server-ip

# 3. 安装 Node.js 和 PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# 4. 克隆项目
cd /var/www
sudo git clone https://github.com/yourusername/contract-analyzer-web.git
cd contract-analyzer-web

# 5. 安装依赖并启动
npm install --production
pm2 start server.js --name contract-analyzer
```

**访问地址：** `http://your-server-ip:3000`

---

#### 4. 腾讯云（生产环境，国内访问快）

#### Vercel

1. Fork 项目到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量（如果需要）
4. 部署

#### Render

1. 连接 GitHub 仓库
2. 配置构建和启动命令
3. 部署

## API 文档

### POST /api/analyze

分析合同文件。

**请求：**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `contract`: 客户合同文件（必需）
  - `standard`: 公司标准合同文件（可选）
  - `redline`: 红线条款清单文件（可选）

**响应：**
```json
{
  "redlineClauses": {
    "exists": false,
    "details": []
  },
  "riskAnalysis": {
    "主体资格风险": [],
    "条款内容风险": [],
    "履约落地风险": [],
    "法律合规风险": []
  },
  "paymentRisk": {
    "nodes": [],
    "risks": [],
    "strategies": []
  },
  "amountVerification": {
    "consistent": true,
    "inconsistencies": []
  },
  "periodVerification": {
    "analysis": {},
    "risk": null
  },
  "riskSummary": []
}
```

### GET /health

健康检查端点。

**响应：**
```json
{
  "status": "ok",
  "timestamp": "2026-03-08T00:00:00.000Z"
}
```

## 文件结构

```
contract-analyzer-web/
├── public/
│   ├── index.html          # 主页面
│   └── js/
│       └── app.js         # 前端逻辑
├── uploads/               # 上传文件临时目录（自动创建）
├── server.js             # 服务器主文件
├── package.json          # 项目配置
├── README.md            # 项目说明
└── .gitignore           # Git忽略文件
```

## 安全注意事项

1. **文件上传限制**
   - 最大文件大小：10MB
   - 支持的文件类型：PDF, DOC, DOCX, MD

2. **数据安全**
   - 上传的文件在分析完成后立即删除
   - 不存储任何用户数据

3. **访问控制**
   - 生产环境建议添加身份验证
   - 考虑添加速率限制
   - 使用 HTTPS

## 故障排除

### 文件上传失败

- 检查文件大小是否超过10MB
- 确认文件格式是否支持
- 检查网络连接

### 分析失败

- 检查浏览器控制台错误信息
- 确认文件内容是否可读
- 检查服务器日志

### 端口被占用

更改端口号：

```bash
# Windows
set PORT=3001
npm start

# Linux/Mac
PORT=3001 npm start
```

## 📊 部署平台对比与选择

### 快速对比

| 特性 | Vercel | Render | 阿里云 | 腾讯云 |
|-----|---------|---------|---------|---------|
| **费用** | 免费 | 免费/付费 | 付费 | 付费 |
| **部署难度** | ⭐ 简单 | ⭐⭐ 中等 | ⭐⭐⭐ 复杂 | ⭐⭐⭐ 复杂 |
| **启动时间** | 5分钟 | 10分钟 | 30分钟+ | 30分钟+ |
| **文件上传限制** | 4.5MB | 无限制 | 无限制 | 无限制 |
| **HTTPS** | 自动 | 需配置 | 需配置 | 需配置 |
| **国内访问** | 慢 | 慢 | 快 | 快 |
| **运维需求** | 无 | 低 | 中高 | 中高 |
| **自动扩容** | 是 | 是 | 需配置 | 需配置 |

### 场景推荐

#### 🎓 个人项目 / 学习测试
**推荐：Vercel** 或 **Render**

- 费用：完全免费
- 部署：5-10 分钟
- 运维：零运维

**适用：**
- 快速验证想法
- 学习云平台部署
- 个人作品集

#### 🏢 小型生产环境
**推荐：Render** (Starter 套餐) 或 **阿里云** (轻量应用服务器)

- 费用：7-20 美元/月 或 100-200 元/月
- 部署：10-30 分钟
- 运维：低

**适用：**
- 小型商业应用
- 初创产品
- 内部工具

#### 🏭 企业生产环境
**推荐：阿里云** 或 **腾讯云**

- 费用：200-1000+ 元/月
- 部署：30分钟+
- 运维：中高

**适用：**
- 高流量应用
- 企业级应用
- 需要高可用性

### 部署流程

```
开发阶段
    ↓
本地测试 (localhost:3000)
    ↓
代码推送到 GitHub
    ↓
选择部署平台
    ↓
部署到云平台
    ↓
配置自定义域名 (可选)
    ↓
配置 HTTPS (可选)
    ↓
测试和监控
    ↓
上线运行
```

### 成本估算

#### Vercel（免费套餐）
- **月费：** $0
- **带宽：** 100GB/月
- **构建：** 6000 分钟/月
- **适合：** 个人项目、测试环境

#### Render（Free 套餐）
- **月费：** $0
- **带宽：** 100GB/月
- **内存：** 512MB
- **注意：** 15 分钟休眠
- **适合：** 小型应用、测试环境

#### Render（Starter 套餐）
- **月费：** $7
- **带宽：** 20GB/月
- **内存：** 512MB
- **无休眠**
- **适合：** 小型生产环境

#### 阿里云（轻量应用服务器）
- **月费：** 约 100-200 元
- **配置：** 1核2GB
- **带宽：** 1-3 Mbps
- **适合：** 国内生产环境

#### 阿里云（ECS 云服务器）
- **月费：** 约 200-500 元
- **配置：** 2核4GB
- **带宽：** 3-5 Mbps
- **适合：** 中型生产环境

### 详细教程

所有部署平台的详细教程都在项目根目录：

- **Vercel 部署：** [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) 📖
- **Render 部署：** [DEPLOY_RENDER.md](DEPLOY_RENDER.md) 📖
- **阿里云部署：** [DEPLOY_ALIYUN.md](DEPLOY_ALIYUN.md) 📖

### 快速开始 - Vercel（最简单）

```bash
# 1. 初始化 Git 仓库
cd contract-analyzer-web
git init
git add .
git commit -m "Initial commit"

# 2. 推送到 GitHub
git remote add origin https://github.com/yourusername/contract-analyzer-web.git
git push -u origin main

# 3. 在 Vercel 部署
# 访问 https://vercel.com/new
# 导入 GitHub 仓库
# 点击 Deploy

# 完成！应用将在 1-2 分钟后上线
```

### 快速开始 - Render（服务器环境）

```bash
# 1. 推送到 GitHub（同上）

# 2. 在 Render 创建 Web Service
# 访问 https://dashboard.render.com
# 点击 New -> Web Service
# 连接 GitHub 仓库
# 配置：
#   - Name: contract-analyzer-web
#   - Build Command: npm install
#   - Start Command: node server.js
#   - Instance Type: Free

# 完成！应用将在 2-3 分钟后上线
```

### 常见问题

**Q1: 哪个平台最适合我？**
- 初学者/个人项目：Vercel
- 需要服务器环境：Render
- 国内生产环境：阿里云/腾讯云

**Q2: 如何从 Vercel 迁移到阿里云？**
- 在阿里云购买 ECS
- 按照阿里云教程部署
- 更新域名解析
- 关闭 Vercel 部署

**Q3: 需要多久能部署完成？**
- Vercel: 5-10 分钟
- Render: 10-20 分钟
- 阿里云: 30-60 分钟

**Q4: 如何监控应用运行状态？**
- Vercel/Render: 控制台查看日志和指标
- 阿里云: 使用云监控 + PM2 监控

**Q5: 遇到问题怎么办？**
- 查看各平台的详细教程文档
- 查看平台社区和文档
- 联系平台技术支持

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系：OpenClaw AI Team

---

**企业合同智能分析系统** © 2026 | 安全 · 可靠 · 专业
