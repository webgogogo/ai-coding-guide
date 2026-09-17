# 架构设计：总览

## 核心观点：模块化是最大杠杆
> **没有好的模块边界，再强的模型也只能产出"能跑但难维护"的代码。**很多团队以为"用了 AI Coding 工具就能提效"，但忽略了**架构设计**这个隐藏杠杆。本章要回答：

> **架构设计如何放大 AI Coding 的效能？答案是 6 个对 AI 友好的设计组合。**-省**上下文**——模块边界就是上下文边界
- 省**返工**——清晰边界让 AI 一次写对
- 省**审查**——边界明确，Review 只看接口不看实现
- 省**协作**——多人 + 多 Agent 并行不冲突

## 为什么"模块化"在 AI Coding 时代尤其重要

### 反例：单体大泥球 + AI
```bash
> 帮我给 src/index.ts 加一个用户管理功能
```

AI 看到的：
- 一个 5000 行的 `src/index.ts`
- 没有清晰的目录结构
- 类型、组件、API、状态全混在一起

**AI 的输出**：在文件末尾追加一堆代码、自己造一套命名、直接 `fetch` 而不抽 service。

**结果**：看起来对，但合并后整个团队的开发体验崩盘。

### 正例：模块化 + AI
```bash
> 在 src/features/user/ 下新建一个用户列表功能，要求：
> - 参考 @src/features/order/ 的结构
> - 遵循 @agents.md 中的"模块自包含"约定
> - 只暴露 index.ts 中的公共 API
```

AI 看到的：
- `features/order/` 是一个完整的"参考实现"
- `agents.md` 明确写了模块化约定
- 边界清楚：用户模块只依赖 `types/` 和 `utils/`

**AI 的输出**：自动按 `components/ hooks/ services/ stores/ types/ index.ts` 模板生成。

**结果**：一次合入零返工。开发者从"打字员"变成"模块边界决策者"。

## 模块化如何"放大" AI Coding

### 1. 模块 = 上下文边界
```
没有模块边界：整个项目 5000 文件 → AI 每次都要"扫一遍"
有模块边界：features/user/ = 8 个文件 → AI 只关心当前模块
```

### 2. 模块 = 可复用模板
当所有业务模块都遵循**同一套目录模板**，AI 只需要"看懂一个"，就能"复制出全部"。

### 3. 模块 = 并行协作单元
| 维度 | 单体大泥球 | 模块化 |
| --- | --- | --- |
| 多 Agent 并行 |  互相覆盖 |  各 Agent 独立模块 |
| PR 冲突 |  频繁 |  极少 |
| Code Review |  看整个项目 |  只看模块接口 |
| 回滚风险 |  高 |  单模块回滚 |
| 新人 onboarding |  2 周起步 |  看 1 个模块就上手 |

## 真实收益数据
>  **以下数据为经验估算**，基于多个团队实践总结，具体数值因项目而异。

| 指标 | 单体项目 | 模块化项目 |
| --- | --- | --- |
| AI 首问准确率 | 30-50% | **70-90%**|
| 单任务 Token 消耗 | 100K-500K | **20K-80K**|
| 返工率（每任务） | 40-60% | **10-20%**|
| PR 平均 Review 时间 | 60+ 分钟 | **15-20 分钟**|
| 新人上手到能合代码 | 2 周 | **2-3 天**|

## 何时不需要过度模块化
| 场景 | 建议 |
| --- | --- |
| Demo / POC / 一次性脚本 |  不需要，单文件就行 |
| 小型工具（<10 文件） |  简单分层即可 |
| 中型项目（10-100 文件） |  按职责分层 |
| 大型业务项目（100+ 文件） |  Feature-based 模块化 |
| 多团队协作 / 微前端 |  Monorepo + 独立可发布模块 |

**原则**：**架构服务于项目，而不是反过来**。

- --

## 不止模块化：6 个对 AI Coding 友好的架构设计
模块化是"骨架"，下面 6 个架构决策共同决定 AI Coding 的"天花板"。

### 总览矩阵
| # | 架构设计 | 对 AI Coding 的核心好处 | 收益 |
| --- | --- | --- | --- |
|| [模块化](/architecture/modular-design) | 上下文边界 / 模板复用 / 并行协作 ||
|| [分层架构](/architecture/layered-architecture) | UI / 业务 / 数据职责分离，AI 改一处不波及其他 ||
|| [状态管理分层](/architecture/state-management) | 让 AI 自动选对工具（Query/Store/Form/URL） ||
|| [单向数据流](/architecture/data-flow) | AI 容易追踪"数据从哪来到哪去" ||
|| [接口契约先行](/architecture/contract-first) | 类型即文档、AI 自动生成 mock / 测试 ||
|| [错误处理架构](/architecture/error-handling) | Result + AppError 让 AI 不"乱 throw" ||
|| [可视化架构资产](/architecture/visualization) | Mermaid / ADR 让 AI"看图写代码" ||

### 协同效应
```
模块化 (骨架)
  + 分层架构 (职责分离)
  + 状态分层 (工具选择)
  + 单向数据流 (可预测性)
  + 接口契约 (类型即文档)
  + 错误处理 (Result + AppError)
  + 可视化资产 (图即规范)
  ─────────────────────
  = AI Coding 的 10 倍效能
```

**单独看**，每个设计都有价值；**组合起来**，形成"AI 友好的项目体质"。

### 阶段对比
| 阶段 | 没有架构设计 | 有完整架构设计 |
| --- | --- | --- |
| **新功能开发**| AI 反复猜、改 5 次 | AI 一次写对 |
| **Bug 修复**| AI 在 5000 行中"找代码" | AI 精确定位到层/模块 |
| **Code Review**| Reviewer 看实现细节 | Reviewer 只看接口契约 |
| **新人上手**| 读一周 agents.md | 看 3 张图 + ADR |
| **跨团队协作**| 各团队 AI 风格不统一 | 全团队 AI 输出同构 |
| **错误处理**| 各处 try-catch 各显神通 | 统一 AppError + Result |

### 选型矩阵
| 项目规模 | 推荐组合 |
| --- | --- |
| **Demo / POC（<10 文件）**| 模块化（轻量）+ 接口契约 |
| **小型工具（10-50 文件）**| 模块化 + 分层架构 + 接口契约 |
| **中型项目（50-200 文件）**| + 状态管理分层 + 错误处理 |
| **大型业务（200+ 文件）**| + 单向数据流 + 可视化资产 |
| **多团队 / 多应用**| 全部 7 个 + Monorepo |

### 落地路线图（推荐 4 周）
**第 1 周：模块化 + 分层 + 接口契约**-建立 feature-based 目录结构
- 在 `agents.md` 中固化约定
- 用 OpenAPI/Zod 建立核心契约
- **预期收益**：AI 首问准确率 30% → 70%

**第 2 周：状态管理分层 + 错误处理**-引入 TanStack Query / RHF / Zustand
- 实现 Result + AppError 基础类
- 给核心 service 加 Result 返回
- **预期收益**：返工率 50% → 20%

**第 3 周：单向数据流 + 可视化**-清理双向绑定和状态散落
- 绘制模块图、数据流图
- 写 3-5 个核心 ADR
- **预期收益**：Review 时间 60min → 20min

**第 4 周：固化与度量**-完善 `agents.md` 模板
- 建立 PR Review Checklist
- 度量效率指标（首问准确率、返工率、Review 时间）
- **预期收益**：新人上手 2 周 → 2-3 天

### 与三种编码模式的组合
| 编码模式 | 必选架构 | 可选架构 |
| --- | --- | --- |
| **Vibe Coding**| 模块化（轻量） | 接口契约 |
| **Plan Coding**| 模块化 + 分层 + 状态 | 单向数据流 + 错误处理 |
| **Spec Coding**| 全部 7 个 | 可视化资产（架构图 + ADR） |

### 协同反模式
```typescript
//  反例：只做模块化，没做错误处理
// 结果：每个 service 的错误处理五花八门
const getUser = async (id) => {
  try { return await http.get(...) }
  catch (e) { console.log(e); return null }  // 错误信息丢失
}

//  反例：只做接口契约，没做状态分层
// 结果：所有状态塞进 Zustand，刷新就丢
const useStore = create((set) => ({
  users: [],       // 服务端数据，刷新就丢！
  filter: '',      // URL 状态，刷新就丢！
}))
```

**结论**：架构设计是"组合拳"，缺一不可。

- --

## 本章导览
| 章节 | 核心问题 |
| --- | --- |
| [架构设计总览](/architecture/overview)（本文） | 为什么模块化是 AI Coding 的杠杆，7 个架构设计总览 |
| [模块化设计](/architecture/modular-design) | 怎么落地模块化（feature-based、Monorepo、AI 协作） |
| [分层架构](/architecture/layered-architecture) | UI / 业务 / 数据 三层分离 |
| [状态管理分层](/architecture/state-management) | Query/Store/Form/URL 各司其职 |
| [单向数据流](/architecture/data-flow) | 数据像"水流"，AI 容易追踪 |
| [接口契约先行](/architecture/contract-first) | 类型即文档，OpenAPI + Zod |
| [错误处理架构](/architecture/error-handling) | Result + AppError，统一错误处理 |
| [可视化架构资产](/architecture/visualization) | Mermaid / ADR 让 AI 看图写代码 |

- --

## 实战原则速览

### DO
- 每个业务模块自包含（components/ hooks/ services/ stores/ types/）
- 只通过 `index.ts` 暴露公共 API
- 在 `agents.md` 中写明"模块化 + 分层 + 状态"约定
- 用同一套模板复制模块
- 模块拆分按"业务边界"而非"技术类型"
- **UI / 业务 / 数据 三层职责清晰，禁止越层**
- **状态分层：服务端用 Query、表单用 RHF、全局用 Zustand**
- **数据单向流动，避免双向绑定 + 状态散落**
- **接口契约先行：类型、Schema、Props 全部 explicit**
- **错误用 Result 模式 + 统一 AppError**
- **Mermaid 图 + ADR + 目录图，让 AI 看图写代码**### DON'T

- 把所有业务代码塞进 `src/` 平铺
- 模块间直接互相 `import` 内部文件
- 一个 Zustand / Redux store 装所有状态
- 用 `any` 或 `// @ts-ignore` 跳过类型校验
- 业务逻辑写在 JSX 里
- 把架构决策只放在脑子里（必须写 ADR）
- 业务流里 `throw new Error`
- UI 写硬编码错误文案

- --

## 下一步
**推荐阅读顺序**：

1.  [项目结构最佳实践](/context/project-structure) — 模块化的基础
2.  [模块化设计](/architecture/modular-design) — 具体落地方法
3.  [Spec Coding](/modes/spec-coding) — 模块化的"规范驱动"模式
4.  [实战案例](/case-study/overview) — 看真实项目如何模块化