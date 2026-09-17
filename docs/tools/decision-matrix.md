# 工具决策矩阵（2026 版）
本节用一个综合矩阵帮你**快速决策**：根据团队情况，应该选哪个/哪几个工具，以及**用什么模型**。

> 数据基准：2026 年 8 月的模型与工具能力。Claude Sonnet 4.6 与 Opus 4.6 在 SWE-bench Verified 上仅差 1.2 个百分点（79.6% vs 80.8%），这一变化让"Opus 才配写代码"的旧经验过时——日常任务全面可下沉到 Sonnet 4.6。

## 决策维度
6 个核心问题：

1. **数据合规**：代码能否出境？
2. **预算**：每月愿意花多少钱？
3. **任务类型**：日常 CRUD 还是大型重构？
4. **中文需求**：是否需要中文 UI？
5. **团队规模**：从 2 人到 200+ 人，不同规模适配不同组合
6. **风险偏好**：能否接受单厂商账号封禁风险？

## 矩阵一：按数据合规
| 合规要求 | 推荐工具 | 推荐模型 | 理由 |
| --- | --- | --- | --- |
| **可出境**| Cursor + Claude Code | Sonnet 4.6（日常）+ Opus 4.6/5（复杂） | 体验最好 |
| **谨慎出境**| Cursor + Claude Code（标准协议网关） | Sonnet 4.6 + DeepSeek V3.2 备份 | 混合策略 + 备用链路 |
| **禁止出境**| OpenCode + 本地模型（GLM-5 / Qwen3.5 397B / DeepSeek V3.2） | GLM-5（77.8%，接近 Opus）或 Qwen3.5 397B | 零泄露 |

> **2026 新趋势**：账号封禁风险常态化（如 Anthropic 一次性封禁 60+ 账号事件），"谨慎出境"档位强烈建议同时配置跨厂商备份。

## 矩阵二：按预算
| 月预算（人均） | 推荐方案 | 模型组合 | 适合 |
| --- | --- | --- | --- |
| **0 元**| Trae Solo（免费）+ OpenCode | 国产免费模型 | 学生/个人试水 |
| **< ¥100**| Trae Solo 付费版 | Doubao / Kimi K2.5 | 国内小团队 |
| **¥100-200**| Cursor Pro | Sonnet 4.6 主力 | 海外个人开发者 |
| **¥200-400**| Cursor Pro + Claude Code API | Sonnet 4.6 (80%) + DeepSeek V3.2 (20%) | 海外进阶 |
| **¥400-700**| Cursor Business + Claude Code Max | Sonnet 4.6 + Opus 4.6/5 切换 | 海外团队 |
| **¥700+**| Cursor Business + Claude Code Max + 自建多模型 | 全模型池 | 重度生产系统 |

> **降本技巧**：日常 80% 任务用 Sonnet 4.6，仅复杂任务切 Opus 4.6/5，可比"全 Opus"省 5x 成本。

## 矩阵三：按任务类型
| 主要任务 | 主力工具 | 主力模型 | 辅助工具 |
| --- | --- | --- | --- |
| **日常组件开发**| Cursor | Sonnet 4.6 + Cursor Composer 2.5 | — |
| **Tab 补全 / 内联编辑**| Cursor | Composer 2.5（自研） | — |
| **Bug 排查**| Claude Code | Opus 4.6 / 5 | Cursor |
| **大型重构（多文件）**| Claude Code（Agent Teams） | Opus 4.6 / 5 | Cursor |
| **依赖升级**| Claude Code | Sonnet 4.6 | OpenCode |
| **脚本自动化**| OpenCode / Claude Code | DeepSeek V3.2 | — |
| **代码审查**| Claude Code | Sonnet 4.6 | Cursor |
| **架构探索**| Cursor（Composer） | Opus 4.6 | — |
| **大型代码库分析**| Claude Code（1M 上下文） | Claude Opus 5 / Gemini 3.1 Pro | Cursor |
| **批量异步任务**| Codex | GPT-5.4 | — |
| **看图写前端**| Cursor / Trae | Kimi K2.5 / Claude Opus | — |
| **中文文档/注释生成**| Cursor 自定义模型 | DeepSeek V3.2 / Kimi K2.5 | — |

## 矩阵四：按团队规模

### 2-5 人小团队
**方案 A（推荐 · 性价比）**：Trae Solo 全员 + 偶尔 Claude Code
- 预算：¥0-100/月/人
- 模型：Doubao / Kimi K2.5 主力
- 上手成本：低

**方案 B（推荐 · 海外）**：Cursor Pro 全员 + DeepSeek V3.2 备用
- 预算：$25-30/月/人
- 模型：Sonnet 4.6（90%）+ DeepSeek V3.2（10%）
- 上手成本：低

**方案 C（合规优先）**：OpenCode + 本地模型（GLM-5 / Qwen3.5 397B）
- 预算：硬件成本（一次性）
- 上手成本：中

### 5-20 人中型团队
**方案 A（推荐 · 黄金组合）**：Cursor Business + Claude Code + 多模型 API
- 预算：$120/月/人
- 模型池：Sonnet 4.6 (80%) + Opus 4.6 (10%) + DeepSeek V3.2 (10%)
- 配套：统一 Privacy Mode + CLAUDE.md + 跨厂商备份

**方案 B（国产化）**：Trae Solo 付费 + Claude Code + 国产模型
- 预算：¥200-400/月/人
- 模型：Kimi K2.5 / GLM-5 / DeepSeek V3.2
- 配套：中文规范文档

**方案 C（分层使用）**：
- 70% 成员用 Cursor/Trae（日常）
- 30% 技术骨干用 Claude Code + Opus 4.6（复杂任务）

### 20+ 人生产级团队
**完整方案**：Cursor Business + Claude Code Max + Codex（异步批量）+ 标准协议网关
- 预算：$200+/月/人
- 模型池：Sonnet 4.6 / Opus 4.6 / Opus 5 / DeepSeek V3.2 / Gemini 3.1 Pro
- 配套：Agent Teams + 1M 上下文 + 内部 Skills 库 + 标准协议中转（避免跨境网络抖动）

## 实战决策流程图（2026 版）
```
开始
  │
  ├─ 数据能否出境？
  │   ├─ 否 → OpenCode + 本地模型（GLM-5 / Qwen3.5 397B）
  │   └─ 是 ↓
  │
  ├─ 主要任务类型？
  │   ├─ 日常开发为主 → IDE 工具
  │   │   ├─ 中文项目 → Trae Solo
  │   │   ├─ 海外项目 → Cursor（Composer 2.5 + Sonnet 4.6）
  │   │   └─ 强合规 → Cursor + 本地备用
  │   │
  │   └─ 复杂任务为主 → CLI 工具
  │       ├─ 顶级质量 → Claude Code（Opus 4.6/5 + Agent Teams）
  │       └─ 灵活配置 → OpenCode
  │
  ├─ 任务复杂度？
  │   ├─ 中小型（≤20 文件改动） → Cursor Agent / Sonnet 4.6
  │   └─ 大型（20+ 文件 / 整库） → Claude Code / Opus 4.6 + 1M 上下文
  │
  └─ 是否组合使用？
      ├─ 是 → IDE（日常）+ CLI（复杂）← **强烈推荐**└─ 否 → 单一工具
```

## 全规模团队的最终推荐

### 首选方案：Cursor + Claude Code（海外主流）
```
日常：Cursor Pro（$20/月，Sonnet 4.6 + Composer 2.5）
复杂任务：Claude Code（按 Token，约 $30-50/月，Sonnet 4.6 主力，Opus 4.6 升级）
备份：DeepSeek V3.2 API（约 $5/月，按量）
合计：$55-75/月/人
```

**适用**：海外业务、不介意数据出境、追求最强体验
**2026 调整**：默认全部走 Sonnet 4.6，仅架构决策/复杂 Bug 才切 Opus 4.6/5

### 国产方案：Trae Solo + Claude Code + 国产模型
```
日常：Trae Solo 付费版（约 ¥100/月）
复杂任务：Claude Code（约 ¥200-300/月）
国产化备份：DeepSeek V3.2 / Kimi K2.5（按量，约 ¥50/月）
合计：¥350-450/月/人
```

**适用**：国内业务、追求性价比、需要中文、规避单厂商风险

### 合规方案：OpenCode + GLM-5 本地部署
```
OpenCode：免费
本地模型：GLM-5（77.8%，接近 Opus 4.6）或 Qwen3.5 397B
合计：¥0/月/人（但需前期硬件投入，A100/H100 级别）
```

**适用**：金融、政企、医疗等强合规场景

### 入门方案：纯 Trae Solo 免费版
```
0 元
适合：刚起步、小规模试水
局限：复杂任务能力有限，建议半年内升级
```

## 决策时常见的坑

### 坑 1：追求"全都要"
同时订阅 Cursor、Claude Code、Copilot、Tabnine，结果每个都不深入用。

**建议**：先用好 1-2 个工具，比浅尝 5 个强。

### 坑 2：只选贵的
直接上 Cursor Business + Claude Code Max + 全 Opus，结果发现团队不会用。

**建议**：先从免费/低价版开始，跑通流程后再升级。

### 坑 3：忽略数据合规
用 Cursor 处理含敏感数据的代码，事后被合规审查。

**建议**：选型前先和法务/合规团队对齐。

### 坑 4：单厂商锁定（2026 新增坑）
把所有代码、skills、上下文都押在单一厂商，账号被封后全部归零。

**建议**：跨厂商组合（Claude + DeepSeek + Gemini），核心项目同时配置本地模型备用。

### 坑 5：忽略模型分层
不管什么任务都用 Opus，结果月度账单爆表。

**建议**：默认 Sonnet 4.6，仅关键任务切 Opus 4.6/5；日常批量用 DeepSeek V3.2 节省 5-10x。

### 坑 6：工具频繁切换
每两周换一个新工具，团队疲于学习。

**建议**：选定后至少稳定使用 3 个月再评估。

### 坑 7：没有统一规范
每个人用不同的工具和配置，Prompt 模板互不共享。

**建议**：建立团队级 [agents.md](/context/agents) 模板。

## 选型后的下一步
1.  写好团队级 [agents.md](/context/agents) / CLAUDE.md
2. **明确默认模型**：默认 Sonnet 4.6，何时升 Opus、何时用 DeepSeek 写清楚
3.  组织 1-2 次内部培训（含"模型分层"与"跨厂商备份"）
4.  选定 2-3 个试点项目
5.  1 个月后评估效果（详见 [效率度量](/metrics/efficiency)）
6.  3 个月后决定是否升级或调整

- --

到这里，「技术选型」章节结束。

下一章：[上下文工程](/context/overview) — 学会如何让 AI 真正"懂"你的项目。