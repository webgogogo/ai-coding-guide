<script setup>
// 客户端增强：用于在浏览器 hydration 后，将 SEO meta 写入 document.head
// SSR 阶段的 meta 注入由 config.mjs 的 head 字段完成（提供基础通用 meta）
import { onMounted, watch } from 'vue'
import { useRoute, useData } from 'vitepress'
import { buildPageSEO } from '../seo-head.js'

const route = useRoute()
const { frontmatter } = useData()

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const m = selector.match(/\[(.*?)="(.*?)"\]/)
    if (m) el.setAttribute(m[1], m[2])
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function applySEO() {
  const seo = buildPageSEO(route.path)
  const fm = frontmatter.value || {}
  const fmSeo = fm.seo || {}

  const title = fmSeo.title || seo.title
  const description = fmSeo.description || seo.description
  const keywords = fmSeo.keywords || seo.keywords
  const image = fmSeo.image || `${seo.baseUrl}/logo.svg`
  const url = seo.fullUrl

  document.title = title
  setMeta('meta[name="description"]', 'content', description)
  setMeta('meta[name="keywords"]', 'content', keywords)
  setMeta('meta[property="og:title"]', 'content', title)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[property="og:url"]', 'content', url)
  setMeta('meta[property="og:image"]', 'content', image)
  setMeta('meta[name="twitter:title"]', 'content', title)
  setMeta('meta[name="twitter:description"]', 'content', description)
  setMeta('meta[name="twitter:url"]', 'content', url)
  setMeta('meta[name="twitter:image"]', 'content', image)
  setLink('canonical', url)

  // JSON-LD
  let ld = document.head.querySelector('script[data-page-seo="true"]')
  if (!ld) {
    ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.setAttribute('data-page-seo', 'true')
    document.head.appendChild(ld)
  }
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': fm.layout === 'home' ? 'WebSite' : 'TechArticle',
    headline: title,
    description,
    keywords,
    inLanguage: 'zh-CN',
    url,
    image,
    author: { '@type': 'Organization', name: fm.author || 'AI Coding Guide Team' },
    publisher: {
      '@type': 'Organization',
      name: 'AI Coding 实践指南',
      logo: { '@type': 'ImageObject', url: `${seo.baseUrl}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  })
}

onMounted(applySEO)
watch(() => route.path, applySEO)
</script>

<template>
  <span style="display:none" aria-hidden="true" />
</template>