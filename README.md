# AI Learning Resources Navigation

## 项目启动指南

## GitHub 仓库管理

### 1. 初始化Git仓库
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. 创建GitHub仓库
1. 登录GitHub
2. 创建新仓库
3. 添加远程仓库地址：
```bash
git remote add origin https://github.com/your-username/your-repo-name.git
```

### 3. 配置GitHub Secrets
1. 进入仓库Settings -> Secrets -> Actions
2. 添加以下Secrets：
   - SSH_PRIVATE_KEY: 服务器SSH私钥
   - REMOTE_HOST: 服务器IP或域名
   - REMOTE_USER: 服务器用户名

### 4. 推送代码
```bash
git push -u origin main
```

## 云服务器部署指南

### 1. 服务器环境准备
- 选择云服务商（推荐：AWS EC2, DigitalOcean, Linode）
- 创建Ubuntu 20.04 LTS服务器
- 配置安全组：
  - 开放端口：22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (API)
  - 限制SSH访问IP
- 安装基础软件：
  ```bash
  sudo apt update && sudo apt upgrade -y
  sudo apt install -y git nginx curl
  ```

### 2. 项目部署
```bash
# 克隆项目
git clone https://github.com/your-repo/ai-learning-resources.git
cd ai-learning-resources

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# 配置生产环境变量
sudo nano /etc/environment
# 添加以下内容：
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/ai-learning
JWT_SECRET=your_secure_jwt_secret
```

### 3. Nginx反向代理配置
```bash
sudo nano /etc/nginx/sites-available/ai-learning
```
添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/ai-learning /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. 使用PM2管理进程
```bash
sudo npm install -g pm2

# 启动后端服务
cd backend
npm install
pm2 start npm --name "backend" -- run start

# 启动前端服务
cd ../frontend
npm install
npm run build
pm2 serve build 3000 --name "frontend"

# 保存PM2配置
pm2 save
pm2 startup
```

### 5. HTTPS配置（使用Let's Encrypt）
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. 安全建议
- 配置SSH密钥认证
- 启用ufw防火墙
- 定期更新系统
- 配置日志轮转
- 设置自动备份

### 环境要求
- Node.js 16+
- MongoDB
- Redis (可选)

### 安装依赖
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 环境变量配置
在backend/.env文件中添加：
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-learning
JWT_SECRET=your_jwt_secret
```

在frontend/.env文件中添加：
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 启动项目
```bash
# 启动后端服务
cd backend
npm run dev

# 启动前端服务
cd ../frontend
npm run dev
```

### 访问地址
- 前端：http://localhost:3000
- 后端API：http://localhost:5000

### 数据库初始化
```bash
# 创建管理员用户
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "admin123",
    "isAdmin": true
  }'
