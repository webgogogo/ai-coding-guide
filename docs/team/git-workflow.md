# Git 工作流

## AI Coding 时代的 Git 挑战
AI Coding 给 Git 工作流带来新挑战：

- **提交频率高**：AI 让单次任务产出更多代码
- **AI 生成 commit message**：如何规范？
- **分支多**：多人并发，合并冲突多
- **依赖变更**：AI 可能引入新依赖

## 分支策略

### 推荐的 Git Flow（覆盖各规模团队）
```
main (生产)
  │
  ├── develop (开发主线)
  │     │
  │     ├── feature/user-list (功能)
  │     ├── feature/order-form
  │     └── fix/login-bug
  │
  └── hotfix/emergency-fix (紧急修复)
```

### 简化版（5 人以下团队）
```
main
  │
  ├── feature/*
  └── fix/*
```

直接 feature → main，PR 合并。

### 分支命名规范
```bash

# 功能开发
feature/user-management
feature/order-system
feature/payment-integration

# Bug 修复
fix/login-redirect-bug
fix/api-timeout

# 重构
refactor/component-structure

# AI 相关实验（可选）
ai-experiment/new-prompt

# 紧急修复
hotfix/prod-down
```

## Commit 规范

### Conventional Commits
```bash
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型
| Type | 说明 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试 |
| `chore` | 构建/工具/依赖 |

### Scope（作用域）
```bash
feat(user): add user list component
fix(login): fix redirect after login
docs(readme): update setup instructions
style(eslint): fix lint errors
refactor(components): split UserCard
perf(api): add request cache
test(user): add user list tests
chore(deps): upgrade react to 18
```

### Subject 规范
```bash
 好的：
feat(user): add user list with search and pagination

 不好的：
feat: add code
update stuff
fix bug
```

### 示例
```bash
git commit -m "feat(user): add user list component with CRUD

- Implement user list with TanStack Query
- Add search, pagination, sorting
- Support create/edit/delete operations
- Add unit tests (coverage: 85%)

Closes #123"
```

## AI 生成的 Commit Message

### 问题
AI 经常生成这样的 commit：

```bash
 "update files"
 "fix issue"
 "add new feature"
```

### 解法

#### 1. 写好 agents.md
```markdown

## Commit 规范
- 遵循 Conventional Commits
- Type: feat/fix/docs/style/refactor/perf/test/chore
- Scope: 模块名
- Subject: 中文/英文描述，长度 < 50 字
- Body: 详细说明改动
- 不要 "update"、"fix issue" 这类无意义描述
```

#### 2. 用工具规范
```bash

# commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional

# .commitlintrc.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore']],
    'subject-max-length': [2, 'always', 50],
  },
}
```

#### 3. 手动规范
写 commit 时人工调整，不要直接用 AI 生成的。

#### 4. 用 commitizen 交互式提交
```bash
pnpm add -D commitizen cz-conventional-changelog

# package.json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}

# 用法
pnpm commit

# 交互式选择 type、scope、subject
```

## AI 时代的分支策略调整

### 1. 短生命周期分支
```bash

# 推荐
feature/user-list  # 1-3 天合并

# 避免
feature/big-refactor  # 2 周后还在
```

### 2. 频繁提交
```bash

# AI 生成大量代码时，分多次提交
git add src/types/user.ts
git commit -m "feat(user): add user type definitions"

git add src/services/user.ts
git commit -m "feat(user): add user API service"

git add src/components/UserList/
git commit -m "feat(user): add user list component"
```

**好处**：
- 每个 commit 可独立回滚
- Code Review 更容易
- 冲突更少

### 3. 减少"巨型 PR"
```bash

# 一个 PR 改 50 个文件

# 拆分成多个小 PR
```

### 4. WIP 分支
```bash

# AI 探索阶段用 WIP 分支
git checkout -b ai-experiment/new-approach

# ...探索

# 觉得行就合并，否则丢弃
```

## PR 与分支配合

### 一个 Feature 一个 PR
```bash

# 推荐
feature/user-list → PR #123 → 合并

# 避免
main ← feature/everything（包含多个功能）
```

### AI 生成的代码也要 PR
```bash

# 即便是 AI 生成的代码，也要走完整 PR 流程
```

## 依赖管理

### AI 引入新依赖
AI 经常建议引入新依赖。**必须谨慎**：

```bash

# AI 可能推荐
pnpm add some-popular-package

# 先问：

# 1. 为什么需要这个包？

# 2. 项目里有没有类似的？

# 3. 包的安全、维护情况？

# 4. License 是否兼容？
```

### 依赖锁定
```bash

# 必须
pnpm-lock.yaml  # pnpm
package-lock.json  # npm
yarn.lock  # yarn
```

### 依赖更新 PR
```bash

# 用 Dependabot / Renovate 自动更新

# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Git Hooks（自动化）

### pre-commit
```bash

# .husky/pre-commit
pnpm lint-staged
```

```jsonc
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{ts,tsx,json,md}": [
      "prettier --write"
    ]
  }
}
```

### commit-msg
```bash

# .husky/commit-msg
pnpm commitlint --edit $1
```

### pre-push
```bash

# .husky/pre-push
pnpm typecheck
pnpm test
```

## 标签与版本

### SemVer
```bash

# 主版本：不兼容的 API 变更
v2.0.0

# 次版本：向下兼容的功能
v1.1.0

# 修订版本：向下兼容的 Bug 修复
v1.0.1
```

### 打标签
```bash
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin v1.2.0
```

### AI Coding 的版本建议
```bash

# 频繁发布小版本
v1.0.0 → v1.0.1 → v1.0.2 → v1.1.0

# 每个 AI 生成的 feature 一个版本
```

## 合并策略

### Squash Merge（推荐用于 feature 分支）
```bash

# 把多个 commit 合并成一个
git merge --squash feature/user-list
```

**适合**：
- feature 分支
- commit 多且杂

### Merge Commit
```bash
git merge --no-ff feature/user-list
```

**适合**：
- 长期分支
- 需要保留历史

### Rebase
```bash
git rebase main
```

**适合**：
- 整理自己的 commit
- 不要在共享分支上 rebase

## 实战：完整的 Git 工作流

### 第 1 步：创建分支
```bash
git checkout main
git pull
git checkout -b feature/user-management
```

### 第 2 步：用 AI 开发
```bash

# Cursor / Claude Code 中开发

# 参考 agents.md
```

### 第 3 步：分阶段提交
```bash

# 类型定义
git add src/types/user.ts
git commit -m "feat(user): add type definitions"

# API 服务
git add src/services/user.ts
git commit -m "feat(user): add user API service"

# 组件
git add src/components/UserList/
git commit -m "feat(user): add user list component"

# 测试
git add src/components/UserList/*.test.tsx
git commit -m "test(user): add user list tests"

# 文档
git add docs/user-management.md
git commit -m "docs(user): add user management docs"
```

### 第 4 步：推送 & PR
```bash
git push origin feature/user-management

# 在 GitHub 创建 PR
```

### 第 5 步：Review & 合并
```bash

# Reviewer 检查

# 通过后 Squash Merge
git checkout main
git merge --squash feature/user-management
git commit -m "feat(user): add user management module (#123)"
```

## AI Coding 的 Git 反模式

### 反模式 1：一个巨型 commit
```bash
git commit -m "feat: add everything"
```

### 反模式 2：直接 commit 到 main
```bash
git checkout main

# 直接改代码
git commit -m "fix"
```

### 反模式 3：无意义的 commit message
```bash
git commit -m "update"
git commit -m "fix bug"
git commit -m "wip"
```

### 反模式 4：长期不合并的分支
```bash

# feature 分支活了 1 个月

# 与 main 严重脱节
```

### 反模式 5：忽略 .gitignore
```bash

# 提交了 node_modules、.env、dist
```

## 总结
AI Coding 让 Git 工作流**更重要**：

- 规范化分支和 commit
- 频繁小提交
- 自动化 Git Hooks
- 不要"AI 写完就直接 commit"

下一节：[PR 与 Review](/team/pr-review)