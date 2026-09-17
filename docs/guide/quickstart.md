# 快速开始：从零到 AI Coding 就绪

## 30 分钟，让你的项目具备 AI Coding 能力
本指南提供一条**最短路径**，帮助你在 30 分钟内完成 AI Coding 的基础准备。

> :bulb: **不想从零写？** 直接参考 [ai-coding-template](https://github.com/webgogogo/ai-coding-template) — 开箱即用的 React + TypeScript 模板，含多 AI 工具配置和完整 CI 门禁。

---

## 第 1 步：选一个工具（5 分钟）
根据你的场景快速选择：

| 场景 | 推荐 | 理由 |
|------|------|------|
| 个人开发，免费优先 | **Trae Solo** | 中文体验好，免费可用 |
| 日常前端开发 | **Cursor** | 生态最成熟，补全最丝滑 |
| 复杂重构 / 调试 | **Claude Code** | Agent 自主性最强 |
| 代码不能出境 | **OpenCode** | 开源可本地部署 |

> 详见 [工具总览](/tools/overview) 和 [工具决策矩阵](/tools/decision-matrix)

---

## 第 2 步：创建 agents.md（10 分钟）
在项目根目录创建 `agents.md`，复制以下模板并根据你的项目修改：

```markdown

# [项目名] AI Coding 规范

## 技术栈
- 框架：[React 18 + TypeScript 5 严格模式]
- UI 库：[Ant Design 5]
- 样式：[Tailwind CSS 3]
- 状态：[Zustand 4 + TanStack Query 5]
- 构建：[Vite 5]
- 测试：[Vitest + Testing Library]

## 目录结构
src/
  components/    # 通用组件
  features/      # 业务功能模块
  pages/         # 页面
  hooks/         # 自定义 Hook
  services/      # API 服务
  stores/        # 全局状态
  types/         # 类型定义
  utils/         # 工具函数

## 命名规范
- 组件：PascalCase（UserCard.tsx）
- Hook：useXxx（useUser.ts）
- 常量：UPPER_SNAKE_CASE

## 代码风格
- 函数组件 + Hooks
- TypeScript 严格模式，禁止 any
- 错误处理用 try-catch
- 不要在组件内直接写 fetch

## 常用命令
pnpm dev          # 启动
pnpm build        # 构建
pnpm test         # 测试
pnpm lint         # 检查
pnpm typecheck    # 类型检查

```

> 详见 [agents.md 约束规范](/context/agents)

---

## 第 3 步：了解三种编码模式（5 分钟）
| 模式 | 一句话 | 什么时候用 |
|------|--------|-----------|
| **Vibe Coding** | 即兴对话探索 | 原型、调研、学习 |
| **Plan Coding** | 先方案后编码 | 日常开发、中等复杂度 |
| **Spec Coding** | 规范驱动交付 | 核心模块、团队协作 |

> 详见 [三种编码模式](/modes/overview)

---

## 第 4 步：完成你的第一个 AI 任务（10 分钟）
用这个 Prompt 模板开始你的第一个任务：

```markdown

## 角色
你是一个资深 [技术栈] 工程师，参照 @agents.md 规范。

## 任务
[一句话描述要做什么]

## 技术要求
- 框架：[你的框架]
- 遵循 @agents.md 中的 [相关约定]
- 参考 @src/[参考文件] 的风格

## 验收
- [ ] 功能正常运行
- [ ] TypeScript 无报错
- [ ] 覆盖 loading / empty / error 三态
```

> 详见 [Prompt 工程技巧](/context/prompt-engineering)

---

## 检查清单
完成以上 4 步后，确认以下事项：

- [ ] 工具已安装并正常运行
- [ ] agents.md 已放入项目根目录，内容贴合项目实际
- [ ] 了解三种编码模式的区别，知道不同场景用哪种
- [ ] 已成功完成至少一个 AI 辅助的代码任务
- [ ] agents.md 已纳入 Git 版本管理

---

## 下一步
根据你的角色选择重点阅读：

| 角色 | 重点章节 |
|------|---------|
| **前端开发者** | [Prompt 工程技巧](/context/prompt-engineering) → [三种编码模式](/modes/overview) → [代码质量保障](/quality/overview) |
| **技术 Lead** | [上下文工程](/context/overview) → [架构设计](/architecture/overview) → [团队协作](/team/overview) |
| **架构师** | [架构设计](/architecture/overview) → [安全合规与成本](/security/overview) → [评估与反模式](/metrics/overview) |

---

## 常见问题

### Q：我该选 Cursor 还是 Trae Solo？
A：如果你需要最好的中文体验和免费方案，选 **Trae Solo**；如果你追求最成熟的生态和插件支持，选 **Cursor**。两者可以都试用 1-2 天再决定。

### Q：agents.md 写多长合适？
A：**200-500 行**最佳。太短没约束力，太长 AI 抓不住重点。

### Q：AI 生成的代码不靠谱怎么办？
A：记住三个原则：1) 用 [Plan Coding](/modes/plan-coding) 先方案后实施；2) 小步迭代，一次一个任务；3) 始终通过 [Code Review](/quality/code-review) 把关。

### Q：团队怎么统一推进 AI Coding？
A：统一工具选型 → 制定团队 agents.md → 建立 PR Review 规范 → 定期分享经验。详见 [团队上手路径](/team/onboarding)。
