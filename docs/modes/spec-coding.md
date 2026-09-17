# Spec Coding：规范驱动的工程化实践
> "If it isn't written down, it doesn't exist." — 规范即代码

## 什么是 Spec Coding
**Spec Coding**（规范编码）是一种**文档驱动、多人协作**的 AI Coding 模式。**先把规范写清楚，AI 按规范实现，团队按规范验收**。

```
规范文档
├── 1. 需求规格（What）
├── 2. 技术设计（How）
├── 3. 验收标准（Acceptance）
└── 4. 任务拆分（Tasks）
        ↓
AI 按规范实现
        ↓
团队按规范验收
```

**核心：规范即代码，文档先行**。

## 核心特征
| 特征 | 说明 |
| --- | --- |
| **文档驱动**| 规范是开发的起点 |
| **团队协作**| 多人按同一规范工作 |
| **可审计**| 决策可追溯 |
| **目标明确**| 验收标准清晰 |
| **长周期**| 通常数周到数月 |
| **可复用**| 规范可作为模板 |

## Spec Coding 的核心流程

### 第 1 步：写需求规格（PRD）
明确"做什么"：

```markdown

## 需求：用户管理模块

### 业务背景
管理员需要在后台管理系统用户，包括增删改查。

### 用户故事
- 作为管理员，我希望能搜索用户，以便快速找到目标用户
- 作为管理员，我希望能分页查看用户列表，以便处理大量数据
- 作为管理员，我希望能新建/编辑/删除用户

### 功能清单
- [ ] 用户列表（搜索、分页、排序）
- [ ] 用户详情
- [ ] 用户新建
- [ ] 用户编辑
- [ ] 用户删除（含二次确认）

### 非功能需求
- 性能：列表页加载 < 1s
- 兼容：Chrome / Edge / Safari 最新版本
- 安全：删除操作需二次确认，操作日志记录
```

### 第 2 步：写技术设计
明确"怎么做"：

```markdown

## 技术设计

### 架构
- 前端：React 18 + TypeScript 5
- UI：Ant Design 5
- 状态：TanStack Query + Zustand
- 路由：React Router 6

### 数据模型
\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}
\`\`\`

### API 设计
- GET /api/users - 列表
- GET /api/users/:id - 详情
- POST /api/users - 新建
- PUT /api/users/:id - 编辑
- DELETE /api/users/:id - 删除

### 组件结构
- src/pages/UserListPage.tsx
- src/pages/UserFormPage.tsx
- src/components/UserList/*
- src/components/UserForm/*
- src/services/user.ts
- src/types/user.ts

### 状态管理
- 服务端状态：TanStack Query（用户数据）
- 表单状态：React Hook Form
- URL 状态：分页、搜索、排序参数

### 关键决策
1. 为什么要用 TanStack Query？
   - 自动缓存、自动 refetch
   - 减少手写 loading/error 逻辑

2. 为什么要 URL 同步分页？
   - 分享链接可重现状态
   - 浏览器前进/后退可用
```

### 第 3 步：写验收标准
明确"什么算完成"：

```markdown

## 验收标准

### 功能验收
- [ ] 列表能正确展示用户数据
- [ ] 搜索功能可用（300ms 防抖）
- [ ] 分页功能正常
- [ ] 排序功能正常（按名称、时间）
- [ ] 新建用户表单校验完整
- [ ] 编辑用户能正确回显
- [ ] 删除有二次确认
- [ ] 操作日志被记录

### 质量验收
- [ ] TypeScript 严格模式，无 any
- [ ] ESLint 无错误
- [ ] 单元测试覆盖 > 80%
- [ ] 关键路径 E2E 测试通过
- [ ] 可访问性 a11y 通过基础检查
- [ ] 性能：列表页 Lighthouse > 90

### 文档验收
- [ ] README 更新
- [ ] 组件 Storybook 完整
- [ ] API 文档同步

### Review 验收
- [ ] 至少 2 个 Reviewer 通过
- [ ] Lead 最终批准
```

### 第 4 步：任务拆分
把大任务拆成可执行的小任务：

```markdown

## 任务拆分

### Task 1：基础设施（2h）
- [ ] 类型定义 src/types/user.ts
- [ ] API 服务 src/services/user.ts
- [ ] 单元测试

### Task 2：列表组件（4h）
- [ ] UserList 组件
- [ ] UserListItem 组件
- [ ] 搜索/排序/分页逻辑
- [ ] 单元测试

### Task 3：表单组件（4h）
- [ ] UserForm 组件
- [ ] Zod schema
- [ ] 表单校验
- [ ] 单元测试

### Task 4：页面集成（2h）
- [ ] UserListPage
- [ ] UserFormPage
- [ ] 路由配置
- [ ] E2E 测试

### Task 5：验收（2h）
- [ ] 功能验收清单逐项过
- [ ] 性能测试
- [ ] 文档完善
```

### 第 5 步：AI 按规范实现
把规范作为 Prompt 的一部分：

```bash
> 参考以下规范实现：
>
> ## 数据模型
> [粘贴类型定义]
>
> ## API 设计
> [粘贴 API 列表]
>
> ## 当前任务
> Task 1：基础设施
> - 创建类型定义
> - 创建 API 服务
> - 单元测试
>
> ## 验收标准
> - TypeScript 严格模式
> - 测试覆盖 > 80%
> - 遵循 agents.md
```

### 第 6 步：按规范验收
```markdown

## 验收记录

### 功能验收
- [x] 列表展示 
- [x] 搜索功能 
- [x] 分页 
- [x] 排序 
- [x] 新建表单 
- [x] 编辑 
- [x] 删除确认 

### 质量验收
- [x] TypeScript 
- [x] ESLint 
- [x] 测试覆盖 85% 
- [x] E2E 测试通过 

### Review
- Reviewer A: 通过
- Reviewer B: 通过
- Lead: 批准

### 上线日期
2025-02-01
```

## 适用场景

### 1. 大型新功能
```
做一个完整的电商前台
├── 商品列表
├── 商品详情
├── 购物车
├── 结算
└── 订单管理
```

**为什么适合**：跨多个模块、跨多人协作、需要长期维护。

### 2. 团队协作项目
5+ 人的团队，**没有规范就乱**。

### 3. 关键业务模块
```
支付、权限、财务等核心模块
```

**为什么适合**：错误代价高，必须严格。

### 4. 需要审计的代码
```
金融、政企、医疗等强合规场景
```

**为什么适合**：决策可追溯。

### 5. 长期维护的项目
```
预期维护 2 年以上的代码
```

**为什么适合**：规范即文档，新人能快速上手。

## 不适用场景

### 小任务
```
修一个按钮颜色
```

不值得写规范。

### 创意探索
Spec 太结构化，**扼杀创意**。用 Vibe。

### 紧急修复
紧急 Bug **没时间写规范**，用 Plan Coding。

### 一次性代码
只跑一次的脚本，**不需要规范**。

## 规范文档模板

### 完整模板
```markdown

# [任务名] 规范文档

## 元信息
- 作者：
- 创建日期：
- 最后更新：
- 状态：草稿 / Review / 已批准 / 已完成

## 1. 需求规格

### 业务背景

### 用户故事

### 功能清单

### 非功能需求

## 2. 技术设计

### 架构概览

### 数据模型

### API 设计

### 组件结构

### 状态管理

### 关键决策（含理由）

## 3. 验收标准

### 功能验收

### 质量验收

### 文档验收

### Review 验收

## 4. 任务拆分

### Task 1

### Task 2

### ...

## 5. 风险与对策

### 风险 1

### 风险 2

## 6. 进度跟踪
- [ ] Task 1
- [ ] Task 2
- ...

## 7. 变更记录
- v1.0 - 2025-01-15 - 初稿
- v1.1 - 2025-01-20 - 更新 API 设计
```

### 简化模板（适用于中等任务）
```markdown

# [任务名]

## 做什么
[一段话]

## 怎么做
- 关键技术决策
- 涉及的文件

## 验收
- [ ] 功能验收
- [ ] 质量验收

## 任务拆分
- [ ] Task 1
- [ ] Task 2
```

## 使用方式

下面给出 Spec Coding **具体怎么用**——用什么工具、怎么启动、步骤、命令模板。

<h3>主推：Trae Solo <code>/spec</code> 命令（IDE 原生）</h3>

Trae Solo 是当前**唯一**原生提供 <code>/spec</code> 斜杠命令的 IDE。

```text
# Trae Solo Commands 面板
/plan   优先规划任务的执行方向，用户确认后再实施
/spec   根据需求细化完整的规范、任务、验收标准   ← 原生 Spec
/goal   启动一个以目标为导向的任务，并自动拆分
/prompt 五段式提示词
```

**使用流程**：

```text
# 1. 在 Trae Solo 命令面板输入 /spec
/spec

# 2. Trae 引导你输入需求
> 我要做一个用户管理模块（列表 + 新建 + 编辑 + 删除）

# 3. Trae 自动细化规范
# 输出：
# - 需求规格（功能清单 + 非功能需求）
# - 技术设计（架构 + 数据模型 + API + 组件结构）
# - 验收标准（功能 + 质量 + 文档）
# - 任务拆分（Task 1-N）

# 4. 你审 + 调整 → 确认 → 自动进入实施
```

**为什么 Trae 适合做主推**：

<ul>
  <li>✓ <strong>原生命令</strong>：<code>/spec</code> 是 Trae IDE 内置斜杠命令，无需配置</li>
  <li>✓ <strong>中文引导</strong>：从需求到规范的整个流程都是中文对话</li>
  <li>✓ <strong>多模型路由</strong>：可指定 <code>kimi-k2.5</code>（256K 上下文）做规范细化</li>
  <li>✓ <strong>与 <code>/plan</code> 联动</strong>：先 <code>/spec</code> 出规范，再 <code>/plan</code> 制定执行计划</li>
  <li>✓ <strong>模板化</strong>：Trae 内置 PRD、技术设计、验收标准模板</li>
</ul>

<h3>备选：Claude Code Agent Teams（终端多 Agent）</h3>

```bash
# 启动 Agent Teams 模式
$ claude --agent-team

# 传入 Spec 文档作为上下文
> 按 .claude/specs/order-system.md 实现完整订单系统

# 自动拆分任务到多个 Agent：
# Agent-1：数据模型 + 状态机
# Agent-2：API 服务
# Agent-3：UI 组件
# Agent-4：E2E 测试
# 全部完成后自动汇总报告
```

<h3>备选：Cursor Composer + 多模型分工（IDE 内）</h3>

```text
# 启动
Cmd+I 打开 Composer，切换到 Agent 模式

# 架构师（Opus 4.6）出接口定义
> 基于规范输出 Task 2 的接口 JSON Schema

# 主力开发（Sonnet 4.6）实现
> 参考 interface.schema.json 实现 Task 2

# 代码评审（Gemini 3.5 Flash）统一风格
> 基于规范和 diff，统一命名和代码风格

# 关键：模型间用结构化格式（JSON Schema / Diff）传递，不传原始对话历史
```

<h3>Spec Coding 命令模板（可直接复用）</h3>

```text
/spec

任务：[任务名]
背景：[业务背景，1-2 句]

功能清单：
- [ ] 功能 1
- [ ] 功能 2

非功能需求：
- 性能：[指标]
- 兼容：[浏览器/设备]
- 安全：[要求]

约束：
- 技术栈：React 18 + TypeScript 5
- 状态：Zustand + TanStack Query
- 样式：Tailwind
- 测试：Vitest + Playwright

请生成：
1. 完整需求规格
2. 技术设计（架构 + 数据模型 + API + 组件）
3. 验收标准（功能 + 质量 + 文档）
4. 任务拆分（按依赖排序）
```

## 工具与 AI 协作（2026 版）
> Spec Coding 特别吃"上下文质量"和"模型能力"。2026 年的最佳实践是**多模型角色分工 + 结构化传递**：用最适合的模型做最擅长的事，用 JSON Schema 等结构化格式在模型间传递信息。

### 模型角色分工（2026 推荐）
| 角色 | 推荐模型 | 职责 |
| --- | --- | --- |
| **架构师 + 安全审计**| Claude Opus 4.6 / 5 | 写架构方案、技术选型、安全审查 |
| **主力开发**| Sonnet 4.6 / GPT-5.4 | 实现业务代码、修复 Bug、生成测试 |
| **代码评审**| Gemini 3.5 Flash | 统一命名规范、检测代码异味、冗余清理 |
| **文档专家**| DeepSeek V3.2 / Kimi K2.5 | 写中文 API 文档、注释、CHANGELOG |
| **大型代码库分析**| Gemini 3.1 Pro / Claude Opus 5（1M 上下文） | 跨文件依赖梳理、整库重构方案 |

> 详见 [大模型选择](/tools/models) 与 [工具决策矩阵](/tools/decision-matrix)。

### 方式 1：规范作为 Prompt（Sonnet 4.6 主力）
```bash

# 工具：Cursor（IDE 内 Agent）或 Claude Code（终端 Agent）

# 模型：Claude Sonnet 4.6（默认；性价比最优）
> 帮我实现以下规范：
>
> [粘贴完整的规范文档]
>
> 当前任务：Task 2（列表组件）
>
> 模型策略：
> - 默认 Sonnet 4.6
> - 架构调整时才切 Opus 4.6
```

### 方式 2：分阶段 AI 执行（阶段门禁）
```bash

# 工具：Claude Code（终端 Agent）

# 模型：Sonnet 4.6 主力

# 第一阶段
> 基于规范，完成 Task 1（基础设施）

# 完成后人工 / 测试验证门禁

# 第二阶段
> 基于规范和 Task 1 的成果，完成 Task 2（列表组件）

# 完成后人工 / 测试验证门禁

# 每一阶段 AI 都能看到规范上下文，但任务边界严格
```

### 方式 3：多模型结构化传递（2026 最佳实践）
模型间**不直接对话**，用结构化格式传递信息，避免误差级联：

```bash

# Step 1：架构师（Opus 4.6）出接口定义
> /agent-team
> 基于规范输出 Task 2 的接口定义 JSON Schema

# 输出：interface.schema.json（结构化）

# Step 2：主力开发（Sonnet 4.6）实现
> 参考以下 interface.schema.json 实现 Task 2

# 输入：JSON Schema，不传原始对话历史

# Step 3：代码评审（Gemini 3.5 Flash）统一风格
> 基于规范和以下 diff，统一命名和代码风格

# 输入：Diff + Style Guide

# Step 4：文档专家（DeepSeek V3.2）写文档
> 基于实现写 API 文档（中文）

# 输入：代码 + 注释占位
```

### 方式 4：Agent Teams 处理大型 Spec（2026 新范式）
```bash

# 工具：Claude Code + Agent Teams
$ claude --agent-team
> 按 .claude/specs/order-system.md 实现完整订单系统

# 自动拆分：

# Agent-1：Task 1-2（数据模型 + 状态机）

# Agent-2：Task 3（API 服务）

# Agent-3：Task 4-6（UI 部分）

# Agent-4：Task 7（E2E 测试）

# 全部完成后自动汇总报告
```

### 方式 5：AI 辅助写规范
```bash

# 先让 AI 帮你梳理（Claude Opus 4.6 适合做架构推演）
> 我们要做一个用户管理模块。
> 我有一些想法：列表 + 表单 + 权限
> 帮我生成一个规范的初稿，包括需求、设计、验收
> 模型：Opus 4.6（架构推演最强）

# AI 输出初稿

# 你 Review + 修改 + 定稿

# 定稿后存到 specs/ + .claude/specs/ 双向同步

# 再让国产模型补本地化建议（可选）
> 检查这份规范的中文术语是否符合国内开发习惯
> 模型：DeepSeek V3.2 或 Kimi K2.5
```

### 协作铁律（2026）
1. **每个阶段设门禁**：AI 输出 → 人工/测试验证 → 通过才进入下一阶段。
2. **结构化传递**：模型间用 JSON Schema / Diff / 测试用例模板，不传原始对话。
3. **Sonnet 起步，Opus 升级**：80% 任务 Sonnet 4.6 够用，仅架构调整切 Opus 4.6/5。
4. **避免上下文过载**：每阶段只传下一环节需要的最小信息集。
5. **明确职责不重叠**：每个环节只指定一个主执行模型 + 一个审查模型，避免意见冲突。

## Spec Coding 的最佳实践

### 1. 规范不是一次写完
```markdown
v1.0 - 初稿（粗略）
v1.1 - 补充细节
v1.2 - Review 反馈修订
v2.0 - 最终版（开始实施）

实施中可能还要继续修订。
```

### 2. 规范要"可执行"
```markdown
 "代码要写得好"（无法验证）

 "TypeScript 严格模式，无 any，测试覆盖 > 80%"
（明确可验证）
```

### 3. 规范要"活"的
规范不是写完就锁进抽屉：

- 代码变更时同步更新规范
- Review 时检查规范是否需要更新
- 发现新方案时记录到规范

### 4. 规范要"短"
```markdown
 100 页规范，没人看

 5-20 页关键内容，人人能读
```

### 5. 规范要"团队共识"
- **写之前对齐**：先和团队讨论大方向
- **Review 后定稿**：不是个人作品
- **定期回顾**：实施后看哪里需要改进

## 实战案例：电商订单系统

### 规范（简化版）
```markdown

# 订单系统规范

## 1. 需求
- 用户可以下单
- 用户可以查看订单历史
- 用户可以取消未支付订单
- 管理员可以查看所有订单

## 2. 技术设计
- 状态机：created → paid → shipped → completed / cancelled
- 状态管理：Zustand（订单表单）+ TanStack Query（订单列表）
- 关键决策：状态变更必须通过统一的状态机函数

## 3. 数据模型
\`\`\`typescript
type OrderStatus = 'created' | 'paid' | 'shipped' | 'completed' | 'cancelled'

interface Order {
  id: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: string
  updatedAt: string
}
\`\`\`

## 4. 验收标准
- [ ] 状态机函数完整（不允许绕过）
- [ ] 订单状态变更记录日志
- [ ] 并发处理（同一订单不会被支付两次）
- [ ] E2E 测试覆盖核心流程

## 5. 任务拆分
1. 数据模型 + 类型（2h）
2. 状态机实现（4h）
3. API 服务（3h）
4. 下单流程（4h）
5. 订单列表（3h）
6. 订单详情（3h）
7. E2E 测试（3h）
```

### 实施
```bash

# 第一阶段：基础设施
> 基于规范完成任务 1-3

# AI 输出：

# - 类型定义

# - 状态机函数

# - API 服务

# 第二阶段：UI
> 基于规范完成任务 4-6

# 第三阶段：测试
> 基于规范完成任务 7

# 每阶段都对照规范验收
```

## 团队实施 Spec Coding

### 角色分工
| 角色 | 责任 |
| --- | --- |
| **产品经理**| 写需求规格 |
| **架构师 / Tech Lead**| 写技术设计 + 验收标准 |
| **开发者**| 按规范实现 + 反馈规范问题 |
| **Reviewer**| 按规范 Review |

### 流程
```
产品出 PRD
   ↓
架构师 Review + 补充技术设计
   ↓
团队 Review
   ↓
开发者认领任务
   ↓
按规范实现
   ↓
按规范验收
```

### 规范管理
```bash
specs/                       # 规范文档目录
├── user-management.md
├── order-system.md
├── payment-integration.md
└── ...

.claude/
  specs/                     # AI 友好的规范
    ├── user-management.md    # 同上，方便 AI 读取
    └── ...
```

## Spec Coding 的常见问题

### 问题 1：过度规范
```
写 100 页规范，结果 90% 没用到
```

**对策**：规范要简洁，只写关键决策。

### 问题 2：规范僵化
```
实施中遇到问题，规范不允许调整
```

**对策**：规范是"活的"，实施中允许更新。

### 问题 3：规范与代码脱节
```
代码改了，规范没更新
```

**对策**：PR 模板强制要求"是否更新规范"。

### 问题 4：无人 Review 规范
```
写完规范直接开始实施
```

**对策**：规范定稿前必须有 Review。

## 总结
Spec Coding 是**大型项目的工程化保障**。

- 文档驱动、可追溯
- 适合多人协作
- 关键模块必备
- 不适合小任务、紧急修复

**记住**：

> 规范不是负担，是**对未来的投资**。

下一节：[模式选择决策树](/modes/decision-tree)