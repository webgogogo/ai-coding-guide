# AI Coding 常见问题（FAQ）
> **本章汇总读者高频问题**，按主题分类。建议先看本 FAQ 找答案，再按需跳转到对应章节深入阅读。

> **本章中的所有"经验数据"均为经验估算**，具体效果因项目类型、团队规模、模型版本而异。

- --

## 快速跳转
- [入门篇](#入门篇)
- [工具篇](#工具篇)
- [模型篇](#模型篇)
- [模式篇](#模式篇)
- [上下文 / Prompt 篇](#上下文--prompt-篇)
- [质量篇](#质量篇)
- [安全篇](#安全篇)
- [成本篇](#成本篇)
- [团队篇](#团队篇)
- [故障篇](#故障篇)

- --

## 入门篇

### Q1. 完全没有 AI Coding 经验，从哪里开始？
**3 步上手路径**：

1. **第 1 步：选工具**——个人首选 [Trae Solo](/tools/trae)（中文友好、免费）或 [Cursor](/tools/cursor)（海外首选）
2. **第 2 步：写第一份 `agents.md`**——参考 [claude-md](/context/claude-md) 模板，10 分钟搞定
3. **第 3 步：试 3 种模式**——挑 3 个小任务，分别用 Vibe / Plan / Spec 各试一次，感受差异

详见 [quickstart](/guide/quickstart)。

- --

### Q2. AI Coding 会让初级程序员失业吗？
**不会，但会改变"初级"的定义**：

- **会贬值**：纯手写 CRUD、写样板代码、抄 Stack Overflow
- **会更值钱**：业务理解、架构设计、Code Review、跨职能协作

**给初级的建议**：
- 不要只学"怎么写代码"
- 要学"怎么定义问题、怎么让 AI 写对、怎么判断对错"
- 详见 [guide/intro](/guide/intro) 里的"开发者角色演变"

- --

### Q3. AI Coding 和 Copilot 那种自动补全有什么区别？
**3 个关键差异**：

| 维度 | Copilot 自动补全 | AI Coding 工具 |
| --- | --- | --- |
| 模式 | 行内补全 | 整段、整文件、整项目 |
| 上下文 | 当前文件 | 多文件 + 知识库 + 历史 |
| 自主度 | 接受/拒绝 | 自主规划、执行、回滚 |
| 典型工具 | GitHub Copilot | Cursor / Trae / Claude Code |

详见 [guide/frontend-evolution](/guide/frontend-evolution)。

- --

### Q4. 我用的 React/Vue 项目，AI Coding 友好吗？
**取决于架构，不取决于框架**：

- **友好**：模块清晰、接口契约完整、状态管理有规律
- **不友好**：单文件 1000+ 行、命名混乱、隐式依赖

详见 [architecture/overview](/architecture/overview) 的"7 大杠杆"。

- --

## 工具篇

### Q5. Cursor vs Trae Solo 怎么选？
**看地区 + 场景**：

| 场景 | 首选 | 理由 |
| --- | --- | --- |
| 国内、中文项目 | **Trae Solo**| 中文优化、国产模型主力 |
| 海外、英文项目 | **Cursor**| Claude / GPT 体验最佳 |
| 预算敏感 | **Trae Solo**（国内） | 有免费额度 |
| 追求最佳体验 | **Cursor**| Composer 2.5 多模型切换 |
| 完全免费 | **VSCode + Continue + DeepSeek**| 开源方案 |

详见 [tools/decision-matrix](/tools/decision-matrix)。

- --

### Q6. Claude Code 值得花 $20/月订阅吗？
**看使用频率**：

- **值得**：每天用 2 小时以上、跑 Agent Teams 自动化
- **可考虑**：偶尔用复杂任务
- **不建议**：只用来聊天的场景

**替代方案**：用 [OpenCode](/tools/opencode) + Anthropic API（按量付费），单月可能只花 $5。

详见 [tools/claude-code](/tools/claude-code)。

- --

### Q7. OpenCode 和 Claude Code 区别是什么？
**核心差异**：

| 维度 | Claude Code | OpenCode |
| --- | --- | --- |
| 模型 | 只能用 Claude | 任意 OpenAI 兼容 |
| 开源 | 否 | 是 |
| 部署 | 官方托管 | 自托管/本地 |
| 合规 | 数据出网 | 可完全本地 |
| 体验 | 更成熟 | 更灵活 |

**何时选 OpenCode**：
- 数据合规要求严
- 想用国产/开源模型
- 需要跨厂商备份

详见 [tools/opencode](/tools/opencode)。

- --

### Q8. CodeX 比 Claude Code 强吗？
**编码任务，Claude Code 更强**：

- Claude Opus 4.6/5 在 SWE-bench 上 80.8%+，CodeX 用的 GPT-5.4/5.5 约 57-65%
- Claude Code 的 Agent Teams 更成熟
- CodeX 强在 OpenAI 生态和推理任务

**建议**：日常编码用 Claude Code，推理/o-series 任务切到 CodeX。

详见 [tools/codex](/tools/codex)。

- --

## 模型篇

### Q9. Claude Sonnet 4.6 还是 Opus 4.6？日常编码用哪个？
**默认 Sonnet 4.6，关键任务 Opus**：

| 任务 | 模型 | 理由 |
| --- | --- | --- |
| 日常补全、CRUD、测试 | **Sonnet 4.6**| 性价比之王 |
| 架构设计、复杂推理 | **Opus 4.6/5**| 推理能力强 |
| Bug 排查（疑难杂症） | **Opus 4.6/5**| 推理能力强 |
| 看图写前端 | **Kimi K2.5**| 原生视觉 |
| 简单脚本/补全 | **DeepSeek V3.2**| 极致便宜 |

**Sonnet 4.6 vs Opus 4.6 实际差距**：SWE-bench 79.6% vs 80.8%（差约 1 个百分点），但价格差 5 倍。

详见 [tools/models](/tools/models)。

- --

### Q10. 国产模型现在能打吗？GLM-5 / Qwen3.5 怎么样？
**已经能打了**：

- **GLM-5**：SWE-bench 77.8%，**接近 Claude Opus 4.6**（仍落后约 3 个百分点）
- **Qwen3.5 397B**：262K 上下文，专为编程优化
- **DeepSeek V3.2**：极致性价比（$0.28/$0.42 per 1M，便宜 18 倍）
- **Kimi K2.5**：原生视觉 + 中文最强

**建议**：
- 日常任务可以放心用国产
- 关键架构/复杂 Bug 还是 Opus
- 详见 [tools/models](/tools/models)

- --

### Q11. GPT-5.5 真的比 GPT-5.4 强吗？
**性能略强，但价格贵 2 倍**（$5/$30 vs $2.50/$15）：

- **值得升级**：编码关键任务、复杂推理
- **不值得升级**：日常 CRUD、文档生成
- **按需使用**：复杂任务切过去，简单任务用便宜的

**建议**：日常主力用 Sonnet 4.6 / DeepSeek V3.2，需要时切到 GPT-5.5。

详见 [tools/models](/tools/models) / [security/cost](/security/cost)。

- --

### Q12. 上下文窗口越大越好吗？
**不是**：

| 误区 | 真相 |
| --- | --- |
| 1M 上下文能装下整个项目 | 1M tokens 约 50 万中文字，**只能装下中小型项目**|
| 上下文越大回答越好 | 上下文超 200K 后质量反降，**"长上下文≠高质量"**|
| 用最贵的 1M 模型最划算 | 1M 比 200K 贵 2-5 倍，**80% 任务用不到 200K**|

**建议**：
- 80% 任务用 128-256K 上下文（DeepSeek V3.2、Kimi K2.5）
- 15% 任务用 1M 上下文（Gemini 3.1 Pro、Opus 5）
- 5% 任务才需要全 1M（大型代码库分析）

详见 [context/management](/context/management)。

- --

### Q13. 一个项目用多个模型会不会很乱？
**不会，但需要管理**：

**推荐：路由式分工**| 任务 | 模型 |
| --- | --- |
| 代码补全 | DeepSeek V3.2 / Sonnet 4.6 |
| 复杂业务 | Sonnet 4.6 |
| 架构决策 | Opus 4.6/5 |
| 长文档分析 | Gemini 3.1 Pro |
| 中文任务 | DeepSeek V3.2 / Kimi K2.5 |

详见 [context/multi-agent](/context/multi-agent) 的"角色分工"。

- --

## 模式篇

### Q14. Vibe / Plan / Spec 三种模式怎么选？
**看任务确定性**：

```
           任务确定性
   低 ◀─────────────▶ 高
   │                 │
Vibe Coding       Spec Coding
   (探索)            (实施)
   │                 │
   └──── Plan Coding ┘
```

| 信号 | 模式 |
| --- | --- |
| 不知道用什么库、什么方案 | Vibe（30 分钟试错） |
| 功能明确但涉及多文件 | Plan（1-2 天） |
| 关键模块、长期维护、多人协作 | Spec（1-2 周） |

详见 [modes/decision-tree](/modes/decision-tree)。

- --

### Q15. Vibe Coding 时间盒设多久合适？
**30 分钟经验值**：

- 太短（< 15 分钟）：还没试出东西就到了
- 太长（> 60 分钟）：陷入"再调一下"的陷阱

**30 分钟原则**：
- 前 10 分钟：AI 写 demo
- 中 10 分钟：自己评估 + 让 AI 优化
- 后 10 分钟：决定方向（继续 / 切换 / 放弃）

详见 [case-study/vibe](/case-study/vibe)。

- --

### Q16. Spec Coding 太重了吧？小项目也要写规格吗？
**看项目规模**：

| 项目规模 | Spec Coding 必要性 |
| --- | --- |
| 个人 < 1 周 | 不必，直接干 |
| 1-2 人 1-2 周 | 可选，写最小规格即可 |
| 3+ 人 / 长期维护 | 必须，否则后期重构成本高 |

**简化的 Spec**（推荐）：
1. 一句话目标
2. 关键接口契约
3. 验收标准
4. 风险与边界

详见 [modes/spec-coding](/modes/spec-coding)。

- --

### Q17. 任务到 Plan 还是 Spec 模式？犹豫的时候怎么选？
**2 个判断问题**：

1. **多人协作吗？**否 → Plan；是 → Spec
2. **会长期维护吗？**否 → Plan；是 → Spec

**简化版决策口诀**：
- "我一个人写" → Plan
- "团队要一起搞" → Spec

详见 [modes/decision-tree](/modes/decision-tree)。

- --

## 上下文 / Prompt 篇

### Q18. agents.md / CLAUDE.md 应该写多长？
**经验值：50-200 行**：

- < 20 行：太粗，AI 抓不到关键约定
- > 500 行：太长，AI 注意力分散
- 50-200 行：聚焦关键约定，AI 容易遵守

**必备 4 大块**：
1. 项目基础（栈、版本、命令）
2. 编码规范（命名、文件、注释）
3. 协作约定（Git、分支、PR）
4. AI 专属（不要做、必须做）

详见 [context/agents](/context/agents)。

- --

### Q19. Prompt 写多长合适？要不要写得越详细越好？
**看任务复杂度**：

| 任务 | Prompt 长度 |
| --- | --- |
| 简单补全 | 1-2 句 |
| 单功能 | 5-10 句 |
| 多文件 | 半页到一页 |
| 完整模块 | 一页+ 多个例子 |

**关键不是长度，是结构**：

```markdown

# 任务（1 句）

# 上下文（项目、文件、约束）

# 期望产出（行为、边界、测试）

# 不要（明确的禁止项）
```

详见 [context/prompt-engineering](/context/prompt-engineering)。

- --

### Q20. AI 听不懂我说的，反复要重写怎么办？
**5 个常见原因 + 对策**：

| 原因 | 对策 |
| --- | --- |
| 任务太大 | 拆成 2-4 步小任务 |
| 缺少上下文 | 引用相关文件、示例 |
| 没说约束 | 明确不要做什么 |
| 没说验收 | 给出具体验收标准 |
| Prompt 太抽象 | 给一个正/反例 |

详见 [context/prompt-engineering](/context/prompt-engineering) 的"常见错误"。

- --

### Q21. 怎么让 AI 生成的代码风格和项目一致？
**3 个手段**：

1. **agents.md 写明规范**（命名、文件组织、注释风格）
2. **引用现有代码作为示例**（"参考 src/components/Button.tsx 的风格"）
3. **Code Review 把关**（风格不一致直接打回）

详见 [context/agents](/context/agents) / [quality/code-review](/quality/code-review)。

- --

### Q22. AI 看不到某个文件怎么办？
**3 个排查方向**：

1. **文件在 .gitignore 里？**加入或临时取消
2. **AI 工具的索引范围**？Cursor 用 `.cursorignore`、Claude Code 用 `.claudeignore`
3. **文件太大**？AI 可能跳过超大文件，主动指定关键文件

详见 [context/project-structure](/context/project-structure)。

- --

## 质量篇

### Q23. AI 写的代码可以直接合吗？
**绝对不能**。**0 信任原则**：

- 简单改动（1-10 行）→ 快速 Review 后合
- 中等改动（10-100 行）→ 完整 Review
- 关键改动（100+ 行、涉及架构、核心逻辑）→ 多次 Review + 测试 + 二次确认

**Review 必看 5 点**：
1. 正确性（特别是边界）
2. 错误处理
3. 性能
4. 安全
5. 可读性

详见 [quality/overview](/quality/overview)。

- --

### Q24. AI 写的测试可信吗？
**谨慎信任**：

- **可信**：常规 CRUD 的 happy path
- **半信**：边界条件、异常情况
- **不可信**：业务逻辑的正确性

**建议**：
- 用 AI 写**测试模板 + happy path**-边界和业务断言**自己写**-跑完测试**看覆盖率**，缺哪里补哪里

详见 [quality/testing](/quality/testing)。

- --

### Q25. 测试覆盖率到多少合适？
**经验值**：

| 项目类型 | 推荐覆盖率 |
| --- | --- |
| 工具/库 | > 80% |
| 业务核心 | > 60% |
| 边缘功能 | > 30% |
| UI/页面 | 关键路径覆盖即可 |

**注意**：
- 覆盖率不是越高越好（100% 覆盖率 ≠ 100% 质量）
- 关键是**关键路径 + 边界条件**有覆盖

详见 [quality/testing](/quality/testing)。

- --

### Q26. AI 写完代码后跑不起来怎么办？
**5 步排查法**：

1. **看错误信息**——复制完整 stack trace
2. **检查依赖**——`pnpm install` 装齐了吗
3. **看类型**——`pnpm typecheck` 通过吗
4. **跑单测**——是哪个测试挂了
5. **最小复现**——剥离代码到最小可复现版本

**给 AI 排查时给完整信息**（错误 + 复现步骤 + 已尝试），详见 [context/prompt-engineering](/context/prompt-engineering) 的"调试模板"。

详见 [quality/debugging](/quality/debugging)。

- --

## 安全篇

### Q27. 怎么防止把 API key 提交到代码库？
**5 道防线**：

1. **本地检查**：`git secrets` 工具预提交检查
2. **平台检查**：GitHub 启用 secret scanning
3. **文件管理**：secrets 放 `.env`（不提交）+ `.env.example`（提交）
4. **agents.md**：明确写"不要写 secrets"
5. **事后兜底**：泄露后立即 revoke

详见 [security/secrets](/security/secrets)。

- --

### Q28. 用户数据可以发给 AI 吗？
**绝对不能直接发**：

| 数据类型 | 处理方式 |
| --- | --- |
| 生产用户数据 | 永不发 |
| 测试数据 | 脱敏后用 |
| 模拟数据 | 可发 |
| 公开数据 | 可发 |

**强合规场景**：用本地模型（GLM-5 / Qwen3.5 + OpenCode），数据不出内网。

详见 [security/overview](/security/overview)。

- --

### Q29. AI 写的代码会不会有漏洞？
**会有**。AI 不懂安全，常见问题：

- SQL 注入（拼接字符串）
- XSS（直接渲染用户输入）
- 权限绕过（漏掉检查）
- 密钥泄露（硬编码）

**对策**：
- 所有用户输入都校验
- 不信任任何外部数据（包括 AI 返回的）
- 关键安全逻辑人工 Review
- 上线前跑安全扫描

详见 [security/prompt-injection](/security/prompt-injection)。

- --

### Q30. 公司禁止数据出境，怎么用 AI Coding？
**3 套方案**：

| 方案 | 工具 | 模型 | 成本 |
| --- | --- | --- | --- |
| 方案 A | OpenCode（自部署） | GLM-5 / Qwen3.5（本地） | 硬件成本 |
| 方案 B | Trae Solo（境内） | 国产云端模型 | $30-50/月 |
| 方案 C | Cursor + 标准协议网关 | 海外 + 脱敏 | 中等 |

详见 [security/overview](/security/overview) 的"合规矩阵"。

- --

## 成本篇

### Q31. AI Coding 一月要花多少钱？
**经验估算**（基于模型分层 80/15/5）：

| 角色 | 月成本 |
| --- | --- |
| 个人开发者 | $30-100 |
| 5 人小团队 | $300-800 |
| 10 人中型团队 | $1,500-3,000 |
| 50 人大团队 | $8,000-20,000 |

**最大头**：模型 API（约 60%），其次是工具订阅（约 10%），人工时间成本另算。

详见 [security/cost](/security/cost)。

- --

### Q32. 怎么降低 AI Coding 成本？
**5 招立即见效**：

1. **80/15/5 模型分层**：80% 用 DeepSeek V3.2（便宜 18 倍）
2. **开启 prompt caching**：重复上下文省 90%
3. **精简 CLAUDE.md / agents.md**：别往里堆文档
4. **本地模型兜底**：简单任务 GLM-5 本地跑
5. **预算告警**：设月度上限

详见 [security/cost](/security/cost)。

- --

### Q33. 订阅 Pro / Max 套餐值吗？
**看用量**：

| 套餐 | 适合 |
| --- | --- |
| Free | 轻度使用（每月几次） |
| Pro（$20/月） | 每天 1-3 小时用 |
| Max（$100-200/月） | 重度 Agent / 团队主力 |

**省钱建议**：先用 Free，跑到上限再升级到 Pro，不要一上来 Max。

详见 [tools/decision-matrix](/tools/decision-matrix)。

- --

### Q34. 用本地模型能省钱吗？
**取决于场景**：

| 场景 | 本地划算？ | 理由 |
| --- | --- | --- |
| 简单补全 | 划算 | 硬件一次投入，长期省 |
| 复杂任务 | 不划算 | 本地模型能力差，返工多反而贵 |
| 合规场景 | 划算 | 不是钱的问题，是必须 |

**建议**：复杂任务用云端顶级模型，简单任务用本地 GLM-5。

详见 [tools/opencode](/tools/opencode)。

- --

## 团队篇

### Q35. 团队怎么统一推进 AI Coding？
**4 步走**：

1. **第 1 步：试点**（1-2 周）—— 选 2-3 个志愿者，验证工具和流程
2. **第 2 步：标准化**（2-4 周）—— 沉淀团队 agents.md、Review 流程
3. **第 3 步：推广**（1-2 月）—— 培训、分享、收集反馈
4. **第 4 步：度量**（持续）—— 跟踪效率、质量、成本指标

详见 [team/overview](/team/overview)。

- --

### Q36. 团队 agents.md 应该谁来写？
**协作写，TL 维护**：

- **TL 主导**：结构、原则、约定
- **团队补充**：具体技术栈、工具命令
- **AI 建议**：基于代码库自动生成初稿

**频率**：每月回顾一次，根据新约定更新。

详见 [team/knowledge-base](/team/knowledge-base)。

- --

### Q37. AI 写的代码 Review 标准应该和人工一样吗？
**应该更严**：

| 维度 | 人工代码 | AI 代码 |
| --- | --- | --- |
| 正确性 | 标准 | **更严**（AI 容易"看起来对"） |
| 错误处理 | 标准 | **更严**（AI 容易吞错） |
| 性能 | 标准 | 标准 |
| 安全 | 标准 | **更严**（AI 不懂安全） |
| 可读性 | 标准 | 标准 |

**理由**：AI 生成的代码"看着很专业"，但可能藏暗坑。

详见 [quality/code-review](/quality/code-review)。

- --

### Q38. 怎么让团队成员愿意用 AI Coding？
**3 个关键**：

1. **降低门槛**：写好 agents.md，新人 copy 就能用
2. **看到效果**：先在一个"快赢"项目上用，让大家看到收益
3. **不强制**：不强制 100% 用，先用再用工具的人自然会扩散

详见 [team/onboarding](/team/onboarding)。

- --

## 故障篇

### Q39. AI 改了不该改的文件怎么办？
**立即回滚 + 加约束**：

1. **回滚**：`git checkout` / `git restore` 撤销
2. **加约束**：在 agents.md 写明"不要改 X 文件"
3. **明确范围**：用 Plan 模式先列改动清单，AI 按清单改

**预防措施**：
- 用 worktree 隔离 AI 操作
- Review 改动范围
- 关键文件加 .cursorignore

详见 [context/project-structure](/context/project-structure)。

- --

### Q40. AI 删了代码 / 覆盖了我的改动怎么办？
**养成 3 个习惯**：

1. **提交频率高**：每完成一个小功能就 commit，AI 改坏也能找回来
2. **分支隔离**：在分支上让 AI 改，自己 worktree 保护
3. **diff 必看**：AI 改完先 `git diff` 再决定是否保留

**永远不要**：
- 不用 git 保护就给 AI 大改
- 不看 diff 就 commit

详见 [team/git-workflow](/team/git-workflow)。

- --

### Q41. AI 引入了一堆依赖怎么办？
**应对**：

- **Review dependencies**：每次 PR 都跑 `pnpm audit` + 看新增依赖
- **禁止瞎装**：agents.md 写"先 Review 再装新依赖"
- **优先用现有**：明确告诉 AI "只用项目已有依赖"

详见 [security/dependencies](/security/dependencies)。

- --

### Q42. AI 一直返回错误格式怎么办？
**3 个排查方向**：

1. **明确格式**：在 Prompt 里给 JSON Schema 或示例
2. **指定协议**：用 [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling) 或 [Anthropic Tool Use](https://docs.anthropic.com/claude/docs/tool-use)
3. **加校验**：用 zod / pydantic 校验 AI 返回

详见 [context/prompt-engineering](/context/prompt-engineering)。

- --

### Q43. AI 一直重复同样的错误怎么办？
**Reset 对话**：

1. **清空对话历史**：太长的对话让 AI 注意力涣散
2. **重写 Prompt**：精简到核心，去掉无关信息
3. **换模型**：用更强的模型（Opus 4.6 vs Sonnet 4.6）
4. **拆任务**：任务太复杂时拆小

详见 [context/management](/context/management)。

- --

## 没找到答案？
1. **翻目录**：左侧导航栏按主题找章节
2. **看速查卡**：[appendix/cheatsheet](/appendix/cheatsheet) 快速定位
3. **看反模式**：[metrics/anti-patterns](/metrics/anti-patterns) 列出常见错误
4. **提交 issue**：到 [GitHub Issues](https://github.com/webgogogo/ai-coding-guide/issues) 提问题，我们会持续更新 FAQ

- --

## FAQ 元信息
- **适用版本**：2026-08 工具 / 模型快照
- **数据来源**：经验估算 + 公开资料
- **更新频率**：每季度更新
- **贡献方式**：欢迎 PR 补充新 FAQ
