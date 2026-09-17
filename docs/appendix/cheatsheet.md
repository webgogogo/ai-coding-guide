# AI Coding 速查卡
> **一页在手，AI Coding 不慌**。本速查卡提炼全指南的关键决策、模板与红线，可作为日常开发、Code Review、决策时的快速参考。

- --

## 0. 30 秒速览
| 我想…… | 怎么做 | 详见 |
| --- | --- | --- |
| 上手 AI Coding | 配置 Cursor / Trae + 写好 agents.md | [quickstart](/guide/quickstart) |
| 选工具 | 用决策矩阵匹配场景 | [decision-matrix](/tools/decision-matrix) |
| 选模型 | 按"日常 / 复杂 / 长上下文"分三层 | [models](/tools/models) |
| 选编码模式 | Vibe（试错）/ Plan（功能）/ Spec（模块） | [modes](/modes/overview) |
| 控成本 | 80/15/5 模型分层 + 缓存 + 本地备份 | [cost](/security/cost) |
| 避坑 | 记住 10 条常见反模式 | [anti-patterns](/metrics/anti-patterns) |

- --

## 1. 三种编码模式选择
>  **核心问题**：这次任务的"确定性"有多高？

```
                任务确定性
        低 ◀─────────────▶ 高
        │                 │
    Vibe Coding       Spec Coding
      (探索)            (实施)
        │                 │
        └──── Plan Coding ┘
              (中间地带)
```

| 维度 | Vibe | Plan | Spec |
| --- | --- | --- | --- |
| **典型场景**| 技术选型、原型、试错 | 单功能/单模块 | 完整模块/长期维护 |
| **时间盒**| 30 分钟 | 1-2 天 | 1-2 周 |
| **产出**| 几个 demo + 判断 | 可运行功能 | 完整模块 + 文档 |
| **AI 自主度**| 高 | 中 | 低 |
| **文档要求**| 无 | 简短计划 | 完整规格 |
| **适合规模**| 个人 | 1-3 人 | 5+ 人 |
| **占比建议**| 20% | 50% | 30% |

**决策口诀**：
- 任务"模糊" → Vibe
- 任务"清晰但分散" → Plan
- 任务"重要且需多人" → Spec

详见 [decision-tree](/modes/decision-tree)

- --

## 2. 模型选择速查（2026-08）

### 按任务选模型
| 任务类型 | 首选 | 备选 | 理由 |
| --- | --- | --- | --- |
| 简单补全/单行 | Sonnet 4.6 | DeepSeek V3.2 | 速度快、价格低 |
| 业务 CRUD | Sonnet 4.6 | DeepSeek V3.2 | 性价比之王 |
| 复杂业务逻辑 | Opus 4.6 | Sonnet 4.6 + 重试 | 推理能力 |
| 多文件重构 | Opus 4.6/5 | Sonnet 4.6 + 拆任务 | 全局视角 |
| 大型代码库分析 | Gemini 3.1 Pro | Opus 5（1M） | 1M 上下文 |
| 看图写前端 | Kimi K2.5 | GPT-5.4 | 原生视觉 |
| 中文文档 | DeepSeek V3.2 | Kimi K2.5 | 中文最强 |
| 调试/排查 Bug | Opus 4.6 | Sonnet 4.6 | 推理能力 |
| 单元测试 | Sonnet 4.6 | DeepSeek V3.2 | 性价比 |

### 模型分层策略（成本控制核心）
| 分层 | 占比 | 适用 | 单价 (1M 输入) |
| --- | --- | --- | --- |
| **便宜层**（DeepSeek V3.2） | 80% | 简单补全、CRUD | $0.28 |
| **主力层**（Sonnet 4.6） | 15% | 日常开发、复杂业务 | $3 |
| **顶级层**（Opus 4.6/5） | 5% | 关键决策、复杂推理 | $5 |

**对比**：全用 Opus 比全用 Sonnet 贵约 5 倍，比 DeepSeek 贵 18 倍。

详见 [models](/tools/models) / [decision-matrix](/tools/decision-matrix)

- --

## 3. 工具选择速查
| 你的需求 | 首选 | 备选 |
| --- | --- | --- |
| 日常开发（中文友好） | **Trae Solo**| Cursor |
| 日常开发（海外） | **Cursor**| Trae Solo |
| 终端 Agent / 深度自动化 | **Claude Code**| OpenCode / CodeX |
| 开源 / 离线 / 合规 | **OpenCode**| Claude Code |
| OpenAI 生态用户 | **CodeX**| Claude Code |
| 跨厂商备份 | **OpenCode**| Cursor + Claude Code |
| 完全本地 | **OpenCode + GLM-5/Qwen3.5 397B**| — |

详见 [tools/overview](/tools/overview) / [decision-matrix](/tools/decision-matrix)

- --

## 4. Prompt 模板速查

### 4.1 任务执行模板
```markdown

# 任务
<一句话说清楚要做什么>

# 上下文
- 项目：<项目名 + 技术栈>
- 文件：<涉及的关键文件>
- 约束：<性能/兼容/安全等>

# 期望产出
- 行为：<输入 → 输出>
- 边界：<异常/边界情况>
- 测试：<如何验证>

# 不要
- 不要修改 X
- 不要引入 Y 依赖
```

### 4.2 调试排查模板
```markdown

# 现象
<错误信息 / 异常行为>

# 复现步骤
1. ...
2. ...

# 已尝试
- ...

# 期望
<应该是什么>
```

### 4.3 重构模板
```markdown

# 目标
<重构后要达到什么>

# 范围
- 涉及文件：<清单>
- 不动：<保留不变的>

# 约束
- 保持 API 向后兼容
- 不改数据库 schema
- 测试不能挂
```

### 4.4 Code Review 请求模板
```markdown
请按以下维度审查 <文件路径>：
1. 正确性（逻辑、边界）
2. 性能（时间/空间复杂度）
3. 安全性（注入、泄露）
4. 可维护性（命名、注释、复杂度）
5. 测试覆盖
```

详见 [prompt-templates](/context/prompt-templates) / [prompt-engineering](/context/prompt-engineering)

- --

## 5. agents.md 必备 20 条
> 放在项目根的 `agents.md` 或 `CLAUDE.md`：

### 5.1 项目基础（5 条）
- [ ] 项目简介（一句话）
- [ ] 技术栈与版本
- [ ] 目录结构说明
- [ ] 关键命令（启动、测试、构建）
- [ ] 环境要求（Node 版本等）

### 5.2 编码规范（8 条）
- [ ] 命名约定（变量/函数/类/文件）
- [ ] 文件组织（单文件最大行数）
- [ ] 导入顺序与规则
- [ ] 注释要求（何时注释、注释什么）
- [ ] 错误处理原则
- [ ] 异步/并发约定
- [ ] 类型严格度
- [ ] 格式化工具（Prettier 配置）

### 5.3 协作约定（4 条）
- [ ] Git 提交规范
- [ ] 分支命名约定
- [ ] PR 流程
- [ ] 禁止项（如禁止提交 secrets）

### 5.4 AI 专属约定（3 条）
- [ ] AI 不要做的事（如改 schema）
- [ ] AI 必须做的事（如先写测试）
- [ ] 反馈机制（如何让 AI 自我改进）

详见 [agents](/context/agents) / [claude-md](/context/claude-md)

- --

## 6. 质量门禁清单

### 提交前 5 分钟自检
- [ ] **类型检查**：`pnpm typecheck` 通过
- [ ] **静态检查**：`pnpm lint` 通过（无 warning）
- [ ] **单元测试**：`pnpm test` 通过（覆盖 > 80%）
- [ ] **格式化**：`pnpm format` 已执行
- [ ] **依赖审计**：`pnpm audit` 无 high/critical

### Code Review 必看 5 点
- [ ] 逻辑正确性（特别是边界条件）
- [ ] 错误处理（不吞错误、不暴露内部）
- [ ] 性能（无 N²、无内存泄漏）
- [ ] 安全（无注入、无 secrets）
- [ ] 可读性（命名清晰、不过度抽象）

### 上线前 10 项检查
- [ ] 所有测试通过
- [ ] CI/CD 全绿
- [ ] 性能测试通过
- [ ] 安全扫描通过
- [ ] 文档更新
- [ ] Feature Flag 已配置
- [ ] 回滚方案就绪
- [ ] 监控/告警已加
- [ ] 数据库迁移可回滚
- [ ] 跨环境验证（dev/staging/prod）

详见 [quality/overview](/quality/overview) / [testing](/quality/testing) / [code-review](/quality/code-review)

- --

## 7. 安全红线（绝对不能）

### 代码安全
- **永不提交**secrets（API key、密码、token）到代码库
- **永不打印**用户敏感信息到日志
- **永不使用**`eval` / `dangerouslySetInnerHTML` 处理用户输入
- **永远不**关闭 HTTPS / CORS / CSP 防护

### 数据合规
- **永不发送**用户生产数据到公网 AI
- **永不**让 AI 处理个人身份信息（PII）
- **永不**跳过审计日志

### Prompt 安全
- **永不**信任 AI 返回的数据结构（必须校验）
- **永不**让 AI 直接执行删除/部署等危险操作（人审后）
- **永不**让 AI 自主选择支付/订阅等付费动作

### 风险操作
- 大型重构前必须写测试
- 数据库 schema 变更必须审核
- 公共 API 变更必须发 RFC

详见 [security/overview](/security/overview) / [secrets](/security/secrets) / [prompt-injection](/security/prompt-injection)

- --

## 8. 成本控制速查

### 8.1 三层成本
| 层级 | 占比建议 | 控制手段 |
| --- | --- | --- |
| 工具订阅 | 10% | 按需订阅，避免全员 Pro |
| 模型 API | 60% | 模型分层 + 缓存 + 路由 |
| 人工时间 | 30% | 模式选对 + 质量前置 |

### 8.2 立即见效的 5 招
1. **80/15/5 模型分层**：80% 用 DeepSeek V3.2，省 60-70% 成本
2. **开启缓存**：Sonnet 4.6 缓存 $0.30 vs 标准 $3，节省 90%
3. **精简上下文**：用 CLAUDE.md / agents.md 替代重复说明
4. **本地备份**：简单任务用 GLM-5 / Qwen3.5 本地，$0
5. **预算告警**：设置单日/单月上限，到额自动降级

### 8.3 不该省的钱
- 安全扫描（省了出事故更贵）
- 关键 Bug 排查（用 Opus 比时间值钱）
- 复杂架构决策（用便宜模型可能大错）

详见 [cost](/security/cost)

- --

## 9. 架构原则速查

### 9.1 7 大架构杠杆（按价值排序）
| 杠杆 | 影响 | 适用 |
| --- | --- | --- |
| 1. **模块化**| 决定 AI 准确率 | 所有项目 |
| 2. **分层**| 决定代码可维护性 | 3+ 模块项目 |
| 3. **接口契约**| 决定 AI 协作质量 | 多文件项目 |
| 4. **单向数据流**| 决定可调试性 | 复杂状态 |
| 5. **状态管理分层**| 决定复杂度 | 全局状态项目 |
| 6. **错误处理架构**| 决定稳定性 | 关键业务 |
| 7. **可视化资产**| 决定团队理解 | 长期项目 |

### 9.2 文件组织原则
```
src/
├── features/<feature>/     # 按特性（推荐 AI 友好）
│   ├── components/
│   ├── hooks/
│   ├── api/
│   └── types.ts
├── shared/                 # 跨特性复用
└── pages/                  # 路由入口
```

**黄金法则**：
- 单文件 < 300 行
- 单特性自包含（修改 1 个特性不需改其他）
- 接口契约先行（types.ts）
- 避免"工具文件夹"（components/、hooks/ 平铺）

详见 [architecture/overview](/architecture/overview) / [modular-design](/architecture/modular-design)

- --

## 10. 常见错误（Anti-patterns）

### 必避
| 反模式 | 后果 | 正确做法 |
| --- | --- | --- |
| 把 AI 当"自动写完整项目" | 大量返工 | Vibe → Plan → Spec 渐进 |
| 一句话无上下文需求 | 产出不可用 | 用 Prompt 模板给完整上下文 |
| 跳过 Review 直接合 | 引入 Bug/漏洞 | 0 信任原则，AI 代码必须 Review |
| 把 secrets 写进 agents.md | 泄露风险 | 只放规则，密钥用环境变量 |
| 让 AI 自主部署/付款 | 不可控 | 关键操作必须人审 |
| 上下文堆到 1M | 贵且慢 | 按需加载，分层管理 |
| 用 Opus 干简单活 | 浪费 18x | 模型分层 80/15/5 |

### 应避
- AI 写测试但人没看
- 一次提 5 个任务给 AI
- 拒绝让 AI 看现有代码
- 拒绝让 AI 改 Bug（只让它写新代码）
- 不更新 agents.md

详见 [anti-patterns](/metrics/anti-patterns) / [limitations](/metrics/limitations)

- --

## 11. 度量指标速查

### 健康基线（经验估算）
| 指标 | 健康值 | 警戒值 | 行动 |
| --- | --- | --- | --- |
| AI 首问准确率 | > 70% | < 50% | 优化 agents.md |
| 代码一次通过率 | > 50% | < 30% | 换更小任务 |
| 返工率 | < 20% | > 40% | 改进 Prompt |
| PR Review 时间 | < 30 分钟 | > 1 小时 | 拆分 PR |
| 工具使用率 | > 80% | < 50% | 加强培训 |
| 团队满意度 | 4+ | < 3 | 收集团队反馈 |

### 每月看一次的指标
- Token 消耗趋势
- 模型分层比例（是否符合 80/15/5）
- 安全事件数
- 工具订阅 ROI

详见 [efficiency](/metrics/efficiency)

- --

## 12. 学习路径速查

### 入门（1-2 周）
1. 阅读 [quickstart](/guide/quickstart)
2. 配置 Cursor / Trae
3. 写第一份 `agents.md`（参考 [claude-md](/context/claude-md)）
4. 尝试 3 种模式各一次

### 进阶（1-2 月）
1. 精读 [context/overview](/context/overview)
2. 掌握 [prompt-engineering](/context/prompt-engineering)
3. 学习 [architecture/overview](/architecture/overview)
4. 建立团队 agents.md 模板

### 资深（持续）
1. 深入 [security/overview](/security/overview)
2. 实施 [team/overview](/team/overview) 流程
3. 跟踪 [metrics/overview](/metrics/overview)
4. 关注 [metrics/future](/metrics/future) 趋势

### 必读 Top 10 章节
1. [guide/intro](/guide/intro)
2. [context/overview](/context/overview)
3. [context/agents](/context/agents)
4. [modes/overview](/modes/overview)
5. [architecture/overview](/architecture/overview)
6. [quality/overview](/quality/overview)
7. [security/overview](/security/overview)
8. [metrics/anti-patterns](/metrics/anti-patterns)
9. [tools/decision-matrix](/tools/decision-matrix)
10. [case-study/comparison](/case-study/comparison)

- --

## 13. 一页式总结
```
模式：模糊→Vibe | 清晰→Plan | 重要→Spec
模型：80% 便宜 | 15% 主力 | 5% 顶级
工具：日常 Cursor/Trae | 自动化 Claude Code | 合规 OpenCode
agents.md：项目+规范+协作+AI 约定
质量：类型+测试+Review 必做
安全：secrets 不进库 | 用户数据不出网
成本：分层 + 缓存 + 预算
架构：模块化 + 契约先行 + 单向数据流
避坑：渐进模式 + 完整 Prompt + 0 信任
度量：首问准确率 / 一次通过率 / 返工率
```

- --

## 使用建议
1. **打印或收藏**本页到书签
2. **Code Review 时**打开"质量门禁清单"对照
3. **决策时**看"模式选择"+"工具选择"决策图
4. **写 Prompt 时**复制"Prompt 模板"作为起点
5. **每周复盘**团队扫一次"反模式清单"

> 速查卡是**起点**，具体细节请跳转对应章节深入阅读。

---

## 14. Tabler 图标使用速查

本指南使用 [Tabler Icons](https://tabler.io/icons)（4000+ 开源矢量图标）作为内容图标标准。

### 基本用法

```markdown
<Icon icon="tabler:tools" width="20" />
```

### 本指南常用图标

| 图标 | 名称 | 用途 |
| --- | --- | --- |
| <Icon icon="tabler:tools" width="18" /> | `tabler:tools` | 工具、配置 |
| <Icon icon="tabler:prompt" width="18" /> | `tabler:prompt` | Prompt / 上下文 |
| <Icon icon="tabler:code" width="18" /> | `tabler:code` | 代码、编码 |
| <Icon icon="tabler:building-arch" width="18" /> | `tabler:building-arch` | 架构 |
| <Icon icon="tabler:shield-check" width="18" /> | `tabler:shield-check` | 安全、质量 |
| <Icon icon="tabler:users-group" width="18" /> | `tabler:users-group` | 团队 |
| <Icon icon="tabler:lock-square" width="18" /> | `tabler:lock-square` | 权限、密钥 |
| <Icon icon="tabler:chart-bar" width="18" /> | `tabler:chart-bar` | 度量、统计 |
| <Icon icon="tabler:alert-triangle" width="18" /> | `tabler:alert-triangle` | 警告、注意 |
| <Icon icon="tabler:check" width="18" /> | `tabler:check` | 正确、已通过 |
| <Icon icon="tabler:x" width="18" /> | `tabler:x` | 错误、必避 |
| <Icon icon="tabler:bulb" width="18" /> | `tabler:bulb` | 提示、Tip |
| <Icon icon="tabler:book" width="18" /> | `tabler:book` | 文档、章节 |
| <Icon icon="tabler:clock" width="18" /> | `tabler:clock` | 时间、性能 |
| <Icon icon="tabler:cash" width="18" /> | `tabler:cash` | 成本、费用 |

### 常用属性

| 属性 | 作用 | 示例 |
| --- | --- | --- |
| `icon` | 图标 ID（必填） | `icon="tabler:home"` |
| `width` | 宽度（默认 24） | `width="32"` |
| `height` | 高度（默认同 width） | `height="32"` |
| `color` | 颜色 | `color="#3b82f6"` |

### 查找图标

访问 [tabler.io/icons](https://tabler.io/icons) 搜索关键词，把图标名填到 `tabler:` 后即可使用。完整 ID 格式：`tabler:<name>`。

