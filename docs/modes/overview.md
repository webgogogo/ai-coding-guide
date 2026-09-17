# 三种编码模式：总览与对比

## 为什么需要"模式"
用 AI 写代码 ≠ 直接让 AI 写代码。

**怎么用**比 **用什么工具**更重要。基于实践总结，AI Coding 分为三种核心模式：

| 模式 | 一句话 | 适用 |
| --- | --- | --- |
| **[Vibe Coding](/modes/vibe-coding)**| 凭感觉，与 AI 即兴对话 | 探索、原型、学习 |
| **[Plan Coding](/modes/plan-coding)**| 先规划，再编码 | 日常开发、复杂任务 |
| **[Spec Coding](/modes/spec-coding)**| 写规范，再实现 | 团队协作、大型项目 |

## 三大模式速览

### Vibe Coding（氛围编码）
```
"我想做个用户列表，你先随便写写看，我看看效果"
```

**特征**：
- **即兴、探索性**
- **对话式推进**
- **目标是验证想法**
- **短周期、低承诺**

**典型场景**：
- 技术调研
- POC 原型
- 学习新框架
- 灵感验证

**优势**：快、自由、易上手
**劣势**：难复用、质量不稳定、难以协作

### Plan Coding（规划编码）
```
"先告诉我怎么做，方案 OK 再写代码"
```

**特征**：
- **结构化、有计划**
- **先方案后实施**
- **目标是控制质量**
- **中等周期**

**典型场景**：
- 日常功能开发
- 中等复杂度任务
- Bug 修复
- 代码重构

**优势**：可控、可验证、易调试
**劣势**：前期投入大、需要经验

### Spec Coding（规范编码）
```
"先写规范文档（需求 + 设计 + 验收），AI 按规范实现"
```

**特征**：
- **文档驱动**
- **多人协作**
- **目标是可复制、可审计**
- **长周期**

**典型场景**：
- 大型新功能
- 团队协作项目
- 关键业务模块
- 需要长期维护的代码

**优势**：可复用、可追溯、团队一致
**劣势**：前期投入大、需要规范维护

## 三模式对比矩阵
| 维度 | Vibe Coding | Plan Coding | Spec Coding |
| --- | --- | --- | --- |
| **前置投入**| 极低 | 中 | 高 |
| **代码质量**| 不稳定 | 可控 | 高 |
| **可控性**| 低 | 高 | 最高 |
| **协作性**| 不适合 | 适合小团队 | 适合大团队 |
| **学习价值**| 高（边聊边学） | 中（学方案设计） | 低（按规范执行） |
| **速度**| 最快 | 中等 | 慢（前期投入大） |
| **可复用**| 低 | 中 | 高 |
| **适合阶段**| 探索 | 开发 | 长期维护 |

## 模式选择决策
```
你的任务是？
├── 不确定 / 探索 → Vibe Coding
├── 明确但有变数 → Plan Coding
└── 明确且要长期维护 → Spec Coding

你的角色是？
├── 个人 / 学习者 → Vibe Coding
├── 主力开发者 → Plan Coding
└── 架构师 / Lead → Spec Coding
```

详细决策树：[模式选择决策树](/modes/decision-tree)

## 模式可以组合使用
实际项目中，**三种模式往往配合使用**：

```
阶段 1：Vibe Coding - 技术调研
        ↓ 选定方案
阶段 2：Spec Coding - 写规范
        ↓ 拆任务
阶段 3：Plan Coding - 逐个实现
        ↓ 集成
阶段 4：Vibe Coding - 微调优化
```

## 各模式的代表工具

| 模式 | 适合的工具 | 原生命令 |
| --- | --- | --- |
| **Vibe Coding** | Cursor（Inline + Chat）、ChatGPT、Claude.ai | — |
| **Plan Coding** | **Trae Solo**（`/plan`）、Claude Code（Plan Mode）、Cursor Composer | `/plan` |
| **Spec Coding** | **Trae Solo**（`/spec`）、Claude Code（Agent Teams） | `/spec` |

## 各模式详细使用方式

每种模式的具体使用方法已拆分到对应页面，请按需查阅：

| 模式 | 使用方式 | 主推工具 | 原生命令 |
| --- | --- | --- | --- |
| **Vibe Coding** | [查看使用方式 →](/modes/vibe-coding#使用方式) | Cursor Chat | — |
| **Plan Coding** | [查看使用方式 →](/modes/plan-coding#使用方式) | Trae Solo | `/plan` |
| **Spec Coding** | [查看使用方式 →](/modes/spec-coding#使用方式) | Trae Solo | `/spec` |

### 使用方式速查对比

| 维度 | Vibe Coding | Plan Coding | Spec Coding |
| --- | --- | --- | --- |
| **主推工具** | Cursor Chat | Trae Solo `/plan` | Trae Solo `/spec` |
| **备选工具** | Trae Solo / Claude Code | Claude Code Plan / Cursor Composer | Claude Code Agent Teams / Cursor Composer |
| **启动方式** | Cmd+L 打开 Chat | 命令面板输 `/plan` | 命令面板输 `/spec` |
| **原生命令** | ❌ | ✓ `/plan` | ✓ `/spec` |
| **模型推荐** | 豆包 2.0 Pro / Sonnet 4.6 | Sonnet 4.6 | Kimi K2.5（256K）做规范 / Sonnet 4.6 实现 |
| **AI 自主度** | 高（你 review 方向） | 中（AI 出方案，你审） | 低（你写需求，AI 自动出规范） |
| **Review 重点** | 方向对不对 | 方案是否合理 | 规范是否符合预期 |
| **典型对话轮次** | 5-20 轮即兴 | 3-5 轮确认 | 1-2 轮（需求 → 规范） |
| **时间盒** | 30-60 分钟 | 1-2 天 | 1-2 周+ |
| **可中断性** | 高 | 中 | 低（需走变更流程） |

## 三种模式的核心差异

### 心智模型不同
| 模式 | 心智模型 |
| --- | --- |
| **Vibe Coding**| AI 是"伙伴"，一起摸索 |
| **Plan Coding**| AI 是"工程师"，按方案执行 |
| **Spec Coding**| AI 是"承包商"，按合同交付 |

### Prompt 风格不同
| 模式 | Prompt 风格 |
| --- | --- |
| **Vibe Coding**| "我想做 X，试试看" |
| **Plan Coding**| "目标是 X，约束是 Y，先出方案" |
| **Spec Coding**| "规范文档：1. 需求 2. 设计 3. 验收，请实现" |

### Review 重点不同
| 模式 | Review 重点 |
| --- | --- |
| **Vibe Coding**| 方向对不对 |
| **Plan Coding**| 方案是否合理、实现是否正确 |
| **Spec Coding**| 是否符合规范、验收标准是否达成 |

## 实际应用
>  **以下占比为经验估算**，应根据团队规模、任务类型、技术栈灵活调整。

### 个人开发者
```
70% Plan Coding + 20% Vibe Coding + 10% Spec Coding
```

### 团队开发
```
50% Plan Coding + 40% Spec Coding + 10% Vibe Coding
```

### 大型企业
```
80% Spec Coding + 20% Plan Coding
```

## 本章导览
| 章节 | 核心内容 |
| --- | --- |
| [Vibe Coding](/modes/vibe-coding) | 探索式编码的实战方法 |
| [Plan Coding](/modes/plan-coding) | 先规划后实施的完整流程 |
| [Spec Coding](/modes/spec-coding) | 文档驱动的工程化实践 |
| [决策树](/modes/decision-tree) | 何时用哪种模式 |

下一节：[Vibe Coding 详解](/modes/vibe-coding)