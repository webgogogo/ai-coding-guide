# 术语表（Glossary）
> **AI Coding 领域的核心术语速查**。按主题分类，可作为阅读本指南时的"字典"。

> **使用方式**：遇到陌生术语时按 Ctrl/ + F 搜索，或按主题分类浏览。

- --

## 快速跳转
- [AI / 模型术语](#ai--模型术语)
- [工具 / 平台术语](#工具--平台术语)
- [编码模式术语](#编码模式术语)
- [Prompt / 上下文术语](#prompt--上下文术语)
- [架构 / 工程术语](#架构--工程术语)
- [质量 / 安全术语](#质量--安全术语)
- [度量 / 评估术语](#度量--评估术语)
- [成本 / 商业术语](#成本--商业术语)

- --

## AI / 模型术语

### LLM（Large Language Model）
大语言模型。参数量通常在数十亿到数万亿之间，通过海量文本预训练，能够理解和生成自然语言。

### GPT（Generative Pre-trained Transformer）
OpenAI 的大语言模型系列，基于 Transformer 架构，采用生成式预训练范式。

### Claude
Anthropic 公司的大语言模型系列，主打长上下文、推理能力和安全性。

### Gemini
Google DeepMind 的大语言模型系列，强项是多模态（文本、图像、视频、音频）和超长上下文。

### Token
模型处理文本的最小单位。**英文约 0.75 单词 = 1 token，中文约 1 字符 ≈ 1-2 tokens**。模型按 Token 计费。

### 上下文窗口（Context Window）
模型单次能"看到"的最大 Token 数。如 Claude Opus 4.6 支持 1M tokens（约 50 万中文字）。

### System Prompt
系统提示词。开发者预设给模型的"角色设定"，通常包括行为规范、输出格式、约束条件等。

### User Prompt
用户提示词。实际对话中用户输入的内容。

### Temperature
控制模型输出随机性的参数。0 = 完全确定性（适合代码），1 = 创造性（适合创意写作），0.7 是常用折中值。

### Top-P / Top-K
采样策略。Top-K 只从前 K 个最可能的 token 中选，Top-P 从累积概率达 P 的最小集合中选。**调低这些值会让输出更稳定**。

### MoE（Mixture of Experts）
混合专家模型。模型分成多个"专家"子网络，每次推理只激活部分专家。**优点是参数多但推理便宜**（如 GLM-5 744B 参数只激活一部分）。

### 预训练（Pre-training）
在大规模无标注语料上训练模型，让模型掌握语言、世界知识、推理能力。**成本极高**。

### 微调（Fine-tuning）
在预训练模型上，用特定任务的小规模数据继续训练，**让模型更擅长某类任务**。如编程微调、对话微调。

### RLHF（Reinforcement Learning from Human Feedback）
基于人类反馈的强化学习。通过人类对模型输出的偏好打分，训练奖励模型，再用强化学习优化 LLM。**Claude / GPT 都用了**。

### 推理（Inference / Reasoning）
模型根据输入生成输出的过程。与"训练"相对。

### CoT（Chain of Thought）
思维链。一种 Prompt 技巧，让模型"一步一步思考"再给答案，**显著提升复杂推理能力**。

### Function Calling / Tool Use
让模型能够"调用外部工具"的能力。模型生成结构化参数，由开发者执行实际函数。**Agent 的基础**。

### MCP（Model Context Protocol）
Anthropic 主导提出的"模型上下文协议"，标准化模型与工具/数据源的交互方式。

### 多模态（Multimodal）
模型能同时处理多种模态（文本、图像、音频、视频）。Gemini 3.1 Pro、Kimi K2.5 支持原生多模态。

### SWE-bench
评估模型软件工程能力的基准测试。给定真实 GitHub issue，让模型生成 patch 解决。**业界最权威的编码能力评测**。

### WebDev Arena
评估模型前端代码生成能力的基准。给定 UI 设计需求，模型生成完整代码，由人类盲评。**Gemini 3 系列在此排名第一**。

- --

## 工具 / 平台术语

### IDE（Integrated Development Environment）
集成开发环境。如 VS Code、WebStorm、IntelliJ IDEA。

### AI Coding 工具
集成了 AI 能力的开发工具。代表：
- **IDE 类**：Cursor、Trae Solo
- **终端 Agent**：Claude Code、OpenCode、CodeX
- **插件类**：GitHub Copilot、Continue

### Cursor
基于 VS Code 的 AI-first IDE，深度集成 GPT/Claude/Gemini，特色是 Composer 2.5（多文件编辑 Agent）。

### Trae Solo
字节跳动推出的 AI-first IDE，中文优化，接入豆包/DeepSeek/Kimi/GLM/Qwen 等国产模型为主。

### Claude Code
Anthropic 推出的终端 AI Coding Agent，强调 Agent 能力和长任务处理。

### OpenCode
开源的终端 AI Coding 工具，支持任意 OpenAI 兼容 API，**主打本地化与合规**。

### CodeX
OpenAI 推出的终端 AI Coding Agent，深度集成 GPT 系列和 o-series 推理模型。

### Tab 补全
光标处的内联补全，类似 Copilot 的传统功能。**响应快、改动小**。

### Composer
Cursor 的多文件编辑 Agent，能理解整个项目并一次性改多个文件。Composer 2.5 是当前版本。

### Agent Teams
Claude Code 的并发子代理能力。一个 Agent 任务可拆给多个子 Agent 并行处理。

### MCP Server
实现 MCP 协议的服务器，为 AI 提供工具或数据访问能力。

### Skills
Claude Code 中"可复用的能力包"，包含 Prompt、工具、配置。

### Slash Command
斜杠命令。如 `/review`、`/test`，触发预设的 AI 工作流。

### Worktree
Git 的工作树功能。在一个仓库里同时有多个分支的独立工作目录，**让 AI 在隔离环境改代码，避免污染主分支**。

### .cursorignore / .claudeignore
工具专用的"忽略文件"配置，告诉 AI 哪些文件不要索引/不要读。

### MCP（见上文 AI 术语）

- --

## 编码模式术语

### Vibe Coding
**探索性编码**模式。快速试错，时间盒 30 分钟内。**适合技术选型、原型验证**。

### Plan Coding
**计划式编码**模式。先写计划再实施，1-2 天完成单功能。**适合常规业务开发**。

### Spec Coding
**规格式编码**模式。先写完整规格（需求/设计/任务），多人协作 1-2 周。**适合关键模块、长期维护**。

### 时间盒（Time Box）
为任务设定固定时长，**到点就停**。Vibe Coding 的核心实践，避免"再调一下"陷阱。

### 渐进式交付
Vibe → Plan → Spec 渐进深化的工作流。**先用 Vibe 验证方向，再用 Plan 落地，最后用 Spec 完善**。

### 一句话需求
用一句话说清楚"做什么"，是 Vibe Coding 的标准输入。

### Spec / 规格
完整描述需求的文档。包括目标、范围、接口、验收标准、风险等。

### 决策树
一种可视化决策工具。从根节点出发，每个分支对应一个判断，**最终到达行动建议**。

### 占位代码 / Stub
只保留接口、留 TODO 的"骨架代码"，用于在规格阶段明确模块边界。

- --

## Prompt / 上下文术语

### Prompt
提示词。发给模型的输入。

### Prompt Engineering
Prompt 工程。系统化设计 Prompt，让模型输出更稳定、更高质量。

### Zero-shot
零样本。直接问模型，不给任何例子。

### Few-shot
少样本。给模型几个例子，让它"照着做"。

### System Prompt（见 AI 术语）

### CoT（见 AI 术语）

### ReAct
Reasoning + Acting。让模型交替"思考"和"行动"，是 Agent 的基础范式。

### Reflection
让模型对自己的输出"自评"或"重写"，提高质量。

### agents.md
项目级的 AI 约束文件。包含项目规范、编码约定、AI 应做/不应做的事。**类似 AI 版的"项目宪法"**。

### CLAUDE.md
Anthropic 生态的 agents.md 命名约定。Cursor 也支持（`.cursorrules` 旧名）。

### .cursorrules
Cursor 的项目级 AI 配置（旧版）。新版用 `.cursor/rules/*.mdc`。

### Cursor Rules
Cursor 的项目级 AI 配置（新版），支持分文件按规则匹配。

### Token Economy
Token 经济学。优化 Token 用量就是在省钱。

### Prompt Caching
缓存机制。重复的 Prompt 不重复计算/计费。**Claude 缓存输入 $0.30/M，是标准价的 1/10**。

### Context Pollution
上下文污染。把无关信息塞进上下文，让模型注意力分散、输出质量下降。

### Structured Output
结构化输出。让模型按 JSON Schema 等固定格式返回，**便于程序化处理**。

### Schema First
先定义数据结构（schema），再让模型按 schema 生成。**接口契约先行**的 AI 版本。

### Multi-Agent
多 Agent。让多个 AI Agent 协作完成复杂任务，每个 Agent 负责一个角色。

### Role Prompting
给模型指定角色。如"你是一个资深前端工程师"，影响输出风格。

- --

## 架构 / 工程术语

### 模块化（Modularization）
把代码拆成独立、可替换的模块。**AI Coding 最重要的架构原则**。

### 特性文件夹（Feature Folder）
按"特性"组织代码，而非按"类型"。`features/user/` 包含 user 的所有相关文件（组件、hooks、API、类型）。

### 分层架构（Layered Architecture）
将代码分成清晰层次（如 UI / 业务 / 数据访问），层与层之间通过接口交互。

### 单向数据流（Unidirectional Data Flow）
数据流向是单向的（State → View → Action → State），便于追踪和调试。**React、Redux 都遵循**。

### 状态管理（State Management）
管理应用状态。**常用方案**：React State、Context、Zustand、Redux、Recoil、Jotai。

### 接口契约（Interface Contract）
模块之间通过明确的"接口"交互，**实现细节互相隐藏**。TypeScript 的 type/interface 是契约的工具。

### 契约先行（Contract-First）
先定义接口契约，再写实现。**AI Coding 友好的最佳实践**。

### 错误处理架构
系统化处理错误的模式。包括错误类型设计、降级策略、用户提示。

### 关注点分离（Separation of Concerns）
每个模块只负责一件事。**与模块化密切相关**。

### 高内聚低耦合
**模块内**关系紧密（高内聚），**模块间**关系松散（低耦合）。

### 依赖注入（Dependency Injection）
将依赖的创建和使用分离。便于测试和替换。

### 依赖倒置（DIP）
依赖抽象，不依赖具体实现。

### 关注点分层（Layered Concerns）
UI 层、业务层、数据层的清晰分离。

### 技术债（Technical Debt）
为了短期速度欠下的"代码债"，需要后续"还债"（重构、优化）。**AI Coding 容易快速产生技术债**。

- --

## 质量 / 安全术语

### 零信任原则（Zero Trust）
不信任任何代码（包括 AI 写的）能直接上线。**所有改动必须经过 Review**。

### Code Review
代码审查。开发者互相检查代码，发现 Bug、安全问题、可改进点。

### PR / Pull Request
合并请求。把分支合并到主干前，请求他人 Review。

### 单元测试（Unit Test）
测试最小单元（函数、组件）。**AI 写测试主要做这种**。

### 集成测试（Integration Test）
测试模块间协作。**需要根据真实业务断言**。

### E2E 测试（End-to-End Test）
模拟真实用户行为，测试完整流程。**最贴近生产，最贵**。

### TDD（Test-Driven Development）
测试驱动开发。先写测试，再写实现，让测试通过。

### BDD（Behavior-Driven Development）
行为驱动开发。用自然语言描述期望行为，再写测试。

### 测试覆盖率（Test Coverage）
被测试覆盖的代码比例。**80%+ 是行业常见目标**。

### Lint / Linter
静态代码分析工具。发现代码风格、潜在错误。**ESLint、Prettier**。

### Type Check
类型检查。TypeScript 的核心优势。**AI 写的代码必须过 typecheck**。

### CI / CD
持续集成 / 持续部署。自动跑测试、构建、部署。

### Secrets 管理
管理 API key、密码、token 等敏感信息。**绝不能写进代码**。

### .env / 环境变量
存放敏感配置的本地文件（不提交到 git）。**部署时通过环境变量注入**。

### Prompt Injection
提示词注入攻击。通过精心构造的输入让 AI 执行未授权操作。

### PII（Personally Identifiable Information）
个人身份信息。如姓名、身份证号、邮箱。**绝不能发给公网 AI**。

### Secret Scanning
代码库自动扫描 secrets。GitHub 内置此功能。

### SBOM（Software Bill of Materials）
软件物料清单。列出所有依赖及其版本，用于安全审计。

### CVE（Common Vulnerabilities and Exposures）
公开漏洞编号。每个已知漏洞都有 CVE 编号。

### SCA（Software Composition Analysis）
软件成分分析。扫描依赖中的已知漏洞。

- --

## 度量 / 评估术语

### KPI（Key Performance Indicator）
关键绩效指标。

### OKR（Objectives and Key Results）
目标与关键结果。**目标管理方法**。

### 首问准确率（First-try Accuracy）
AI 第一次回答就"对"的比例。**是 AI Coding 体验的核心指标**。

### 返工率（Rework Rate）
需要返工的任务占总任务的比例。

### 一次通过率（Pass Rate）
代码/测试一次通过的比例。

### 代码评审时长（PR Review Time）
从提交 PR 到合并的平均时间。

### ROI（Return on Investment）
投资回报率。AI Coding 衡量投入产出比的核心指标。

### 工具使用率（Adoption Rate）
团队中使用 AI 工具的比例。

### 满意度（NPS / CSAT）
净推荐值 / 客户满意度。**通常用 5 星评分**。

### Token 消耗趋势
随时间变化的 Token 使用量。**用于判断成本趋势**。

### 经验估算
基于实践的参考值，**非权威数据**。本指南中所有标注"经验估算"的数据都属于这一类。

### Anti-pattern
反模式。常见但错误的做法。

### Code Smell
代码异味。"看起来不太对"的代码特征。

- --

## 成本 / 商业术语

### 输入价格 / 输出价格
LLM 按 Token 收费，分输入（你发给模型的）和输出（模型返回的）。**输出通常比输入贵 3-5 倍**。

### 缓存价格
Prompt Caching 的命中价格。**通常比标准输入便宜 90%**。

### 批量折扣（Batch API）
异步批量调用的折扣。**Anthropic / OpenAI 都提供**。

### 模型分层
按任务复杂度使用不同价位的模型。**80% 便宜 + 15% 主力 + 5% 顶级**是经验最优解。

### Subscription / 订阅
按月/按年付费的订阅制（如 Cursor Pro $20/月、Claude Code $20/月）。

### Pay-as-you-go
按量付费。**如 OpenAI API、Anthropic API**。

### 跨厂商备份
同时使用多个 AI 厂商，**避免单点故障**（账号封禁、API 故障）。

### 冷启动（Cold Start）
首次调用模型的额外延迟。**本地模型常见问题**。

### TPM / RPM
Tokens Per Minute / Requests Per Minute。**API 限流指标**。

- --

## 常见缩写速查
| 缩写 | 全称 | 中文 |
| --- | --- | --- |
| LLM | Large Language Model | 大语言模型 |
| CoT | Chain of Thought | 思维链 |
| MoE | Mixture of Experts | 混合专家 |
| RLHF | RL from Human Feedback | 人类反馈强化学习 |
| MCP | Model Context Protocol | 模型上下文协议 |
| IDE | Integrated Development Environment | 集成开发环境 |
| TDD | Test-Driven Development | 测试驱动开发 |
| BDD | Behavior-Driven Development | 行为驱动开发 |
| PR | Pull Request | 合并请求 |
| CI | Continuous Integration | 持续集成 |
| CD | Continuous Deployment | 持续部署 |
| SCA | Software Composition Analysis | 软件成分分析 |
| SBOM | Software Bill of Materials | 软件物料清单 |
| CVE | Common Vulnerabilities and Exposures | 公开漏洞 |
| PII | Personally Identifiable Information | 个人身份信息 |
| ROI | Return on Investment | 投资回报率 |
| KPI | Key Performance Indicator | 关键绩效指标 |
| OKR | Objectives and Key Results | 目标与关键结果 |
| TPS | Transactions Per Second | 每秒事务数 |
| TPM | Tokens Per Minute | 每分钟 Token 数 |
| RPM | Requests Per Minute | 每分钟请求数 |

- --

## 术语表元信息
- **整理时间**：2026-08
- **词条数量**：100+ 核心术语
- **更新频率**：随领域演进持续更新
- **使用建议**：Ctrl/ + F 搜索，或按主题浏览

> **术语是沟通的基础**。在团队里统一术语，能极大减少沟通成本。
