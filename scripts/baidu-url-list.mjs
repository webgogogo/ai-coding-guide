#!/usr/bin/env node
/**
 * 生成百度主动推送 URL 清单
 *
 * 用法:
 *   node scripts/baidu-url-list.mjs
 *   node scripts/baidu-url-list.mjs path/to/sitemap.xml
 *   node scripts/baidu-url-list.mjs -o dist/baidu-urls.txt
 *
 * 默认读取 dist/sitemap.xml，每行一个 URL，
 * 方便手动复制粘贴到百度站长平台主动推送框提交。
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

async function parseSitemap(file) {
  const xml = await fs.readFile(file, 'utf-8')
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim())
}

function isSitemap(file) {
  return file.endsWith('.xml') && /sitemap/i.test(path.basename(file))
}

async function readUrlFile(file) {
  const txt = await fs.readFile(file, 'utf-8')
  return txt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

async function main() {
  const args = process.argv.slice(2)
  let inputPath = path.resolve('dist/sitemap.xml')
  let outputPath = path.resolve('dist/baidu-urls.txt')

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' || args[i] === '--output') {
      outputPath = path.resolve(args[++i])
    } else if (args[i] === '-h' || args[i] === '--help') {
      console.log(`用法:
  node scripts/baidu-url-list.mjs                  # 从 dist/sitemap.xml 提取, 输出到 dist/baidu-urls.txt
  node scripts/baidu-url-list.mjs <sitemap.xml>    # 指定 sitemap
  node scripts/baidu-url-list.mjs -o urls.txt      # 指定输出路径
`)
      return
    } else {
      inputPath = path.resolve(args[i])
    }
  }

  let urls
  if (isSitemap(inputPath)) {
    urls = await parseSitemap(inputPath)
  } else {
    urls = await readUrlFile(inputPath)
  }

  if (urls.length === 0) {
    console.error(`✗ 输入文件 ${inputPath} 中没有找到 URL`)
    process.exit(1)
  }

  // 去重 + 排序
  urls = Array.from(new Set(urls)).sort()

  const body = urls.join('\n') + '\n'
  await fs.writeFile(outputPath, body, 'utf-8')

  console.log(`✓ 已生成 ${urls.length} 个 URL`)
  console.log(`  输出文件: ${outputPath}`)
  console.log(`  提交接口: http://data.zz.baidu.com/urls?site=https://guide.aisk.vip&token=QmcrybTLNoUlbGJn`)
  console.log()
  console.log(`--- 内容预览 (前 ${Math.min(5, urls.length)} 条) ---`)
  urls.slice(0, 5).forEach((u) => console.log(u))
  if (urls.length > 5) console.log(`... 共 ${urls.length} 条`)
}

main().catch((err) => {
  console.error('✗ 生成失败:', err.message)
  process.exit(1)
})