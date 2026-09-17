# agents.md 约束规范

**agents.md**（也称 CLAUDE.md、AGENTS.md、CURSOR.md）是放在项目根目录的**"AI 项目说明书"**，告诉 AI 你的项目约定、规范、约束。

## 为什么它如此重要

没有 agents.md，AI 每次都要"猜"——用什么框架、什么命名风格、状态管理用什么、测试用什么。

**有了 agents.md，AI 第一次启动就"懂"你的项目**。

> 经验估算：AI 首问准确率从 30-50% 提升到 70-90%，每次节省 1-2 分钟重述成本。

## 文件命名与位置

| 工具 | 文件名 |
|------|--------|
| Cursor | `.cursorrules` 或 `.cursor/rules/*.md` |
| Claude Code | `CLAUDE.md` |
| OpenCode | `AGENTS.md` |
| 通用 | `agents.md` |

**推荐**：在项目根目录放一个 `agents.md`，通过符号链接适配各工具：

```bash
ln -s agents.md .cursorrules
ln -s agents.md CLAUDE.md
ln -s agents.md AGENTS.md
```

详细的多工具适配方案：[CLAUDE.md / 工具适配](/context/claude-md)

## 标准模板

```markdown
# [项目名] AI Coding 规范

## 5 条最重要规则
1. 默认使用 TypeScript 严格模式
2. 禁止使用 any（必要时用 unknown）
3. API 请求必须走 services/
4. 不要修改 package.json 依赖版本
5. 不直接 push main 分支

## 项目简介
[一段话说明项目做什么、给谁用、当前阶段]

## 技术栈
- 框架：React 18 + TypeScript 5
- UI 库：Ant Design 5
- 样式：Tailwind CSS 3
- 状态：Zustand 4
- 服务端状态：TanStack Query
- 表单：React Hook Form + Zod
- 构建：Vite 5
- 测试：Vitest + Testing Library
- HTTP：Axios

## 目录结构
src/
  components/    # 通用组件
  features/      # 业务功能模块
  pages/         # 页面
  hooks/         # 自定义 Hook
  services/      # API 服务
  stores/        # 全局状态
  utils/         # 工具
  types/         # 类型定义
  constants/     # 常量

## 命名规范
- 组件：PascalCase（如 UserCard.tsx）
- 文件：组件 PascalCase，其他 camelCase
- Hook：use + 动词（如 useUser.ts）
- 类型：PascalCase
- 常量：UPPER_SNAKE_CASE

## 代码风格
- 函数组件 + Hooks，禁止 class 组件
- 默认使用箭头函数
- 优先命名导出（export const）
- TypeScript 严格模式，禁止 any
- 异步函数显式标 Promise<返回值类型>

## API 规范
- 所有 API 请求走 src/services/
- 使用统一的 http 工具
- 错误处理统一在 http 拦截器

## 测试规范
- 测试框架：Vitest + Testing Library
- 覆盖率：核心模块 > 80%
- 测试文件与源文件同目录，*.test.ts(x)
- 每个组件至少一个 smoke test

## 常用命令
pnpm dev          # 启动开发服务器
pnpm build        # 构建
pnpm test         # 跑测试
pnpm lint         # ESLint
pnpm typecheck    # TypeScript 检查
pnpm format       # Prettier

## 禁止事项
- 不要修改 package.json 依赖版本
- 不要直接 push main
- 不要使用 any
- 不要在组件中直接写业务逻辑
- 不要重复造轮子

## AI 工作流偏好
- 默认使用 Plan Coding 模式
- 复杂任务先出方案再写代码
- 一次只做一个明确任务
- 完成后给出修改清单
```

## 分层方案（推荐固化在 agents.md）

为了让 AI 准确理解项目分层，建议在 agents.md 中以独立章节固化。

### 推荐结构

```markdown
## 分层架构
- 表示层（UI）：components/、pages/，只负责渲染
- 业务层（Business）：hooks/、services/，封装业务规则
- 数据层（Data）：api/、repositories/，封装请求与缓存
- 共享层（Shared）：utils/、types/、constants/，禁止反向依赖
```

### 设计原则

- **单向依赖**：上层可调用下层，下层不可调用上层
- **职责单一**：每层只做一件事，便于独立测试与替换
- **可替换性**：换 UI 不动业务、换 API 不动 UI

### 使用场景

- 中大型项目、长期维护项目 → 必须分层
- AI Coding 重度使用 → 约束 AI 在指定层写代码
- 不建议：一次性脚本、Demo、原型验证（增加心智负担）

### 分层约束示例

```markdown
## 分层约束（AI 必须遵守）
- 禁止 components/ 中调用 fetch / axios，必须走 services/
- 禁止 pages/ 中写业务计算（过滤、排序、聚合），必须抽到 hooks/
- 禁止 api/ 反向依赖 hooks/ 或 components/
```

### 反例 vs 正例

```typescript
// 反例：组件直连 fetch + 业务逻辑混在一起
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(d => setUsers(d.filter(u => u.active)))
  }, [])
  return <div>{users.map(u => <UserCard user={u} />)}</div>
}

// 正例：三层分离
// 数据层 api/userApi.ts
export const userApi = { list: () => http.get<User[]>('/users') }

// 业务层 hooks/useActiveUsers.ts
export function useActiveUsers() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.list()
  })
  return useMemo(() => data?.filter(u => u.active) ?? [], [data])
}

// 表示层 components/UserList.tsx
export function UserList() {
  const users = useActiveUsers()
  return <div>{users.map(u => <UserCard user={u} />)}</div>
}
```

## 实战技巧

### 1. 短而精

```
反例：1000 行"百科全书"，AI 抓不住重点
正例：控制在 200-500 行，重点突出
```

### 2. 关键约束放首尾

LLM 对长上下文的"中间部分"记忆弱。**最重要的 5 条规则**放最前面：

```markdown
# 5 条最重要规则
1. 默认使用 TypeScript 严格模式
2. 不要使用 any
3. 不要修改 package.json 依赖
4. API 请求必须走 services/
5. 不直接 push main 分支

[中间：详细规范...]
```

### 3. 提供反例

AI 对"不要做什么"理解弱于"要做什么"。**给出明确的反例**：

```markdown
## 不要这样写
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(setUsers)
}, [])

## 应该这样写
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => userService.list()
})
```

### 4. 用代码示例而非纯文字

AI 对代码示例的理解远好于纯文字描述。模板中放一个组件示例即可。

### 5. 持续迭代

根据 AI 实际表现持续优化，并维护更新日志：

```markdown
## 更新日志

### 2025-01-15
- 新增：禁止在 useEffect 中直接写 fetch（统一用 TanStack Query）
- 原因：AI 多次重复犯这个错误
```

## 团队协作

| 环节 | 建议 |
|------|------|
| 谁来写 | Tech Lead / 架构师起草，全员 Review |
| 怎么维护 | 与代码同源管理、PR Review、每月回顾 |
| 怎么推广 | 新人 onboarding 必读、Wiki 置顶、PR 检查项 |

## 常见问题

**Q：agents.md 应该多长？**
A：200-500 行最佳。太短没约束力，太长 AI 抓不住重点。

**Q：要不要为每个工具写一份？**
A：不需要。写一份 `agents.md`，通过符号链接适配各工具。

**Q：AI 不遵守 agents.md 怎么办？**
A：1) 把规则写得更明确（带反例）；2) 拆分到工具特定位置（Cursor Rules 等）；3) PR Review 中检查。

**Q：要不要写中文还是英文？**
A：团队语言。国内团队中文更易维护；海外/开源项目用英文。

## 上下文引用

建议在 agents.md 末尾列出所有可被 AI 引用的外部文档：

```markdown
## 上下文引用
- 组件库使用参考：./docs/components.md
- API 接口文档：./docs/api.md
- 业务术语表：./docs/glossary.md
- 设计规范：./docs/design.md
- 分层架构详解：./docs/layered-architecture.md
```

## 与 AI 对话示例

**好的 Prompt**

> 参考 agents.md 帮我写一个用户列表组件，要求：
> - 支持分页、搜索、排序
> - 用 Zustand 管理分页状态
> - 用 TanStack Query 获取数据
> - 用 Ant Design 的 Table

**不好的 Prompt**

> 帮我写个用户列表

---

## 总结

agents.md 是**上下文工程的灵魂**。投入 1-2 天写好它，回报是持续整个项目周期的 AI Coding 效率提升。

下一节：[CLAUDE.md / 工具适配](/context/claude-md) — 让不同 AI 工具都遵守同一份规范。
