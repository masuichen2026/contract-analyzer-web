@echo off
REM Vercel 一键部署脚本 (Windows)
REM 使用方法：deploy-vercel.bat

echo ========================================
echo   Vercel 一键部署脚本
echo ========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未安装 Node.js
    echo 请访问 https://nodejs.org 下载安装
    pause
    exit /b 1
)

REM 检查 npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未安装 npm
    pause
    exit /b 1
)

REM 检查 vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [信息] 安装 Vercel CLI...
    call npm install -g vercel
)

REM 检查 vercel.json
if not exist vercel.json (
    echo [错误] 未找到 vercel.json 配置文件
    pause
    exit /b 1
)

REM 检查 package.json
if not exist package.json (
    echo [错误] 未找到 package.json
    pause
    exit /b 1
)

REM 检查依赖
echo [信息] 检查依赖...
if not exist node_modules (
    echo [信息] 安装依赖...
    call npm install
)

REM 检查 Git 仓库
if not exist .git (
    echo [信息] 初始化 Git 仓库...
    git init
    git add .
    git commit -m "Initial commit"

    echo.
    echo [警告] 请先在 GitHub 创建仓库，然后运行以下命令：
    echo.
    echo     git remote add origin https://github.com/yourusername/contract-analyzer-web.git
    echo     git push -u origin main
    echo.
    set /p confirm="完成了吗？(y/n): "
    if /i not "%confirm%"=="y" (
        exit /b 1
    )
)

REM 部署到 Vercel
echo.
echo [信息] 开始部署...
echo.

call vercel

echo.
echo [成功] 部署完成！
echo.
echo [信息] 部署到生产环境，请运行：
echo     vercel --prod
echo.
echo [信息] 查看 Vercel 文档：
echo     https://vercel.com/docs
echo.

pause
