# 实战案例：端到端前端项目
>  **本案例为教学演示用**，基于虚构的 **Task Dashboard**项目，用于对比三种编码模式（Vibe / Plan / Spec）的实际效果。所有数字（耗时、Token、API 成本、ROI 等）均为**演示用数据**，非真实生产项目。

## 案例项目：Task Dashboard
我们要构建一个**任务看板应用**，覆盖三种编码模式的完整流程。

### 项目需求
```markdown

## Task Dashboard 需求

### 功能
- 任务列表（CRUD）
- 看板视图（拖拽）
- 任务筛选（按状态、优先级）
- 数据统计

### 技术栈
- React 18 + TypeScript 5
- Vite 5
- Ant Design 5
- Zustand（状态管理）
- TanStack Query（服务端状态）
- React Hook Form + Zod（表单）
- @dnd-kit（拖拽）

### 三种模式对比
1. Vibe Coding：探索性原型
2. Plan Coding：日常功能
3. Spec Coding：核心模块
```

## 项目结构
```
task-dashboard/
├── agents.md                 # AI Coding 规范
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── components/
│   │   ├── TaskList/
│   │   ├── TaskCard/
│   │   ├── TaskForm/
│   │   └── Kanban/
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   └── TaskDetailPage.tsx
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── utils/
├── .claude/
│   ├── prompts/
│   │   ├── task-list.md
│   │   ├── task-form.md
│   │   └── kanban.md
│   └── commands/
└── tests/
```

## agents.md（项目级）
```markdown

# Task Dashboard AI Coding 规范

## 项目简介
任务看板应用，支持列表/看板两种视图，CRUD + 拖拽。

## 技术栈
- React 18 + TypeScript 5（严格模式）
- Vite 5 + Ant Design 5 + Tailwind 3
- Zustand 4 + TanStack Query 5
- React Hook Form + Zod
- @dnd-kit

## 目录结构
src/
  components/    # 通用组件
  pages/         # 页面
  hooks/         # 自定义 Hook
  services/      # API 服务
  stores/        # Zustand 状态
  types/         # 类型定义
  utils/         # 工具函数

## 命名规范
- 组件：PascalCase（TaskCard.tsx）
- Hook：useXxx（useTaskList.ts）
- 类型：PascalCase（Task）
- 常量：UPPER_SNAKE_CASE

## 状态管理
- 服务端状态：TanStack Query
- 客户端状态：Zustand
- 表单状态：React Hook Form

## 命名空间约定
- 任务状态：'todo' | 'in_progress' | 'done'
- 优先级：'low' | 'medium' | 'high'

## 常用命令
- pnpm dev：启动
- pnpm test：测试
- pnpm lint：lint
- pnpm typecheck：类型检查

## 禁止
- 不要修改 package.json 依赖
- 不要硬编码颜色、URL
- 不要用 any
- 不要在组件内直接写业务逻辑

## 偏好
- 函数组件 + Hooks
- Props interface 定义
- 命名导出
- 错误处理用 try-catch
```

## 本章导览
| 章节 | 内容 |
| --- | --- |
| [Vibe Coding 实战](/case-study/vibe) | 探索技术选型 |
| [Plan Coding 实战](/case-study/plan) | 实现核心功能 |
| [Spec Coding 实战](/case-study/spec) | 实现关键模块 |
| [模式对比总结](/case-study/comparison) | 三模式效果对比 |

## 时间线
```markdown

## 完整项目时间线

### Day 1：项目初始化 + Vibe Coding
- Vite 项目脚手架
- Vibe Coding 探索组件库选型
- 确定技术栈

### Day 2-3：Plan Coding 主体功能
- 任务列表组件
- 任务表单组件
- 路由配置

### Day 4-5：Spec Coding 看板模块
- 写完整规范
- 实现拖拽功能
- 性能优化

### Day 6：整合 + 优化
- 整体联调
- 性能优化
- 文档完善

### Day 7：测试 + 上线
- 单元测试
- E2E 测试
- 部署
```

下一节：[Vibe Coding 实战](/case-study/vibe)