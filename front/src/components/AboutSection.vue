<script setup>
import { ref, onMounted } from 'vue'

const statsSection = ref(null)
const hasCounted = ref(false)

const counts = ref({
  years: 0,
  projects: 0,
  technologies: 0
})

const startCounting = () => {
  const targets = { years: 3, projects: 20, technologies: 10 }
  const duration = 1600
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOutQuad = 1 - (1 - progress) * (1 - progress)

    counts.value = {
      years: Math.floor(targets.years * easeOutQuad),
      projects: Math.floor(targets.projects * easeOutQuad),
      technologies: Math.floor(targets.technologies * easeOutQuad)
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      counts.value = targets
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasCounted.value) {
          hasCounted.value = true
          startCounting()
        }
      })
    },
    { threshold: 0.25 }
  )

  if (statsSection.value) {
    observer.observe(statsSection.value)
  }
})
</script>

<template>
  <section id="about" class="about-section">
    <div class="about-container">
      <!-- Section Title in Black -->
      <h2 class="about-title">About Me</h2>

      <!-- Introduction -->
      <div class="about-heading-block">
        <h3 class="about-greeting">Hello, I'm <span class="highlight-name">Mekdelawit Habtamu</span></h3>
        <p class="about-role-tag">Full-Stack Developer & System Builder</p>
      </div>

      <!-- Description Text in 2-Column Grid (Cardless) -->
      <div class="about-paragraphs-grid">
        <div class="grid-col lead-col">
          <p>
            A dedicated software engineer specializing in robust and scalable web applications. My foundation was built at <strong>Wollo University</strong>, focused on strong engineering principles and problem-solving.
          </p>
        </div>
        <div class="grid-col detail-col">
          <p>
            With a focus on <strong>React and Laravel</strong>, I develop complete end-to-end solutions that balance performance, clean architecture, and intuitive user experiences.
          </p>
        </div>
      </div>

      <!-- Minimalist Cardless Stats -->
      <div class="stats-row" ref="statsSection">
        <div class="stat-item">
          <div class="stat-number">{{ counts.years }}+</div>
          <div class="stat-label">Years Experience</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">{{ counts.projects }}+</div>
          <div class="stat-label">Projects Completed</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">{{ counts.technologies }}+</div>
          <div class="stat-label">Technologies</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  position: relative;
  width: 100%;
  background-color: #f4f5f7;
  padding: 7rem 2rem 8rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-container {
  max-width: 1040px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Centered Title in Black */
.about-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 5.5vw, 4.4rem);
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 2.2rem;
}

/* Greeting and Role */
.about-heading-block {
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.about-greeting {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.highlight-name {
  color: #000000;
}

.about-role-tag {
  font-family: 'Space Mono', monospace;
  font-size: 0.95rem;
  font-weight: 600;
  color: #06b6d4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* 2-Column Grid Layout */
.about-paragraphs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  width: 100%;
  margin-bottom: 4.5rem;
  text-align: left;
}

.grid-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lead-col p {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.15rem, 1.8vw, 1.38rem);
  font-weight: 400;
  line-height: 1.8;
  color: #0f172a;
}

.detail-col p {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.05rem, 1.5vw, 1.22rem);
  font-weight: 400;
  line-height: 1.8;
  color: #334155;
}

.grid-col strong {
  color: #000000;
  font-weight: 600;
}

/* Minimalist Cardless Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  padding-top: 2.5rem;
  border-top: 1px solid #e2e8f0;
  width: 100%;
  max-width: 820px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.stat-number {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.4rem, 4.5vw, 3.6rem);
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.03em;
  line-height: 1;
}

.stat-label {
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-divider {
  width: 1px;
  height: 48px;
  background-color: #cbd5e1;
}

@media (max-width: 868px) {
  .about-section {
    padding: 5rem 1.5rem 6rem 1.5rem;
  }
  .about-paragraphs-grid {
    grid-template-columns: 1fr;
    gap: 1.8rem;
  }
  .lead-col p,
  .detail-col p {
    font-size: 1.1rem;
    line-height: 1.7;
  }
  .stats-row {
    gap: 1.8rem;
    flex-wrap: wrap;
  }
  .stat-divider {
    display: none;
  }
}

/* ========================================= */
/* DARK THEME STYLES                         */
/* ========================================= */
:global(.dark) .about-section {
  background-color: #0a0b0e;
}

:global(.dark) .about-title {
  color: #ffffff;
}

:global(.dark) .about-greeting {
  color: #f8fafc;
}

:global(.dark) .highlight-name {
  color: #22d3ee;
}

:global(.dark) .about-role-tag {
  color: #94a3b8;
}

:global(.dark) .lead-col p,
:global(.dark) .detail-col p {
  color: #cbd5e1;
}

:global(.dark) strong {
  color: #ffffff;
}

:global(.dark) .stats-row {
  border-top-color: rgba(255, 255, 255, 0.1);
}

:global(.dark) .stat-number {
  color: #ffffff;
}

:global(.dark) .stat-label {
  color: #94a3b8;
}

:global(.dark) .stat-divider {
  background-color: rgba(255, 255, 255, 0.12);
}
</style>
