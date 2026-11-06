<script setup>
import WindBloom from './WindBloom.vue'

const scrollToAbout = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="hero-container">
    <!-- 3D Wind-Moving Bloom Background -->
    <WindBloom />

    <!-- Top Navigation Bar -->
    <header class="hero-header">
      <!-- Monogram 'M' Logo -->
      <a href="#" class="logo" aria-label="Home">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
          <path 
            d="M12 36V14L24 28L36 14V36" 
            stroke="#111827" 
            stroke-width="3.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </header>

    <!-- Main Content Grid -->
    <main class="hero-content">
      <div class="hero-text-block">
        <!-- Subtitle / Name -->
        <div class="hero-author-tag">
          <span class="author-name">MEKDELAWIT &nbsp; HABTAMU</span>
        </div>

        <!-- Big Bold Title -->
        <h1 class="hero-title">
          <span class="title-line">Full Stack</span>
          <span class="title-line">Developer</span>
        </h1>

        <!-- Scroll Indicator -->
        <div class="scroll-indicator" @click="scrollToAbout" title="Scroll to About">
          <div class="mouse-pill">
            <div class="scroll-wheel"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.hero-container {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background-color: #f4f5f7;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header */
.hero-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 2.2rem 4rem 1rem 4rem;
  width: 100%;
}

.logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.25s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-svg {
  width: 44px;
  height: 44px;
}

/* Main Hero Content */
.hero-content {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 4rem 3rem 4rem;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}

.hero-text-block {
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  padding-top: 1rem;
}

/* Author Name Tag */
.hero-author-tag {
  display: flex;
  align-items: center;
}

.author-name {
  font-family: 'Space Mono', monospace;
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  color: #64748b;
  text-transform: uppercase;
}

/* Headline */
.hero-title {
  display: flex;
  flex-direction: column;
  font-family: 'Space Grotesk', 'Space Mono', sans-serif;
  font-size: clamp(3.4rem, 6.8vw, 6.2rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.title-line {
  display: block;
  word-break: break-word;
}

/* Scroll Pill Indicator */
.scroll-indicator {
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
}

.mouse-pill {
  width: 26px;
  height: 44px;
  border: 2px solid #475569;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
  opacity: 0.75;
  transition: opacity 0.3s ease, border-color 0.3s ease;
}

.mouse-pill:hover {
  opacity: 1;
  border-color: #0f172a;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  background-color: #334155;
  border-radius: 9999px;
  animation: scrollBob 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes scrollBob {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(14px);
    opacity: 0.2;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .hero-header {
    padding: 1.8rem 2rem 1rem 2rem;
  }
  .hero-content {
    padding: 0 2rem 2rem 2rem;
  }
}

@media (max-width: 768px) {
  .hero-header {
    padding: 1.2rem 1.2rem;
  }
  .hero-content {
    padding: 0 1.2rem 2rem 1.2rem;
  }
  .hero-title {
    font-size: 3rem;
  }
  .author-name {
    font-size: 0.9rem;
    letter-spacing: 0.25em;
  }
}
</style>
