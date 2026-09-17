# 知识沉淀：让团队经验可复用（2026 版）
> 2026 年的核心变化：模型生态从"单模型为主"变成"多模型协同"，知识沉淀也要相应升级——除了规范、模板、案例、战术，还要沉淀**模型路由策略**与**多模型协作流程**。

## 为什么知识沉淀重要
AI Coding 让单个开发者效率提升，但**团队的复利效应**来自于**知识沉淀**。

```
没有沉淀：
个人效率 ↑ 团队效率 = 个人总和（线性）

有沉淀：
个人效率 ↑ 团队效率 = 个人总和 × 复利（指数）
```

## 需要沉淀的 5 类知识（2026 升级）
| 类型 | 内容 | 形式 |
| --- | --- | --- |
| **规范类**| agents.md、最佳实践 | Markdown |
| **模板类**| Prompt 模板、代码模板 | 可复用文件 |
| **案例类**| 成功案例、失败案例 | Wiki / 文档 |
| **战术类**| 工具技巧、问题解决 | 速查表 |
| **模型策略类**| 模型路由表、多模型协作流程 | Markdown + 配置 |

## 0. 模型策略类知识（2026 新增）

### 模型路由表
每个团队应该维护一张"任务→模型"映射表，避免每个成员各自摸索：

```markdown

# 模型路由表（团队共享）
| 任务类型 | 默认模型 | 升级条件 | 备选模型 |
| --- | --- | --- | --- |
| 代码补全 | Cursor Composer 2.5 | — | DeepSeek V3.2 |
| 内联编辑 | Sonnet 4.6 | 复杂逻辑切 Opus 4.6 | GPT-5.4 |
| 日常开发 | Sonnet 4.6 | 大型重构切 Opus 4.6/5 | — |
| 架构设计 | Opus 4.6 | — | Opus 5（1M 上下文） |
| 代码审查 | Sonnet 4.6 | 安全审计切 Opus 4.6 | Gemini 3.5 Flash |
| 中文文档 | DeepSeek V3.2 | — | Kimi K2.5 |
| 看图写前端 | Kimi K2.5 | — | Opus 4.6 |
| 大型重构 | Opus 4.6 | >50 文件切 Opus 5 + Agent Teams | — |
| Bug 排查 | Sonnet 4.6 | 复杂 Bug 切 Opus 4.6 | — |
| 测试生成 | Sonnet 4.6 | — | DeepSeek V3.2 |
```

### 跨厂商备份清单
```markdown

# 跨厂商备份（避免单厂商锁定）
| 主用 | 备用 | 触发切换条件 |
| --- | --- | --- |
| Claude Sonnet/Opus | DeepSeek V3.2 | 账号封禁 / 跨境网络故障 |
| Cursor | Trae Solo / OpenCode | 服务不可用 |
| OpenAI Codex | 阿里云百炼 / 腾讯元宝 | 服务不可用 |
| Claude Code Agent Teams | OpenCode + GLM-5 | 账号封禁 |

# Skills 双向备份
关键 Skills 必须存到独立 Git 仓库，不依赖单一平台：
- .claude/skills/ → 同时存到 skills-shared/
- CLAUDE.md → 同时存到 docs/claude-md-template.md
- .cursorrules → 同时存到 docs/cursorrules-template.json
```

## 1. 规范类知识
| 类型 | 内容 | 形式 |
| --- | --- | --- |
| **规范类**| agents.md、最佳实践 | Markdown |
| **模板类**| Prompt 模板、代码模板 | 可复用文件 |
| **案例类**| 成功案例、失败案例 | Wiki / 文档 |
| **战术类**| 工具技巧、问题解决 | 速查表 |

## 1. 规范类知识

### 项目级规范
```bash
project/
├── agents.md           # AI Coding 规范
├── README.md           # 项目说明
├── ARCHITECTURE.md     # 架构文档
├── CONTRIBUTING.md     # 贡献指南
└── STYLE_GUIDE.md      # 代码风格
```

### 团队级规范
```markdown

# 内部 Wiki

## AI Coding 规范
- 工具选型与配置
- 通用 agents.md 模板
- 工作流程
- 安全合规要求
- 团队约定
```

## 2. 模板类知识

### Prompt 模板库
```bash
.claude/
  prompts/
    ├── README.md              # 模板说明
    ├── list-component.md      # 列表组件
    ├── form-component.md      # 表单组件
    ├── detail-page.md         # 详情页
    ├── api-service.md         # API 服务
    ├── unit-test.md           # 单元测试
    ├── fix-bug.md             # Bug 修复
    ├── code-review.md         # 代码审查
    ├── refactor.md            # 重构
    ├── upgrade-deps.md        # 依赖升级
    └── multi-model-pipeline.md #  多模型协作流水线
```

### 多模型角色分工 Prompt 模板（2026 新增）
```markdown

# 多模型协作流水线模板

# 适用：需要多视角产出的大型任务

## 阶段 1：架构方案（Opus 4.6）
工具：Cursor / Claude Code
Prompt:
> 你是系统架构师。基于以下需求输出架构方案：
> - 模块划分
> - 接口契约（JSON Schema）
> - 数据模型
> - 关键技术决策（含理由）
>
> 需求：[粘贴]
> 不要写实现代码，只给架构。

## 阶段 2：核心实现（Sonnet 4.6）
工具：Cursor Agent / Claude Code
Prompt:
> 你是主力开发。基于以下架构方案实现核心代码：
> [粘贴 JSON Schema 接口定义]
> 技术栈：[React 18 + TypeScript + ...]
> 输出：完整可运行的代码 + 单元测试

## 阶段 3：代码评审（Gemini 3.5 Flash）
工具：Cursor / Claude Code
Prompt:
> 你是代码评审专家。审查以下 diff：
> [粘贴 diff]
> 重点：
> - 命名规范统一性
> - 重复代码 / 冗余
> - 代码异味
> 输出：问题清单 + 修复建议

## 阶段 4：安全审计（Opus 4.6）
工具：Claude Code
Prompt:
> 你是安全审计专家。审查以下代码：
> [粘贴]
> 重点：SQL 注入 / XSS / 权限校验 / 敏感信息泄露
> 输出：风险点 + 防御代码

## 阶段 5：中文文档（DeepSeek V3.2）
工具：Cursor 自定义模型 / API
Prompt:
> 基于以下代码生成中文 API 文档：
> [粘贴代码]
> 要求：自然流畅，无翻译腔

# 关键约束
- 每个阶段必须经过门禁（人工 / 测试）才进入下一阶段
- 阶段间用结构化格式传递（JSON Schema / Diff），不传原始对话历史
- Sonnet 起步，Opus 仅在阶段 1 / 4 使用
```

### 代码模板
```bash
.templates/
├── component/
│   ├── Component.tsx
│   ├── Component.test.tsx
│   ├── index.ts
│   └── types.ts
├── service/
│   ├── service.ts
│   ├── service.test.ts
│   └── types.ts
└── page/
    ├── Page.tsx
    └── Page.test.tsx
```

### 配置文件模板
```bash
.templates/config/
├── .eslintrc.js
├── tsconfig.json
├── vite.config.ts
├── .prettierrc
└── agents.md
```

## 3. 案例类知识

### 成功案例库
```markdown

# 案例库

## 案例 1：AI 辅助迁移 React 17 → 18

### 背景
- 项目：XXX
- 规模：200+ 文件
- 挑战：避免 breaking change

### 方法
- Spec Coding 模式
- Claude Code 主导
- 分阶段迁移

### 结果
- 时间：3 天（手动需 2 周）
- Bug 数：5（其中 3 个在迁移中发现）
- 团队满意度：

### 关键 Prompt
[附上]
```

### 失败案例库
```markdown

# 失败案例

## 案例 1：过度依赖 AI 导致的性能问题

### 背景
- 项目：XXX
- 问题：列表页加载慢

### 根因
- AI 生成的组件缺少 memo
- 没考虑虚拟滚动
- 重复创建对象

### 教训
- AI 不擅长性能优化
- 必须人工 Review 性能
- 加性能测试

### 改进措施
- 在 agents.md 加入性能规则
- 添加性能 Review 清单
```

## 4. 战术类知识

### 工具速查表
```markdown

# Cursor 速查表

## 快捷键
- Cmd+K：Inline Edit
- Cmd+L：打开 Chat
- Cmd+I：Composer

## 常用命令
- @file：引用文件
- @codebase：引用代码库
- @docs：引用文档
```

### 常见问题速查
```markdown

# 常见问题

## Q：AI 生成的代码有 XSS 风险？
A：在 agents.md 中明确禁止 dangerouslySetInnerHTML，要求所有动态内容转义

## Q：AI 总是不写测试？
A：使用 /unit-test 模板，明确要求覆盖率

## Q：AI 理解不了项目结构？
A：完善 README 和 ARCHITECTURE.md
```

## 知识沉淀的载体

### 1. 内部 Wiki（推荐）
**工具选择**：
- Notion
- Confluence
- GitBook
- 飞书文档（国内）

**结构示例**：

```
AI Coding Wiki/
├── 入门
│   ├── 什么是 AI Coding
│   ├── 工具介绍
│   └── 7 天上手
├── 规范
│   ├── 团队 agents.md
│   ├── 工作流程
│   └── 工具配置
├── 模板
│   ├── Prompt 模板
│   ├── 代码模板
│   └── 配置模板
├── 案例
│   ├── 成功案例
│   └── 失败案例
└── FAQ
    ├── 工具问题
    ├── 工作流问题
    └── 最佳实践
```

### 2. 代码仓库
```bash

# ai-coding-resources/ 仓库
- README.md
- agents-templates/
- prompt-templates/
- code-templates/
- best-practices/
- lessons-learned/
```

### 3. 定期分享
```markdown

## 每周分享会议

### 议程
1. 本周 AI Coding 数据（使用率、效率提升）
2. 最佳实践分享（1-2 人）
3. 失败案例分享（1 个）
4. 新工具 / 新方法
5. 讨论 & Q&A

### 时长
30-45 分钟
```

## 知识沉淀的流程

### 沉淀时机
```markdown

## 什么时候沉淀

### 立即沉淀
- 遇到新问题并解决
- 发现 AI 的新玩法
- 完成大型任务

### 每周沉淀
- 每周分享
- 周报中的 AI Coding 经验

### 每月沉淀
- 月度复盘
- agents.md 更新

### 每季度沉淀
- 季度回顾
- 大型案例总结
```

### 沉淀的格式
```markdown

## 标准模板

### 标题
[任务名]：[简要描述]

### 背景
[为什么做这个]

### 方法
[具体做法]

### 结果
[产出、效果]

### 经验
[可复用的经验]

### 教训
[避免的坑]

### 参考
[相关链接]
```

## 知识沉淀的激励

### 团队层面
```markdown

## 激励措施

### 认可
- 月度最佳实践奖
- 案例库贡献者
- 分享达人

### 制度
- 知识沉淀纳入绩效
- 分享会强制参与
- agents.md 贡献者名单

### 文化
- 鼓励分享、不批评
- 失败案例也值得分享
- 持续改进
```

### 个人层面
```markdown

## 个人成长
- 沉淀 = 反思 = 成长
- 分享 = 影响 = 影响力
- 案例 = 履历 = 职业发展
```

## 知识沉淀的常见问题

### 问题 1：没时间沉淀
```markdown

## 解决
- 沉淀不需要大段时间
- 每次 5-10 分钟记录关键点
- 周末整理一次
- 用 AI 帮忙整理：
  > 帮我整理这周的 AI Coding 笔记
  > 输入：这周的对话记录
  > 输出：结构化笔记
```

### 问题 2：沉淀了没人看
```markdown

## 解决
- Wiki 主动推送
- 周会强制分享
- 关联到具体场景
- 持续更新（不要过期）
```

### 问题 3：知识过时
```markdown

## 解决
- 标注更新时间
- 定期 Review
- 鼓励更新（而不是删除）
- 失效内容归档
```

## AI 辅助知识沉淀

### 自动整理
```bash

# 让 AI 整理对话历史
> 请帮我整理这周的对话记录：
> - 关键决策
> - 遇到的问题
> - 解决方案
> - 可复用的 Prompt

# 输出结构化笔记
```

### 自动总结
```bash
> 帮我在以下 PR 中提取 AI Coding 经验：
> [PR 列表]

# 输出：

# - 成功案例

# - 失败教训

# - 最佳实践
```

### 自动生成文档
```bash
> 基于以下代码生成最佳实践文档：
> [代码示例]

# 输出：

# - 模式说明

# - 使用场景

# - 注意事项
```

## 实战：建立团队知识库

### 第 1 步：选择载体
```bash

# 推荐：
- Notion / 飞书（最方便）
- GitHub Wiki（开发友好）
- GitBook（适合文档站点）
```

### 第 2 步：搭建结构
```markdown
按照上面的 Wiki 结构创建：
- 入门、规范、模板、案例、FAQ
```

### 第 3 步：填充初始内容
```markdown
- 上手指南
- 团队 agents.md
- 常用 Prompt 模板
- 第一个成功案例
```

### 第 4 步：建立贡献机制
```markdown
- 鼓励所有人贡献
- 周会分享
- 月度整理
```

### 第 5 步：持续运营
```markdown
- 每周分享
- 每月回顾
- 每季度优化
```

## 总结
知识沉淀是**团队 AI Coding 的复利**：

- 规范、模板、案例、战术
- Wiki + 仓库 + 分享会
- AI 辅助沉淀
- 不要"个人英雄主义"

最后一章：[评估、度量与反模式](/metrics/overview)