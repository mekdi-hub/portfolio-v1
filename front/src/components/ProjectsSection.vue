<script setup>
import { ref, onMounted } from 'vue'

const API_BASE = localStorage.getItem('portfolio_api_base') || import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

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
    demo_link: '#'
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
    demo_link: '#'
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
    demo_link: '#'
  }
]

const projects = ref([...defaultProjects])

const normalizeTechStack = (tech) => {
  if (Array.isArray(tech)) return tech
  if (typeof tech === 'string') {
    return tech.split(',').map(s => s.trim()).filter(Boolean)
  }
  return []
}

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/projects`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        projects.value = data.map((item, idx) => ({
          ...item,
          tech_stack: normalizeTechStack(item.tech_stack),
          isDark: idx % 2 === 0,
          demo_link: item.demo_link || '#'
        }))
      }
    }
  } catch (err) {
    // Keep default projects if API server is offline
    console.info('Loaded curated portfolio projects (Backend offline or local cache active).')
  }
})
</script>

<template>
  <div id="projects" class="curtain-wrapper">
    <!-- Pinned Underlay: Shows 'My Projects' full screen in background -->
    <div class="curtain-underlay">
      <div class="underlay-content">
        <div class="portfolio-badge">PORTFOLIO</div>
        <h2 class="underlay-title">My Projects</h2>
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
          <article
            v-for="project in projects"
            :key="project.id"
            class="project-card"
          >
            <!-- Mockup Window Box matching reference -->
            <div class="mockup-window" :class="{ 'dark-theme': project.isDark, 'light-theme': !project.isDark }">
              <!-- If custom image is uploaded -->
              <template v-if="project.image && !project.imageText">
                <img :src="project.image" :alt="project.title" class="custom-cover-img" />
              </template>

              <!-- Styled interactive mockup for curated projects -->
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
                <a :href="project.demo_link" class="live-demo-btn" target="_blank" rel="noopener noreferrer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </article>
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
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3.8rem, 8vw, 6.5rem);
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0;
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
}

.custom-cover-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
</style>
