#!/usr/bin/env node
/**
 * 百度站长平台 - 主动推送 (sitemap / URL 列表)
 *
 * 用法:
 *   1) 直接传 URL 列表文件: node scripts/baidu-push.mjs path/to/urls.txt
 *   2) 推送整个 sitemap.xml: node scripts/baidu-push.mjs dist/sitemap.xml
 *   3) 不传参则推送 dist/sitemap.xml
 *
 * 环境变量 (可选):
 *   BAIDU_SITE    站点根域名, 如 https://guide.aisk.vip
 *   BAIDU_TOKEN   百度站长平台推送 token
 *
 * 配额: 普通站 10 次/天, 每次最多 5000 条 URL
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const DEFAULT_SITE = 'https://guide.aisk.vip'
const DEFAULT_TOKEN = 'QmcrybTLNoUlbGJn'
const PUSH_ENDPOINT = 'http://data.zz.baidu.com/urls'
const BATCH_SIZE = 5000 // 百度单次最多 5000 条

const SITE = process.env.BAIDU_SITE || DEFAULT_SITE
const TOKEN = process.env.BAIDU_TOKEN || DEFAULT_TOKEN
const PUSH_URL = `${PUSH_ENDPOINT}?site=${SITE}&token=${TOKEN}`

/** 从 sitemap.xml 中提取所有 <loc>URL */
async function parseSitemap(file) {
  const xml = await fs.readFile(file, 'utf-8')
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim())
  return urls
}

/** 判断是否为 sitemap 文件 */
function isSitemap(file) {
  return file.endsWith('.xml') && /sitemap/i.test(path.basename(file))
}

/** 解析命令行文件中的 URL（支持 # 注释与空行） */
async function readUrlFile(file) {
  const txt = await fs.readFile(file, 'utf-8')
  return txt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

/** 单次推送 */
async function push(urls) {
  if (urls.length === 0) {
    console.warn('⚠ 没有可推送的 URL, 已跳过')
    return null
  }

  const body = urls.join('\n')
  console.log(`→ 推送 ${urls.length} 条 URL ...`)

  const res = await fetch(PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body,
  })

  const text = await res.text()
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = { raw: text }
  }

  console.log(`← 状态 ${res.status}:`, JSON.stringify(parsed, null, 2))
  return parsed
}

async function main() {
  const arg = process.argv[2]

  if (arg === '-h' || arg === '--help') {
    console.log(`用法:
  node scripts/baidu-push.mjs                    # 推送 dist/sitemap.xml 中的 URL
  node scripts/baidu-push.mjs <sitemap.xml>      # 推送指定 sitemap
  node scripts/baidu-push.mjs <urls.txt>         # 推送 url 列表文件 (每行一个 URL, # 开头为注释)

环境变量:
  BAIDU_SITE    站点根域名, 默认 ${DEFAULT_SITE}
  BAIDU_TOKEN   百度推送 token, 默认 ${DEFAULT_TOKEN.slice(0, 4)}****
`)
    return
  }

  let urls
  if (!arg) {
    const sitemapPath = path.resolve('dist/sitemap.xml')
    try {
      await fs.access(sitemapPath)
    } catch {
      console.error(`✗ 未找到 ${sitemapPath}, 请先运行 pnpm docs:build 生成 sitemap`)
      process.exit(1)
    }
    urls = await parseSitemap(sitemapPath)
  } else {
    const file = path.resolve(arg)
    urls = isSitemap(file) ? await parseSitemap(file) : await readUrlFile(file)
  }

  console.log(`站点: ${SITE}`)
  console.log(`Token: ${TOKEN.slice(0, 4)}****`)
  console.log(`待推送: ${urls.length} 条 URL`)
  console.log(`接口: ${PUSH_URL}`)
  console.log('---')

  // 分批（每批最多 BATCH_SIZE 条）
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    console.log(`\n[批次 ${Math.floor(i / BATCH_SIZE) + 1}]`)
    await push(batch)
  }

  console.log('\n✓ 完成')
}

main().catch((err) => {
  console.error('✗ 推送失败:', err)
  process.exit(1)
})