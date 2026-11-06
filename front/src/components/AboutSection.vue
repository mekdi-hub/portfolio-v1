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

      <!-- Description Paragraphs (Cardless) -->
      <div class="about-paragraphs">
        <p>
          A dedicated software engineer specializing in the development of robust and scalable web applications. My journey in software engineering began at <strong>Wollo University</strong>, where I developed a strong foundation in software engineering and programming.
        </p>
        <p>
          With a particular focus on <strong>React and Laravel</strong>, I am committed to delivering high-quality solutions that meet both user needs and business objectives. My expertise extends across the full software development lifecycle, from conceptualization to implementation.
        </p>
        <p>
          I am driven by the challenges of problem-solving and continuously seek to enhance my skills to stay at the forefront of the ever-evolving technology landscape.
        </p>
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
  max-width: 860px;
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
  margin-bottom: 2.5rem;
}

/* Greeting and Role */
.about-heading-block {
  margin-bottom: 2.2rem;
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
  font-size: 1rem;
  font-weight: 600;
  color: #06b6d4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Paragraphs */
.about-paragraphs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 820px;
  margin-bottom: 4rem;
}

.about-paragraphs p {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.1rem, 1.8vw, 1.35rem);
  font-weight: 400;
  line-height: 1.75;
  color: #334155;
  text-align: center;
}

.about-paragraphs strong {
  color: #0f172a;
  font-weight: 600;
}

/* Minimalist Cardless Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
  width: 100%;
  max-width: 760px;
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

@media (max-width: 768px) {
  .about-section {
    padding: 5rem 1.5rem 6rem 1.5rem;
  }
  .about-title {
    font-size: 2.4rem;
    margin-bottom: 1.8rem;
  }
  .about-greeting {
    font-size: 1.7rem;
  }
  .about-role-tag {
    font-size: 0.85rem;
  }
  .about-paragraphs {
    gap: 1.2rem;
    margin-bottom: 3rem;
  }
  .about-paragraphs p {
    font-size: 1.05rem;
    line-height: 1.65;
  }
  .stats-row {
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .stat-divider {
    display: none;
  }
  .stat-number {
    font-size: 2.2rem;
  }
  .stat-label {
    font-size: 0.75rem;
  }
}
</style>
