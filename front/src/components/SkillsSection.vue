<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('all')

const skills = [
  // Frontend
  { name: 'Vue.js', category: 'frontend', color: '#42b883', level: 'Advanced', icon: '⚡' },
  { name: 'React', category: 'frontend', color: '#06b6d4', level: 'Proficient', icon: '⚛️' },
  { name: 'JavaScript', category: 'frontend', color: '#eab308', level: 'Advanced', icon: 'JS' },
  { name: 'Tailwind CSS', category: 'frontend', color: '#38bdf8', level: 'Advanced', icon: '🎨' },
  { name: 'Three.js / WebGL', category: 'frontend', color: '#10b981', level: 'Intermediate', icon: '🌐' },

  // Backend
  { name: 'Laravel', category: 'backend', color: '#ef4444', level: 'Advanced', icon: '🔥' },
  { name: 'PHP', category: 'backend', color: '#818cf8', level: 'Advanced', icon: '🐘' },
  { name: 'REST APIs', category: 'backend', color: '#06b6d4', level: 'Advanced', icon: '🔌' },
  { name: 'Node.js', category: 'backend', color: '#22c55e', level: 'Intermediate', icon: '🟢' },

  // Database & DevOps
  { name: 'PostgreSQL', category: 'devops', color: '#3b82f6', level: 'Proficient', icon: '🐘' },
  { name: 'MySQL', category: 'devops', color: '#0284c7', level: 'Advanced', icon: '🐬' },
  { name: 'Docker', category: 'devops', color: '#0ea5e9', level: 'Proficient', icon: '🐳' },
  { name: 'Git & GitHub', category: 'devops', color: '#f97316', level: 'Advanced', icon: '🐙' }
]

const categories = [
  { id: 'all', label: 'All Skills' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'devops', label: 'Database & DevOps' }
]

const filteredSkills = computed(() => {
  if (activeCategory.value === 'all') return skills
  return skills.filter(skill => skill.category === activeCategory.value)
})
</script>

<template>
  <section id="skills" class="skills-section">
    <div class="skills-container">
      <!-- Centered Header in Black -->
      <h2 class="skills-title">Skills & Technologies</h2>
      <p class="skills-subtitle">The tools, frameworks, and technologies I leverage to build modern web solutions</p>

      <!-- Category Filter Pills -->
      <div class="category-filters">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="filter-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Skills Grid / Cloud -->
      <div class="skills-grid">
        <div
          v-for="skill in filteredSkills"
          :key="skill.name"
          class="skill-item"
          :style="{ '--accent-color': skill.color }"
        >
          <span class="skill-indicator"></span>
          <span class="skill-name">{{ skill.name }}</span>
          <span class="skill-level">{{ skill.level }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
  position: relative;
  width: 100%;
  background-color: #f4f5f7;
  padding: 6rem 2rem 9rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.skills-container {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Centered Title in Bold Black */
.skills-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 5.5vw, 4.4rem);
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 0.8rem;
}

.skills-subtitle {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  color: #64748b;
  max-width: 620px;
  margin-bottom: 2.8rem;
  line-height: 1.5;
}

/* Filter Buttons */
.category-filters {
  display: inline-flex;
  gap: 0.5rem;
  background-color: #e5e7eb;
  padding: 0.35rem;
  border-radius: 9999px;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.55rem 1.2rem;
  border: none;
  background: transparent;
  color: #4b5563;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.filter-btn:hover {
  color: #000000;
}

.filter-btn.active {
  background-color: #000000;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

/* Minimalist Skills Grid */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 860px;
}

.skill-item {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.6rem;
  background-color: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.9);
  border-radius: 9999px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  cursor: default;
}

.skill-item:hover {
  transform: translateY(-3px);
  border-color: var(--accent-color);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.skill-indicator {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: var(--accent-color);
  box-shadow: 0 0 10px var(--accent-color);
  flex-shrink: 0;
}

.skill-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #0f172a;
}

.skill-level {
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-left: 0.2rem;
  border-left: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .skills-section {
    padding: 4rem 1.5rem 6rem 1.5rem;
  }
  .skills-title {
    font-size: 2.4rem;
  }
  .skills-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  .category-filters {
    gap: 0.25rem;
  }
  .filter-btn {
    padding: 0.45rem 0.9rem;
    font-size: 0.8rem;
  }
  .skill-item {
    padding: 0.7rem 1.2rem;
  }
  .skill-name {
    font-size: 0.95rem;
  }
}
</style>

