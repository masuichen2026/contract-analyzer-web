#!/bin/bash

# Vercel 一键部署脚本
# 使用方法：./deploy-vercel.sh

echo "🚀 开始部署到 Vercel..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未安装 Node.js"
    echo "请访问 https://nodejs.org 下载安装"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未安装 npm"
    exit 1
fi

# 检查 vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查 Git 仓库
if [ ! -d ".git" ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit"

    echo "⚠️  请先在 GitHub 创建仓库，然后运行以下命令："
    echo ""
    echo "  git remote add origin https://github.com/yourusername/contract-analyzer-web.git"
    echo "  git push -u origin main"
    echo ""
    read -p "完成了吗？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查 vercel.json
if [ ! -f "vercel.json" ]; then
    echo "❌ 错误：未找到 vercel.json 配置文件"
    exit 1
fi

# 检查 package.json
if [ ! -f "package.json" ]; then
    echo "❌ 错误：未找到 package.json"
    exit 1
fi

# 检查依赖
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 部署到 Vercel
echo ""
echo "🚀 开始部署..."
echo ""

# 部署到预览环境
vercel

echo ""
echo "✅ 部署完成！"
echo ""
echo "📖 部署到生产环境，请运行："
echo "  vercel --prod"
echo ""
echo "📖 查看 Vercel 文档："
echo "  https://vercel.com/docs"
