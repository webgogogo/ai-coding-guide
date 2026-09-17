<script setup>
import DefaultTheme from 'vitepress/theme'
import PageSEO from './components/PageSEO.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!--
      通过 doc-before slot 在每页文档开头注入 SEO head，
      PageSEO 组件内部调用 useHead() 动态注入 meta。
    -->
    <template #doc-before>
      <PageSEO />
    </template>
  </Layout>
</template>