# Prompt 模板库

把高频任务**模板化**，是团队效率提升的关键。

## 为什么需要模板

```
反例：每次重新组织语言
> 帮我写一个用户列表，要搜索分页排序，用 React + TS + Ant Design + Zustand +
> TanStack Query，函数组件，TS 严格模式，覆盖 loading/empty/error 三态，
> 遵循 .claude/agents.md ……

正例：使用模板
> /list-component user
> /list-component order
> /list-component product
```

模板 + 参数 = 标准化输出，避免遗漏、节省时间。

## 模板设计三原则

| 原则 | 说明 |
|------|------|
| **参数化** | 用 `{{VAR}}` 占位，避免硬编码 |
| **可复用** | 跨项目通用，把项目特定的部分作为参数 |
| **可测试** | 给出示例输入和预期输出 |

## 通用底层模板：五段式

适用于没有预制模板的任何场景，按五段填空即可：

```markdown
## 角色
你是一个 {{ROLE}}，擅长 {{SKILL}}，熟悉本项目 agents.md 规范。

## 背景
- 项目：{{PROJECT}}
- 当前阶段：{{STAGE}}
- 关键上下文：{{CONTEXT}}

## 任务
{{TASK}}

## 要求
- 技术约束：{{FRAMEWORK}}
- 功能要求：{{FEATURES}}
- 验收标准：{{ACCEPTANCE}}
- 禁止事项：{{FORBIDDEN}}

## 输出格式
{{OUTPUT}}
```

填写示例（新建用户列表）：

```
ROLE: 资深 React 前端工程师
SKILL: Ant Design 5 + Zustand + TanStack Query
PROJECT: 企业后台管理系统
STAGE: 功能迭代，已有订单列表可参考
CONTEXT: 参考 src/features/order/OrderList 的实现风格
TASK: 在 src/features/user/components/ 下新建 UserList 组件
FRAMEWORK: React 18 + TypeScript 严格模式，禁止 any
FEATURES: 分页（20条/页）、搜索（按名称防抖 300ms）、排序（按创建时间）
ACCEPTANCE: loading/empty/error/空搜索结果 四态
FORBIDDEN: 不要修改 package.json、不要 class 组件、不要硬编码样式
OUTPUT: 先方案 → 代码 → 用法示例
```

## 高频场景模板（10 个）

下面列出最常用的 10 个模板。完整模板库建议放在 `.claude/prompts/` 或 `.cursor/commands/`，通过 `/模板名 + 参数` 调用。

### 模板 1：CRUD 列表组件（/list-component）

```
参数：NAME、API_PATH
用途：生成标准 CRUD 列表

参考 agents.md，写一个 {{NAME}} 列表组件：

要求：
1. 函数组件 + TypeScript
2. 使用 TanStack Query 获取数据（GET {{API_PATH}}）
3. 使用 Ant Design Table 组件
4. 支持：搜索（按名称）、分页（20 条/页）、排序（按更新时间）
5. 状态：loading / error / empty / data 四态都要处理
6. 操作列：查看、编辑、删除（带确认弹窗）
7. 新建按钮在右上角，点击打开 Modal 表单

输出：
- 组件文件路径与代码
- 配套的 TypeScript 类型
- 简短的用法说明
```

### 模板 2：表单组件（/form-component）

```
参数：NAME、FIELDS（字段名 | 类型 | 必填 | 校验规则）

参考 agents.md，写一个 {{NAME}} 表单组件：

字段：{{FIELDS}}

要求：
1. 函数组件 + TypeScript
2. 使用 React Hook Form + Zod
3. 字段类型映射：string→Input、number→InputNumber、boolean→Switch、enum→Select、date→DatePicker
4. 实时校验 + 提交校验，错误信息显示在字段下方
5. 提交按钮 loading 态，支持 onSubmit 回调

输出：组件代码 + Zod schema + 类型定义
```

### 模板 3：详情页（/detail-page）

```
参考 agents.md，写一个 {{NAME}} 详情页：

要求：
1. 路由：/{{name}}/:id，从路由参数获取 id
2. 使用 TanStack Query 获取数据（GET /api/{{name}}s/:id）
3. 布局：左侧基本信息 + 右侧操作面板
4. 信息分组：基本信息 / 业务信息 / 系统信息（创建时间、更新时间等）
5. 操作：编辑、删除、返回列表
6. loading 用 Skeleton
```

### 模板 4：API 服务层（/api-service）

```
参考 agents.md，为 {{NAME}} 实体写 API 服务层：

要求：
1. 文件：src/services/{{name}}.ts
2. 使用项目统一的 http 工具
3. 包含标准 CRUD 方法：list、get、create、update、delete
4. 完整 TypeScript 类型，JSDoc 注释

接口：
- GET /api/{{name}}s - 列表（支持分页参数）
- GET /api/{{name}}s/:id - 详情
- POST /api/{{name}}s - 创建
- PUT /api/{{name}}s/:id - 更新
- DELETE /api/{{name}}s/:id - 删除
```

### 模板 5：单元测试（/unit-test）

```
为 {{FILE_PATH}} 写单元测试：

要求：
1. 使用 Vitest + Testing Library
2. 测试文件：{{FILE_PATH}} 同目录 *.test.ts(x)
3. 必须覆盖：正常渲染 / 用户交互 / 边界情况 / 错误处理
4. 每个 describe 有清晰说明，使用 userEvent 模拟交互

不要：
- 测试实现细节
- 过度 mock
- 跳过错误场景
```

### 模板 6：Bug 修复（/fix-bug）

```
修复以下 Bug：

## Bug 描述
{{BUG_DESC}}

## 复现步骤
1. {{STEP_1}}
2. {{STEP_2}}

## 期望行为
{{EXPECTED}}

## 实际行为
{{ACTUAL}}

## 相关文件
{{FILES}}

## 任务
1. 定位 Bug 根因
2. 提出修复方案
3. 实施修复
4. 添加回归测试
5. 跑全部测试验证

参考 agents.md 编码规范
```

### 模板 7：代码审查（/code-review）

```
审查以下代码变更：

## 变更内容
{{DIFF}}

## 审查要点
1. 代码风格是否符合 agents.md
2. 类型定义是否完整
3. 错误处理是否充分
4. 是否有性能问题
5. 是否有可访问性问题
6. 是否有安全风险
7. 测试是否覆盖

## 输出格式
### 优点
### 建议改进（非阻塞）
### 必须修改（阻塞）
### 详细评论（文件:行号 - 评论）
```

### 模板 8：代码重构（/refactor）

```
重构 {{TARGET}}：

## 当前问题
{{ISSUES}}

## 重构目标
{{GOAL}}

## 约束
- 不改变外部行为
- 不修改公开 API
- 保持现有测试通过
- 遵循 agents.md

## 步骤
1. 先分析当前代码
2. 提出重构方案
3. 列出修改清单
4. 实施（按计划逐步）
5. 跑测试 + lint + typecheck 验证
```

### 模板 9：写文档（/docs）

```
为 {{TARGET}} 写文档：

目标读者：{{AUDIENCE}}

要求：
1. 简洁明了，避免废话
2. 代码示例要可运行
3. 重点突出，结构清晰
4. 必要时用 mermaid 图示

输出结构：
## 简介（一段话）
## 基本用法（代码示例）
## API 参考（如适用）
## 常见问题
## 进阶用法（如适用）
```

### 模板 10：依赖升级（/upgrade-deps）

```
升级依赖：{{FROM_VERSION}} → {{TO_VERSION}}
包名：{{PACKAGE}}

任务：
1. 查看 CHANGELOG，找出 breaking changes
2. 在项目中搜索该包的所有用法
3. 列出需要修改的地方
4. 实施修改（按优先级）
5. 跑测试验证
6. 更新类型定义（如有）
7. 提交修改
```

## 模板组织方式

```
.claude/
  prompts/                   # Claude Code 模板目录
    list-component.md
    form-component.md
    detail-page.md
    api-service.md
    unit-test.md
    fix-bug.md
    code-review.md
    refactor.md
    docs.md
    upgrade-deps.md
    README.md                # 模板索引
```

**README 索引示例**：

```markdown
## 可用模板
| 模板 | 用途 | 调用 |
| --- | --- | --- |
| list-component | CRUD 列表 | `/list-component` |
| form-component | 表单 | `/form-component` |
| fix-bug | Bug 修复 | `/fix-bug` |
| code-review | 代码审查 | `/code-review` |
```

## 模板质量检查

| 检查项 | 说明 |
|--------|------|
| 是否参数化 | 用 `{{VAR}}` 而不是硬编码 |
| 是否带示例 | 给 AI 一个参考 |
| 是否说明输出格式 | 明确期望产出 |
| 是否引用规范 | 引导 AI 参考 agents.md |
| 是否说明禁止项 | 避免常见错误 |
| 是否有版本 | 模板也要迭代 |

## 模板迭代

模板不是一次写完就完事，需要根据实际效果持续优化，并维护版本：

```markdown
<!-- prompts/list-component.md -->
<!-- v1.0 - 2025-01-15: 初版 -->
<!-- v1.1 - 2025-01-20: 增加 loading/error/empty 三态 -->
<!-- v2.0 - 2025-02-01: 拆分为参数化模板 -->
```

## 团队共享

| 实践 | 说明 |
|------|------|
| 独立仓库 | 模板单独管理（`ai-templates`），跨项目复用 |
| 分技术栈 | `react/`、`vue/`、`general/` 子目录 |
| 每个模板有维护者 | 团队共享迭代经验 |
| 纳入项目 | `git submodule add ... .claude/templates` |

**跨项目模板仓库结构**：

```
ai-templates/                 # 单独的 Git 仓库
├── README.md
├── react/
│   ├── list-component.md
│   ├── form-component.md
│   └── ...
├── vue/
│   └── ...
└── general/
    ├── code-review.md
    ├── refactor.md
    └── ...
```

## 模板评估指标

| 指标 | 说明 |
|------|------|
| **使用率** | 每个模板每周被调用多少次 |
| **一次可用率** | AI 按模板生成的代码一次可用比例 |
| **平均修改时间** | 生成后人工修改耗时 |
| **团队反馈** | 哪个模板最好用、哪个需要改 |

详见 [效率度量](/metrics/efficiency)。

## 总结

模板化是上下文工程的**最高级形式**。从：

```
散落的 Prompt → 模板 → 模板库 → 跨团队模板库
```

每一步都带来效率的指数级提升。

下一节：[上下文管理策略](/context/management) — 控制单次任务的输入量。
