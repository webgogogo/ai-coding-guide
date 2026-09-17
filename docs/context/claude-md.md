# CLAUDE.md / 多工具适配

不同 AI 工具有不同的指令加载机制。本章讲解如何让**一份 `agents.md` 在所有工具中生效**。

## 核心理念：一份规范，多端加载

```
        ┌─────────────────────┐
        │     agents.md        │  ← 主配置（团队维护一份）
        └──────────┬──────────┘
                   │
       ┌───────────┼───────────┬───────────┐
       ▼           ▼           ▼           ▼
   .cursorrules  CLAUDE.md   AGENTS.md   .trae/rules
   (Cursor)    (Claude Code) (OpenCode)   (Trae)
```

通过**符号链接 + 工具特定扩展**，实现一份主配置 + 多端差异化增强。

## 主流工具加载机制

| 工具 | 主配置位置 | 特点 |
|------|-----------|------|
| **Cursor** | `.cursorrules` 或 `.cursor/rules/*.mdc` | 支持多文件按需加载（globs） |
| **Claude Code** | `CLAUDE.md` + `.claude/commands/` | 支持自定义命令和子 Agent |
| **OpenCode** | `AGENTS.md` + YAML | 支持多 Agent 配置 |
| **Trae** | `.trae/rules/*.md` | 中文场景友好 |

### Cursor

**旧版** `.cursorrules`（项目根目录单文件）：

```markdown
## TypeScript
- 严格模式
- 禁止 any

## React
- 函数组件 + Hooks
```

**新版** `.cursor/rules/*.mdc`（推荐，按需加载）：

```bash
.cursor/
  rules/
    general.mdc       # 全局规则
    typescript.mdc    # TS 专项
    react.mdc         # React 专项
    api.mdc           # API 专项
```

每个 `.mdc` 文件可用 frontmatter 控制加载条件：

```markdown
---
description: "TypeScript 编码规范"
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: false
---

# TypeScript 规则

## 必须
- 严格模式
- 优先 interface

## 禁止
- any 类型
- @ts-ignore
```

### Claude Code

Claude Code 启动时自动加载：

```
~/.claude/CLAUDE.md           # 全局（个人，所有项目生效）
./CLAUDE.md                    # 项目根（团队共享）
```

**优先级**：项目级 > 全局

`.claude/` 目录的高级用法：

```bash
.claude/
  CLAUDE.md                # 主配置（可符号链接到 agents.md）
  commands/                # 自定义斜杠命令
    review.md              # /review 命令
    test.md                # /test 命令
  agents/                  # 子 Agent 配置
    frontend-reviewer.md   # 前端代码审查 Agent
  hooks/                   # 钩子（Pre/Post 任务）
```

**自定义命令示例** `.claude/commands/review.md`：

```markdown
# /review 命令
执行 PR Review：
1. 读取 diff
2. 检查代码风格
3. 检查潜在 Bug
4. 给出 Review 报告
```

调用方式：在 Claude Code 中输入 `/review`

### OpenCode

通过 YAML 配置多 Agent：

```yaml
# opencode.yaml
agents:
  default:
    model: claude-sonnet-4-6
    system_prompt: |
      [你的全局指令]
  reviewer:
    model: claude-sonnet-4-6
    system_prompt: |
      你是代码审查专家...
  refactor:
    model: claude-opus-4-6
    system_prompt: |
      你是重构专家...
```

按任务使用不同 Agent：

```bash
opencode run --agent reviewer "审查当前 PR"
opencode run --agent refactor "重构 UserService"
```

### Trae

```bash
# 项目配置
.trae/
  rules/
    general.md
    react.md
```

```markdown
<!-- .trae/rules/react.md -->
# React 规则
- 函数组件 + Hooks
- Props interface 定义
- Zustand 管状态
- TanStack Query 管服务端状态
```

## 推荐的多工具统一方案

### 项目结构

```
my-project/
├── agents.md             # 主配置（统一规范）
├── CLAUDE.md             # → 符号链接到 agents.md
├── .cursorrules          # → 符号链接到 agents.md
├── AGENTS.md             # → 符号链接到 agents.md
├── .cursor/
│   └── rules/
│       ├── typescript.mdc  # TS 专项（Cursor 加载）
│       ├── react.mdc       # React 专项
│       └── api.mdc         # API 专项
└── .claude/
    └── commands/
        └── review.md       # Claude Code 自定义命令
```

### 一键初始化脚本

```bash
#!/bin/bash
# setup-ai-config.sh

# 创建主配置
touch agents.md

# 创建符号链接
ln -sf agents.md CLAUDE.md
ln -sf agents.md .cursorrules
ln -sf agents.md AGENTS.md

# 创建 Cursor Rules 目录
mkdir -p .cursor/rules

# 创建 Claude Code 自定义命令目录
mkdir -p .claude/commands

echo "AI 配置初始化完成 ✅"
```

### 配置继承与分层

```
全局（~/.claude/CLAUDE.md）
  ↓ 个人偏好，跨项目生效（如：中文回复、函数式风格）
项目根（./agents.md）
  ↓ 团队规范，共享给所有人
工具特定（./.cursor/rules/*.mdc）
  ↓ 工具加载的专项规则
目录级（./src/services/AGENTS.md）
  ↓ 局部约定，特定模块
```

## 配置最佳实践

| 原则 | 说明 |
|------|------|
| **一份主配置** | 写一份 `agents.md`，避免重复维护 |
| **符号链接** | 适配各工具的工具特定文件名 |
| **专项增强** | 工具支持多文件时，按主题拆分（TS、React、API） |
| **目录级覆盖** | 特定子目录需要额外约定时，添加 `AGENTS.md` |
| **纳入版本管理** | 把所有配置纳入 Git，PR Review 时检查 |
| **README 说明** | 在 README 中写明"本项目使用 AI Coding，AI 必须遵守 agents.md" |

## 调试配置

### Cursor

`Cmd+Shift+P → "Cursor: Show Rules"` 查看当前激活的规则。

### Claude Code

```bash
# 启动时显示
> Reading CLAUDE.md (47 lines)...

# 调试模式
> /debug
```

### 通用方法：实测 AI 是否遵守

1. 提出一个违反规则的任务（如 "用 any 类型"）
2. 看 AI 是否主动纠正
3. 如果不遵守，回到配置层加约束

## 常见问题

**Q：为什么不让每个工具读自己的文件？**
A：会导致同一规范维护多份，容易漂移。通过符号链接统一到 `agents.md`。

**Q：Cursor 的 `.cursor/rules/` 和 `.cursorrules` 哪个好？**
A：`.cursor/rules/` 更强大，支持 globs 按需加载。`.cursorrules` 是旧版，仍可用但不推荐。

**Q：怎么知道 AI 加载了哪些规则？**
A：Cursor 用 `Show Rules` 命令；Claude Code 启动时会打印；OpenCode 通过日志查看。

下一节：[Prompt 工程](/context/prompt-engineering) — 写出 AI 能精确执行的指令。
