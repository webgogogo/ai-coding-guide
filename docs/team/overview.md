# 团队协作与流程：总览
AI Coding 不是个人工具，而是**团队工程实践**。

## 为什么团队流程重要
没有团队流程的 AI Coding：

```
开发者 A：用 Cursor，agents.md 写得很好
开发者 B：用 Trae，agents.md 没写
开发者 C：用 Claude Code，不看规范
        ↓
代码风格混乱
Review 困难
知识无法共享
```

有团队流程的 AI Coding：

```
统一 agents.md
   ↓
统一规范（命名、Commit、PR）
   ↓
统一质量门（lint、test、CI）
   ↓
共享知识库
   ↓
团队效率最大化
```

## 四大核心流程
| 流程 | 作用 | 工具 |
| --- | --- | --- |
| **[Git 工作流](/team/git-workflow)**| 分支策略、版本管理 | Git / GitHub |
| **[PR 与 Review](/team/pr-review)**| 代码审查、合并控制 | GitHub PR / Cursor Review |
| **[团队上手](/team/onboarding)**| 新人融入 AI Coding | 培训 / 文档 |
| **[知识沉淀](/team/knowledge-base)**| Prompt、经验、模板 | 内部 Wiki |

## AI Coding 协作模型（按规模分层）

### 2-5 人小团队
```
- 1 个 Lead + 几个开发者
- 工具：Cursor / Trae Solo
- 流程：简化版（PR Review + 共享 agents.md）
- 知识：每周分享会
```

### 5-20 人中型团队
```
- 1-2 个 Lead + 多个开发者
- 工具：Cursor + Claude Code 分层使用
- 流程：完整版（Git Flow + PR + CI）
- 知识：内部 Wiki + 模板库
```

## 团队 AI Coding 的核心原则

### 1. 工具统一
```markdown

## 团队 AI 工具规范

### 推荐工具
- IDE：Cursor Pro / Trae Solo 付费版
- CLI：Claude Code
- 不推荐：Copilot / 其他 IDE 工具（除非特殊情况）

### 工具切换
- 试用新工具需 Lead 批准
- 切换前需培训团队
```

### 2. 规范统一
```markdown

## 必须遵守
- 所有项目都有 agents.md
- agents.md 纳入 Git 管理
- 变更需 PR Review
- 个人私有不一致配置
```

### 3. 流程统一
```markdown

## PR 流程
1. 创建 feature 分支
2. 编码 + 测试
3. 跑 CI（lint + typecheck + test）
4. 提交 PR
5. 至少 1 个 Reviewer
6. 通过后合并
```

### 4. 知识共享
```markdown

## 知识管理
- 内部 Wiki 记录最佳实践
- 每周分享 AI Coding 经验
- Prompt 模板集中管理
- 失败案例也要记录
```

## 本章导览
| 章节 | 核心内容 |
| --- | --- |
| [Git 工作流](/team/git-workflow) | 分支策略、Commit 规范、AI 适配 |
| [PR 与 Review](/team/pr-review) | 团队级代码审查 |
| [团队上手](/team/onboarding) | 新人融入、培训 |
| [知识沉淀](/team/knowledge-base) | Prompt、模板、案例库 |

## 团队 AI Coding 成熟度模型

### Level 1：各自为战
```
- 个人用 AI Coding
- 没有团队规范
- 效率提升有限
```

### Level 2：工具统一
```
- 统一 AI 工具
- 共享 agents.md
- 初级协作
```

### Level 3：流程成熟
```
- 完整 Git 流程
- PR Review 规范
- 知识沉淀
- 高效协作
```

### Level 4：数据驱动
```
- 度量效率提升
- 持续优化
- 规模化推广
```

**目标**：所有规模团队至少做到 Level 3，大型团队追求 Level 4。

## 团队常见痛点
| 痛点 | 解法 |
| --- | --- |
| 规范不统一 | 强制 agents.md + 培训 |
| Review 慢 | AI 辅助 Review + 明确规则 |
| 新人不会用 | 标准化上手流程 |
| 经验不沉淀 | 内部 Wiki + 周会分享 |
| 工具碎片化 | 工具统一规范 |
| 质量参差 | 自动化质量门 |

## 总结
> 团队 AI Coding = 工具 × 规范 × 流程 × 文化。

下一节：[Git 工作流](/team/git-workflow)