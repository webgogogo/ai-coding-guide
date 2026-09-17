import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { Icon } from '@iconify/vue'
import MouseGlow from './components/MouseGlow.vue'
import CustomLayout from './Layout.vue'
import './custom.css'

/**
 * 使用函数式 API 而非 JSX，避免 .js 文件无法解析 JSX 的问题
 * h() 是 Vue 的 createElement 替代品
 */
export default {
  extends: DefaultTheme,
  Layout() {
    return h('div', { class: 'vp-layout-wrapper' }, [
      h(CustomLayout),
      h(MouseGlow),
    ])
  },
  // 全局注册 Icon 组件（基于 @iconify/vue + @iconify-json/tabler）
  // 用法：<Icon icon="tabler:tool" /> 或 <Icon icon="tabler:brand-cursor" width="24" />
  enhanceApp({ app }) {
    app.component('Icon', Icon)
  },
}