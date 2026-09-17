# AI Coding 实践指南

面向所有团队的 AI Coding 最佳实践，覆盖从零到一落地 AI Coding 的完整路径。

## 内容导航

- **工具与模型** — Trae Solo / Cursor / Claude Code / OpenCode / CodeX 对比与决策矩阵
- **上下文工程** — Prompt 技巧、agents.md 约束规范、多 Agent 协同
- **三种编码模式** — Vibe Coding / Plan Coding / Spec Coding 及适用场景决策树
- **架构设计** — 模块化、分层、状态管理、接口契约先行
- **质量保障** — Code Review、测试策略、Lint / TypeCheck 体系
- **团队协作** — Git 工作流、PR Review 规范、团队上手路径
- **安全与成本** — 敏感信息保护、依赖审计、Prompt Injection 防护、Token 成本治理
- **度量与反模式** — 效率指标、常见反模式、局限与边界
- **实战案例** — 三种模式的完整对比与踩坑记录

## 配套示范项目

[ai-coding-template](https://github.com/webgogogo/ai-coding-template) — React 18 + TypeScript 5 + Vite 5 模板，含 agents.md、多 AI 工具配置、全链路 CI 门禁，开箱即用。

## 本地运行

```bash
pnpm install
pnpm docs:dev      # 启动开发服务器 http://localhost:5173
pnpm docs:build    # 构建 dist
pnpm docs:preview  # 预览构建产物
```
