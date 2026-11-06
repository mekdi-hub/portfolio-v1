<script setup>
import { ref, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import SplashScreen from './components/SplashScreen.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import { useTheme } from './composables/useTheme'

// Lazy-load AdminPanel on demand to optimize performance
const AdminPanel = defineAsyncComponent(() => import('./components/AdminPanel.vue'))

const { initTheme } = useTheme()

const currentView = ref('portfolio')
const showSplash = ref(true)

const updateRouteFromHash = () => {
  const hash = window.location.hash.toLowerCase()
  if (hash.startsWith('#admin') || hash.startsWith('#/admin')) {
    currentView.value = 'admin'
    showSplash.value = false // Skip splash screen when going directly to admin
  } else {
    currentView.value = 'portfolio'
  }
}

onMounted(() => {
  initTheme()
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
    <!-- Kinetic Counting Splash Screen -->
    <SplashScreen
      v-if="showSplash && currentView !== 'admin'"
      @complete="showSplash = false"
    />

    <!-- Global Floating Theme Toggle (Dark / Light) -->
    <ThemeToggle v-if="currentView !== 'admin'" />

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
  transition: background-color 0.3s ease, color 0.3s ease;
}

:global(.dark) .app-wrapper {
  background-color: #000000 !important;
  color: #ffffff;
}

.portfolio-view {
  width: 100%;
  min-height: 100vh;
}
</style>
