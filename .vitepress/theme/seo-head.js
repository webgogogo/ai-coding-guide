import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'

/**
 * 通用 SEO head 注入组件
 * - 自动根据当前路由计算页面标题、描述、规范化链接
 * - 为每页注入独立的 OG / Twitter Card / JSON-LD
 */
export default {
  ...DefaultTheme,
  enhanceApp({ router }) {
    router.onAfterRouteChanged = (to) => {
      // 占位：路由切换时无操作（保持 SSR 静态生成）
    }
  },
}

// 工具：根据路径生成基础 SEO 信息
export function buildPageSEO(route) {
  const path = route || ''
  const baseUrl = 'https://guide.aisk.vip'
  const fullUrl = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

  // 默认值
  let title = 'AI Coding 实践指南'
  let description = '面向所有团队的 AI 编码最佳实践 · 涵盖 Cursor、Claude Code、Trae、Codex 等工具的选型、Vibe/Plan/Spec 三种编码模式、上下文工程、架构设计、质量保障与团队落地方法论。'
  let keywords = 'AI Coding, AI 编程, AI 辅助编程, LLM 编程'
  let section = ''

  // 各页面定制
  const pageMap = {
    '/guide/quickstart': { title: '快速开始 · AI Coding 实践指南', desc: '5 分钟了解 AI Coding 的核心概念、工具与上手路径。', section: '指南' },
    '/guide/intro': { title: '什么是 AI Coding · AI Coding 实践指南', desc: '深入理解 AI Coding 的本质、价值与适用场景。', section: '指南' },
    '/guide/history': { title: 'AI Coding 演变史 · AI Coding 实践指南', desc: '从 Copilot 到 Claude Code、Cursor，回顾 AI 辅助编程的演进历程。', section: '指南' },
    '/guide/frontend-evolution': { title: '前端领域的 AI Coding 发展 · AI Coding 实践指南', desc: '前端工程师视角下的 AI 编程演变与技术栈变迁。', section: '指南' },
    '/guide/challenges': { title: 'AI Coding 的瓶颈与挑战 · AI Coding 实践指南', desc: '诚实面对 AI 编程的当前边界：上下文、质量、安全与团队协作挑战。', section: '指南' },

    '/tools/overview': { title: 'AI 编码工具总览 · AI Coding 实践指南', desc: 'Cursor、Claude Code、Trae Solo、OpenCode、Codex 等主流 AI 编码工具横向对比与场景化推荐。', section: '工具' },
    '/tools/models': { title: '大模型选择 · AI Coding 实践指南', desc: '主流编程大模型的能力对比与选型建议：GPT-4、Claude、DeepSeek、Qwen 等。', section: '工具' },
    '/tools/cursor': { title: 'Cursor 实战指南 · AI Coding 实践指南', desc: 'Cursor IDE 的最佳实践、快捷键、上下文管理与团队配置。', section: '工具' },
    '/tools/claude-code': { title: 'Claude Code 实战指南 · AI Coding 实践指南', desc: 'Claude Code 命令行工具的安装、CLAUDE.md 配置与高级用法。', section: '工具' },
    '/tools/trae': { title: 'Trae Solo 实战指南 · AI Coding 实践指南', desc: 'Trae Solo 的 Solo Agent 工作流与多 Agent 协同模式。', section: '工具' },
    '/tools/opencode': { title: 'OpenCode 实战指南 · AI Coding 实践指南', desc: 'OpenCode 开源 AI 编程工具的使用与配置。', section: '工具' },
    '/tools/codex': { title: 'CodeX 实战指南 · AI Coding 实践指南', desc: 'CodeX CLI 的使用技巧与团队实践。', section: '工具' },
    '/tools/decision-matrix': { title: '工具决策矩阵 · AI Coding 实践指南', desc: '基于团队规模、项目类型、预算的 AI 工具选型决策矩阵。', section: '工具' },

    '/context/overview': { title: '上下文工程 · AI Coding 实践指南', desc: '系统讲解 AI 编程中的上下文工程：项目结构、agents.md、CLAUDE.md、Prompt 模板与多 Agent 协同。', section: '上下文' },
    '/context/prompt-engineering': { title: 'Prompt 工程技巧 · AI Coding 实践指南', desc: '面向 AI 编码的 Prompt 写作技巧：角色、目标、约束、示例与迭代方法。', section: '上下文' },
    '/context/prompt-templates': { title: 'Prompt 模板库 · AI Coding 实践指南', desc: '经过验证的 AI 编程 Prompt 模板：重构、调试、测试、Code Review 一键调用。', section: '上下文' },
    '/context/project-structure': { title: '项目结构最佳实践 · AI Coding 实践指南', desc: '为 AI 编程而设计的项目目录结构、配置文件与文档组织方式。', section: '上下文' },
    '/context/agents': { title: 'agents.md 约束规范 · AI Coding 实践指南', desc: '使用 agents.md 统一 AI Agent 的行为、约束与项目规范。', section: '上下文' },
    '/context/claude-md': { title: 'CLAUDE.md 与自定义指令 · AI Coding 实践指南', desc: '通过 CLAUDE.md 等自定义指令文件沉淀团队知识与编码规范。', section: '上下文' },
    '/context/management': { title: '上下文管理策略 · AI Coding 实践指南', desc: '大型项目中 AI 上下文的分片、压缩与持久化策略。', section: '上下文' },
    '/context/multi-agent': { title: '多 Agent 角色协同 · AI Coding 实践指南', desc: '产品经理、架构师、工程师、QA 多 Agent 协同的工程实践。', section: '上下文' },

    '/modes/overview': { title: '三种编码模式 · AI Coding 实践指南', desc: 'Vibe Coding、Plan Coding、Spec Coding 三种 AI 编码模式的本质区别与适用场景。', section: '模式' },
    '/modes/vibe-coding': { title: 'Vibe Coding · AI Coding 实践指南', desc: '凭直觉与 AI 高频迭代的 Vibe Coding 模式：探索、原型、创意场景的最佳选择。', section: '模式' },
    '/modes/plan-coding': { title: 'Plan Coding · AI Coding 实践指南', desc: '先规划后编码的 Plan Coding 模式：复杂任务与中型特性的工程化实践。', section: '模式' },
    '/modes/spec-coding': { title: 'Spec Coding · AI Coding 实践指南', desc: '规格先行的 Spec Coding 模式：大型重构、跨团队协作与长期可维护性。', section: '模式' },
    '/modes/decision-tree': { title: '模式选择决策树 · AI Coding 实践指南', desc: '基于任务复杂度、变更范围、协作规模选择最合适的 AI 编码模式。', section: '模式' },

    '/architecture/overview': { title: 'AI 时代的架构设计 · AI Coding 实践指南', desc: 'AI 编码时代的架构设计原则：模块化、分层、状态管理、数据流与可视化。', section: '架构' },
    '/architecture/modular-design': { title: '模块化设计 · AI Coding 实践指南', desc: '为 AI 编码而设计的模块化架构：高内聚低耦合、可测试、可提示。', section: '架构' },
    '/architecture/layered-architecture': { title: '分层架构 · AI Coding 实践指南', desc: '表现层、业务层、数据层的清晰边界与 AI 协作策略。', section: '架构' },
    '/architecture/state-management': { title: '状态管理分层 · AI Coding 实践指南', desc: '本地状态、全局状态、服务端状态的合理分层与 AI 上下文边界。', section: '架构' },
    '/architecture/data-flow': { title: '单向数据流 · AI Coding 实践指南', desc: '单向数据流在 AI 编程时代的价值与最佳实践。', section: '架构' },
    '/architecture/contract-first': { title: '接口契约先行 · AI Coding 实践指南', desc: 'API 契约先行的开发模式：让 AI 与人类在同一接口下高效协作。', section: '架构' },
    '/architecture/error-handling': { title: '错误处理架构 · AI Coding 实践指南', desc: '统一的错误处理架构：让 AI 生成的代码也能保持健壮性与可观测性。', section: '架构' },
    '/architecture/visualization': { title: '可视化架构资产 · AI Coding 实践指南', desc: '架构图、流程图、时序图：让 AI 更好理解系统的可视化方法。', section: '架构' },

    '/quality/overview': { title: 'AI 时代的代码质量保障 · AI Coding 实践指南', desc: 'Code Review、测试、静态检查、调试在 AI 编程时代的全新工作流。', section: '质量' },
    '/quality/code-review': { title: 'Code Review 工作流 · AI Coding 实践指南', desc: 'AI 生成代码的 Code Review 清单、关注点与团队协作规范。', section: '质量' },
    '/quality/testing': { title: '测试策略 · AI Coding 实践指南', desc: 'AI 编程时代的测试金字塔：单元测试、集成测试、E2E 测试的最佳配比。', section: '质量' },
    '/quality/lint-typecheck': { title: '静态检查体系 · AI Coding 实践指南', desc: 'ESLint、TypeScript、Prettier 在 AI 编程时代的配置策略与质量门禁。', section: '质量' },
    '/quality/debugging': { title: '调试与排错 · AI Coding 实践指南', desc: 'AI 生成代码的常见 Bug 模式、调试技巧与回归测试。', section: '质量' },

    '/team/overview': { title: '团队协作与流程 · AI Coding 实践指南', desc: 'Git 工作流、PR 规范、团队上手与知识沉淀的 AI 时代升级版。', section: '团队' },
    '/team/git-workflow': { title: 'Git 工作流 · AI Coding 实践指南', desc: '适合 AI 编程时代的 Git 分支策略、提交规范与协作流程。', section: '团队' },
    '/team/pr-review': { title: 'PR 与 Review 规范 · AI Coding 实践指南', desc: 'AI 协作下的 Pull Request 模板、Review 清单与评审流程。', section: '团队' },
    '/team/onboarding': { title: '团队上手路径 · AI Coding 实践指南', desc: '从 0 到 1 推行 AI Coding 的团队培训、试点与推广方法。', section: '团队' },
    '/team/knowledge-base': { title: 'Prompt 与经验沉淀 · AI Coding 实践指南', desc: '团队 Prompt 库、踩坑记录、最佳实践的可持续沉淀机制。', section: '团队' },

    '/security/overview': { title: '安全、合规与成本 · AI Coding 实践指南', desc: 'AI 编程中的敏感信息保护、依赖审计、Prompt Injection 防护与成本治理。', section: '安全' },
    '/security/secrets': { title: '敏感信息保护 · AI Coding 实践指南', desc: 'AI 编程中 API Key、Token、隐私数据的保护策略与工具。', section: '安全' },
    '/security/dependencies': { title: '依赖与合规审计 · AI Coding 实践指南', desc: 'AI 生成的依赖、许可证审计与供应链安全。', section: '安全' },
    '/security/prompt-injection': { title: 'Prompt Injection 防护 · AI Coding 实践指南', desc: '代码、注释、文档中的 Prompt Injection 风险与防御实践。', section: '安全' },
    '/security/cost': { title: '成本治理 · AI Coding 实践指南', desc: 'AI 编程的 Token 成本、订阅成本、人力成本评估与优化。', section: '安全' },

    '/metrics/overview': { title: '评估、度量与反模式 · AI Coding 实践指南', desc: 'AI 编程的效率度量、常见反模式、能力边界与未来趋势。', section: '度量' },
    '/metrics/efficiency': { title: '效率度量指标 · AI Coding 实践指南', desc: 'AI Coding 的关键效率指标：开发周期、代码质量、缺陷率与 ROI。', section: '度量' },
    '/metrics/anti-patterns': { title: '常见反模式 · AI Coding 实践指南', desc: 'AI 编程中需要警惕的反模式：过度依赖、缺乏验证、安全疏忽等。', section: '度量' },
    '/metrics/limitations': { title: '局限与边界 · AI Coding 实践指南', desc: '坦诚面对 AI Coding 当前的能力边界：复杂业务、跨系统、长期维护的挑战。', section: '度量' },
    '/metrics/future': { title: '未来趋势 · AI Coding 实践指南', desc: 'AI 编程的未来：多模态、自主 Agent、规格化与人机协作的新范式。', section: '度量' },

    '/case-study/overview': { title: '实战案例 · AI Coding 实践指南', desc: 'Vibe Coding、Plan Coding、Spec Coding 三种模式的真实案例与对比总结。', section: '案例' },
    '/case-study/vibe': { title: 'Vibe Coding 实战 · AI Coding 实践指南', desc: '用 Vibe Coding 模式从想法到原型的完整实战案例。', section: '案例' },
    '/case-study/plan': { title: 'Plan Coding 实战 · AI Coding 实践指南', desc: '用 Plan Coding 模式完成中型功能开发的完整实战。', section: '案例' },
    '/case-study/spec': { title: 'Spec Coding 实战 · AI Coding 实践指南', desc: '用 Spec Coding 模式完成大型重构的完整实战。', section: '案例' },
    '/case-study/comparison': { title: '模式对比总结 · AI Coding 实践指南', desc: '三种 AI 编码模式在同一项目中的对比实验与结论。', section: '案例' },

    '/appendix/cheatsheet': { title: 'AI Coding 速查卡 · AI Coding 实践指南', desc: 'AI 编程常用命令、快捷键、Prompt 模板与最佳实践速查表。', section: '附录' },
    '/appendix/faq': { title: '常见问题 FAQ · AI Coding 实践指南', desc: '关于 AI Coding 工具、流程、成本、安全、效果的常见问题与解答。', section: '附录' },
    '/appendix/resources': { title: '进阶资源 · AI Coding 实践指南', desc: 'AI Coding 学习路线、推荐书籍、博客、视频与社区资源。', section: '附录' },
    '/appendix/glossary': { title: '术语表 · AI Coding 实践指南', desc: 'AI Coding 相关术语解释：Token、Context、Agent、Prompt、Spec 等。', section: '附录' },
    '/appendix/starter-kit': { title: '配套模板 Starter Kit · AI Coding 实践指南', desc: '可直接使用的项目模板：agents.md、CLAUDE.md、Prompt 库、CI 配置。', section: '附录' },

    '/contact': { title: '联系我 · AI Coding 实践指南', desc: '通过邮件、GitHub 与作者交流 AI Coding 实践经验与反馈。', section: '' },
  }

  const found = pageMap[path]
  if (found) {
    title = found.title
    description = found.desc
    section = found.section
  }

  return {
    title,
    description,
    keywords,
    fullUrl,
    baseUrl,
    section,
  }
}