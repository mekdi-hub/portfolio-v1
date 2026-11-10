<script setup>
import { computed } from 'vue'
import WindBloom from './WindBloom.vue'
import { useSettings } from '../composables/useSettings'

const { settings } = useSettings()

const heroAuthorName = computed(() => {
  const name = settings.value.hero_name
  if (name === null || name === undefined) return ''
  const trimmed = String(name).trim()
  if (trimmed.toLowerCase() === 'your name') return ''
  return trimmed.toUpperCase()
})

const heroTitleLines = computed(() => {
  const rawTitle = settings.value.hero_title
  const rawSub = settings.value.hero_subtitle
  
  const title = (rawTitle !== null && rawTitle !== undefined) ? String(rawTitle).trim() : ''
  const subtitle = (rawSub !== null && rawSub !== undefined) ? String(rawSub).trim() : ''
  
  // If user cleared title and subtitle, display nothing
  if (!title && !subtitle) {
    return []
  }
  
  if (title && !subtitle) {
    const words = title.split(/\s+/)
    if (words.length >= 2) {
      const mid = Math.ceil(words.length / 2)
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
    }
    return [title, '']
  }
  
  if (!title && subtitle) {
    return [subtitle, '']
  }
  
  return [title, subtitle]
})

const hasHeroTitle = computed(() => {
  return heroTitleLines.value.some(line => !!line)
})

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
        <div v-if="heroAuthorName" class="hero-author-tag">
          <span class="author-name">{{ heroAuthorName }}</span>
        </div>

        <!-- Big Bold Title -->
        <h1 v-if="hasHeroTitle" class="hero-title">
          <span v-if="heroTitleLines[0]" class="title-line">{{ heroTitleLines[0] }}</span>
          <span v-if="heroTitleLines[1]" class="title-line">{{ heroTitleLines[1] }}</span>
        </h1>

        <!-- Action Cluster: Download CV Button + Scroll Indicator -->
        <div class="hero-action-cluster">
          <!-- Download CV Button -->
          <a
            href="/Mekdelawit_Habtamu_CV.pdf"
            download="Mekdelawit_Habtamu_CV.pdf"
            class="download-cv-btn"
            title="Download Mekdelawit Habtamu's Curriculum Vitae"
          >
            <span class="btn-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </span>
            <span class="btn-text">Download CV</span>
          </a>

          <!-- Mouse Scroll Indicator -->
          <div class="scroll-indicator" @click="scrollToAbout" title="Scroll to About Me">
            <div class="mouse-pill">
              <div class="scroll-wheel"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
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
  text-shadow: 0 1px 8px rgba(244, 245, 247, 0.9);
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
  text-shadow: 0 1px 16px rgba(244, 245, 247, 0.85);
}

.title-line {
  display: block;
  word-break: break-word;
}

/* Action Cluster */
.hero-action-cluster {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

/* Download CV Button */
.download-cv-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.85rem;
  background-color: #000000;
  color: #ffffff;
  border-radius: 9999px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.96rem;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: -0.01em;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.download-cv-btn:hover {
  background-color: #1e293b;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(6, 182, 212, 0.4);
}

.download-cv-btn:active {
  transform: translateY(0);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee; /* Soft cyan accent matching wind bloom */
  transition: transform 0.25s ease;
}

.download-cv-btn:hover .btn-icon {
  transform: translateY(2px);
}

.btn-text {
  white-space: nowrap;
}

/* Scroll Pill Indicator */
.scroll-indicator {
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

/* ========================================= */
/* RESPONSIVE BREAKPOINTS                    */
/* ========================================= */

/* Tablet & medium screens */
@media (max-width: 1024px) {
  .hero-header {
    padding: 1.8rem 2.5rem 1rem 2.5rem;
  }
  .hero-content {
    padding: 0 2.5rem 2.5rem 2.5rem;
  }
  .hero-title {
    font-size: clamp(3rem, 6.5vw, 4.5rem);
  }
}

/* Smaller tablets & large mobile (<= 768px) */
@media (max-width: 768px) {
  .hero-header {
    padding: max(1.2rem, env(safe-area-inset-top)) 1.5rem 0.8rem 1.5rem;
  }
  .hero-content {
    padding: 0 1.5rem max(2rem, env(safe-area-inset-bottom)) 1.5rem;
  }
  .hero-text-block {
    gap: 1.4rem;
    padding-top: 0.5rem;
    max-width: 100%;
  }
  .hero-title {
    font-size: clamp(2.35rem, 8vw, 3.2rem);
    line-height: 1.08;
    letter-spacing: -0.025em;
  }
  .author-name {
    font-size: 0.9rem;
    letter-spacing: 0.22em;
  }
  .hero-action-cluster {
    gap: 1.5rem;
  }
}

/* Standard small mobile devices (iPhone, Pixel, Galaxy <= 480px) */
@media (max-width: 480px) {
  .hero-header {
    padding: max(1rem, env(safe-area-inset-top)) 1.25rem 0.5rem 1.25rem;
  }
  .logo-svg {
    width: 36px;
    height: 36px;
  }
  .hero-content {
    padding: 0 1.25rem max(2rem, env(safe-area-inset-bottom)) 1.25rem;
    justify-content: flex-start;
  }
  .hero-text-block {
    gap: 1.15rem;
    padding-top: 0.35rem;
    width: 100%;
  }
  .hero-author-tag {
    margin-bottom: -0.15rem;
  }
  .author-name {
    font-size: clamp(0.72rem, 3.2vw, 0.82rem);
    letter-spacing: 0.15em;
  }
  .hero-title {
    font-size: clamp(1.95rem, 8.2vw, 2.55rem);
    line-height: 1.12;
    letter-spacing: -0.02em;
  }
  .hero-action-cluster {
    gap: 1.25rem;
    margin-top: 0.2rem;
    width: 100%;
    align-items: center;
  }
  .download-cv-btn {
    padding: 0.72rem 1.35rem;
    font-size: 0.88rem;
    min-height: 44px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  }
  .mouse-pill {
    width: 23px;
    height: 38px;
    padding-top: 5px;
  }
  .scroll-wheel {
    width: 3.5px;
    height: 7px;
  }
}

/* Extra small devices (<= 360px: iPhone SE 1st gen, small Galaxy, folded screens) */
@media (max-width: 360px) {
  .hero-header {
    padding: 0.8rem 1rem 0.35rem 1rem;
  }
  .logo-svg {
    width: 32px;
    height: 32px;
  }
  .hero-content {
    padding: 0 1rem 1.6rem 1rem;
  }
  .hero-text-block {
    gap: 0.95rem;
  }
  .author-name {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
  }
  .hero-title {
    font-size: 1.75rem;
    line-height: 1.14;
  }
  .download-cv-btn {
    padding: 0.65rem 1.15rem;
    font-size: 0.82rem;
  }
  .hero-action-cluster {
    gap: 1rem;
  }
}

/* Short screens / landscape orientation on mobile */
@media (max-height: 520px) and (orientation: landscape) {
  .hero-container {
    min-height: auto;
    padding-bottom: 2rem;
  }
  .hero-header {
    padding: 0.65rem 1.75rem 0.4rem 1.75rem;
  }
  .hero-content {
    padding: 0 1.75rem 1.25rem 1.75rem;
  }
  .hero-text-block {
    gap: 0.8rem;
  }
  .hero-title {
    font-size: 2.1rem;
    line-height: 1.08;
  }
}

/* ========================================= */
/* DARK THEME STYLES                         */
/* ========================================= */
:global(.dark) .hero-container {
  background-color: #000000 !important;
}

:global(.dark) .logo-svg path {
  stroke: #ffffff;
}

:global(.dark) .author-name {
  color: #94a3b8;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.85);
}

:global(.dark) .hero-title {
  color: #ffffff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.8);
}

:global(.dark) .download-cv-btn {
  background-color: #11131a;
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(6, 182, 212, 0.15);
}

:global(.dark) .download-cv-btn:hover {
  background-color: #181c26;
  border-color: #06b6d4;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6), 0 0 16px rgba(6, 182, 212, 0.3);
}

:global(.dark) .mouse-pill {
  border-color: #64748b;
}

:global(.dark) .mouse-pill:hover {
  border-color: #22d3ee;
}

:global(.dark) .scroll-wheel {
  background-color: #22d3ee;
}
</style>
