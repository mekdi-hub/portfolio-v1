<script setup>
import { ref } from 'vue'

// Saved real projects from reference ready for when you want to show them:
const myProjects = ref([
  {
    id: 1,
    title: 'Gibi-Equb',
    description: 'this project is mainly built for ethiopian university students',
    tech_stack: ['Laravel', 'vue', 'mysql'],
    demo_link: '#'
  },
  {
    id: 2,
    title: 'Lumina-Tutors',
    description: 'Digitalized tutorial giving web based Learning Management System',
    tech_stack: ['Laravel 12', 'Vue 3', 'Custom css', 'Mysql', 'RestApi'],
    demo_link: '#'
  },
  {
    id: 3,
    title: 'Eduage Ai',
    description: 'Discover universities, match scholarships, check eligibility, and get visa guidance',
    tech_stack: ['Laravel', 'Vue', 'Postgres', 'Qwen ai', 'Gemini ai'],
    demo_link: '#'
  }
])
</script>

<template>
  <section id="projects" class="projects-section">
    <div class="projects-container">
      <!-- Only 'My Projects' text centered in the middle of the section -->
      <h2 class="projects-title">My Projects</h2>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #f4f5f7;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.projects-container {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Centered Title in Middle in Bold Black */
.projects-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3.2rem, 7vw, 5.5rem);
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.03em;
  line-height: 1.1;
  text-align: center;
  margin: 0;
}

@media (max-width: 768px) {
  .projects-section {
    min-height: 100vh;
    padding: 1.5rem;
  }
  .projects-title {
    font-size: 2.8rem;
  }
}
</style>
