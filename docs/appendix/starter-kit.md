# 配套模板（Starter Kit）
> **本附录汇集配套模板**，可直接复制到项目使用。覆盖 agents.md、Cursor/Claude Code 配置、Prompt 模板、Review 检查表等。

> **使用方式**：复制下方代码块到项目对应位置，按需修改。

> **本指南中的"经验数据"均为经验估算**，具体效果因项目而异。

- --

## 快速跳转
- [1. agents.md / CLAUDE.md 模板](#1-agentsmd--claudemd-模板)
- [2. Cursor 配置模板](#2-cursor-配置模板)
- [3. Claude Code 配置模板](#3-claude-code-配置模板)
- [4. OpenCode 配置模板](#4-opencode-配置模板)
- [5. Prompt 模板库](#5-prompt-模板库)
- [6. Code Review 检查表](#6-code-review-检查表)
- [7. 工作流模板](#7-工作流模板)
- [8. 安全检查表](#8-安全检查表)

- --

## 1. agents.md / CLAUDE.md 模板
> 放在项目根目录，**文件名二选一**：`agents.md`（通用）或 `CLAUDE.md`（Claude 工具识别）。

### 1.1 通用模板
```markdown

# <项目名> AI Coding 协作约定
> 本文件约束 AI 工具（Cursor / Trae / Claude Code 等）的行为。
> 修改本文件属于"项目宪法变更"，需要团队 Review。

- --

## 1. 项目基础
- **项目名称**：<项目名>
- **项目简介**：<一句话说明>
- **技术栈**：
  - 前端：React 18 + TypeScript 5 + Vite 5
  - 路由：React Router 6
  - 状态：Zustand 4
  - UI：Ant Design 5
  - 请求：Axios + React Query
  - 测试：Vitest + Testing Library
  - 工具：pnpm + ESLint + Prettier
- **Node 版本**：>= 18.18
- **包管理器**：pnpm 9

## 2. 关键命令
```bash

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm typecheck

# Lint
pnpm lint

# 单元测试
pnpm test

# E2E 测试
pnpm e2e

# 构建
pnpm build

# 格式化
pnpm format
```

## 3. 目录结构
```
src/
├── features/        # 业务特性（每个特性自包含）
│   ├── user/        # 用户模块
│   │   ├── api/     # API 调用
│   │   ├── components/  # 组件
│   │   ├── hooks/   # 自定义 Hooks
│   │   ├── store/   # 状态管理
│   │   ├── types.ts # 类型定义
│   │   └── index.ts # 模块入口
│   └── order/       # 订单模块
├── shared/          # 跨特性复用
│   ├── components/  # 通用组件
│   ├── hooks/       # 通用 hooks
│   ├── utils/       # 工具函数
│   └── types/       # 通用类型
├── pages/           # 路由页面
├── router/          # 路由配置
├── store/           # 全局状态
├── api/             # 全局 API
└── main.tsx         # 应用入口
```

## 4. 编码规范

### 命名约定
- **组件**：PascalCase（如 `UserProfile.tsx`）
- **函数/变量**：camelCase（如 `getUserById`）
- **常量**：UPPER_SNAKE_CASE（如 `MAX_RETRY_COUNT`）
- **类型/接口**：PascalCase，前缀 `I` 可选（如 `UserInfo` 或 `IUserInfo`）
- **文件名**：与导出名一致
- **布尔变量**：前缀 `is`/`has`/`should`（如 `isLoading`）

### 文件组织
- 单文件 < 300 行
- 单组件 < 200 行（超过就拆子组件）
- 每个特性文件夹自包含
- 接口契约（types.ts）放在模块根

### 导入顺序
1. 第三方包
2. 内部别名（@/）
3. 相对路径

```typescript
// 1. 第三方
import { useState } from 'react'
import { Button } from 'antd'

// 2. 内部别名
import { useAuth } from '@/shared/hooks'

// 3. 相对路径
import { UserCard } from './UserCard'
```

### 注释
- **JSDoc**：导出的公共函数/类型必须有
- **行内注释**：解释"为什么"而非"做了什么"
- **TODO**：写明负责人和日期

```typescript
/***根据用户 ID 获取用户信息
 * @param id - 用户 ID
 * @returns 用户信息
 */
export async function getUserById(id: string): Promise<User> {
  // 缓存策略：使用 SWR，避免重复请求
  // ...
}
```

### 错误处理
- 不吞错误（不要 `catch (e) {}`）
- 错误必须向上抛或返回有意义的错误对象
- 用户提示使用统一的 toast 组件
- 异步函数必须处理异常

```typescript
// 正确
try {
  const data = await fetchUser(id)
  return data
} catch (error) {
  logger.error('Fetch user failed', { id, error })
  throw new UserFetchError('Failed to fetch user', { cause: error })
}

// 错误
try {
  return await fetchUser(id)
} catch (e) {
  // 吞掉错误
}
```

### 异步/并发
- 优先用 async/await（不用 .then）
- 并行请求用 Promise.all
- 避免 await in loop

## 5. 协作约定

### Git
- 分支命名：`feat/<name>`、`fix/<name>`、`chore/<name>`
- 提交规范：`<type>(<scope>): <subject>`，参考 Conventional Commits
  - 类型：feat / fix / docs / style / refactor / test / chore
  - 示例：`feat(user): add avatar upload`
- 提交前必跑：lint + typecheck + test
- 不要提交：`node_modules/`、`.env`、`dist/`、`*.log`、`.DS_Store`

### 分支流程
- `main`：生产环境，永远可发布
- `develop`：开发主分支
- `feat/*`：功能分支
- 合并前需要 PR + 至少 1 人 Review

### PR
- 标题：与 commit 一致
- 描述：说明"为什么"+"改了什么"+"怎么测试"
- 单 PR 不超过 400 行改动
- 关联 Issue

## 6. AI 专属约定

### AI 必须做
- 修改前先阅读相关文件
- 写代码后给出"如何测试"的说明
- 涉及多文件改动时，先列"改动清单"再动手
- 出现不确定性时主动询问

### AI 不要做
- 不要修改 `package.json` 的关键依赖版本（需人工评估）
- 不要修改数据库 schema（需 DBA 评估）
- 不要删除测试代码（需确认是否过时）
- 不要直接操作生产环境（禁止 deploy、delete 等危险操作）
- 不要写 secrets 到任何文件
- 不要在未明确说明的情况下启用新依赖

### AI 必须遵守
- 严格遵循本文件的命名、目录、注释规范
- 完成改动后必须能通过 `pnpm typecheck` + `pnpm lint` + `pnpm test`
- 输出代码时同时给出"潜在风险"提示

## 7. 反馈
- 本文件是活的，欢迎通过 PR 改进
- 不合理的约定，由 TL Review 后调整
- 新人入门必读
```

```

### 1.2 极简版（适合小项目）
```markdown

# <项目名> AI 约定

## 项目
- 简介：<一句话>
- 技术栈：React 18 + TypeScript + Vite
- 命令：`pnpm dev / build / test / lint / typecheck`

## 规范
- 命名：组件 PascalCase，函数 camelCase
- 文件：< 300 行/文件
- 目录：`src/features/<feature>/`
- 导入：第三方 → 别名 → 相对

## AI 约定
- 先读文件再改
- 完成后给测试说明
- 不改 package.json 关键依赖
- 不改数据库 schema
- 不写 secrets
- 不直接 deploy

## 安全
- 不要把生产数据发给 AI
- 用户输入必须校验
- 不信任 AI 返回的数据结构（要校验）
```

```

- --

## 2. Cursor 配置模板

### 2.1 旧版：.cursorrules（项目根目录）
```markdown

# Cursor 规则

## 必读
- 项目遵循 `agents.md` 的所有约定
- 修改前先看相关文件
- 完成后用 `pnpm test` 验证

## 代码风格
- 使用 TypeScript strict 模式
- 优先函数式组件
- 优先 hooks 复用
- 状态管理用 Zustand
- 表单处理用 React Hook Form

## 不要做
- 不要生成 `any` 类型
- 不要修改 .env 文件
- 不要在 .gitignore 之外创建大文件

## 上下文
- 看到 `@/shared/` 下的代码是公共组件，修改时谨慎
- 看到 `features/` 下的代码是业务特性，按特性组织
```

```

### 2.2 新版：.cursor/rules/*.mdc
新版本用分文件规则，按文件类型 / glob 匹配。

**`.cursor/rules/typescript.mdc`**：

```markdown

- --

description: TypeScript 编码规则
globs:
  - "**/*.ts"
  - "**/*.tsx"

- --

# TypeScript 规则
- 严格使用 `strict: true` 配置
- 禁止 `any` 类型，用 `unknown` 替代
- 导出函数必须有返回类型
- 复杂对象用 `interface`，简单对象用 `type`
- 泛型使用描述性名称（`TItem` 而非 `T`）

```typescript
// 正确
interface UserInfo {
  id: string
  name: string
}

function getUser(id: string): Promise<UserInfo> { ... }

// 错误
function getUser(id) { ... }
```

```
```

**`.cursor/rules/react.mdc`**：

```markdown

- --

description: React 组件规则
globs:
  - "**/*.tsx"
  - "**/*.jsx"

- --

# React 规则
- 函数组件优先
- 优先使用 hooks
- 组件 props 必须有 type
- 默认导出 + 命名导出都可，但保持一致
- 状态用 useState，提升到合适层级

```tsx
// 正确
interface UserCardProps {
  user: User
  onEdit?: (id: string) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (...)
}
```

```
```

**`.cursor/rules/api.mdc`**：

```markdown

- --

description: API 调用规则
globs:
  - "**/api/**/*.ts"
  - "**/api/**/*.tsx"

- --

# API 规则
- 用 React Query 管理请求
- 错误统一处理
- 不在前端直接处理敏感数据
- 路径用相对路径，配合 tsconfig paths

```typescript
// 正确
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/features/user/api'

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getById(id),
  })
}
```

```
```

### 2.3 .cursorignore
放在项目根，告诉 Cursor 哪些文件不索引：

```

# 依赖
node_modules/
.pnpm-store/

# 构建产物
dist/
build/
.next/
.vite/

# 环境变量
.env
.env.local
.env.*.local

# 日志
*.log
logs/

# 大文件
*.zip
*.tar.gz
*.pdf

# 敏感信息
secrets/
credentials/

# 测试覆盖率
coverage/

# 临时文件
tmp/
temp/
```

- --

## 3. Claude Code 配置模板

### 3.1 CLAUDE.md（与 agents.md 二选一或并存）
如果你同时用 Claude Code 和其他工具，建议**统一用 CLAUDE.md**（Claude Code 优先识别）。

**`CLAUDE.md`**：

```markdown

# <项目名>

## 项目
- 简介：<一句话>
- 栈：React 18 + TypeScript + Vite
- 命令：见 agents.md

## 必读
- 所有约定见 `./agents.md`
- 特别提醒：不要改 schema、不要 deploy、不要写 secrets

## Skills（可选）
- @file:./.claude/skills/review.md
- @file:./.claude/skills/test.md
```

```

### 3.2 .claudeignore
```
node_modules/
dist/
build/
*.log
.env
.env.local
coverage/
.git/
.idea/
.vscode/
.DS_Store
```

### 3.3 Skills 示例
**`.claude/skills/review.md`**：

```markdown

- --

name: review
description: 启动代码审查流程

- --

# Code Review 流程
按以下步骤审查 PR / 文件：

1. 阅读相关测试，确认覆盖
2. 检查类型、错误处理、安全
3. 评估性能影响
4. 给出具体改进建议

输出格式：
- 优点
- 风险
- 建议
- 必须改
```

```

**`.claude/skills/test.md`**：

```markdown

- --

name: test
description: 为代码生成测试

- --

# 测试生成流程
为 <目标文件> 生成单元测试：

1. 识别导出函数
2. 覆盖 happy path
3. 覆盖边界条件（null、undefined、空数组、超大）
4. 覆盖异常路径
5. 用 describe/it 组织
6. 使用项目已有的测试工具

输出格式：
- 测试文件路径
- 关键断言说明
```

```

### 3.4 Slash Commands
**`.claude/commands/refactor.md`**：

```markdown

- --

description: 重构代码

- --

请重构 $ARGUMENTS，按以下步骤：

1. 阅读当前实现
2. 列出重构目标
3. 给出重构后代码
4. 列出风险点
5. 提供测试建议

**重要**：不破坏现有 API，不修改测试。
```

```

**`.claude/commands/security.md`**：

```markdown

- --

description: 安全审查

- --

请审查 $ARGUMENTS 的安全性：

1. 检查用户输入校验
2. 检查 SQL/XSS 风险
3. 检查认证授权
4. 检查敏感数据处理
5. 给出风险等级（高/中/低）
```

```

- --

## 4. OpenCode 配置模板

### 4.1 opencode.json
放在项目根：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-6",
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api.anthropic.com"
      }
    },
    "deepseek": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.deepseek.com/v1"
      }
    }
  },
  "small_model": "deepseek/deepseek-chat"
}
```

### 4.2 切换模型用命令
```bash

# 用 Claude Sonnet 4.6
opencode --model anthropic/claude-sonnet-4-6

# 用 DeepSeek V3.2（便宜）
opencode --model deepseek/deepseek-chat

# 用 GLM-5（接近 Opus 4.6）
opencode --model zhipu/glm-5
```

- --

## 5. Prompt 模板库

### 5.1 新功能开发
```markdown

# 任务
实现"<功能名>"功能。

# 上下文
- 项目：<项目名>
- 涉及文件：<列出关键文件>
- 技术栈：<相关栈>

# 功能描述
- 输入：<用户输入/数据>
- 处理：<核心逻辑>
- 输出：<UI/API/数据>

# 验收标准
- [ ] 功能完整可用
- [ ] 边界条件已处理
- [ ] 错误处理已覆盖
- [ ] 单元测试通过（覆盖 > 80%）
- [ ] 类型检查通过
- [ ] Lint 通过

# 约束
- 不要修改 X
- 不要引入新依赖 Y

# 测试要求
- 至少 3 个测试用例
- 包含 happy path + 异常 path
```

```

### 5.2 Bug 修复
```markdown

# 现象
<具体错误信息 / 异常行为>

# 复现步骤
1. <操作 1>
2. <操作 2>
3. <出错>

# 期望
<应该是什么>

# 已尝试
- <尝试 1>（结果：失败 / 原因）
- <尝试 2>（结果：失败 / 原因）

# 相关文件
- <文件 1>（怀疑位置）
- <文件 2>（可能相关）

# 调查方向
<你的初步判断 / 假设>
```

```

### 5.3 重构
```markdown

# 重构目标
<重构后要达到什么效果>

# 范围
- 涉及文件：<清单>
- 保留不变：<明确不动的>

# 约束
- 保持 API 向后兼容
- 测试不能挂
- 不修改功能行为
- 不改数据库 schema

# 重构手法
- [ ] 提取函数
- [ ] 提取类
- [ ] 替换算法
- [ ] 移动函数
- 其他：<自定义>

# 风险评估
- 影响范围：<广/中/窄>
- 回滚方案：<git revert / feature flag>
```

```

### 5.4 Code Review 请求
```markdown
请按以下维度审查 <文件/PR>：

1. **正确性**：逻辑、边界条件
2. **性能**：时间/空间复杂度，N² 循环
3. **安全**：注入、泄露、权限
4. **可维护性**：命名、注释、复杂度
5. **测试**：覆盖、断言质量
6. **一致性**：是否与项目规范一致

输出格式：
- 必须改：<列出>
- 建议改：<列出>
- 可选优化：<列出>
- 优点：<列出>
```

```

### 5.5 测试生成
```markdown
为 <目标文件> 的 `<函数名>` 函数生成单元测试。

要求：
- 使用 Vitest + Testing Library
- 覆盖 happy path
- 覆盖边界（null、undefined、空、极大）
- 覆盖异常（throw / 拒绝）
- Mock 所有外部依赖
- 关键断言有说明

输出：
- 测试代码
- 覆盖率说明
```

```

### 5.6 文档生成
```markdown
为 <文件> 生成 JSDoc / 文档：

- 函数：参数、返回值、抛错、示例
- 类型：字段说明
- 模块：用途、依赖、用法示例

要求：
- 中文文档
- 简洁、准确
- 包含 1 个使用示例
```

```

### 5.7 架构设计讨论
```markdown
我要设计 <系统名>，请帮我思考：

# 需求
- <功能 1>
- <功能 2>

# 约束
- 性能：<QPS / 响应时间>
- 一致性：强一致 / 最终一致
- 团队规模：<人数>

# 请输出
- 整体架构（分层 / 模块）
- 关键技术选型及理由
- 风险点 + 应对方案
- MVP 拆分
```

```

- --

## 6. Code Review 检查表

### 6.1 提交者自检
提交 PR 前：

- [ ] 跑过 `pnpm typecheck` 无错误
- [ ] 跑过 `pnpm lint` 无 warning
- [ ] 跑过 `pnpm test` 全部通过
- [ ] 跑过 `pnpm format` 格式化
- [ ] 新功能有测试（覆盖 > 80%）
- [ ] 复杂逻辑有注释
- [ ] 没有遗留 console.log
- [ ] 没有提交 secrets
- [ ] 没有提交大文件
- [ ] PR 描述清楚"为什么"+"改了什么"

### 6.2 Reviewer 检查

#### 必看（5 项）
- [ ] **正确性**：逻辑正确，边界条件覆盖
- [ ] **错误处理**：不吞错，错误有上下文
- [ ] **性能**：无 N²、无内存泄漏
- [ ] **安全**：无注入、无 secrets、权限正确
- [ ] **可读性**：命名清晰、不过度抽象

#### 加分项（5 项）
- [ ] **测试质量**：断言不弱（不是 `toBeTruthy` 而应是具体值）
- [ ] **错误日志**：关键路径有日志
- [ ] **可观测性**：埋点、监控齐全
- [ ] **回滚方案**：有 feature flag 或回滚说明
- [ ] **文档更新**：API 变更、README 更新

#### 红旗（必须打回）
- 提交 secrets
- 删测试
- 跳过 typecheck / lint
- 单 PR 超过 1000 行
- 修改公共 API 无说明

- --

## 7. 工作流模板

### 7.1 Vibe Coding 工作流（30 分钟）
```
00:00 - 05:00  需求确认（用一句话说清楚）
05:00 - 10:00  AI 生成 1-3 个 demo
10:00 - 20:00  自己评估 + AI 优化
20:00 - 25:00  决定方向（继续 / 切换 / 放弃）
25:00 - 30:00  整理产出（结论 + 经验）
```

### 7.2 Plan Coding 工作流（1-2 天）
```
Day 1 上午：
  - 写简短计划（任务清单 + 验收标准）
  - 让 AI 拆分任务
  - 估时 + 优先级

Day 1 下午：
  - 实施功能
  - 写测试
  - 自测

Day 2：
  - 修 bug
  - Code Review
  - 提 PR
```

### 7.3 Spec Coding 工作流（1-2 周）
```
Day 1-2：需求分析
  - 写功能规格（goals / scope / interfaces / acceptance）
  - 团队对齐

Day 3-4：设计
  - 数据模型
  - 接口契约（types.ts）
  - 任务拆分

Day 5-9：实施
  - 按任务推进
  - 每日 standup
  - 持续集成

Day 10：验证
  - 集成测试
  - E2E 测试
  - 性能测试

Day 11-12：上线
  - Code Review
  - 文档更新
  - Feature Flag 灰度
  - 监控
```

### 7.4 个人效率追踪
每周一花 15 分钟记录：

```markdown

# 第 X 周 AI Coding 复盘

## 本周数据
- AI 完成任务数：<N>
- 一次通过率：<X>%
- 返工率：<Y>%
- Token 消耗：<Z>
- API 成本：$ <W>

## 经验教训
- 哪些 Prompt 效果好
- 哪些反模式要避
- 哪些工具用得多

## 下周计划
- <重点 1>
- <重点 2>
```

### 7.5 团队周会
每周 30 分钟，议程：

```
1. 分享 1 个本周 AI Coding 高光时刻（10 分钟）
2. 分享 1 个本周踩的坑（10 分钟）
3. 同步 agents.md / Cursor Rules 更新（5 分钟）
4. 度量数据 review（5 分钟）
```

- --

## 8. 安全检查表

### 8.1 提交前
- [ ] 代码中无 API key、token、密码
- [ ] 无 console.log 打印用户数据
- [ ] 无硬编码的 URL / IP
- [ ] 无调试代码（debugger、TODO 注释）

### 8.2 上线前
- [ ] 依赖审计 `pnpm audit` 通过
- [ ] 关键路径有错误处理
- [ ] 用户输入已校验
- [ ] 权限检查到位
- [ ] HTTPS 强制
- [ ] CSP 配置正确
- [ ] 日志不包含敏感信息
- [ ] 监控告警配置
- [ ] 回滚方案就绪

### 8.3 数据合规
- [ ] 不向 AI 发送生产用户数据
- [ ] 测试用脱敏数据
- [ ] 内部敏感数据用本地模型
- [ ] 第三方 API 调用符合合规要求
- [ ] 留存策略符合法规

### 8.4 Prompt 安全
- [ ] AI 返回值校验后再使用
- [ ] AI 不直接执行 deploy / delete
- [ ] AI 不直接处理支付
- [ ] AI 不自主订阅 / 购买
- [ ] 关键决策必须人审

- --

## 9. 配套文件清单
把以下文件放到项目根：

```
<project-root>/
├── agents.md             # AI 协作约定（推荐）
├── CLAUDE.md             # Claude Code 专用（可选，与 agents.md 并存）
├── .cursorrules          # Cursor 旧版规则（可选）
├── .cursor/
│   └── rules/            # Cursor 新版规则（推荐）
│       ├── typescript.mdc
│       ├── react.mdc
│       └── api.mdc
├── .cursorignore         # Cursor 忽略文件
├── .claude/
│   ├── skills/           # Claude Code skills
│   │   ├── review.md
│   │   └── test.md
│   └── commands/         # Claude Code slash commands
│       ├── refactor.md
│       └── security.md
├── .claudeignore         # Claude Code 忽略文件
├── opencode.json         # OpenCode 配置
├── .env.example          # 环境变量示例
├── .gitignore            # Git 忽略（已有）
└── README.md             # 项目说明
```

- --

## 模板使用建议

### 1. 不要照搬，按需裁剪
- 小项目用"极简版 agents.md"
- 大项目用"通用模板"
- 特殊行业（金融、医疗）加额外约束

### 2. 团队协作
- 模板由 TL 维护
- 改动走 PR Review
- 每月回顾一次

### 3. 持续演进
- 团队踩坑后加到模板
- 工具能力升级后更新约定
- 业务变更后调整规范

- --

## 模板元信息
- **整理时间**：2026-08
- **兼容性**：Cursor / Trae Solo / Claude Code / OpenCode / CodeX
- **维护建议**：每季度 review 一次

> **模板只是起点**，团队跑起来后根据实际情况调整，比"完美模板"更重要。
