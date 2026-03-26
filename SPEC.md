# Image Background Remover - MVP 需求文档

**版本**：v1.0  
**日期**：2026-03-25  
**状态**：开发中

---

## 1. 项目概述

### 1.1 产品定位
- **产品名称**：Image Background Remover
- **核心功能**：在线一键去除图片背景，无需下载安装
- **目标用户**：电商卖家、设计师、普通用户
- **核心价值**：免费、无需注册、直接使用

### 1.2 竞品分析
| 竞品 | 收费 | 特点 |
|------|------|------|
| remove.bg | $0.009/张 | 效果好，收费 |
| Clipdrop | $0.005/张 | 质量高 |
| 稿定设计 | 免费（限次） | 需要注册 |
| 创客贴 | 免费（限次） | 需要注册 |

### 1.3 差异化定位
- **完全免费**（使用 remove.bg API 免费额度）
- **无需注册**（降低使用门槛）
- **极简体验**（拖拽即用）
- **隐私优先**（图片不存储，处理完即删）

---

## 2. 功能需求

### 2.1 核心功能

#### F1: 图片上传 ✅
- [x] 支持拖拽上传
- [x] 支持点击选择文件
- [x] 支持粘贴图片
- [ ] 支持 URL 输入
- [x] 格式支持：JPG, PNG, WebP
- [x] 大小限制：≤ 10MB

#### F2: 背景移除 ✅
- [x] 自动识别前景主体
- [x] 一键去除背景
- [x] 输出透明 PNG
- [x] 处理时间：≤ 10秒

#### F3: 结果展示 ✅
- [x] 实时预览处理效果
- [x] 原图/结果对比
- [x] 支持下载保存
- [x] 支持复制到剪贴板

#### F4: 批量处理（可选）
- [ ] 一次上传多张图片
- [ ] 批量下载

---

## 3. 技术方案

### 3.1 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端 | Next.js 14 + React | 现代 React 框架 |
| 样式 | TailwindCSS | 原子化 CSS |
| 后端 | Next.js API Routes | 集成在后端 |
| AI 模型 | remove.bg API | 免费 50 次/月 |
| 部署 | Vercel | 免费托管 |

### 3.2 项目结构

```
image-background-remover/
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts    # API 接口
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 主页面
├── components/             # 组件目录
├── public/                 # 静态资源
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

## 4. 验收标准

### 4.1 功能验收

- [x] 支持拖拽上传图片
- [x] 支持点击选择文件
- [x] 支持 JPG/PNG/WebP 格式
- [x] 处理时间 ≤ 15秒
- [x] 输出透明 PNG
- [x] 支持下载保存
- [x] 移动端可用

### 4.2 性能验收

- [ ] 首屏加载时间 ≤ 2秒
- [ ] API 响应时间 ≤ 15秒
- [x] 支持 10MB 以下图片

### 4.3 体验验收

- [x] 无需注册即可使用
- [x] 界面简洁直观
- [x] 处理过程有提示

---

## 5. 部署步骤

```bash
# 1. 克隆项目
git clone https://github.com/lucyzhang1216/image-background-remover.git
cd image-background-remover

# 2. 安装依赖
npm install

# 3. 设置环境变量
echo "REMOVE_BG_API_KEY=FapLRdAemxCRG6VJxeMHbA3e" > .env.local

# 4. 运行开发服务器
npm run dev
```

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel.com 导入项目
3. 添加环境变量 `REMOVE_BG_API_KEY`
4. 部署完成

---

## 6. 成本

- **remove.bg**: 免费 50 次/月
- **Vercel**: 免费
- **域名**: 可选

---

**文档更新**：2026-03-26
