import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'

const SITE_URL = 'https://guide.aisk.vip'

/**
 * 通过 glob 扫描 docs 下所有 markdown 文件并收集 URL。
 * 兼容 siteConfig 中 nav/sidebar 不可用的场景。
 */
function collectUrls(siteConfig) {
  const urls = new Set()

  // 1. 从 nav / sidebar 收集（如可用）
  const nav = siteConfig?.themeConfig?.nav || []
  for (const item of nav) {
    if (item.link) urls.add(normalize(item.link))
  }
  const sidebar = siteConfig?.themeConfig?.sidebar || {}
  for (const section of Object.values(sidebar)) {
    if (Array.isArray(section)) {
      for (const group of section) {
        for (const it of group?.items || []) {
          if (it.link) urls.add(normalize(it.link))
        }
      }
    }
  }

  // 2. 兜底：直接扫描 srcDir 下的 .md 文件
  const srcDir = siteConfig?.srcDir || 'docs'
  const srcAbs = path.resolve(process.cwd(), srcDir)
  try {
    // 同步遍历（buildEnd 在 Node 主线程执行）
    const files = walkSync(srcAbs)
    for (const file of files) {
      if (!file.endsWith('.md')) continue
      // docs/foo/bar.md -> /foo/bar/
      let rel = path.relative(srcAbs, file).replace(/\\/g, '/').replace(/\.md$/, '')
      if (rel === 'index') rel = ''
      const url = '/' + rel + (rel ? '/' : '')
      urls.add(url)
    }
  } catch {
    // 忽略扫描错误
  }

  return Array.from(urls).filter((u) => !u.includes(':'))
}

function normalize(u) {
  let url = u.startsWith('/') ? u : `/${u}`
  if (url.endsWith('.html')) return url
  return url.endsWith('/') ? url : `${url}/`
}

function walkSync(dir, acc = []) {
  const entries = fsSync.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue
      walkSync(full, acc)
    } else {
      acc.push(full)
    }
  }
  return acc
}

/**
 * 为不同 URL 估算优先级与 changefreq。
 */
function pageMeta(url) {
  if (url === '/' || url === '/index.html') {
    return { priority: '1.0', changefreq: 'weekly' }
  }
  if (/\/(guide|tools|context|modes|architecture)\//.test(url)) {
    return { priority: '0.9', changefreq: 'weekly' }
  }
  if (/\/(quality|team|security|metrics|case-study)\//.test(url)) {
    return { priority: '0.8', changefreq: 'weekly' }
  }
  if (/\/appendix\//.test(url)) {
    return { priority: '0.7', changefreq: 'monthly' }
  }
  if (/\/contact/.test(url)) {
    return { priority: '0.5', changefreq: 'yearly' }
  }
  return { priority: '0.6', changefreq: 'monthly' }
}

/**
 * 生成 sitemap.xml
 */
export async function buildSitemap(siteConfig) {
  const outDir = siteConfig?.outDir || 'dist'
  const urls = collectUrls(siteConfig)
  const now = new Date().toISOString()

  const urlsXml = urls
    .map((u) => {
      const meta = pageMeta(u)
      return `  <url>
    <loc>${SITE_URL}${u}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`

  await fs.writeFile(path.join(outDir, 'sitemap.xml'), xml, 'utf-8')
  // eslint-disable-next-line no-console
  console.log(`✓ sitemap.xml generated (${urls.length} urls)`)
}

/**
 * 生成 RSS 订阅源。
 */
export async function buildRss(siteConfig) {
  const outDir = siteConfig?.outDir || 'dist'
  const siteTitle = siteConfig?.title || 'AI Coding 实践指南'
  const siteDesc = siteConfig?.description || '面向所有团队的 AI 编码最佳实践'

  const items = collectFeedItems(siteConfig)
  const now = new Date().toUTCString()

  const itemsXml = items
    .map(
      (it) => `    <item>
      <title><![CDATA[${it.title}]]></title>
      <link>${SITE_URL}${it.url}</link>
      <guid isPermaLink="true">${SITE_URL}${it.url}</guid>
      <pubDate>${now}</pubDate>
      <description><![CDATA[${it.desc}]]></description>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${siteDesc}]]></description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>VitePress</generator>
${itemsXml}
  </channel>
</rss>
`

  await fs.writeFile(path.join(outDir, 'rss.xml'), xml, 'utf-8')
  // eslint-disable-next-line no-console
  console.log(`✓ rss.xml generated (${items.length} items)`)
}

function collectFeedItems(siteConfig) {
  const items = []
  const seen = new Set()
  const sidebar = siteConfig?.themeConfig?.sidebar || {}

  for (const n of siteConfig?.themeConfig?.nav || []) {
    if (n.link && !seen.has(n.link)) {
      seen.add(n.link)
      items.push({ url: normalize(n.link), title: n.text, desc: '' })
    }
  }
  for (const section of Object.values(sidebar)) {
    if (!Array.isArray(section)) continue
    for (const group of section) {
      for (const item of group?.items || []) {
        if (item.link && !seen.has(item.link)) {
          seen.add(item.link)
          items.push({ url: normalize(item.link), title: item.text, desc: group?.text || '' })
        }
      }
    }
  }

  // 兜底：从 srcDir 扫描所有 .md，根据首行 # 标题生成
  if (items.length === 0) {
    const srcDir = siteConfig?.srcDir || 'docs'
    const srcAbs = path.resolve(process.cwd(), srcDir)
    try {
      const files = walkSync(srcAbs)
      for (const file of files) {
        if (!file.endsWith('.md')) continue
        let rel = path.relative(srcAbs, file).replace(/\\/g, '/').replace(/\.md$/, '')
        if (rel === 'index') rel = ''
        const url = '/' + rel + (rel ? '/' : '')
        const title = extractTitle(file) || rel || 'AI Coding 实践指南'
        items.push({ url, title, desc: '' })
      }
    } catch {
      // ignore
    }
  }
  return items
}

function extractTitle(file) {
  try {
    const content = fsSync.readFileSync(file, 'utf-8')
    const m = content.match(/^#\s+(.+)$/m)
    if (m) return m[1].trim()
  } catch {
    // ignore
  }
  return ''
}