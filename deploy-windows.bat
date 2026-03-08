@echo off
REM GitHub 账号配置
REM 请在此处填入你的 GitHub 账号信息
REM ⚠️ 重要：部署完成后请删除此文件或修改密码！

set GITHUB_EMAIL=469380464@qq.com
set GITHUB_USERNAME=469380464
set GITHUB_TOKEN=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

REM Vercel 配置
set VERCEL_EMAIL=469380464@qq.com
set VERCEL_PASSWORD=+++999czy

REM 仓库名称
set REPO_NAME=contract-analyzer-web

echo ========================================
echo   Vercel 部署脚本
echo   Windows 11
echo ========================================
echo.

REM 检查 Node.js
echo [步骤 1/7] 检查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未安装 Node.js
    echo 请访问 https://nodejs.org 下载安装
    pause
    exit /b 1
)
echo [成功] Node.js 已安装
node -v
echo.

REM 检查 npm
echo [步骤 2/7] 检查 npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未安装 npm
    pause
    exit /b 1
)
echo [成功] npm 已安装
npm -v
echo.

REM 检查 Git
echo [步骤 3/7] 检查 Git...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [信息] 未安装 Git，尝试下载安装...
    echo 请访问 https://git-scm.com/downloads 下载并安装 Git
    pause
    exit /b 1
)
echo [成功] Git 已安装
git --version
echo.

REM 检查 vercel CLI
echo [步骤 4/7] 检查 Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [信息] 安装 Vercel CLI...
    call npm install -g vercel
    if %errorlevel% neq 0 (
        echo [错误] Vercel CLI 安装失败
        pause
        exit /b 1
    )
)
echo [成功] Vercel CLI 已安装
echo.

REM 检查必需文件
echo [步骤 5/7] 检查必需文件...
if not exist vercel.json (
    echo [错误] 未找到 vercel.json
    pause
    exit /b 1
)
echo [成功] vercel.json 存在

if not exist package.json (
    echo [错误] 未找到 package.json
    pause
    exit /b 1
)
echo [成功] package.json 存在

if not exist server.js (
    echo [错误] 未找到 server.js
    pause
    exit /b 1
)
echo [成功] server.js 存在
echo.

REM 安装依赖
echo [步骤 6/7] 检查依赖...
if not exist node_modules (
    echo [信息] 安装项目依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)
echo [成功] 依赖已安装
echo.

REM Git 配置
echo [步骤 7/7] 配置 Git 并推送...
echo.

REM 初始化 Git（如果需要）
if not exist .git (
    echo [信息] 初始化 Git 仓库...
    git init
    git add .
    git commit -m "Initial commit - Contract Analyzer Web App"
)

REM 配置 Git 用户信息
echo [信息] 配置 Git 用户信息...
git config user.name "469380464"
git config user.email "469380464@qq.com"

REM 检查远程仓库
git remote -v | findstr origin >nul 2>nul
if %errorlevel% neq 0 (
    echo [信息] 添加远程仓库...
    git remote add origin https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
) else (
    echo [信息] 更新远程仓库 URL...
    git remote set-url origin https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
)

REM 推送代码
echo [信息] 推送代码到 GitHub...
echo 这可能需要一些时间...
git push -u origin main
if %errorlevel% neq 0 (
    echo [错误] Git 推送失败
    echo 可能的原因：
    echo   1. 仓库不存在，请先在 GitHub 创建仓库：%REPO_NAME%
    echo   2. 密码错误，请检查 GITHUB_PASSWORD
    echo   3. 网络问题
    pause
    exit /b 1
)
echo [成功] 代码已推送到 GitHub
echo.

echo ========================================
echo   部署步骤完成！
echo ========================================
echo.
echo [下一步] 手动部署到 Vercel：
echo.
echo 1. 访问 https://vercel.com/new
echo 2. 导入 GitHub 仓库：%GITHUB_USERNAME%/%REPO_NAME%
echo 3. 配置环境变量：
echo    NODE_ENV = production
echo    PORT = 3000
echo 4. 点击 Deploy
echo.
echo [信息] 仓库地址：
echo    https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
echo [信息] Vercel 控制台：
echo    https://vercel.com/dashboard
echo.
echo [警告] 请删除或修改此文件中的密码信息！
echo.

pause
