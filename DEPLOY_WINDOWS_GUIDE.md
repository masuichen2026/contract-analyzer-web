# 部署到 Vercel - Windows 11 完整指南

## 📋 前置准备

### 系统信息
- **操作系统：** Windows 11
- **GitHub 账号：** 469380464@qq.com
- **Vercel 账号：** 469380464@qq.com

### 必需软件
1. **Node.js** - https://nodejs.org (建议 v18 或更高)
2. **Git** - https://git-scm.com/downloads
3. **Vercel CLI** - 将通过脚本自动安装

## 🚀 快速部署（一键脚本）

### 方式一：使用自动部署脚本（推荐）

**步骤：**

1. **打开 PowerShell 或 CMD**
   - 按 `Win + X`，选择 "Windows PowerShell" 或 "命令提示符"
   - 或按 `Win + R`，输入 `powershell` 或 `cmd`

2. **进入项目目录**
   ```bash
   cd C:\Users\46938\.openclaw\workspace\contract-analyzer-web
   ```

3. **运行部署脚本**
   ```bash
   deploy-windows.bat
   ```

4. **按提示操作**
   - 脚本会自动检查和安装所有依赖
   - 配置 Git 并推送代码到 GitHub
   - 完成后会显示下一步操作

**脚本功能：**
- ✅ 自动检查 Node.js、npm、Git
- ✅ 自动安装 Vercel CLI
- ✅ 配置 Git 用户信息
- ✅ 推送代码到 GitHub
- ✅ 提供详细的下一步指引

### 方式二：手动部署

#### 步骤 1：创建 GitHub 仓库

1. 访问：https://github.com/new
2. 登录你的账号：469380464@qq.com
3. 填写仓库信息：
   - **Repository name:** contract-analyzer-web
   - **Description:** 企业合同智能分析系统
   - **Public/Private:** 选择 Public（推荐）或 Private
4. 点击 "Create repository"

#### 步骤 2：初始化 Git 并推送代码

打开 PowerShell 或 CMD，执行：

```bash
# 进入项目目录
cd C:\Users\46938\.openclaw\workspace\contract-analyzer-web

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit - Contract Analyzer Web App"

# 添加远程仓库
git remote add origin https://469380464:+++999czy@github.com/469380464/contract-analyzer-web.git

# 推送代码
git push -u origin main
```

**注意：** `+++999czy` 是你的密码，如果密码有特殊字符，可能需要 URL 编码。

#### 步骤 3：在 Vercel 部署

1. **访问 Vercel**
   - 打开浏览器访问：https://vercel.com/new
   - 使用 GitHub 账号登录（469380464@qq.com）

2. **导入项目**
   - 点击 "Import Project"
   - 选择 "From GitHub"
   - 找到并选择 `contract-analyzer-web` 仓库
   - 点击 "Import"

3. **配置项目**
   Vercel 会自动检测配置，确认以下信息：
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: npm install
   Output Directory: ./
   Install Command: (留空）
   ```

4. **添加环境变量**
   在 "Environment Variables" 部分添加：
   ```
   NAME: NODE_ENV
   VALUE: production

   NAME: PORT
   VALUE: 3000
   ```

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待 1-2 分钟

#### 步骤 4：访问应用

部署完成后，Vercel 会提供访问 URL：
```
https://contract-analyzer-web.vercel.app
```

## 📊 部署流程图

```
Windows 11
    ↓
运行 deploy-windows.bat
    ↓
检查依赖（Node.js, Git, Vercel CLI）
    ↓
安装缺失的依赖
    ↓
配置 Git（用户信息）
    ↓
推送代码到 GitHub
    ↓
访问 Vercel 控制台
    ↓
导入 GitHub 仓库
    ↓
配置环境变量
    ↓
点击 Deploy
    ↓
访问应用
```

## 🔧 手动执行命令

### 检查依赖

```powershell
# 检查 Node.js
node --version

# 检查 npm
npm --version

# 检查 Git
git --version
```

### 安装 Vercel CLI

```powershell
npm install -g vercel
```

### Git 配置和推送

```powershell
# 进入项目目录
cd C:\Users\46938\.openclaw\workspace\contract-analyzer-web

# 初始化 Git
git init

# 配置用户信息
git config user.name "469380464"
git config user.email "469380464@qq.com"

# 添加文件
git add .

# 提交
git commit -m "Initial commit - Contract Analyzer Web App"

# 添加远程仓库
git remote add origin https://469380464:+++999czy@github.com/469380464/contract-analyzer-web.git

# 推送
git push -u origin main
```

## 🎯 快速开始（3种方式）

### 方式 1：一键脚本（最简单）

```bash
cd C:\Users\46938\.openclaw\workspace\contract-analyzer-web
deploy-windows.bat
```

### 方式 2：分步命令（理解流程）

```bash
# 1. 创建 GitHub 仓库（手动）
# 访问 https://github.com/new

# 2. 推送代码
cd C:\Users\46938\.openclaw\workspace\contract-analyzer-web
git init
git add .
git commit -m "Initial commit"
git remote add origin https://469380464:+++999czy@github.com/469380464/contract-analyzer-web.git
git push -u origin main

# 3. 在 Vercel 部署
# 访问 https://vercel.com/new
```

### 方式 3：Vercel CLI（命令行部署）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
cd C:\Users\46938\.openclaw\workspace\contract-analyzer-web
vercel

# 4. 生产环境部署
vercel --prod
```

## 🚨 常见问题

### 问题 1：Git 推送失败 - 密码错误

**错误信息：**
```
fatal: Authentication failed for 'https://github.com/'
```

**解决方法：**
1. 检查密码是否正确：`+++999czy`
2. 如果密码有特殊字符，使用 URL 编码
3. 或者使用 GitHub Personal Access Token：
   - 访问：https://github.com/settings/tokens
   - 创建新 token，勾选 `repo` 权限
   - 使用 token 替代密码

### 问题 2：Vercel 部署失败

**错误信息：**
```
Error: Build failed
```

**解决方法：**
1. 检查 Vercel 构建日志
2. 确认 package.json 正确
3. 确认所有必需文件都在仓库中

### 问题 3：Node.js 或 Git 未安装

**解决方法：**
1. **Node.js：** 访问 https://nodejs.org 下载安装
2. **Git：** 访问 https://git-scm.com/downloads 下载安装

### 问题 4：端口被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方法：**
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 结束进程（根据 PID）
taskkill /F /PID <PID>
```

## 📝 环境变量配置

### 本地开发（.env）

创建 `.env` 文件：

```
NODE_ENV=development
PORT=3000
```

### Vercel 生产环境

在 Vercel 控制台添加：

1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加：
   ```
   NODE_ENV = production
   PORT = 3000
   ```

## 🔗 有用链接

- **GitHub：** https://github.com/469380464/contract-analyzer-web
- **Vercel：** https://vercel.com/dashboard
- **Vercel 文档：** https://vercel.com/docs
- **Node.js：** https://nodejs.org
- **Git：** https://git-scm.com

## 💡 提示

1. **首次部署：** 建议先在本地测试应用
2. **自动部署：** 每次推送到主分支会自动部署
3. **查看日志：** 在 Vercel 控制台查看实时日志
4. **自定义域名：** 可以在 Vercel 配置自定义域名
5. **HTTPS：** Vercel 自动提供免费 SSL 证书

## 🎉 完成后

部署成功后，你将获得：

- **应用地址：** https://contract-analyzer-web.vercel.app
- **Vercel 控制台：** 查看部署状态和日志
- **GitHub 仓库：** 查看代码和版本历史

## 🔒 安全提醒

⚠️ **重要：** 部署完成后，请：
1. 删除或修改 `config-user.txt` 中的密码
2. 考虑使用 GitHub Personal Access Token 替代密码
3. 不要将密码提交到公开的代码仓库

---

**准备好开始部署了吗？运行 `deploy-windows.bat` 即可！** 🚀
