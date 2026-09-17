# 大模型选择
工具决定了**交互方式**，但真正决定 AI Coding 质量的是**背后的模型**。

## 主流编码模型横评

### 综合排名（截至 2026 年 8 月）
| 排名 | 模型 | 厂商 | 综合代码能力 | 长上下文 | 速度 | 价格 |
| --- | --- | --- | --- | --- | --- | --- |
|| Claude Opus 4.6 | Anthropic || 1M | 中 | 高 |
|| Claude Sonnet 4.6 | Anthropic || 1M | 快 | 中 |
|| Claude Opus 5 | Anthropic || 1M | 中 | 高 |
| 4 | GPT-5.4 / 5.5 | OpenAI || 1M | 快 | 中高 |
| 5 | Gemini 3.1 Pro | Google || 1M | 中 | 中 |
| 6 | Gemini 3.5 Flash | Google || 1M | 极快 | 低 |
| 7 | DeepSeek V3.2 | 深度求索 || 128K | 中 | 极低 |
| 8 | Kimi K2.5 | 月之暗面 || 262K | 中 | 低 |
| 9 | Qwen3.5 397B | 阿里 || 262K | 快 | 低 |
| 10 | GLM-5 / 5.2 | 智谱 || 200K-256K | 中 | 低 |

> **SWE-bench Verified 评分（2026 年）**：Claude Opus 4.6 80.8%、Claude Sonnet 4.6 79.6%、Kimi K2.5 76.8%、GLM-5 77.8%、DeepSeek V3.2 73.0%、GPT-5.4 ~57-65%、Gemini 3.1 Pro ~70-80%（不同评测口径差异较大）。

## 各模型在前端场景的表现

### Claude Opus 4.6 / Opus 5（推荐 ，复杂任务首选）
**优势**：
- SWE-bench Verified 80.8%，**当前编码能力天花板**-Opus 4.6 起新增 **Agent Teams**并发子代理、1M 上下文 beta（128K 输出）
- 对指令遵循度极高，**最听话**-复杂多文件重构、跨文件推理最强

**劣势**：
- 价格偏高（$5/$25 per 1M tokens；Opus 5 维持 $5/$25）
- 速度比 Sonnet 慢

**最适合**：复杂业务逻辑、多文件重构、自主 Agent 任务

### Claude Sonnet 4.6（推荐 ，性价比首选）
**优势**：
- SWE-bench Verified 79.6%，与 Opus 4.6 仅差 **1.2 个百分点**-价格仅 Opus 的 **1/5**（$3/$15 per 1M tokens）
- 70% 用户在 Claude Code 中更偏好 Sonnet 4.6 而非 Sonnet 4.5
- 综合代码风格、指令遵循、响应速度的**最佳平衡**

**劣势**：
- 极致推理任务（科学、博士级）弱于 Opus
- 无 Agent Teams 能力

**最适合**：日常编码、绝大多数 AI Coding 场景（**默认推荐**）

### GPT-5.4 / GPT-5.5（推荐 ）
**优势**：
- 指令遵循与**结构化输出合规性最强**（schema 严格遵循）
- 工具调用、函数调用最稳定
- 多模态能力强（语音、图像、视频）
- 生态最成熟，工具兼容性最好

**劣势**：
- SWE-bench 编码任务仍落后 Claude Opus / Gemini 3 Pro 一档
- 长上下文仅 1M（部分模型）
- GPT-5.5（2026 年 4 月发布）首发定价 $5/$30（不涨）

**最适合**：日常对话、需要严格结构化输出、多模态输入场景

### Gemini 3.1 Pro / 3.5 Flash（推荐 ）
**优势**：
- **超长上下文**（1M tokens），能装下整个大型项目
- 多模态原生支持（视频、音频、PDF）
- Gemini 3.5 Flash **速度极快**（适合实时补全 / 大规模调用）
- Gemini 3 在 WebDev Arena 排名第一，被谷歌称为"迄今最佳 vibe coding 模型"
- 价格友好（3.1 Pro $2/$12；3.5 Flash 更低）

**劣势**：
- 长上下文有衰减（128K 以上召回率开始下降，>512K 严重衰减）
- 单文件代码质量略逊于 Claude
- 中文注释有时不够自然

**最适合**：分析整个大型代码库、超长文档、原型快速迭代

### DeepSeek V3.2（推荐 ，性价比之王）
**优势**：
- **性价比碾压**（$0.28/$0.42 per 1M tokens，比 Claude 便宜约 **10 倍**）
- SWE-bench Verified 73.0%，与 GPT-5 级别性能相当
- 完全开源（MIT），可私有部署
- 中文能力强，多语言显著提升

**劣势**：
- 复杂多文件重构弱于 Claude Opus
- 128K 上下文略小
- 部分场景速度比 GPT-4.1 慢

**最适合**：成本敏感场景、日常任务、对国产化和私有化有要求

### Kimi K2.5 / K3（国产推荐）
**优势**：
- K2.5 SWE-bench Verified 76.8%，**已接近 Sonnet 4.6**-K2.5 支持 **256K 上下文**，"最强开源视觉编程模型"，能看截图写前端
- K3（2026 年 7 月开源）2.8T 参数，史上最大开源模型
- 中文写作、代码注释自然度极高

**劣势**：
- 高峰期算力紧张
- 多模态能力相对较弱

**最适合**：中文项目、长文档分析、阿里云百炼 Coding Plan 优惠场景

### Qwen3.5 397B / GLM-5（国产推荐）
**优势**：
- **Qwen3.5 397B**：原生 262K 上下文，专为编程优化
- **GLM-5 / 5.2**：SWE-bench Verified 77.8%，**首个综合能力接近 Claude Opus 4.6 的中国模型**（仍落后约 3 个百分点）
- GLM-5.2 支持 1M 无损上下文，Coding 与长程任务达开源 SOTA
- 中文支持最好，价格低，可私有部署

**劣势**：
- 英文场景略弱于 Claude
- 英文资料较少
- 部分模型需阿里云 / 智谱平台调用

**最适合**：中文项目、对数据合规敏感、需要本地化部署

## 模型选择的决策树
```
你的预算是？
├── 充足 → Claude Opus 5 / Opus 4.6（关键任务）+ Sonnet 4.6（日常）
├── 中等 → Sonnet 4.6（首选）+ DeepSeek V3.2 / Kimi K2.5（备选）
└── 紧张 → DeepSeek V3.2（API）/ Qwen3.5 397B / GLM-5（本地）

你的任务复杂度？
├── 复杂业务 / 多文件重构 → Claude Opus 4.6 / 5
├── 日常 CRUD → Sonnet 4.6 / DeepSeek V3.2
└── 大型代码库分析 → Gemini 3.1 Pro（1M 上下文）

数据合规要求？
├── 严格 → 本地开源模型（Qwen3.5 397B / GLM-5 / DeepSeek V3.2）
└── 宽松 → 任意商用模型

是否需要多模态？
├── 视频/长 PDF → Gemini 3.1 Pro
├── 设计稿截图 → Kimi K2.5 / GPT-5.4
└── 纯文本 → Claude / DeepSeek
```

## 实战建议

### 多模型组合策略
不要"一棵树上吊死"。推荐组合：

| 任务类型 | 推荐模型 | 工具 |
| --- | --- | --- |
| 代码补全 | DeepSeek V3.2 / GPT-4.1 Mini | Cursor / Trae |
| 组件生成 | Sonnet 4.6 / GPT-5.4 | Cursor Composer |
| 复杂重构 | Claude Opus 4.6 / 5 | Claude Code |
| 代码审查 | Claude Sonnet 4.6 | 任意 |
| Bug 排查 | Claude Opus 4.6 | Claude Code |
| 文档生成 | GPT-5.4 / DeepSeek V3.2 | 任意 |
| 测试编写 | Sonnet 4.6 / DeepSeek V3.2 | 任意 |
| 大型代码库分析 | Gemini 3.1 Pro | Cursor |
| 看图写前端 | Kimi K2.5 | Trae / Cursor |

### 模型切换的成本
实际使用中，**模型切换几乎零成本**——大多数工具都支持运行时切换。

建议：

1. **日常用便宜模型**：代码补全、简单生成（DeepSeek V3.2 / Sonnet 4.6）
2. **关键任务用顶级模型**：复杂重构、架构决策（Claude Opus 4.6 / 5）
3. **不确定时让两个模型都给方案**：对比选择
4. **避免单一厂商锁定**：跨厂商组合（Claude + DeepSeek + Gemini）规避账号风控

## 关注的评测基准
判断模型代码能力时，关注这些基准：

| 基准 | 测什么 | 参考价值 |
| --- | --- | --- |
| **SWE-bench Verified**| 真实 GitHub Issue 修复（500 题） ||
| **SWE-bench Pro**| 更难变体（1,865 题，多语言） ||
| **LiveCodeBench**| 持续更新的真实题目（防污染） ||
| **HumanEval**| 编程题（已饱和，>95%） ||
| **MBPP**| 基础编程 ||
| **Aider Polyglot**| 多语言编辑任务 ||
| **WebDev Arena**| 前端/Web 任务 ||
| **Terminal-Bench 2.0**| CLI / 终端操作 ||

::: warning 基准 ≠ 实战
基准分数只能作为参考，**真实项目中的表现才是关键**。HumanEval 已饱和（>95%），无法区分前沿模型；建议团队内做小规模试用再决策。
:::

## 未来趋势
- **Agent 专用模型**：专门为 Agent 场景优化的模型（Claude Agent Teams、OpenAI o-series）
- **超长上下文常态化**：1M 上下文成为标配（Opus 5、GLM-5.2、GPT-5.5 均已支持）
- **开源追平闭源**：GLM-5、Kimi K2.5、Qwen3.5 等开源模型已逼近 Claude Opus
- **国产芯片 + 国产模型协同**：GLM-5 已在寒武纪、摩尔线程国产芯片上完成适配
- **判断力优先**：从机械规则约束转向"判断力优先"的上下文工程（Claude 5 路线）

下一节：[Trae Solo 深度评测](/tools/trae)