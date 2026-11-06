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
  .hero-action-cluster {
    gap: 1.5rem;
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
}

:global(.dark) .hero-title {
  color: #ffffff;
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
