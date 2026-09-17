# AI Coding 工具全景

## 五大核心工具速览
本指南聚焦**五个核心工具**的深度对比，覆盖 IDE 集成、终端 Agent、开源方案三大范式：

| 工具 | 类型 | 核心定位 | 一句话评价 |
| --- | --- | --- | --- |
| **[Trae Solo](/tools/trae)**| AI 原生 IDE | 国产 + 深度集成 Agent | 国产团队的"Cursor 替代" |
| **[Cursor](/tools/cursor)**| AI 原生 IDE | 海外主流 AI 编辑器 | AI Coding 的事实标准 |
| **[Claude Code](/tools/claude-code)**| 终端 Agent | Anthropic 官方 CLI | 复杂重构的"重武器" |
| **[OpenCode](/tools/opencode)**| 终端 Agent（开源） | 开源 + 灵活配置 | 数据敏感团队的首选 |
| **[CodeX](/tools/codex)**| 终端 Agent | OpenAI 官方 CLI | 生态最完善但模型偏弱 |

## 工具分类框架
按"工作环境"和"AI 集成深度"两个维度划分：

```
                    集成深度
                  浅  ←─────→  深
                ┌─────────┬─────────┐
       IDE 内   │ (Copilot)│ Cursor │
                │  Trae   │        │
                ├─────────┼─────────┤
       终端 CLI │  Aider  │ Claude │
                │ OpenCode│  CodeX │
                └─────────┴─────────┘
                      工作环境
```

**本指南聚焦右侧两个象限**：深度集成 + 主流在用的工具。

## 横向对比速查表
| 维度 | Trae Solo | Cursor | Claude Code | OpenCode | CodeX |
| --- | --- | --- | --- | --- | --- |
| **所属公司**| 字节跳动 | Anysphere | Anthropic | 开源社区 | OpenAI |
| **运行方式**| 桌面 IDE | 桌面 IDE | 终端 CLI | 终端 CLI | 终端 CLI |
| **背后模型**| Claude/GPT/DeepSeek | Claude/GPT | Claude 系列 | 多模型可配 | GPT/Codex |
| **中文支持**||  || 取决于模型 ||
| **代码补全**||  ||  ||
| **Agent 模式**||  ||  ||
| **代码库索引**||  || 需手动 ||
| **MCP 支持**||  ||  ||
| **开源**||  ||  ||
| **本地部署**||  ||  ||
| **价格**| 免费 + 付费 | $20/月起 | 按 Token | 免费 | ChatGPT 订阅 |
| **上手难度**| 低 | 低 | 中 | 中 | 中 |

## 典型场景的工具选择
| 场景 | 推荐 | 理由 |
| --- | --- | --- |
| **日常前端开发**| **Cursor**或 **Trae Solo**| IDE 集成最丝滑，补全+对话+Agent 一体化 |
| **复杂重构**| **Claude Code**| 终端 Agent 自主性最强，长上下文优势 |
| **Bug 排查**| **Claude Code**| 可执行命令、读日志、跑测试 |
| **快速原型**| **Cursor / Trae Solo**| Composer 模式批量生成 |
| **开源/数据敏感**| **OpenCode**| 本地部署，代码不出内网 |
| **批量脚本**| **Claude Code / OpenCode**| CLI 范式天然适合脚本化 |
| **团队统一规范**| **Cursor**+ **CLAUDE.md**| 配置文件跨工具复用 |
| **个人尝鲜**| **Trae Solo**（免费） | 中文体验最好，零成本 |

## 推荐组合（按规模分层）

### 组合 A：纯 IDE 派（最常见，小团队）
```
全员使用 Cursor（或 Trae Solo）
        ↓
统一 CLAUDE.md / agents.md
        ↓
Code Review 兜底
```

**适合**：团队成员技术栈差异不大、希望快速上手

### 组合 B：IDE + CLI 派（推荐，中大型团队）
```
日常开发：Cursor（IDE）
复杂任务：Claude Code（CLI）
        ↓
两套工具共享同一份 agents.md
```

**适合**：追求深度、有复杂重构需求的团队

### 组合 C：国产 + 开源派（合规友好，强合规团队）
```
日常开发：Trae Solo（国产 IDE）
复杂任务：OpenCode（开源 CLI，本地模型）
        ↓
代码不出境 + 国产化
```

**适合**：对数据出境敏感、要求国产化的团队

## 选择工具的几个核心问题
选工具前，先回答这 5 个问题：

1. **数据合规**：代码能否出境？→ 决定是否能用海外 SaaS
2. **预算**：每月愿意为 AI Coding 花多少钱？→ 决定订阅档位
3. **团队规模**：从 2 人到 200+ 人 → 决定管理复杂度与工具组合策略
4. **任务类型**：日常 CRUD 还是大型重构？→ 决定需要 IDE 还是 CLI
5. **中文需求**：是否需要中文 UI / 中文文档？→ 决定工具偏好

详见：[工具决策矩阵](/tools/decision-matrix)

## 学习路径建议
```
第 1 周：选一个 IDE（推荐 Cursor）
        ↓
第 2 周：写好你的 agents.md / CLAUDE.md
        ↓
第 3 周：尝试 Agent 模式做一个小功能
        ↓
第 4 周：尝试 CLI Agent（Claude Code）做一次重构
        ↓
第 5+ 周：在团队内部沉淀经验，制定规范
```

下一节：[大模型选择](/tools/models)