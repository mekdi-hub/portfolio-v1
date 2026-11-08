<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['complete'])

const isVisible = ref(true)
const isExiting = ref(false)
const count = ref(0)
const ghostNumber = ref('012')
const showGhost = ref(true)

// Format count as 3-digit with leading zero: '000', '001', ... '047', ... '100'
const formattedCount = computed(() => {
  if (count.value >= 100) return '100'
  return String(count.value).padStart(3, '0')
})

let animationFrameId = null
let exitTimeout = null
let holdTimeout = null

// Fast skip on click or keypress
const skipSplash = () => {
  if (count.value < 100) {
    count.value = 100
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    triggerExit()
  }
}

const triggerExit = () => {
  isExiting.value = true
  exitTimeout = setTimeout(() => {
    isVisible.value = false
    emit('complete')
  }, 850)
}

onMounted(() => {
  // Prevent background scrolling while splash is active
  document.body.style.overflow = 'hidden'

  const duration = 1900 // Snappy 1.9s duration
  const startTime = performance.now()

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Non-linear easing curve: starts smoothly, accelerates rapidly through mid, eases into 100
    let easeVal
    if (progress < 0.65) {
      easeVal = Math.pow(progress / 0.65, 1.35) * 0.72
    } else {
      easeVal = 0.72 + Math.pow((progress - 0.65) / 0.35, 0.75) * 0.28
    }

    const currentVal = Math.min(100, Math.floor(easeVal * 100))
    count.value = currentVal

    // Generate kinetic trailing ghost number (Cyan/Mint kinetic trail)
    if (currentVal < 98) {
      const ghostOffset = Math.floor((currentVal * 2.3 + 18) % 99)
      ghostNumber.value = String(Math.max(1, ghostOffset)).padStart(3, '0')
      showGhost.value = true
    } else {
      showGhost.value = false
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step)
    } else {
      count.value = 100
      showGhost.value = false
      // Brief cinematic hold at 100 before smooth curtain wipe
      holdTimeout = setTimeout(() => {
        triggerExit()
      }, 260)
    }
  }

  animationFrameId = requestAnimationFrame(step)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (exitTimeout) clearTimeout(exitTimeout)
  if (holdTimeout) clearTimeout(holdTimeout)
})
</script>

<template>
  <div
    v-if="isVisible"
    class="splash-screen"
    :class="{ 'is-exiting': isExiting }"
    @click="skipSplash"
    role="dialog"
    aria-label="Loading Screen"
  >
    <!-- Top Thin Horizontal Line (Cyan Accent) -->
    <div class="splash-top-line" aria-hidden="true"></div>

    <!-- Center Stage: Giant Number Display -->
    <div class="splash-stage">
      <div class="counter-box">
        <!-- Kinetic Ghosting Trail (Luminous Mint/Cyan Semi-transparent) -->
        <div
          v-if="count < 100 && showGhost"
          class="counter-num ghost-layer"
          aria-hidden="true"
        >
          {{ ghostNumber }}
        </div>

        <!-- Primary Solid Crisp White Number -->
        <div class="counter-num primary-layer">
          {{ formattedCount }}
        </div>
      </div>
    </div>

    <!-- Bottom Cluster: Progress Bar Line & System Init Status -->
    <div class="splash-bottom-bar">
      <!-- Horizontal Track with Animated Active Cyan Fill Segment -->
      <div class="progress-track-wrapper">
        <div class="progress-track-line">
          <div
            class="progress-active-fill"
            :style="{ width: `${count}%` }"
          ></div>
        </div>
      </div>

      <!-- Spaced Monospace System Text -->
      <div class="sys-init-caption">
        <span class="mono-text">
          <span class="cyan-accent">SYS_INIT</span> &nbsp;—&nbsp; LOADING
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fullscreen Pitch-Black Stage (Primary Dark) */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  z-index: 999999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4.5rem 0 3.5rem 0;
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  transition: transform 0.85s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.85s ease;
  will-change: transform;
}

/* Curtain Wipe Exit Effect */
.splash-screen.is-exiting {
  transform: translateY(-100%);
  pointer-events: none;
}

/* Top Accent Line (Secondary Cyan Brand Color) */
.splash-top-line {
  width: 100%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent 0%, #06b6d4 15%, #22d3ee 50%, #06b6d4 85%, transparent 100%);
  opacity: 0.8;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.4);
}

/* Center Number Display */
.splash-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.counter-box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Giant Font Styling */
.counter-num {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(8rem, 26vw, 24rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-align: center;
  margin: 0;
}

/* Primary Foreground Layer: Solid Crisp White */
.primary-layer {
  position: relative;
  z-index: 2;
  color: #ffffff;
}

/* Ghost Trail Layer: Luminous Mint/Cyan (#06b6d4 / #22d3ee) */
.ghost-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  color: #06b6d4;
  opacity: 0.45;
  transform: translate(5px, -3px) scale(1.01);
  filter: blur(0.5px);
  text-shadow: 0 0 35px rgba(34, 211, 238, 0.4);
  pointer-events: none;
  transition: opacity 0.1s ease;
}

/* Bottom Cluster */
.splash-bottom-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

/* Progress Track Line */
.progress-track-wrapper {
  width: 100%;
  max-width: 480px;
  padding: 0 1.5rem;
  box-sizing: border-box;
}

.progress-track-line {
  position: relative;
  width: 100%;
  height: 2px;
  background-color: rgba(6, 182, 212, 0.2); /* Faint cyan track */
  border-radius: 9999px;
  overflow: hidden;
}

.progress-active-fill {
  height: 100%;
  background: linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.85);
  transition: width 0.05s linear;
}

/* Monospace Caption */
.sys-init-caption {
  text-align: center;
}

.mono-text {
  font-family: 'Space Mono', monospace;
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
  font-weight: 700;
  letter-spacing: 0.35em;
  color: #64748b;
  text-transform: uppercase;
}

.cyan-accent {
  color: #06b6d4;
  text-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
}

/* Responsive Scaling */
@media (max-width: 768px) {
  .splash-screen {
    padding: 3rem 0 2.5rem 0;
  }
  .counter-num {
    font-size: clamp(5.5rem, 30vw, 10rem);
  }
  .progress-track-wrapper {
    max-width: 80%;
  }
  .mono-text {
    letter-spacing: 0.25em;
  }
}
</style>
