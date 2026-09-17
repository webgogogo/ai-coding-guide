<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  /** 粒子数（默认 60，移动设备自动降为 30） */
  particleCount: { type: Number, default: 60 },
  /** 粒子最大半径 */
  radius: { type: Number, default: 1.6 },
  /** 连线最大距离（px） */
  linkDistance: { type: Number, default: 130 },
  /** 主色调（HSL hue，0-360） */
  hue: { type: Number, default: 220 },
})

const canvasId = `mouse-glow-${Math.random().toString(36).slice(2, 9)}`

let raf = null
let onResize = null
let onMove = null
let canvas = null

function hexToRgb(hex) {
  const v = hex.replace('#', '')
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  }
}

function getAccentColor() {
  // 优先读取 VitePress 主题色 --vp-c-brand-1
  if (typeof window === 'undefined') return { r: 100, g: 108, b: 255 }
  const root = getComputedStyle(document.documentElement)
  const brand = root.getPropertyValue('--vp-c-brand-1').trim()
  if (brand.startsWith('#')) return hexToRgb(brand)
  const rgb = brand.match(/(\d+),\s*(\d+),\s*(\d+)/)
  if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] }
  return { r: 100, g: 108, b: 255 }
}

onMounted(() => {
  canvas = document.getElementById(canvasId)
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let width = 0
  let height = 0
  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  let isMobile = window.matchMedia('(max-width: 768px)').matches
  let color = getAccentColor()

  const baseCount = props.particleCount
  const count = isMobile ? Math.floor(baseCount * 0.5) : baseCount

  const particles = []
  const mouse = { x: -9999, y: -9999 }

  function resize() {
    if (!canvas) return
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function init() {
    particles.length = 0
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: props.radius * (0.6 + Math.random() * 0.6),
      })
    }
  }

  function step() {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)

    // 粒子移动 + 鼠标吸引力
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy

      // 鼠标引力（近距离时拉向鼠标，距离 > 200px 时不影响）
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const dist = Math.hypot(dx, dy)
      if (dist < 200 && mouse.x > -9999) {
        const force = (1 - dist / 200) * 0.02
        p.vx += (dx / dist) * force
        p.vy += (dy / dist) * force
      }

      // 速度衰减（防止无限加速）
      p.vx *= 0.985
      p.vy *= 0.985

      // 边界反弹
      if (p.x < 0) { p.x = 0; p.vx *= -1 }
      else if (p.x > width) { p.x = width; p.vx *= -1 }
      if (p.y < 0) { p.y = 0; p.vy *= -1 }
      else if (p.y > height) { p.y = height; p.vy *= -1 }
    }

    // 绘制连线
    ctx.lineWidth = 0.8
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i]
        const b = particles[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const d = Math.hypot(dx, dy)
        if (d < props.linkDistance) {
          const alpha = (1 - d / props.linkDistance) * 0.35
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      // 鼠标与粒子的连线
      if (mouse.x > -9999) {
        const dx = particles[i].x - mouse.x
        const dy = particles[i].y - mouse.y
        const d = Math.hypot(dx, dy)
        if (d < props.linkDistance * 1.2) {
          const alpha = (1 - d / (props.linkDistance * 1.2)) * 0.6
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
    }

    // 绘制粒子
    for (const p of particles) {
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }

    raf = requestAnimationFrame(step)
  }

  onResize = () => {
    resize()
    init()
  }
  onMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }

  resize()
  init()
  step()

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMove)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (onResize) window.removeEventListener('resize', onResize)
  if (onMove) window.removeEventListener('mousemove', onMove)
})
</script>

<template>
  <canvas
    :id="canvasId"
    class="mouse-glow-canvas"
    aria-hidden="true"
  />
</template>

<style scoped>
.mouse-glow-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  opacity: 0.85;
}
</style>