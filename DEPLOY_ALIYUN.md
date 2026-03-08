# 阿里云部署指南

阿里云是中国领先的云服务提供商，适合需要国内访问速度快的应用。

## 前置准备

1. 注册阿里云账号
   - 访问：https://www.aliyun.com
   - 完成实名认证

2. 购买云服务器（ECS）

   **推荐配置（小型应用）：**
   - 实例规格：1核2GB
   - 操作系统：Ubuntu 20.04 或 CentOS 7.9
   - 带宽：1-3 Mbps
   - 系统盘：40GB

   **费用：** 约 100-200 元/月

## 部署步骤

### 步骤 1：连接服务器

#### Windows 用户

下载并安装 PuTTY：
1. 下载：https://www.putty.org/
2. 安装并打开 PuTTY
3. 输入服务器 IP 地址和端口（22）
4. 点击 "Open"

#### Mac/Linux 用户

使用终端连接：

```bash
ssh root@your-server-ip
```

输入密码（登录时不会显示，正常输入即可）

### 步骤 2：安装 Node.js

```bash
# 使用 NodeSource 仓库安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

### 步骤 3：安装 PM2（进程管理器）

PM2 可以让应用在后台运行，并在崩溃时自动重启。

```bash
sudo npm install -g pm2
```

### 步骤 4：上传项目文件

#### 方式一：使用 Git（推荐）

```bash
# 安装 Git
sudo apt-get install -y git

# 克隆项目
cd /var/www
sudo git clone https://github.com/yourusername/contract-analyzer-web.git

# 进入项目目录
cd contract-analyzer-web
```

#### 方式二：使用 SCP

本地执行：

```bash
# 压缩项目
tar -czf contract-analyzer-web.tar.gz contract-analyzer-web/

# 上传到服务器
scp contract-analyzer-web.tar.gz root@your-server-ip:/var/www/

# 服务器上解压
ssh root@your-server-ip
cd /var/www
tar -xzf contract-analyzer-web.tar.gz
```

### 步骤 5：安装项目依赖

```bash
cd /var/www/contract-analyzer-web
npm install --production
```

### 步骤 6：配置环境变量

创建 `.env` 文件：

```bash
nano .env
```

添加以下内容：

```
NODE_ENV=production
PORT=3000
```

按 `Ctrl+X`，然后 `Y`，最后 `Enter` 保存退出。

### 步骤 7：修改 server.js 端口监听

确保 server.js 使用环境变量中的端口：

```javascript
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`应用运行在端口 ${port}`);
});
```

### 步骤 8：使用 PM2 启动应用

```bash
# 启动应用
pm2 start server.js --name contract-analyzer

# 查看状态
pm2 status

# 查看日志
pm2 logs contract-analyzer

# 设置开机自启
pm2 startup
pm2 save
```

### 步骤 9：配置防火墙

```bash
# 允许 SSH
sudo ufw allow 22

# 允许 HTTP
sudo ufw allow 80

# 允许 HTTPS
sudo ufw allow 443

# 允许应用端口（可选）
sudo ufw allow 3000

# 启用防火墙
sudo ufw enable

# 查看防火墙状态
sudo ufw status
```

**重要：** 在阿里云控制台的安全组中也要开放相应端口！

### 步骤 10：访问应用

在浏览器中访问：

```
http://your-server-ip:3000
```

## 配置 Nginx 反向代理

使用 Nginx 可以：
- 启用 HTTPS
- 提供静态文件缓存
- 负载均衡
- 安全保护

### 安装 Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 配置 Nginx

创建配置文件：

```bash
sudo nano /etc/nginx/sites-available/contract-analyzer
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 文件上传大小限制
    client_max_body_size 10M;

    # 超时时间
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

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

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 启用配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/contract-analyzer /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

## 配置 HTTPS（Let's Encrypt）

### 安装 Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### 获取 SSL 证书

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

按提示操作：
1. 输入邮箱地址
2. 同意服务条款
3. 选择是否强制 HTTPS 重定向（建议选 2）

### 自动续期

```bash
# 测试自动续期
sudo certbot renew --dry-run

# Certbot 会自动配置续期任务
```

## 配置域名

### 步骤 1：购买域名

在阿里云购买域名：
1. 访问：https://wanwang.aliyun.com
2. 搜索并购买域名

### 步骤 2：解析域名

1. 登录阿里云控制台
2. 进入"域名与网站" -> "域名"
3. 选择你的域名 -> "解析"
4. 添加解析记录：

```
记录类型: A
主机记录: @ 或 www
记录值: 你的服务器 IP
TTL: 600
```

### 步骤 3：等待 DNS 生效

通常需要 10 分钟到 2 小时。

## 监控和日志

### PM2 监控

```bash
# 查看实时监控
pm2 monit

# 查看日志
pm2 logs contract-analyzer

# 查看错误日志
pm2 logs contract-analyzer --err

# 清空日志
pm2 flush
```

### Nginx 日志

```bash
# 访问日志
sudo tail -f /var/log/nginx/access.log

# 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 系统日志

```bash
# 系统日志
sudo journalctl -xe

# CPU 和内存使用
htop
```

## 安全配置

### 1. 禁用 root 登录

```bash
# 创建新用户
sudo adduser yourname
sudo usermod -aG sudo yourname

# 配置 SSH
sudo nano /etc/ssh/sshd_config
```

修改以下内容：

```
PermitRootLogin no
PasswordAuthentication no
```

重启 SSH：

```bash
sudo systemctl restart sshd
```

### 2. 配置防火墙规则

```bash
# 删除现有规则
sudo ufw --force reset

# 允许 SSH
sudo ufw allow 22/tcp

# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw --force enable
```

### 3. 安装 fail2ban（防暴力破解）

```bash
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. 定期更新系统

```bash
# 更新包列表
sudo apt-get update

# 升级所有包
sudo apt-get upgrade

# 清理不需要的包
sudo apt-get autoremove
```

设置自动更新：

```bash
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 备份和恢复

### 备份脚本

创建备份脚本：

```bash
nano /usr/local/bin/backup-app.sh
```

添加内容：

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/contract-analyzer"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/contract-analyzer-web"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份应用文件
tar -czf $BACKUP_DIR/app_$DATE.tar.gz $APP_DIR

# 保留最近 7 天的备份
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +7 -delete

echo "Backup completed: app_$DATE.tar.gz"
```

添加执行权限：

```bash
sudo chmod +x /usr/local/bin/backup-app.sh
```

### 设置定时备份

```bash
# 编辑 crontab
sudo crontab -e

# 每天凌晨 2 点备份
0 2 * * * /usr/local/bin/backup-app.sh >> /var/log/backup.log 2>&1
```

## 性能优化

### 1. 启用 Gzip 压缩

在 Nginx 配置中添加：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript
           application/x-javascript application/xml+rss
           application/json;
```

### 2. 配置 PM2 集群模式

```bash
# 停止应用
pm2 stop contract-analyzer

# 使用集群模式启动（使用所有 CPU 核心）
pm2 start server.js --name contract-analyzer -i max

# 保存配置
pm2 save
```

### 3. 使用 Redis 缓存（可选）

安装 Redis：

```bash
sudo apt-get install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

## 故障排除

### 应用无法启动

```bash
# 查看 PM2 日志
pm2 logs contract-analyzer

# 检查端口占用
sudo netstat -tulpn | grep 3000

# 重启 PM2
pm2 restart contract-analyzer
```

### Nginx 502 Bad Gateway

```bash
# 检查 Nginx 配置
sudo nginx -t

# 检查后端应用是否运行
pm2 status

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 磁盘空间不足

```bash
# 检查磁盘使用
df -h

# 清理系统缓存
sudo apt-get clean
sudo apt-get autoremove
```

## 成本估算

| 项目 | 费用 |
|-----|------|
| ECS 服务器（1核2GB） | 约 100-200 元/月 |
| 带宽（1-3 Mbps） | 约 30-80 元/月 |
| 域名（.com） | 约 60 元/年 |
| SSL 证书 | 免费 |

**总计：** 约 150-300 元/月

## 总结

阿里云 ECS 适合：
- ✅ 需要国内访问速度快
- ✅ 需要完全控制服务器
- ✅ 需要自定义配置
- ✅ 有一定技术基础的用户

相比 Vercel/Render：
- ✅ 无限制
- ✅ 完全控制
- ✅ 国内访问速度快
- ❌ 需要运维
- ❌ 需要手动配置
- ❌ 费用较高

**阿里云是生产环境的理想选择！**
