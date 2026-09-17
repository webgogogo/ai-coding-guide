# 模块化设计：让 AI 在边界内自由发挥
> **本文是 [架构设计总览](/architecture/overview) 的方法论落地，重点讲"怎么把模块化做对"以最大化 AI Coding 收益。**

## 核心原则
模块化的所有原则，都可以归结为 **5 个"AI 友好"的黄金法则**：

```
1. 高内聚：模块内的事在模块内解决
2. 低耦合：模块间通过"接口"对话，不碰内部
3. 边界清晰：每个模块有自己的"领土"
4. 同构模板：所有模块长得一样，AI 才能"举一反三"
5. 依赖单向：模块依赖像"树"，不能形成"环"
```

下面每一条都会讲 **AI Coding 场景下意味着什么**。

- --

## 1. 主流模块化方案对比
| 方案 | 一句话 | 适用 | AI 友好度 |
| --- | --- | --- | --- |
| **按技术分层**| `components/ hooks/ services/` 全局 | 小型项目 ||
| **Feature-based**| `features/user/ features/order/` 自包含 | 中大型项目 ||
| **Hexagonal（端口-适配器）**| 业务核心 + 适配器 | 复杂业务 ||
| **Monorepo 多包**| 每个 feature 是独立 npm 包 | 多团队 ||
| **微前端**| 每个应用独立部署 | 多业务线 ||

**AI Coding 时代推荐**：**Feature-based 是性价比最高的方案**，下面重点讲它。

- --

## 2. Feature-based 模块化（推荐）

### 标准目录模板
```
src/
├── features/                    # 业务功能模块（核心）
│   ├── user/                    # 用户模块
│   │   ├── components/          # UI 组件
│   │   │   ├── UserCard/
│   │   │   │   ├── UserCard.tsx
│   │   │   │   ├── UserCard.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── UserList/
│   │   ├── hooks/               # 自定义 Hook
│   │   │   ├── useUser.ts
│   │   │   └── useUserList.ts
│   │   ├── services/            # API 服务
│   │   │   └── userService.ts
│   │   ├── stores/              # 状态管理
│   │   │   └── userStore.ts
│   │   ├── types/               # 类型定义
│   │   │   └── user.ts
│   │   ├── constants.ts         # 模块常量
│   │   └── index.ts             #  公共 API 出口
│   │
│   ├── order/                   # 订单模块（结构同上）
│   └── product/                 # 商品模块
│
├── shared/                      # 跨模块共享（公共层）
│   ├── components/              # 通用 UI 组件（Button、Modal）
│   ├── hooks/                   # 通用 Hook（useDebounce）
│   ├── utils/                   # 工具函数
│   ├── types/                   # 跨模块类型
│   └── constants/               # 全局常量
│
├── pages/                       # 页面（只做编排）
├── router/
├── App.tsx
└── main.tsx
```

### 关键约定

#### 约定 1：每个 feature 都是"自包含"
`features/user/` 应该**完整地**包含这个业务所有需要的东西：

```
features/user/
  ├── components/    ← 这个模块的 UI
  ├── hooks/         ← 这个模块的逻辑
  ├── services/      ← 这个模块的 API
  ├── stores/        ← 这个模块的状态
  └── types/         ← 这个模块的类型
```

**AI 的好处**：给 AI 一个 feature 路径，它就能看到这个业务的全部上下文。

#### 约定 2：index.ts 是"公共契约"
```typescript
// features/user/index.ts
export { UserCard } from './components/UserCard'
export { UserList } from './components/UserList'
export { useUser } from './hooks/useUser'
export type { User, UserListParams } from './types/user'
```

**严禁**：
```typescript
//  反例：跨模块直接访问内部
import { UserCard } from '@/features/user/components/UserCard/UserCard'
```

**AI 的好处**：
- AI 只看 `index.ts` 就知道这个模块"对外提供什么"
- 重构模块内部不影响外部调用
- `index.ts` 本身就是"AI 的接口文档"

#### 约定 3：模块间依赖单向
```
shared  ←  所有模块都可以依赖
features/user  →  可以依赖 shared
features/order →  可以依赖 shared
features/order →  可以依赖 features/user 的公共 API（通过 index.ts）
features/user    不应依赖 features/order（避免循环）
```

**AI 的好处**：依赖方向清晰，AI 改一个模块不会"波及其他"。

#### 约定 4：types 放模块内部，跨模块类型放 shared
```typescript
// features/user/types/user.ts
export interface User {
  id: string
  name: string
  email: string
}

// 只在 user 内部使用 → 放在 features/user/types/
// 多个模块都要用 → 放在 shared/types/
```

- --

## 3. 在 agents.md 中固化模块化约定
把上面的约定**写进 `agents.md`**，让 AI 自动遵守：

```markdown

## 模块化约定

### 目录结构
所有业务模块放在 src/features/ 下，每个 feature 自包含：
- components/     # UI 组件
- hooks/          # 自定义 Hook
- services/       # API 服务
- stores/         # 状态管理
- types/          # 类型定义
- index.ts        # 公共 API 出口（唯一对外暴露的文件）

### 禁止事项
- 跨模块直接 import 内部文件（只能通过 @/features/<name> 导入）
- 在 features/<name>/ 之外创建与该业务相关的组件
- 修改 package.json 依赖
- 修改其他模块的公共 API（除非明确要求）

### 偏好
- 新功能优先在已有模块扩展，不创建新模块
- 新模块创建前，先确认是否需要（参考"模块拆分判断标准"）
- 复杂组件拆分为小组件，每个组件独立目录
- 业务逻辑抽到 Hook，不写在组件里

### 模块拆分判断标准
满足以下任一条件，才创建新模块：
1. 业务边界清晰（用户、订单、商品各自独立）
2. 至少有 3 个独立组件 + 1 个 service
3. 团队规模需要（>2 人协作同一模块会冲突）
```

**AI 的好处**：这些约定成为"硬约束"，AI 不再需要每次"猜"。

- --

## 4. AI Coding 协作流程（基于模块化）

### 步骤 1：让 AI 看"参考模块"
```bash
> 在 src/features/user/ 下新建一个"角色管理"模块
> 参考 @src/features/order/ 的完整结构
> 遵循 @agents.md 中的模块化约定
```

AI 自动：
- 复制 `features/order/` 的目录模板
- 按相同命名风格生成 components/ hooks/ services/ types/
- 写出 `index.ts` 公共 API
- 保持与已有模块一致

### 步骤 2：让 AI 严格遵守 index.ts 边界
```bash

# 在 PR 模板中加入
- [ ] 只通过 index.ts 暴露公共 API
- [ ] 没有跨模块直接 import 内部文件
- [ ] 没有修改其他模块的公共 API（除非 PR 明确说明）
```

### 步骤 3：模块化 Review Checklist
```markdown

## 模块化 Review 检查表

### 结构合规
- [ ] 目录结构与参考模块一致（components/hooks/services/stores/types/index.ts）
- [ ] 有且仅有 index.ts 作为公共 API 出口
- [ ] 没有"游离文件"在 features/ 之外

### 依赖合规
- [ ] 依赖方向单向（不形成循环）
- [ ] 跨模块依赖只走公共 API（index.ts）
- [ ] 没有把跨模块共用的代码放在模块内部

### AI 友好
- [ ] 模块可以独立读懂（不需要看其他模块）
- [ ] index.ts 自带"接口文档"
- [ ] 类型定义完整，AI 引用时无需猜测
```

- --

## 5. 高级方案：Monorepo 模块化
当项目进入"多团队 + 多应用"阶段，单仓的 `features/` 不够用了，需要 **Monorepo**：

```
monorepo/
├── apps/
│   ├── admin/               # 管理后台（独立部署）
│   ├── h5/                  # 移动端 H5
│   └── web/                 # 官网
├── packages/
│   ├── ui/                  # 公共 UI 组件库
│   ├── utils/               # 工具函数
│   ├── types/               # 共享类型
│   └── features-user/       # 用户模块（独立 npm 包）
│       ├── src/
│       ├── package.json     # 独立版本号
│       └── tsconfig.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Monorepo 对 AI Coding 的额外好处
| 维度 | 单仓多模块 | Monorepo |
| --- | --- | --- |
| **跨项目复用**|  复制代码 |  引用包 |
| **独立版本管理**|  一起发布 |  各自独立 |
| **多 Agent 并行**|  可能冲突 |  各自包独立 |
| **CI 增量构建**|  全量 |  Turborepo 只构建变更 |

### AI 协作 Prompt 模板（Monorepo）
```bash

# 让 AI 在独立包中开发
> 在 packages/features-product/ 下实现一个商品模块
> 参考 @packages/features-user/ 的完整结构
> 这是独立 npm 包，需要在 package.json 中正确声明依赖
> 输出完成后，自动跑 pnpm typecheck 和 pnpm test
```

**工具推荐**：
- **包管理**：pnpm workspace（节省磁盘）
- **构建编排**：Turborepo（增量构建、远程缓存）
- **版本管理**：Changesets（自动生成 CHANGELOG）

- --

## 6. 微前端模块化（超大规模）
当业务变成"多 BU + 多团队独立交付"，进入**微前端**阶段：

```
主应用（Shell）
├── 子应用 A（订单中心，独立仓库）
├── 子应用 B（用户中心，独立仓库）
└── 子应用 C（运营后台，独立仓库）
```

**对 AI Coding 的影响**：
- **极致并行**：每个子应用独立仓库 → 多个 AI Agent 互不干扰
- **技术异构**：不同子应用可以用不同技术栈
- **接口复杂**：子应用间通过"微前端协议"通信
- **AI 难统一**：每个子应用都要单独维护 agents.md

**建议**：微前端是"组织架构"驱动，不是"技术"驱动。**90% 的项目不需要**。

- --

## 7. 反模式：模块化的常见错误

### 反模式 1：模块按"技术"分
```

# 错误：按技术分
src/
  ├── components/        ← 所有组件混在一起
  ├── hooks/             ← 所有 Hook 混在一起
  └── services/          ← 所有 API 混在一起
```

**问题**：用户相关组件和订单相关组件放在同一目录，AI 找不到边界。

### 反模式 2：模块颗粒度过细
```

# 错误：每个组件一个模块
features/
  ├── UserCard/
  ├── UserList/
  └── UserForm/
```

**问题**：过度拆分，模块失去"业务意义"，AI 不知道这些是同一个业务的。

**正确**：颗粒度按"业务边界"（用户、订单），不按"组件"。

### 反模式 3：模块间紧耦合
```typescript
//  反例：order 模块直接读 user 内部
import { userStore } from '@/features/user/stores/userStore'
```

**正确**：通过 `features/user` 的公共 API 交互。

### 反模式 4：公共代码放错位置
```

# 错误：把"通用按钮组件"放在 features/user/
features/user/components/Button.tsx

# 正确：通用组件放 shared/
shared/components/Button/
```

- --

## 8. 模块化 + 三种编码模式的最佳组合
| 模式 | 模块化策略 | AI Prompt 模板 |
| --- | --- | --- |
| **Vibe Coding**| 简单分层（components/ hooks/ services/） | `> 在 src/components/ 下加一个 UserCard` |
| **Plan Coding**| Feature-based，每个 feature 自包含 | `> 在 src/features/user/ 下加一个角色管理子模块，参考 order 模块` |
| **Spec Coding**| Monorepo + 独立可发布模块 | `> 按 specs/user-module.md 实现完整模块，包括类型、API、UI、状态、测试` |

- --

## 9. 团队落地建议

### 第 1 周：建立模板
- 选定 feature-based 方案
- 在 `agents.md` 中写明模块化约定
- 实现 1-2 个"参考模块"（user、order）

### 第 2-4 周：扩展模块
- 新功能都按 feature 拆分
- Code Review 时严格检查"模块边界"
- 让 AI 在所有新功能中遵循约定

### 第 2-3 个月：评估升级
- 项目规模超过 100 文件？
- 团队超过 5 人？
- 有多个独立应用？

→ 满足任意 2 个，考虑升级到 **Monorepo**。

- --

## 总结
模块化设计是 AI Coding 时代的**架构师最大杠杆**：

- **定义边界**= 减少 AI 上下文浪费
- **统一模板**= 让 AI "举一反三"
- **公共 API**= 让重构不影响外部
- **单向依赖**= 让 AI 修改"不波及其他"
- **并行协作**= 多 Agent + 多开发者同时高效工作

> **最后的金句**：
>
> *"AI 不会让差架构变好，但好架构会让 AI 发挥 10 倍效能。"*

- --

**下一步**：
- [Spec Coding](/modes/spec-coding) — 模块化如何与规范驱动结合
- [团队协作](/team/overview) — 模块化的团队治理
- [实战案例](/case-study/overview) — 看真实项目的模块化实践