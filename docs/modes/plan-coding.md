# Plan Coding：先规划后编码
> "Measure twice, cut once." — 思考到位，再下笔

## 什么是 Plan Coding
**Plan Coding**（规划编码）是一种**结构化、可控的 AI Coding 模式**。**先与 AI 协商方案，确认后再写代码**。

```
你：我要做一个用户列表组件
AI：好的，我建议这样做：
    1. 用 TanStack Query 获取数据
    2. 用 Ant Design 的 Table
    3. 支持分页、搜索、排序
    4. ...
    方案 OK 吗？
你：分页大小改成 50，加个导出按钮
AI：好的，按这个方案实施
你：开始吧
AI：[生成代码]
```

**核心：方案先于代码**。

## 核心特征
| 特征 | 说明 |
| --- | --- |
| **结构化**| 有明确的方案和步骤 |
| **可验证**| 方案先确认再实施 |
| **目标明确**| 一开始就知道要做什么 |
| **中等周期**| 通常几小时到几天 |
| **可调整**| 方案可微调 |
| **可度量**| 任务拆分清晰，便于追踪 |

## Plan Coding 的核心流程

### 第 1 步：明确目标
```
> 我要做一个用户管理模块，包括列表、新建、编辑、删除
```

### 第 2 步：让 AI 出方案
```
> 先不要写代码，告诉我你会怎么做：
> 1. 整体架构
> 2. 涉及的文件
> 3. 数据流
> 4. 关键决策（为什么选 Zustand 而不是 Redux）
> 5. 风险点
```

### 第 3 步：审查 & 调整方案
```
AI 输出方案...

你：分页状态应该放 URL，不是 Zustand
你：用 React Hook Form 而不是 Formik
你：API 请求要加防抖
```

### 第 4 步：确认后实施
```
> 方案 OK，按这个写
```

### 第 5 步：验证结果
```
> 跑测试 + lint + typecheck，确保没问题
```

### 第 6 步：Code Review
```
按团队的 PR 流程提交 Review
```

## 适用场景

### 1. 日常功能开发
```
做一个用户管理模块
├── 列表（CRUD）
├── 详情
└── 表单
```

**为什么适合**：结构清晰，方案可预见。

### 2. Bug 修复
```
> 登录页面白屏，请先分析：
> 1. 可能的根因
> 2. 排查步骤
> 3. 修复方案
> 4. 验证方法
```

**为什么适合**：修复方案需要评估，避免改出新 bug。

### 3. 中等重构
```
> 把所有 class 组件改成函数组件，请先告诉我：
> 1. 涉及哪些文件
> 2. 重构顺序（避免破坏依赖）
> 3. 每个文件怎么改
> 4. 验证策略
```

**为什么适合**：重构风险大，需要规划。

### 4. 新功能集成
```
> 集成第三方支付 SDK，先告诉我：
> 1. 集成点在哪
> 2. 需要哪些配置
> 3. 错误如何处理
> 4. 如何测试
```

**为什么适合**：外部集成风险高，需要谨慎。

### 5. 性能优化
```
> 优化首屏加载时间，请先：
> 1. 分析当前瓶颈
> 2. 列出可行的优化方案
> 3. 评估每个方案的收益和成本
> 4. 推荐一个方案实施
```

**为什么适合**：优化方案需要权衡。

## 不适用场景

### 创意探索
Plan Coding 太结构化，**不适合发散性思考**。用 Vibe Coding。

### 一次性小任务
```bash
> "这个正则怎么写？"
（不值得先出方案）
```

### 大型团队项目
团队项目需要更严格的 Spec Coding。

## 使用方式

下面给出 Plan Coding **具体怎么用**——用什么工具、怎么启动、步骤、命令模板。

<h3>主推：Trae Solo <code>/plan</code> 命令（IDE 原生）</h3>

```text
# 命令面板输 /plan
/plan

# Trae 引导你输入任务
> 我要做一个用户管理模块，包括列表、新建、编辑、删除

# Trae 输出方案...
# 你审 + 调整 → 确认 → 自动进入执行
```

<h3>备选 1：Claude Code Plan Mode（终端 + 文件系统）</h3>

```bash
# 启动（进入 Plan Mode）
$ claude --plan

# 或在会话中切换
$ claude
> /plan

# 流程
> 我要做一个用户管理模块，包括列表、新建、编辑、删除
> 先不要写代码，告诉我方案：
> 1. 整体架构
> 2. 涉及的文件
> 3. 数据流
> 4. 关键决策（为什么选 Zustand 而不是 Redux）
> 5. 风险点

# AI 输出方案...

# 你审 + 调整
> 分页状态应该放 URL，不是 Zustand
> 用 React Hook Form 而不是 Formik
> API 请求要加防抖

# 确认
> 方案 OK，按这个写

# Claude Code 自动进入执行模式
```

<h3>备选 2：Cursor Composer（IDE 内跨文件）</h3>

```text
# 启动
Cmd+I 打开 Composer 面板

# 流程
> 帮我实现用户列表组件
# Cursor 先输出方案（Plan Mode）
# 你审 → 确认 → Cursor 自动跨文件编辑

# 设置
.cursor/settings.json
{
  "cursor.planMode": {
    "enabled": true,
    "autoConfirm": false,   // 必须人工确认
    "showDiff": true
  }
}
```

<h3>Plan Coding 命令模板（可直接复用）</h3>

```text
我要做 [任务名]，先不要写代码。

请给我一个详细方案，包括：
1. 整体架构
2. 涉及的文件（新建/修改）
3. 数据流
4. 关键决策及理由（[选 X 不选 Y]的原因）
5. 风险点
6. 验收标准

约束：
- TypeScript 严格模式
- 遵循 agents.md
- 单文件 < 300 行
```

## 实战方法

### 方法 1：Plan Mode（Cursor / Claude Code）

#### Cursor Plan Mode
```bash

# Cmd+Shift+P → "Cursor: Toggle Plan Mode"

# 或者在 Composer 中选择 Plan 模式
> 帮我实现用户列表组件

# Cursor 先输出方案：

# Plan:

# 1. 创建类型定义 src/types/user.ts

# 2. 创建 API 服务 src/services/user.ts

# 3. 创建组件 src/components/UserList/index.tsx

# 4. 配套测试

# ...

# 确认后再执行
```

#### Claude Code Plan Mode
```bash
$ claude

> /plan

# 进入 Plan Mode
> 把所有 class 组件改成函数组件

# Claude Code 输出详细计划

# 确认后执行
```

### 方法 2：手动规划
```bash
> 我要做 X，先不要写代码。
> 给我一个详细计划，包括：
> 1. 涉及的文件
> 2. 修改的内容
> 3. 实施顺序
> 4. 风险点
```

### 方法 3：分阶段执行
```bash

# 第一阶段：只做规划
> 设计用户管理模块的架构，给出方案

# 第二阶段：写核心
> 按方案先写 API 服务和类型

# 第三阶段：写组件
> 写列表组件，按方案

# 每一阶段独立验证
```

### 方法 4：边写边规划
```bash

# 开始时不确定细节，但有大致方向
> 我要做用户列表，先用最简实现

# 跑通后再补充
> 现在加搜索功能
> 加排序
> 加分页

# 这种"渐进式规划"也属于 Plan Coding
```

## 规划的关键要素

### 1. 明确范围
```markdown

## 任务范围
 包括：
- 用户列表
- 用户搜索
- 用户删除

 不包括：
- 用户新建（单独任务）
- 用户编辑（单独任务）
- 权限管理（单独任务）
```

### 2. 设计方案
```markdown

## 技术方案

### 数据层
- API：GET /api/users
- 状态：TanStack Query（服务端状态）
- 缓存：默认 5 分钟

### UI 层
- 组件库：Ant Design 5
- 样式：Tailwind
- 表格：Table 组件

### 交互
- 搜索：输入防抖 300ms
- 分页：每页 20 条，URL 同步
- 删除：确认弹窗
```

### 3. 文件清单
```markdown

## 文件变更
新建：
- src/types/user.ts
- src/services/user.ts
- src/components/UserList/index.tsx
- src/components/UserList/UserList.test.tsx

修改：
- src/router/index.tsx（添加路由）
- src/pages/UserPage.tsx
```

### 4. 风险评估
```markdown

## 风险点
1. 用户量大时列表性能 → 暂不处理，预留分页
2. 搜索响应慢 → 后端已加索引
3. 删除误操作 → 二次确认
```

### 5. 验收标准
```markdown

## 验收标准
- [ ] 列表能正常展示用户数据
- [ ] 搜索功能可用，300ms 防抖
- [ ] 分页功能正常，URL 同步
- [ ] 删除有二次确认
- [ ] 单元测试覆盖 > 80%
- [ ] 通过 lint + typecheck
```

## 工具配置

### Cursor
```jsonc
// .cursor/settings.json
{
  "cursor.planMode": {
    "enabled": true,
    "autoConfirm": false,   // 需要人工确认方案
    "showDiff": true
  }
}
```

### Claude Code
```bash

# 默认进入 Plan Mode
$ claude --plan

# 或在会话中切换
> /plan
> /auto-accept
```

## Plan Coding 的最佳实践

### 1. 方案要"可执行"
```markdown
 "我会用合适的组件库"（模糊）
 "我会用 Ant Design 5 的 Table 组件"（具体）
```

### 2. 方案要"可验证"
```markdown
 "代码会工作"
 "跑测试 + lint + typecheck 全部通过"
```

### 3. 方案要"可调整"
```markdown
好的方案应该：
- 列出关键决策点（方便讨论）
- 说明每个选择的理由（方便评估）
- 提供备选方案（必要时切换）
```

### 4. 拆分要"合理"
```markdown
 太粗："做一个电商网站"
 太细："做一个按钮"（过度拆分）
 合适："做一个商品列表组件"（独立可交付）
```

### 5. 风险要"前置"
```markdown
在开始前就识别风险，而不是做完才发现。
```

## 实战案例：用户管理模块

### Plan 阶段
```markdown

## 目标
实现用户管理模块（CRUD）

## 范围
- 用户列表（搜索、分页、删除）
- 用户新建
- 用户编辑

## 技术方案
- API: src/services/user.ts
- 状态: TanStack Query
- UI: Ant Design 5
- 表单: React Hook Form + Zod
- 路由: /users, /users/new, /users/:id/edit

## 文件
新建：
- src/types/user.ts
- src/services/user.ts
- src/hooks/useUserList.ts
- src/components/UserList/* (5 个文件)
- src/components/UserForm/* (3 个文件)
- src/pages/UserListPage.tsx
- src/pages/UserFormPage.tsx

修改：
- src/router/index.tsx

## 风险
1. 表单校验复杂 → 用 Zod schema 集中管理
2. 大列表性能 → 默认分页，暂不优化

## 验收
- [ ] 4 个核心场景测试通过
- [ ] 单元测试覆盖 > 80%
- [ ] CI 通过
```

### 执行阶段
```bash

# 按计划逐步执行
> 第一步：创建类型和 API 服务

# 验证
> pnpm typecheck
> pnpm test src/services/user

# 第二步：写列表组件
> 第二步：按方案写 UserList 组件

# 验证
> pnpm test src/components/UserList
> 手动测试页面

# ...依次类推
```

### Review 阶段
```bash
> 跑完整测试
> pnpm lint
> pnpm build

# 提交 PR
> git add .
> git commit -m "feat(user): add user management module"
> git push
```

## Plan Coding 与 Vibe Coding 的边界
什么时候从 Vibe 切换到 Plan？

| 信号 | 切换 |
| --- | --- |
| Vibe 验证了想法 | → Plan Coding |
| 需要保留代码 | → Plan Coding |
| 开始有性能/安全问题 | → Plan Coding |
| 团队要 review | → Plan Coding |

反过来，Plan Coding 内部也可以用 Vibe 来探索：

```
Plan Coding 阶段
   └── 用 Vibe Coding 探索某个细节
       └── 验证后回到 Plan Coding
```

## 团队中的 Plan Coding

### 团队 Leader 应该
- **提供模板**：给团队标准的 Plan 模板
- **Review 方案**：确保方案合理
- **积累案例**：把好的 Plan 沉淀到知识库

### 开发者应该
- **写好 Plan**：在动手前把方案写清楚
- **主动对齐**：和 Lead / 同事确认方案
- **跟踪进度**：按计划推进，及时调整

### Plan 模板示例
```markdown
<!-- .claude/templates/plan.md -->

# 任务：[任务名]

## 目标
[一段话说明要做什么]

## 范围
 包括：
- ...

 不包括：
- ...

## 技术方案
[关键决策和理由]

## 文件变更
新建：
- ...

修改：
- ...

## 风险与对策
- ...

## 验收标准
- [ ] ...

## 进度跟踪
- [ ] 阶段 1
- [ ] 阶段 2
- [ ] ...
```

## 总结
Plan Coding 是**日常开发的主力模式**。

- 结构化、可控、可验证
- 适合大多数生产任务
- 与 Vibe / Spec 配合使用效果最佳

下一节：[Spec Coding](/modes/spec-coding) — 大型项目的工程化实践。