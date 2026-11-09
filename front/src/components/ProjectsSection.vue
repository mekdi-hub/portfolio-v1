<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getApiBaseUrl } from '../config/api'
import { useSettings } from '../composables/useSettings'

const { settings } = useSettings()

const API_BASE = getApiBaseUrl()

const isLoading = ref(true)
const imageLoadingStates = reactive({})

const onImageLoad = (id) => {
  imageLoadingStates[id] = true
}

const defaultProjects = [
  {
    id: 1,
    title: 'Gibi-Equb',
    description: 'this project is mainly built for ethiopian university students',
    tech_stack: ['Laravel', 'vue', 'mysql'],
    imageText: {
      tag: 'Trusted by students across Ethiopia',
      headline: 'Save Together, Win Together',
      subtext: "Gibi-Equb brings Ethiopia's beloved savings tradition online — with fellow students, contribute monthly, and take turns receiving the full pot. Simple, transparent, and fair."
    },
    isDark: true,
    demo_link: ''
  },
  {
    id: 2,
    title: 'Lumina-Tutors',
    description: 'Digitalized tutorial giving web based Learning Management System',
    tech_stack: ['Laravel 12', 'Vue 3', 'Custom css', 'Mysql', 'RestApi'],
    imageText: {
      tag: 'Personalized Learning',
      headline: 'Master Any Subject With Confidence',
      subtext: 'Get personalized one-on-one support from experienced tutors who are passionate about your success.'
    },
    isDark: false,
    demo_link: 'https://lumina-tutor-lms.vercel.app/'
  },
  {
    id: 3,
    title: 'Eduage Ai',
    description: 'Discover universities, match scholarships, check eligibility, and get visa guidance',
    tech_stack: ['Laravel', 'Vue', 'Postgres', 'Qwen ai', 'Gemini ai'],
    imageText: {
      tag: 'EduVoyage AI',
      headline: 'Plan your entire study-abroad journey with AI agents',
      subtext: 'Discover universities, match scholarships, check eligibility, and get visa guidance — all orchestrated by specialized Qwen-powered agents.'
    },
    isDark: true,
    demo_link: ''
  }
]

const projects = ref([])

const normalizeTechStack = (tech) => {
  if (Array.isArray(tech)) return tech
  if (typeof tech === 'string') {
    return tech.split(',').map(s => s.trim()).filter(Boolean)
  }
  return []
}

const sortProjects = (list) => {
  if (!Array.isArray(list)) return []
  const cloned = [...list]
  
  // If items have explicit order property
  const hasOrderProps = cloned.some(p => p.order !== undefined && p.order !== null)
  if (hasOrderProps) {
    return cloned.sort((a, b) => {
      const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 9999
      const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 9999
      return ordA - ordB
    })
  }

  // Fallback to local storage custom sequence
  try {
    const savedOrder = JSON.parse(localStorage.getItem('portfolio_projects_order') || '[]')
    if (Array.isArray(savedOrder) && savedOrder.length > 0) {
      cloned.sort((a, b) => {
        const idxA = savedOrder.indexOf(a.id)
        const idxB = savedOrder.indexOf(b.id)
        if (idxA !== -1 && idxB !== -1) return idxA - idxB
        if (idxA !== -1) return -1
        if (idxB !== -1) return 1
        return 0
      })
    }
  } catch (e) {
    // ignore
  }

  return cloned
}

const fetchPortfolioProjects = async (initial = false) => {
  if (initial || projects.value.length === 0) {
    isLoading.value = true
  }
  const startTime = Date.now()
  const apiBase = getApiBaseUrl()

  const loadFromApi = async () => {
    const res = await fetch(`${apiBase}/projects`, {
      headers: { Accept: 'application/json' }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) throw new Error('Empty projects')
    return data
  }

  try {
    let data
    try {
      data = await loadFromApi()
    } catch (firstErr) {
      // Free tier Render backend might be waking up (cold start); retry once
      console.info('Retrying connection to backend (cold start wake-up)...')
      await new Promise(r => setTimeout(r, 2200))
      data = await loadFromApi()
    }

    const sorted = sortProjects(data)
    projects.value = sorted.map((item, idx) => ({
      ...item,
      tech_stack: normalizeTechStack(item.tech_stack),
      isDark: idx % 2 === 0,
      demo_link: item.demo_link || ''
    }))
  } catch (err) {
    console.info('Backend unreachable or cold starting. Showing curated fallback.', err)
    if (projects.value.length === 0) {
      projects.value = sortProjects(defaultProjects).map((item, idx) => ({
        ...item,
        isDark: idx % 2 === 0
      }))
    }
  } finally {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, 420 - elapsed)
    setTimeout(() => {
      isLoading.value = false
    }, remaining)
  }
}

onMounted(() => {
  fetchPortfolioProjects(true)
  window.addEventListener('focus', () => fetchPortfolioProjects(false))
})
</script>

<template>
  <div id="projects" class="curtain-wrapper">
    <!-- Pinned Underlay: Shows 'My Projects' full screen in background -->
    <div class="curtain-underlay">
      <div class="underlay-content">
        <h2 v-if="settings.projects_title" class="underlay-title">{{ settings.projects_title }}</h2>
        <div class="scroll-curtain-hint">
          <span class="hint-text">Scroll to reveal</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </div>
    </div>

    <!-- The Rising Curtain Sheet: Solid surface that covers 'My Projects' like a curtain -->
    <section class="curtain-sheet">
      <!-- Curtain Top Edge Handle -->
      <div class="curtain-handle-bar">
        <span class="curtain-pill-notch"></span>
      </div>

      <div class="curtain-content">
        <div class="projects-cards-grid">
          <!-- Skeleton Loading Placeholders -->
          <template v-if="isLoading">
            <article
              v-for="n in 3"
              :key="'skeleton-' + n"
              class="project-card skeleton-card"
              aria-hidden="true"
            >
              <!-- Mockup Window Box Skeleton -->
              <div class="mockup-window skeleton-window skeleton-pulse">
                <div class="skeleton-mockup-header">
                  <div class="skeleton-shimmer-pill" style="width: 80px; height: 13px;"></div>
                  <div class="skeleton-mockup-dots">
                    <span class="skeleton-dot"></span>
                    <span class="skeleton-dot"></span>
                    <span class="skeleton-dot"></span>
                  </div>
                </div>

                <div class="skeleton-mockup-body">
                  <div class="skeleton-shimmer-pill" style="width: 90px; height: 18px; margin-bottom: 14px;"></div>
                  <div class="skeleton-shimmer-bar" style="width: 82%; height: 22px; margin-bottom: 10px;"></div>
                  <div class="skeleton-shimmer-bar" style="width: 65%; height: 14px;"></div>
                </div>

                <div class="skeleton-mockup-footer">
                  <div class="skeleton-shimmer-pill" style="width: 110px; height: 26px;"></div>
                </div>
              </div>

              <!-- Details Under Card Skeleton -->
              <div class="project-details">
                <div class="skeleton-shimmer-bar skeleton-title-bar"></div>
                <div class="skeleton-shimmer-bar skeleton-desc-line-1"></div>
                <div class="skeleton-shimmer-bar skeleton-desc-line-2"></div>

                <div class="skeleton-tags-row">
                  <div class="skeleton-tag-pill" style="width: 75px;"></div>
                  <div class="skeleton-tag-pill" style="width: 60px;"></div>
                  <div class="skeleton-tag-pill" style="width: 85px;"></div>
                </div>

                <div class="skeleton-action-row">
                  <div class="skeleton-btn-pill"></div>
                </div>
              </div>
            </article>
          </template>

          <!-- Real Loaded Project Cards -->
          <template v-else>
            <article
              v-for="project in projects"
              :key="project.id"
              class="project-card fade-in-card"
            >
              <!-- Mockup Window Box matching reference -->
              <div
                class="mockup-window"
                :class="{
                  'dark-theme': project.isDark,
                  'light-theme': !project.isDark,
                  'has-custom-img': !!project.image
                }"
              >
                <!-- If custom image is available -->
                <template v-if="project.image">
                  <div
                    class="cover-ambient-blur"
                    :style="{ backgroundImage: `url(${project.image})` }"
                    aria-hidden="true"
                  ></div>
                  <div class="cover-img-frame">
                    <div
                      v-if="!imageLoadingStates[project.id]"
                      class="img-skeleton-placeholder skeleton-pulse"
                      aria-hidden="true"
                    ></div>
                    <img
                      :src="project.image"
                      :alt="project.title"
                      class="custom-cover-img"
                      :class="{ 'img-loaded': imageLoadingStates[project.id] }"
                      @load="onImageLoad(project.id)"
                    />
                  </div>
                </template>

                <!-- Styled interactive mockup for curated projects without an image -->
                <template v-else>
                  <div class="mockup-header-bar">
                    <span class="mockup-brand">{{ project.title }}</span>
                    <div class="mockup-nav-links">
                      <span>Home</span>
                      <span>About</span>
                      <span>Features</span>
                      <span>Contact</span>
                    </div>
                  </div>

                  <div class="mockup-content-body">
                    <span class="mockup-pill-tag">{{ project.imageText?.tag || 'Featured Project' }}</span>
                    <h4 class="mockup-headline">{{ project.imageText?.headline || project.title }}</h4>
                    <p class="mockup-subtext">{{ project.imageText?.subtext || project.description }}</p>
                    
                    <div class="mockup-cta-btn">
                      <span>Explore Platform</span>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Details Under Card -->
              <div class="project-details">
                <h3 class="project-name">{{ project.title }}</h3>
                <p class="project-summary">{{ project.description }}</p>

                <!-- Tech Tags -->
                <div class="project-tags">
                  <span
                    v-for="tech in project.tech_stack"
                    :key="tech"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>

                <!-- Action Link -->
                <div v-if="project.demo_link" class="project-action-row">
                  <a
                    :href="project.demo_link"
                    class="live-demo-btn notranslate"
                    translate="no"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <span class="notranslate" translate="no">Live Demo</span>
                  </a>
                </div>
              </div>
            </article>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Main Curtain Container */
.curtain-wrapper {
  position: relative;
  width: 100%;
  background-color: #f4f5f7;
}

/* 1. Underlay: Sticky full-screen view containing 'My Projects' */
.curtain-underlay {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background-color: #f4f5f7;
}

.underlay-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 2rem;
}

.portfolio-badge {
  display: inline-block;
  padding: 0.45rem 1.8rem;
  background-color: #e0f7fa;
  border: 1px solid rgba(178, 235, 242, 0.9);
  border-radius: 9999px;
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #0f172a;
  text-transform: uppercase;
}

.underlay-title {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-size: clamp(3.8rem, 8vw, 6.5rem);
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.01em;
  line-height: 1.08;
  margin: 0;
  position: relative;
  display: inline-block;
}

.underlay-title::after {
  content: '';
  display: block;
  width: 68px;
  height: 3px;
  margin: 0.85rem auto 0 auto;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent 0%, #06b6d4 50%, transparent 100%);
  box-shadow: 0 0 14px rgba(6, 182, 212, 0.7);
}

.scroll-curtain-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 1rem;
  animation: bounceHint 2s infinite ease-in-out;
}

@keyframes bounceHint {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

/* 2. Rising Curtain Sheet: Solid surface that slides UP and completely covers 'My Projects' */
.curtain-sheet {
  position: relative;
  z-index: 10;
  width: 100%;
  background-color: #ffffff;
  border-radius: 44px 44px 0 0;
  box-shadow: 0 -25px 60px rgba(0, 0, 0, 0.08), 0 -4px 16px rgba(0, 0, 0, 0.03);
  padding: 2rem 3rem 8rem 3rem;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
}

/* Elegant Curtain Top Notch Handle */
.curtain-handle-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 3.5rem;
  padding-top: 0.5rem;
}

.curtain-pill-notch {
  width: 54px;
  height: 5px;
  background-color: #cbd5e1;
  border-radius: 9999px;
  opacity: 0.7;
}

.curtain-content {
  max-width: 1440px;
  margin: 0 auto;
}

.projects-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  align-items: start;
}

.project-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card:hover {
  transform: translateY(-8px);
}

/* Mockup Window Box */
.mockup-window {
  position: relative;
  width: 100%;
  height: 270px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.2rem 1.4rem;
  background-color: #0b0f17;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.mockup-window.has-custom-img {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0d131f;
}

:global(.dark) .mockup-window.has-custom-img {
  background-color: #030712;
  border-color: rgba(255, 255, 255, 0.1);
}

.cover-ambient-blur {
  position: absolute;
  top: -15%;
  left: -15%;
  width: 130%;
  height: 130%;
  background-size: cover;
  background-position: center;
  filter: blur(32px);
  opacity: 0.28;
  transform: scale(1.15);
  pointer-events: none;
  z-index: 1;
}

.cover-img-frame {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem;
  box-sizing: border-box;
}

.custom-cover-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.custom-cover-img.img-loaded {
  opacity: 1;
}

.project-card:hover .custom-cover-img {
  transform: scale(1.025);
}

/* ======================================================== */
/* SKELETON LOADING CARD STYLES                              */
/* ======================================================== */
.skeleton-card {
  pointer-events: none;
  user-select: none;
}

.skeleton-pulse {
  background: linear-gradient(
    90deg,
    #e2e8f0 0%,
    #f8fafc 40%,
    #e2e8f0 80%,
    #e2e8f0 100%
  );
  background-size: 250% 100%;
  animation: skeletonShimmer 1.8s ease-in-out infinite;
}

@keyframes skeletonShimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -150% 0;
  }
}

.skeleton-window {
  position: relative;
  width: 100%;
  height: 270px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.4rem 1.6rem;
  background-color: #f1f5f9;
}

.skeleton-mockup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  padding-bottom: 0.7rem;
}

.skeleton-mockup-dots {
  display: flex;
  gap: 6px;
}

.skeleton-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #cbd5e1;
}

.skeleton-mockup-body {
  margin: 1.2rem 0;
}

.skeleton-shimmer-bar {
  background: linear-gradient(
    90deg,
    #cbd5e1 0%,
    #e2e8f0 45%,
    #cbd5e1 90%,
    #cbd5e1 100%
  );
  background-size: 250% 100%;
  animation: skeletonShimmer 1.8s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-shimmer-pill {
  background: linear-gradient(
    90deg,
    #cbd5e1 0%,
    #e2e8f0 45%,
    #cbd5e1 90%,
    #cbd5e1 100%
  );
  background-size: 250% 100%;
  animation: skeletonShimmer 1.8s ease-in-out infinite;
  border-radius: 9999px;
}

.skeleton-title-bar {
  height: 28px;
  width: 65%;
  border-radius: 8px;
  margin-bottom: 0.9rem;
}

.skeleton-desc-line-1 {
  height: 16px;
  width: 95%;
  margin-bottom: 0.5rem;
}

.skeleton-desc-line-2 {
  height: 16px;
  width: 70%;
  margin-bottom: 1.4rem;
}

.skeleton-tags-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.4rem;
}

.skeleton-tag-pill {
  height: 28px;
  border-radius: 9999px;
  background: linear-gradient(
    90deg,
    #e0f2fe 0%,
    #f0fdfa 45%,
    #e0f2fe 90%,
    #e0f2fe 100%
  );
  background-size: 250% 100%;
  animation: skeletonShimmer 1.8s ease-in-out infinite;
}

.skeleton-btn-pill {
  width: 120px;
  height: 38px;
  border-radius: 9999px;
  background: linear-gradient(
    90deg,
    #cbd5e1 0%,
    #e2e8f0 45%,
    #cbd5e1 90%,
    #cbd5e1 100%
  );
  background-size: 250% 100%;
  animation: skeletonShimmer 1.8s ease-in-out infinite;
}

.img-skeleton-placeholder {
  position: absolute;
  inset: 0.85rem;
  border-radius: 12px;
  z-index: 1;
}

.fade-in-card {
  animation: fadeInCard 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInCard {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mockup-window.dark-theme {
  background: radial-gradient(circle at 85% 15%, #1e293b 0%, #090d16 100%);
  color: #ffffff;
}

.mockup-window.light-theme {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%);
  color: #0f172a;
}

.mockup-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  opacity: 0.8;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  padding-bottom: 0.6rem;
  position: relative;
  z-index: 2;
}

.mockup-brand {
  font-weight: 700;
  letter-spacing: 0.05em;
}

.mockup-nav-links {
  display: flex;
  gap: 0.8rem;
  font-size: 0.7rem;
  color: inherit;
  opacity: 0.7;
}

.mockup-content-body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.8rem;
  position: relative;
  z-index: 2;
}

.mockup-pill-tag {
  align-self: flex-start;
  font-family: 'Space Mono', monospace;
  font-size: 0.68rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background-color: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
  font-weight: 600;
}

.mockup-headline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.25;
}

.mockup-subtext {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.76rem;
  line-height: 1.45;
  opacity: 0.75;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mockup-cta-btn {
  align-self: flex-start;
  margin-top: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  background-color: #000000;
  color: #ffffff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
}

.mockup-window.light-theme .mockup-cta-btn {
  background-color: #0f172a;
}

/* Details Under Card */
.project-details {
  padding: 1.6rem 0.4rem 0.4rem 0.4rem;
  display: flex;
  flex-direction: column;
}

.project-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.65rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.project-summary {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.96rem;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 1.2rem;
  min-height: 48px;
}

/* Tags matching reference */
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.4rem;
}

.tech-tag {
  font-family: 'Space Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: #0891b2;
  background-color: #ecfeff;
  border: 1px solid #cffafe;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

/* Live Demo Button */
.project-action-row {
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
}

.live-demo-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 1.4rem;
  border-radius: 9999px;
  background-color: #000000;
  color: #ffffff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.live-demo-btn:hover {
  background-color: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

/* Responsive */
@media (max-width: 1100px) {
  .projects-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .curtain-sheet {
    border-radius: 32px 32px 0 0;
    padding: 1.5rem 1.2rem 6rem 1.2rem;
  }
  .projects-cards-grid {
    grid-template-columns: 1fr;
    gap: 2.2rem;
  }
  .underlay-title {
    font-size: 3.2rem;
  }
  .mockup-window {
    height: 240px;
  }
}

/* ========================================= */
/* DARK THEME STYLES                         */
/* ========================================= */
:global(.dark) .curtain-wrapper,
:global(.dark) .curtain-underlay {
  background-color: #000000 !important;
}

:global(.dark) .underlay-title {
  color: #ffffff;
}

:global(.dark) .underlay-title::after {
  background: linear-gradient(90deg, transparent 0%, #22d3ee 50%, transparent 100%);
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.95);
}

:global(.dark) .portfolio-badge {
  background-color: #082f49;
  border-color: rgba(6, 182, 212, 0.4);
  color: #38bdf8;
}

:global(.dark) .scroll-curtain-hint {
  color: #94a3b8;
}

:global(.dark) .curtain-sheet {
  background-color: #000000 !important;
  border-top-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 -25px 60px rgba(0, 0, 0, 0.9);
}

:global(.dark) .curtain-pill-notch {
  background-color: #334155;
}

:global(.dark) .project-name {
  color: #ffffff;
}

:global(.dark) .project-summary {
  color: #94a3b8;
}

:global(.dark) .tech-tag {
  background-color: #082f49;
  border-color: rgba(6, 182, 212, 0.3);
  color: #22d3ee;
}

:global(.dark) .live-demo-btn {
  background-color: #11131a;
  border: 1px solid rgba(6, 182, 212, 0.4);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

:global(.dark) .live-demo-btn:hover {
  background-color: #181c26;
  border-color: #06b6d4;
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
}

:global(.dark) .mockup-window.light-theme {
  background: linear-gradient(135deg, #161922 0%, #11131a 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.08);
}

:global(.dark) .mockup-window.light-theme .mockup-cta-btn {
  background-color: #06b6d4;
  color: #000000;
}
</style>
