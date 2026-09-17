# 三种模式实战对比总结
通过 Task Dashboard 项目，我们走完了 Vibe / Plan / Spec 三种模式。本节做系统对比。

## 项目全景
```
Task Dashboard 项目（7 天）
├── Day 1：Vibe Coding（拖拽库选型）
├── Day 2-3：Plan Coding（任务列表）
├── Day 4-5：Spec Coding（看板模块）
├── Day 6：整合 + 优化
└── Day 7：测试 + 上线
```

## 三模式对比

### 核心差异
| 维度 | Vibe Coding | Plan Coding | Spec Coding |
| --- | --- | --- | --- |
| **目标**| 验证 | 实现 | 实现 + 协作 |
| **范围**| 30 分钟 demo | 1-2 天功能 | 1-2 周模块 |
| **产出**| 简单 demo | 生产代码 | 关键模块 |
| **规范**| 无 | 简单方案 | 完整文档 |
| **参与**| 个人 | 个人/小组 | 多人协作 |
| **代码量**| < 200 行 | 200-1000 行 | 1000+ 行 |
| **测试**| 无 | 部分 | 充分 |
| **文档**| 无 | 简要 | 完整 |

### 实际产出对比
```markdown

## Vibe Coding 产出（30 分钟）

### 代码
- src/demo/DndDemo.tsx（30 行）

### 文档
- 无

### 决策
- 选定 @dnd-kit/core

### 收获
- 验证技术可行性
- 识别潜在问题
```

```markdown

## Plan Coding 产出（2 天）

### 代码
- src/types/task.ts
- src/services/task.ts
- src/hooks/useTaskList.ts
- src/hooks/useTaskMutation.ts
- src/components/TaskList/* (5 文件)
- src/components/TaskForm/*
- src/pages/TaskListPage.tsx
- 总计：~800 行

### 文档
- .claude/plans/task-list.md

### 测试
- 单元测试覆盖 85%

### 提交
- 6 个 commit
```

```markdown

## Spec Coding 产出（2 周）

### 代码
- src/components/Kanban/* (8 文件)
- src/hooks/useKanbanMutations.ts
- src/pages/KanbanPage.tsx
- 总计：~1500 行

### 文档
- specs/kanban-module.md（完整规范）
- README 更新
- 组件 API 文档

### 测试
- 单元测试覆盖 85%
- E2E 测试（Playwright）
- 性能测试

### 提交
- 16 个 commit
- 8 个 PR
```

## 质量对比
| 维度 | Vibe | Plan | Spec |
| --- | --- | --- | --- |
| **代码质量**||  ||
| **可维护性**||  ||
| **可测试性**||  ||
| **可访问性**||  ||
| **性能**||  ||
| **安全性**||  ||

## 成本对比
>  **以下为案例演示数据**（基于虚构 Task Dashboard 项目），用于对比三种编码模式的相对成本结构，**非真实生产数据**。

| 维度 | Vibe | Plan | Spec |
| --- | --- | --- | --- |
| **Token 消耗**| 5K | 100K | 500K |
| **API 成本**| $0.10 | $2 | $10 |
| **人工时间**| 30 分钟 | 8 小时 | 30 小时 |
| **总成本**| 极低 | 中 | 高 |

## 适用场景对比

### Vibe Coding 适合
```markdown
 适合
- 技术调研
- POC 原型
- 学习新东西
- 快速验证想法
- 找最优解的"探索"

 不适合
- 生产代码
- 长期维护
- 多人协作
```

### Plan Coding 适合
```markdown
 适合
- 日常功能开发
- Bug 修复
- 中等重构
- 个人开发
- 短期项目

 不适合
- 关键模块
- 长期项目
- 多人协作
```

### Spec Coding 适合
```markdown
 适合
- 大型新功能
- 关键模块
- 多人协作
- 长期项目
- 合规要求

 不适合
- 小任务
- 紧急修复
- 探索性任务
```

## 关键经验总结

### 1. 不要只用一种模式
```markdown
实际项目需要混合使用：

 Vibe Coding → 探索技术选型
 Plan Coding → 实现日常功能
 Spec Coding → 实现关键模块
```

### 2. 模式可以切换
```markdown
Vibe Coding 验证后 → Plan Coding 实现
Plan Coding 发现复杂度 → Spec Coding 重写
Spec Coding 中遇到细节 → Vibe Coding 探索
```

### 3. 选择基于场景
```markdown
按以下因素选模式：
- 任务复杂度
- 时间预算
- 团队规模
- 风险等级
- 维护周期
```

### 4. AI Coding 让模式选择更重要
```markdown
AI 让 Plan Coding 提速 → Spec Coding 也变快
但 Vibe Coding 仍是探索利器

选择对的模式 = 更高的 ROI
```

## 数据回顾

### Task Dashboard 项目数据
```markdown

## 整体项目

### 代码
- 总代码：~5000 行
- AI 生成：~70%
- 人工修改：~30%

### 时间
- 7 天（vs 传统 14-21 天）
- 节省：50-66%（案例演示数据）

### 质量
- 测试覆盖：82%
- 生产 Bug：2 个（低）
- 团队满意度：

### 成本
- Token 消耗：~2M
- API 成本：~$50
- 工具订阅：~$60/人/月
- ROI：~5x
```

## 实战建议

### 对个人开发者
```markdown

## 时间分配建议

### 70% Plan Coding
- 日常开发的主力

### 20% Vibe Coding
- 技术调研、学习

### 10% Spec Coding
- 大型新功能（偶尔）
```

### 对所有规模团队
```markdown

## 时间分配建议

### 50% Plan Coding
- 大多数功能开发

### 40% Spec Coding
- 关键模块、协作功能

### 10% Vibe Coding
- 调研、试点
```

## 决策流程
```
接到任务
  ↓
问自己：
- 任务有多大？
- 谁会用？
- 多久要维护？
- 风险多高？
  ↓
按 [决策树](/modes/decision-tree) 选择模式
  ↓
执行
  ↓
根据反馈调整
```

## 写在最后
> 三种模式不是互相替代，而是**互补的工具**。

- Vibe Coding 探索未知
- Plan Coding 实现日常
- Spec Coding 守护关键

**用对模式 = 用好 AI Coding**---

 **恭喜！你已经完成整个指南的学习。**回到 [首页](/) 探索更多内容。