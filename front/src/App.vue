<script setup>
import { ref, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'

// Lazy-load AdminPanel on demand to optimize performance
const AdminPanel = defineAsyncComponent(() => import('./components/AdminPanel.vue'))

const currentView = ref('portfolio')

const updateRouteFromHash = () => {
  const hash = window.location.hash.toLowerCase()
  if (hash.startsWith('#admin') || hash.startsWith('#/admin')) {
    currentView.value = 'admin'
  } else {
    currentView.value = 'portfolio'
  }
}

onMounted(() => {
  updateRouteFromHash()
  window.addEventListener('hashchange', updateRouteFromHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateRouteFromHash)
})

const handleNavigate = (view) => {
  currentView.value = view
  if (view === 'admin') {
    window.location.hash = '#admin'
  } else {
    window.location.hash = '#'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="app-wrapper">
    <!-- Admin Dashboard View -->
    <AdminPanel
      v-if="currentView === 'admin'"
      @navigate="handleNavigate"
    />

    <!-- Public Portfolio View -->
    <div v-else class="portfolio-view">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection @open-admin="handleNavigate('admin')" />
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: #f4f5f7;
}

.portfolio-view {
  width: 100%;
  min-height: 100vh;
}
</style>
