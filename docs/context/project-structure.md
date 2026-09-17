# 项目结构最佳实践

清晰的项目结构是**上下文工程的地基**。结构越规范，AI 越能基于训练数据"猜对"你的意图。

## 四大核心原则

### 1. 约定优于配置

AI 擅长识别模式。遵循主流约定，能让 AI 不需要解释就理解你的代码：

```
 推荐：src/components/UserCard/index.tsx
 怪异：src/widgets/profile-card-component.tsx
```

### 2. 关注点分离

把不同职责的代码**物理隔离**，让 AI 一眼定位：

| 目录 | 职责 | 关键约束 |
|------|------|---------|
| `components/` | 通用 UI 组件 | 不含业务逻辑、不直接请求 |
| `pages/` | 页面 | 业务逻辑编排 |
| `features/` | 业务功能模块 | 自包含、可独立交付 |
| `hooks/` | 自定义 Hook | 封装可复用状态逻辑 |
| `services/` | API 请求 | 所有 HTTP 调用入口 |
| `stores/` | 全局状态 | Zustand / Redux |
| `utils/` | 纯函数工具 | 无副作用 |
| `types/` | 类型定义 | 全局共享类型 |
| `constants/` | 常量 | 避免硬编码 |

> 详细分层原则与反例：[分层架构详解](/architecture/layered-architecture)

### 3. 一个文件一个职责

```typescript
//  反例：一个文件 500 行，啥都有
// UserCard.tsx
export function UserCard() { ... }
export function useUser() { ... }
export function fetchUser() { ... }
export type User = { ... }

//  正例：拆开
// components/UserCard/index.tsx  - 组件
// hooks/useUser.ts               - Hook
// services/user.ts               - API
// types/user.ts                  - 类型
```

### 4. 入口文件统一

每个目录有清晰的 `index.ts`，AI 看到一个文件就能了解整个模块：

```typescript
// components/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Modal } from './Modal'
```

## 推荐结构（React + TS）

```
my-app/
├── public/                      # 静态资源
├── src/
│   ├── components/              # 通用 UI 组件
│   │   └── Button/
│   │       ├── index.tsx
│   │       ├── Button.tsx
│   │       ├── Button.test.tsx
│   │       └── types.ts
│   ├── features/                # 业务功能模块
│   │   ├── auth/
│   │   └── user/
│   ├── pages/                   # 页面
│   ├── hooks/                   # 全局 Hook
│   ├── services/                # 全局 API
│   ├── stores/                  # 全局状态
│   ├── utils/                   # 工具函数
│   ├── types/                   # 全局类型
│   ├── constants/               # 常量
│   ├── styles/                  # 全局样式
│   ├── router/                  # 路由配置
│   ├── App.tsx
│   └── main.tsx
├── tests/                       # E2E 测试
├── .claude/                     # Claude Code 配置
│   ├── agents.md
│   ├── commands/
│   └── examples/
├── .cursor/                     # Cursor 配置
├── agents.md                    # 通用 AI 规范
└── package.json
```

## 让 AI 更好理解的细节

### 类型导出集中

```typescript
// types/index.ts
export * from './user'
export * from './order'
export * from './product'

// AI 引用：import type { User } from '@/types'
```

### 常量集中

```typescript
// constants/index.ts
export const API_BASE = '/api'
export const PAGE_SIZE = 20
```

### utils 拆分清晰

```
utils/
  format.ts        # 日期、数字格式化
  validation.ts    # 校验函数
  storage.ts       # localStorage 封装
  http.ts          # HTTP 工具
  array.ts         # 数组操作
```

### 服务层封装

```typescript
// services/user.ts
export const userService = {
  list: (params: UserListParams) =>
    http.get<User[]>('/users', { params }),
  get: (id: string) => http.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => http.post<User>('/users', data),
  update: (id: string, data: Partial<User>) =>
    http.put<User>(`/users/${id}`, data),
  delete: (id: string) => http.delete(`/users/${id}`),
}
```

AI 看到这个文件就能直接调用。

## 关键文档文件

| 文件 | 作用 | 关键内容 |
|------|------|---------|
| **README.md** | 项目门面 | 这是什么、技术栈、命令、约定 |
| **ARCHITECTURE.md** | 架构说明 | 模块划分、数据流、技术决策 |
| **CONTRIBUTING.md** | 贡献指南 | 代码风格、提交规范、PR 流程 |
| **agents.md** | AI 说明书 | AI 必须遵守的所有规范（详见下章） |

## 常见反模式

| 反模式 | 后果 | 建议 |
|--------|------|------|
| 所有代码塞一个文件夹 | 噪声大，AI 无法定位 | 按职责拆分目录 |
| 嵌套过深（>4 层） | 难以维护 | 最多 3-4 层 |
| 命名不一致（`UserCard.tsx` / `productList.tsx`） | AI 风格混乱 | 统一 PascalCase / camelCase |
| 业务逻辑散落在组件 | 难测试、难复用 | 抽到 hooks/ 或 services/ |

## 检查清单

- [ ] 项目结构是否符合主流约定？
- [ ] README 是否清晰说明项目？
- [ ] 是否有 ARCHITECTURE.md？
- [ ] 类型/常量/工具是否集中？
- [ ] 服务层是否统一封装？
- [ ] 命名风格是否一致？
- [ ] 嵌套深度是否 ≤ 4 层？

下一节：[agents.md 约束规范](/context/agents) — 给 AI 写一份"项目说明书"。
