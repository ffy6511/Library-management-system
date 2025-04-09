# 图书管理系统

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于Next.js和Prisma构建的现代化图书管理系统，提供直观的用户界面和强大的管理功能。

## 项目特点

- 📚 完整的图书管理功能
  - 图书借阅和归还
  - 图书信息管理
  - 用户账户管理

- 🔍 智能搜索功能
  - 图书模糊查询
  - 分类统计与快速精确搜索
  - 多维度过滤

- 📊 数据统计与分析
  - 借阅统计
  - 热门图书展示
  - 图书分类统计

- 🎨 用户体验优化
  - 响应式设计
  - 深色/浅色主题切换
  - 直观的操作界面

## 技术栈

- **前端框架**: Next.js
- **数据库ORM**: Prisma
- **样式方案**: CSS Modules
- **状态管理**: React Context
- **认证方案**: JWT

## 项目结构

```
├── prisma/                # 数据库模型和迁移
│   ├── schema.prisma      # 数据库表结构定义
│   └── seed.ts           # 数据库初始化脚本
├── src/
│   ├── app/              # 页面路由
│   ├── components/       # 可复用组件
│   ├── lib/              # 工具函数
│   └── context/          # 全局状态管理
```

## 快速开始

### 环境准备

1. 确保已安装 Node.js 和 npm
2. 准备MySQL数据库

### 环境配置

在项目根目录创建 `.env` 文件：

```env
# 数据库连接配置
DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"

# JWT密钥
JWT_SECRET="your-jwt-secret-key"
```

### 安装和运行

```bash
# 安装依赖
npm install

# 生成Prisma客户端
npx prisma generate

# 初始化数据库（可选）
npx prisma db push

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000/auth/login 进行登录

默认管理员账号：
- 用户名：admin
- 密码：admin123

### 数据库管理

启动Prisma Studio进行可视化数据库管理：

```bash
npx prisma studio
```

## 贡献

欢迎提交Issue和Pull Request！

## 许可

MIT License
