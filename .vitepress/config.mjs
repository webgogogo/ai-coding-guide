import { defineConfig } from 'vitepress'

const siteUrl = 'https://guide.aisk.vip'
const siteTitle = 'AI Coding 实践指南'
const siteDesc = '面向所有团队的 AI 编码最佳实践 · 涵盖 Cursor、Claude Code、Trae、Codex 等工具的选型、Vibe/Plan/Spec 三种编码模式、上下文工程、架构设计、质量保障与团队落地方法论。'
const siteKeywords = 'AI Coding, AI 编程, Cursor, Claude Code, Trae, Codex, OpenCode, Vibe Coding, Plan Coding, Spec Coding, 上下文工程, Prompt 工程, AI 编码最佳实践, 前端 AI 开发, 团队 AI 落地, AI 辅助编程, LLM 编程'

export default defineConfig({
  title: siteTitle,
  description: siteDesc,
  lang: 'zh-CN',
  srcDir: 'docs',
  outDir: 'dist',
  cleanUrls: false,
  ignoreDeadLinks: true,

  // 构建后钩子：自动生成 sitemap.xml 与 rss.xml
  buildEnd: async (siteConfig) => {
    const { buildSitemap, buildRss } = await import('./theme/sitemap-builder.js')
    await buildSitemap(siteConfig)
    await buildRss(siteConfig)

    // 若环境变量 BAIDU_AUTO_PUSH=1，则构建后自动调用百度主动推送
    if (process.env.BAIDU_AUTO_PUSH === '1') {
      try {
        const { spawn } = await import('node:child_process')
        const child = spawn('node', ['scripts/baidu-push.mjs'], {
          stdio: 'inherit',
          env: process.env,
        })
        await new Promise((resolve) => child.on('close', resolve))
      } catch (err) {
        console.warn('⚠ 自动推送失败:', err.message)
      }
    }
  },

  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }],
    ['meta', { name: 'theme-color', content: '#3451b2' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    ['meta', { name: 'generator', content: 'VitePress' }],

    // 基础 SEO
    ['meta', { name: 'keywords', content: siteKeywords }],
    ['meta', { name: 'author', content: 'AI Coding Guide Team' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'baiduspider', content: 'index, follow' }],
    ['meta', { name: 'format-detection', content: 'telephone=no, email=no, address=no' }],
    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],
    ['meta', { name: 'application-name', content: siteTitle }],
    ['meta', { name: 'apple-mobile-web-app-title', content: siteTitle }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'rating', content: 'general' }],
    ['meta', { name: 'distribution', content: 'global' }],
    ['meta', { name: 'revisit-after', content: '7 days' }],
    ['meta', { httpEquiv: 'X-UA-Compatible', content: 'IE=edge,chrome=1' }],
    ['meta', { httpEquiv: 'Content-Language', content: 'zh-CN' }],
    ['meta', { httpEquiv: 'Content-Type', content: 'text/html; charset=utf-8' }],

    // Open Graph (Facebook / 微信 / 知乎等)
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:title', content: siteTitle }],
    ['meta', { property: 'og:description', content: siteDesc }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: `${siteUrl}/logo.svg` }],
    ['meta', { property: 'og:image:type', content: 'image/svg+xml' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:locale:alternate', content: 'en_US' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: siteTitle }],
    ['meta', { name: 'twitter:description', content: siteDesc }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/logo.svg` }],

    // 站点图标
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.svg' }],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#3451b2' }],
    ['link', { rel: 'canonical', href: siteUrl }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: siteTitle, href: `${siteUrl}/rss.xml` }],
    ['link', { rel: 'sitemap', type: 'application/xml', href: `${siteUrl}/sitemap.xml` }],
    ['link', { rel: 'dns-prefetch', href: '//hm.baidu.com' }],

    // 结构化数据 (JSON-LD) - WebSite + Organization
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}#website`,
          url: siteUrl,
          name: siteTitle,
          description: siteDesc,
          inLanguage: 'zh-CN',
          publisher: { '@id': `${siteUrl}#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/?s={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'Organization',
          '@id': `${siteUrl}#organization`,
          name: siteTitle,
          url: siteUrl,
          logo: `${siteUrl}/logo.svg`,
          email: 'mailto:seomaster@126.com',
          sameAs: [
            'https://github.com/webgogogo/ai-coding-guide',
          ],
        },
        {
          '@type': 'WebPage',
          '@id': `${siteUrl}#webpage`,
          url: siteUrl,
          name: siteTitle,
          description: siteDesc,
          inLanguage: 'zh-CN',
          isPartOf: { '@id': `${siteUrl}#website` },
        },
      ],
    })],

    // 百度统计
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?92bd154d12bdb0ed9759b934f490aec8";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    `],
  ],

  themeConfig: {
    nav: [
      { text: '概述', link: '/guide/quickstart', activeMatch: '/guide/' },
      { text: '工具', link: '/tools/overview', activeMatch: '/tools/' },
      { text: '上下文', link: '/context/overview', activeMatch: '/context/' },
      { text: '模式', link: '/modes/overview', activeMatch: '/modes/' },
      { text: '架构', link: '/architecture/overview', activeMatch: '/architecture/' },
      { text: '质量', link: '/quality/overview', activeMatch: '/quality/' },
      { text: '团队', link: '/team/overview', activeMatch: '/team/' },
      { text: '安全', link: '/security/overview', activeMatch: '/security/' },
      { text: '度量', link: '/metrics/overview', activeMatch: '/metrics/' },
      { text: '案例', link: '/case-study/overview', activeMatch: '/case-study/' },
      { text: '附录', link: '/appendix/cheatsheet', activeMatch: '/appendix/' },
      { text: '联系我', link: '/contact' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'AI Coding 概述',
          items: [
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '什么是 AI Coding', link: '/guide/intro' },
            { text: 'AI Coding 演变史', link: '/guide/history' },
            { text: '前端领域的发展', link: '/guide/frontend-evolution' },
            { text: '当前瓶颈与挑战', link: '/guide/challenges' },
          ],
        },
      ],
      '/tools/': [
        {
          text: '工具与模型',
          items: [
            { text: '总览', link: '/tools/overview' },
            { text: '大模型选择', link: '/tools/models' },
            { text: 'Trae Solo', link: '/tools/trae' },
            { text: 'Cursor', link: '/tools/cursor' },
            { text: 'Claude Code', link: '/tools/claude-code' },
            { text: 'OpenCode', link: '/tools/opencode' },
            { text: 'CodeX', link: '/tools/codex' },
            { text: '工具决策矩阵', link: '/tools/decision-matrix' },
          ],
        },
      ],
      '/context/': [
        {
          text: '上下文工程',
          items: [
            { text: '总览', link: '/context/overview' },
            { text: 'Prompt 工程技巧', link: '/context/prompt-engineering' },
            { text: 'Prompt 模板库', link: '/context/prompt-templates' },
            { text: '项目结构最佳实践', link: '/context/project-structure' },
            { text: 'agents.md 约束规范', link: '/context/agents' },
            { text: 'CLAUDE.md / 自定义指令', link: '/context/claude-md' },
            { text: '上下文管理策略', link: '/context/management' },
            { text: '多 Agent 角色协同', link: '/context/multi-agent' },
          ],
        },
      ],
      '/modes/': [
        {
          text: '三种编码模式',
          items: [
            { text: '总览', link: '/modes/overview' },
            { text: 'Vibe Coding', link: '/modes/vibe-coding' },
            { text: 'Plan Coding', link: '/modes/plan-coding' },
            { text: 'Spec Coding', link: '/modes/spec-coding' },
            { text: '模式选择决策树', link: '/modes/decision-tree' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: '架构设计',
          items: [
            { text: '总览', link: '/architecture/overview' },
            { text: '模块化设计', link: '/architecture/modular-design' },
            { text: '分层架构', link: '/architecture/layered-architecture' },
            { text: '状态管理分层', link: '/architecture/state-management' },
            { text: '单向数据流', link: '/architecture/data-flow' },
            { text: '接口契约先行', link: '/architecture/contract-first' },
            { text: '错误处理架构', link: '/architecture/error-handling' },
            { text: '可视化架构资产', link: '/architecture/visualization' },
          ],
        },
      ],
      '/quality/': [
        {
          text: '代码质量保障',
          items: [
            { text: '总览', link: '/quality/overview' },
            { text: 'Code Review 工作流', link: '/quality/code-review' },
            { text: '测试策略', link: '/quality/testing' },
            { text: '静态检查体系', link: '/quality/lint-typecheck' },
            { text: '调试与排错', link: '/quality/debugging' },
          ],
        },
      ],
      '/team/': [
        {
          text: '团队协作与流程',
          items: [
            { text: '总览', link: '/team/overview' },
            { text: 'Git 工作流', link: '/team/git-workflow' },
            { text: 'PR 与 Review 规范', link: '/team/pr-review' },
            { text: '团队上手路径', link: '/team/onboarding' },
            { text: 'Prompt 与经验沉淀', link: '/team/knowledge-base' },
          ],
        },
      ],
      '/security/': [
        {
          text: '安全、合规与成本',
          items: [
            { text: '总览', link: '/security/overview' },
            { text: '敏感信息保护', link: '/security/secrets' },
            { text: '依赖与合规审计', link: '/security/dependencies' },
            { text: 'Prompt Injection 防护', link: '/security/prompt-injection' },
            { text: '成本治理', link: '/security/cost' },
          ],
        },
      ],
      '/metrics/': [
        {
          text: '评估、度量与反模式',
          items: [
            { text: '总览', link: '/metrics/overview' },
            { text: '效率度量指标', link: '/metrics/efficiency' },
            { text: '常见反模式', link: '/metrics/anti-patterns' },
            { text: '局限与边界', link: '/metrics/limitations' },
            { text: '未来趋势', link: '/metrics/future' },
          ],
        },
      ],
      '/case-study/': [
        {
          text: '实战案例',
          items: [
            { text: '总览', link: '/case-study/overview' },
            { text: 'Vibe Coding 实战', link: '/case-study/vibe' },
            { text: 'Plan Coding 实战', link: '/case-study/plan' },
            { text: 'Spec Coding 实战', link: '/case-study/spec' },
            { text: '模式对比总结', link: '/case-study/comparison' },
          ],
        },
      ],
      '/appendix/': [
        {
          text: '附录',
          items: [
            { text: 'AI Coding 速查卡', link: '/appendix/cheatsheet' },
            { text: '常见问题（FAQ）', link: '/appendix/faq' },
            { text: '进阶资源', link: '/appendix/resources' },
            { text: '术语表（Glossary）', link: '/appendix/glossary' },
            { text: '配套模板（Starter Kit）', link: '/appendix/starter-kit' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/webgogogo/ai-coding-guide' },
    ],

    footer: {
      message: 'AI Coding 实践指南 · 探索智能编程新范式',
      copyright: `Copyright © 2024-2026 · MIT License ·
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">皖ICP备17029149号</a> ·
        联系我: <a href="mailto:seomaster@126.com" class="vp-footer-mail">seomaster@126.com</a>`,
    },

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },

    editLink: false,

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            boost: {
              title: 4,
              text: 2,
              tags: 3,
            },
          },
        },
      },
    },
  },
})