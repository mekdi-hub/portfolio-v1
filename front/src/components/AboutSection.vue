<script setup>
</script>

<template>
  <section id="about" class="about-section">
    <div class="about-container">
      <!-- Centered Header in Black -->
      <h2 class="about-title">About Me</h2>

      <!-- Short Cardless Description -->
      <div class="about-description">
        <p class="about-text">
          I'm <strong>Mekdelawit Habtamu</strong>, a full-stack developer dedicated to building robust, scalable web systems. With a strong background in Software Engineering from <strong>Wollo University</strong> and expertise in <strong>Vue.js</strong> and <strong>Laravel</strong>, I craft clean, high-performance architectures paired with seamless digital experiences.
        </p>

        <div class="about-meta">
          <span class="meta-item">Full-Stack Engineering</span>
          <span class="meta-separator">/</span>
          <span class="meta-item">Vue.js & Laravel</span>
          <span class="meta-separator">/</span>
          <span class="meta-item">Scalable Systems</span>
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
  padding: 8rem 2rem 9rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-container {
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Centered Title in Bold Black */
.about-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 5.5vw, 4.4rem);
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 2.2rem;
  text-transform: none;
}

/* Cardless Short Description */
.about-description {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.about-text {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.25rem, 2.2vw, 1.7rem);
  font-weight: 400;
  line-height: 1.65;
  color: #111827;
  max-width: 820px;
  margin: 0 auto;
}

.about-text strong {
  color: #000000;
  font-weight: 600;
}

/* Minimalist Meta Tags */
.about-meta {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.meta-item {
  font-family: 'Space Mono', monospace;
  font-size: 0.88rem;
  color: #475569;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.meta-separator {
  color: #94a3b8;
  font-family: 'Space Mono', monospace;
  font-size: 0.88rem;
}

@media (max-width: 768px) {
  .about-section {
    padding: 5rem 1.5rem 6rem 1.5rem;
  }
  .about-title {
    font-size: 2.4rem;
    margin-bottom: 1.5rem;
  }
  .about-text {
    font-size: 1.15rem;
    line-height: 1.6;
  }
  .about-meta {
    gap: 0.5rem;
  }
  .meta-item {
    font-size: 0.78rem;
  }
}
</style>
