<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const containerRef = ref(null)
const canvasRef = ref(null)

// Motion & Interactive State
const mouse = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  speed: 0,
  prevX: 0,
  prevY: 0
}

const sculptureTransform = ref('')
const auraTransform = ref('')
const causticTransform = ref('')

let animationFrameId = null
let startTime = Date.now()

// Floating Crystal Shards System
let ctx = null
let canvasW = 0
let canvasH = 0
let shards = []

const PALETTE = [
  '#00D6D2', // Electric turquoise
  '#00E5F0', // Bright cyan
  '#62E5DF', // Aqua
  '#28B9B5', // Soft teal
  '#C8F7F4'  // Pale icy cyan
]

function createShard() {
  const isRightSide = Math.random() < 0.85
  const x = isRightSide
    ? canvasW * (0.45 + Math.random() * 0.6)
    : canvasW * (0.35 + Math.random() * 0.7)
  const y = Math.random() * canvasH

  // Number of polygon vertices (3 to 5)
  const numVerts = Math.floor(Math.random() * 3) + 3
  const baseSize = 8 + Math.random() * 26
  const vertices = []
  for (let i = 0; i < numVerts; i++) {
    const angle = (i / numVerts) * Math.PI * 2 + (Math.random() - 0.5) * 0.45
    const r = baseSize * (0.6 + Math.random() * 0.8)
    vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r })
  }

  return {
    x,
    y,
    baseX: x,
    baseY: y,
    z: 0.35 + Math.random() * 1.1, // 3D depth layer
    vertices,
    size: baseSize,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.018,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -0.18 - Math.random() * 0.35, // slow upward float
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    alpha: 0.15 + Math.random() * 0.45,
    pulseOffset: Math.random() * Math.PI * 2
  }
}

function initShards() {
  shards = []
  const count = window.innerWidth < 768 ? 16 : 32
  for (let i = 0; i < count; i++) {
    shards.push(createShard())
  }
}

function handleResize() {
  if (!canvasRef.value || !containerRef.value) return
  canvasW = containerRef.value.clientWidth
  canvasH = containerRef.value.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvasRef.value.width = canvasW * dpr
  canvasRef.value.height = canvasH * dpr
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
  initShards()
}

function handleMouseMove(e) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  
  // Normalized mouse coords (-1 to 1)
  const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1
  const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1

  mouse.targetX = Math.max(-1, Math.min(1, normX))
  mouse.targetY = Math.max(-1, Math.min(1, normY))

  const dx = e.clientX - mouse.prevX
  const dy = e.clientY - mouse.prevY
  const speed = Math.sqrt(dx * dx + dy * dy)
  mouse.speed = Math.min(speed * 0.02, 1.0)

  mouse.prevX = e.clientX
  mouse.prevY = e.clientY
}

function handleTouchMove(e) {
  if (!e.touches || e.touches.length === 0) return
  const touch = e.touches[0]
  handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY })
}

function handleOrientation(e) {
  if (e.gamma !== null && e.beta !== null) {
    mouse.targetX = Math.max(-1, Math.min(1, e.gamma / 25))
    mouse.targetY = Math.max(-1, Math.min(1, (e.beta - 40) / 25))
  }
}

function updateMotion(time) {
  const t = (time - startTime) * 0.001

  // Smooth lerp easing for mouse (0.05 factor)
  mouse.x += (mouse.targetX - mouse.x) * 0.05
  mouse.y += (mouse.targetY - mouse.y) * 0.05
  mouse.speed *= 0.94

  // Multi-frequency organic breathing & floating oscillation
  const floatY = Math.sin(t * 0.75) * 12 + Math.cos(t * 1.3) * 4
  const floatX = Math.cos(t * 0.55) * 8
  const rotZ = Math.sin(t * 0.6) * 1.5
  const scale = 1.0 + Math.sin(t * 0.4) * 0.015

  // 3D Parallax Tilt (centered around 72% 50% on the right side)
  const rotY = mouse.x * 8.5 + floatX * 0.15
  const rotX = -mouse.y * 7.5 + floatY * 0.12
  const transX = -mouse.x * 22 + floatX
  const transY = -mouse.y * 18 + floatY

  sculptureTransform.value = `perspective(1400px) translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`

  // Volumetric Aura dynamic pulsation
  const auraPulse = 0.85 + Math.sin(t * 0.8) * 0.15
  const auraX = transX * 0.6
  const auraY = transY * 0.6
  auraTransform.value = `translate3d(${auraX.toFixed(2)}px, ${auraY.toFixed(2)}px, 0) scale(${auraPulse.toFixed(3)})`

  // Caustic light sweep shift
  const causticShiftX = (mouse.x * 35 + Math.sin(t * 0.9) * 25).toFixed(1)
  const causticShiftY = (mouse.y * 30 + Math.cos(t * 0.7) * 20).toFixed(1)
  causticTransform.value = `translate3d(${causticShiftX}px, ${causticShiftY}px, 0)`
}

function renderCanvas(time) {
  if (!ctx || canvasW === 0 || canvasH === 0) return
  const t = (time - startTime) * 0.001

  ctx.clearRect(0, 0, canvasW, canvasH)

  for (let i = 0; i < shards.length; i++) {
    const s = shards[i]

    // Update position
    s.y += s.vy
    s.x += s.vx + mouse.speed * (mouse.targetX - mouse.x) * 1.5 * s.z
    s.rot += s.rotSpeed

    // Wrap around boundaries
    if (s.y < -60) {
      s.y = canvasH + 40
      s.x = canvasW * (0.45 + Math.random() * 0.6)
    }
    if (s.x > canvasW + 60) s.x = canvasW * 0.45
    if (s.x < canvasW * 0.35) s.x = canvasW * 0.95

    // Depth parallax coordinates
    const renderX = s.x - mouse.x * 35 * s.z
    const renderY = s.y - mouse.y * 28 * s.z

    // Strict fade-out towards left 45% (keeps left side clean and open)
    let leftFade = 1.0
    const leftThreshold = canvasW * 0.48
    const fadeStart = canvasW * 0.35
    if (renderX < leftThreshold) {
      leftFade = Math.max(0, (renderX - fadeStart) / (leftThreshold - fadeStart))
    }
    if (leftFade <= 0.01) continue

    const currentAlpha = s.alpha * leftFade * (0.8 + Math.sin(t * 1.8 + s.pulseOffset) * 0.2)

    ctx.save()
    ctx.translate(renderX, renderY)
    ctx.rotate(s.rot)
    ctx.scale(s.z, s.z)

    // Draw translucent faceted shard
    ctx.beginPath()
    ctx.moveTo(s.vertices[0].x, s.vertices[0].y)
    for (let v = 1; v < s.vertices.length; v++) {
      ctx.lineTo(s.vertices[v].x, s.vertices[v].y)
    }
    ctx.closePath()

    // Glass Shard Fill
    ctx.fillStyle = s.color
    ctx.globalAlpha = currentAlpha
    ctx.fill()

    // Refractive Highlight Edge
    ctx.lineWidth = 1.2
    ctx.strokeStyle = isDark.value ? '#C8F7F4' : '#FFFFFF'
    ctx.globalAlpha = Math.min(1.0, currentAlpha * 1.5)
    ctx.stroke()

    ctx.restore()
  }
}

function animateLoop() {
  const now = Date.now()
  updateMotion(now)
  renderCanvas(now)
  animationFrameId = requestAnimationFrame(animateLoop)
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    handleResize()
  }

  animateLoop()

  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation, { passive: true })
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
  if (window.DeviceOrientationEvent) {
    window.removeEventListener('deviceorientation', handleOrientation)
  }
})
</script>

<template>
  <div ref="containerRef" class="hero-motion-stage">
    <!-- Ambient Base Warm Off-White / Dark Backdrop -->
    <div class="stage-backdrop" :class="{ 'is-dark': isDark }"></div>

    <!-- 3D Crystalline Sculpture Layer (Right 55%) -->
    <div class="sculpture-3d-scene">
      <!-- Volumetric Luminous Aura Behind Crystal -->
      <div
        class="volumetric-aura"
        :class="{ 'is-dark': isDark }"
        :style="{ transform: auraTransform }"
      ></div>

      <!-- Moving 3D Crystalline Artwork Container -->
      <div class="sculpture-wrapper" :style="{ transform: sculptureTransform }">
        <img
          :src="isDark ? '/hero-bg-dark.jpg' : '/hero-bg.jpg'"
          alt="3D Crystalline Glass Sculpture"
          class="sculpture-image"
          :class="{ 'is-dark': isDark }"
          draggable="false"
        />

        <!-- Dynamic Traveling Caustic Light Refraction -->
        <div
          class="caustic-sweep"
          :class="{ 'is-dark': isDark }"
          :style="{ transform: causticTransform }"
        ></div>
      </div>
    </div>

    <!-- Floating 3D Crystal Shards & Refractive Light Dust -->
    <canvas ref="canvasRef" class="shards-canvas"></canvas>
  </div>
</template>

<style scoped>
/* Motion Stage Container */
.hero-motion-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

/* Warm Off-White Base (#F7F7F5) */
.stage-backdrop {
  position: absolute;
  inset: 0;
  background-color: #F7F7F5;
  transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}

.stage-backdrop.is-dark {
  background-color: #000000;
}

/* 3D Scene Host */
.sculpture-3d-scene {
  position: absolute;
  inset: 0;
  z-index: 2;
  perspective: 1400px;
  transform-style: preserve-3d;
  overflow: hidden;
}

/* Volumetric Cyan/Turquoise Light Aura */
.volumetric-aura {
  position: absolute;
  top: 15%;
  right: -5%;
  width: 65vw;
  height: 75vh;
  border-radius: 50%;
  background: radial-gradient(
    circle at 60% 50%,
    rgba(0, 229, 240, 0.28) 0%,
    rgba(0, 214, 210, 0.18) 35%,
    rgba(40, 185, 181, 0.08) 60%,
    transparent 80%
  );
  filter: blur(60px);
  pointer-events: none;
  transition: opacity 0.4s ease;
  will-change: transform;
}

.volumetric-aura.is-dark {
  background: radial-gradient(
    circle at 60% 50%,
    rgba(0, 229, 240, 0.42) 0%,
    rgba(0, 214, 210, 0.25) 35%,
    rgba(98, 229, 223, 0.12) 65%,
    transparent 85%
  );
  filter: blur(80px);
}

/* 3D Moving Sculpture Container */
.sculpture-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  /* Pivot around the sculpture's core on the right 55% */
  transform-origin: 75% 50%;
  transform-style: preserve-3d;
  will-change: transform;
  pointer-events: none;
}

/* The High-Resolution 3D Crystalline Artwork */
.sculpture-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;
  user-select: none;
  -webkit-user-drag: none;
  /* Smooth left-edge fade into the warm off-white background */
  mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 18%, rgba(0, 0, 0, 0.85) 32%, black 45%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 18%, rgba(0, 0, 0, 0.85) 32%, black 45%);
  transition: opacity 0.4s ease, filter 0.4s ease;
}

.sculpture-image.is-dark {
  mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 18%, rgba(0, 0, 0, 0.9) 30%, black 45%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 18%, rgba(0, 0, 0, 0.9) 30%, black 45%);
  filter: drop-shadow(0 0 35px rgba(0, 229, 240, 0.3));
}

/* Dynamic Caustic Refraction Light Sweep */
.caustic-sweep {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  background: radial-gradient(
    ellipse at 65% 45%,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(98, 229, 223, 0.2) 25%,
    rgba(0, 214, 210, 0.08) 50%,
    transparent 75%
  );
  mix-blend-mode: overlay;
  pointer-events: none;
  will-change: transform;
}

.caustic-sweep.is-dark {
  mix-blend-mode: color-dodge;
  background: radial-gradient(
    ellipse at 65% 45%,
    rgba(200, 247, 244, 0.4) 0%,
    rgba(0, 229, 240, 0.25) 25%,
    rgba(0, 214, 210, 0.1) 50%,
    transparent 75%
  );
}

/* Floating 3D Crystal Shards Canvas */
.shards-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .sculpture-wrapper {
    transform-origin: 85% 60%;
  }
  .sculpture-image {
    object-position: 80% center;
    opacity: 0.85;
  }
}

@media (max-width: 600px) {
  .sculpture-image {
    object-position: 90% center;
    opacity: 0.65;
  }
  .volumetric-aura {
    width: 90vw;
    height: 60vh;
  }
}
</style>
