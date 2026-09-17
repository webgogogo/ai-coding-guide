---
layout: home
title: AI Coding 实践指南
seo:
  title: AI Coding 实践指南 - 团队 AI 编码的工程化最佳实践
  description: 面向所有团队的 AI 编码最佳实践，系统讲解 Cursor、Claude Code、Trae Solo、Codex、OpenCode 等主流工具的选型方法、Vibe/Plan/Spec 三种编码模式、上下文工程、架构设计、质量保障与团队落地方法论。
  keywords: AI Coding, AI 编程, Cursor, Claude Code, Trae, Codex, OpenCode, Vibe Coding, Plan Coding, Spec Coding, 上下文工程, Prompt 工程, AI 编码最佳实践, 前端 AI 开发, 团队 AI 落地, AI 辅助编程, LLM 编程

hero:
  name: "AI Coding 实践指南"
  text: "团队 AI 编码的工程化实践"
  tagline: "从前端开发视角，系统讲解 AI Coding 的工具选型、编码模式与团队落地"
  image:
    src: /logo.svg
    alt: AI Coding Guide
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 开始阅读
      link: /guide/intro
---

## 核心主题速览

<div class="vp-icon-grid">

<a href="/tools/overview" class="vp-icon-card">
<div class="vp-icon-wrap"><Icon icon="tabler:tools" width="28" /></div>
<h3>工具与模型</h3>
<p>五大工具速览 · 横向对比 · 场景选型</p>
</a>

<a href="/context/overview" class="vp-icon-card">
<div class="vp-icon-wrap"><Icon icon="tabler:prompt" width="28" /></div>
<h3>上下文工程</h3>
<p>6 个层级 · ROI 分析 · 实战原则</p>
</a>

<a href="/modes/overview" class="vp-icon-card">
<div class="vp-icon-wrap"><Icon icon="tabler:code" width="28" /></div>
<h3>三种编码模式</h3>
<p>三大模式速览 · 决策树 · 组合使用</p>
</a>

<a href="/architecture/overview" class="vp-icon-card">
<div class="vp-icon-wrap"><Icon icon="tabler:building-arch" width="28" /></div>
<h3>架构设计</h3>
<p>模块化 · 6 大架构 · 收益数据</p>
</a>

<a href="/quality/overview" class="vp-icon-card">
<div class="vp-icon-wrap"><Icon icon="tabler:shield-check" width="28" /></div>
<h3>代码质量保障</h3>
<p>4 大支柱 · 零信任原则 · 质量门禁</p>
</a>

<a href="/team/overview" class="vp-icon-card">
<div class="vp-icon-wrap"><Icon icon="tabler:users-group" width="28" /></div>
<h3>团队协作与流程</h3>
<p>4 大流程 · 协作模型 · 成熟度模型</p>
</a>

<a href="/security/overview" class="vp-icon-card">
<div class="vp-icon-wrap"><Icon icon="tabler:lock-square" width="28" /></div>
<h3>安全、合规与成本</h3>
<p>4 类风险 · 风险矩阵 · 安全原则</p>
</a>

<a href="/metrics/overview" class="vp-icon-card">
<div class="vp-icon-wrap"><Icon icon="tabler:chart-bar" width="28" /></div>
<h3>评估、度量与反模式</h3>
<p>4 大主题 · 度量原则 · 反模式</p>
</a>

</div>

## 关于本指南

这是一份**面向前端开发者的 AI Coding 实践指南**，覆盖从个人开发者到大型团队的真实落地场景。

我们不谈空泛的"AI 将取代程序员"，只讲：

- **怎么选**——工具与模型该如何选型
- **怎么用**——Vibe / Plan / Spec 三种模式怎么用最有效
- **怎么管**——代码质量、团队流程、安全合规怎么管
- **怎么避坑**——反模式、局限、踩坑总结

## 阅读对象

<div class="vp-icon-grid">

<a href="/guide/quickstart" class="vp-icon-card vp-audience-card">
<div class="vp-icon-wrap"><Icon icon="tabler:user-code" width="28" /></div>
<h3>个人开发者</h3>
<p>Vibe / Plan / Spec 模式选择 + 工具选型 + 上下文工程实战</p>
</a>

<a href="/team/overview" class="vp-icon-card vp-audience-card">
<div class="vp-icon-wrap"><Icon icon="tabler:users" width="28" /></div>
<h3>技术 Lead / 架构师</h3>
<p>团队 agents.md 模板 + Review 流程 + 培训推广方案</p>
</a>

</div>

## 阅读指南

本指南规模较大、内容较多，根据你的角色和目标时间，可选择不同阅读路径。

<div class="vp-doc-stats">

<div class="vp-doc-stat">
<Icon icon="tabler:file-text" width="22" />
<strong>~10 万字</strong>
<span>总字数</span>
</div>

<div class="vp-doc-stat">
<Icon icon="tabler:files" width="22" />
<strong>65 个</strong>
<span>MD 文件</span>
</div>

<div class="vp-doc-stat">
<Icon icon="tabler:layout-grid" width="22" />
<strong>11 节</strong>
<span>核心章节</span>
</div>

<div class="vp-doc-stat">
<Icon icon="tabler:clock" width="22" />
<strong>5-6 小时</strong>
<span>完整通读</span>
</div>

</div>

| 阅读方式 | 预计时长 | 推荐路径 |
| --- | --- | --- |
| **快速上手** | 30 分钟 | [快速开始](/guide/quickstart) → [工具选型](/tools/overview) |
| **速查参考** | 1-2 小时 | [速查卡](/appendix/cheatsheet) → [FAQ](/appendix/faq) |
| **系统学习** | 5-6 小时 | 按导航顺序完整通读 |
| **团队培训** | 3-4 小时 | [快速开始](/guide/quickstart) + [模式选择](/modes/decision-tree) + [团队协作](/team/overview) + 实战演练 |
