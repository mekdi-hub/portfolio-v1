<script setup>
import { ref, defineAsyncComponent, onMounted, onUnmounted, nextTick } from 'vue'
import SplashScreen from './components/SplashScreen.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import SectionNav from './components/SectionNav.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import { useTheme } from './composables/useTheme'
import { useSettings } from './composables/useSettings'
import { useScrollTransitions } from './composables/useScrollTransitions'

// Lazy-load AdminPanel on demand to optimize performance
const AdminPanel = defineAsyncComponent(() => import('./components/AdminPanel.vue'))

const { initTheme } = useTheme()
const { fetchSettings } = useSettings()
const { initScrollTransitions, cleanupScrollTransitions } = useScrollTransitions()

const currentView = ref('portfolio')
const showSplash = ref(true)

const onSplashComplete = () => {
  showSplash.value = false
  nextTick(() => {
    initScrollTransitions()
  })
}

const updateRouteFromHash = () => {
  const hash = window.location.hash.toLowerCase()
  if (hash.startsWith('#admin') || hash.startsWith('#/admin')) {
    currentView.value = 'admin'
    showSplash.value = false // Skip splash screen when going directly to admin
  } else {
    currentView.value = 'portfolio'
    nextTick(() => {
      initScrollTransitions()
    })
  }
}

onMounted(() => {
  initTheme()
  fetchSettings()
  updateRouteFromHash()
  window.addEventListener('hashchange', updateRouteFromHash)
  nextTick(() => {
    initScrollTransitions()
  })
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateRouteFromHash)
  cleanupScrollTransitions()
})

const handleNavigate = (view) => {
  currentView.value = view
  if (view === 'admin') {
    window.location.hash = '#admin'
  } else {
    window.location.hash = '#'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    nextTick(() => {
      initScrollTransitions()
    })
  }
}
</script>

<template>
  <div class="app-wrapper">
    <!-- Kinetic Counting Splash Screen -->
    <SplashScreen
      v-if="showSplash && currentView !== 'admin'"
      @complete="onSplashComplete"
    />

    <!-- Global Floating Theme Toggle (Dark / Light) -->
    <ThemeToggle />

    <!-- Global Floating Section Navigation & Scroll Progress -->
    <SectionNav v-if="currentView !== 'admin'" />

    <!-- Admin Dashboard View -->
    <AdminPanel
      v-if="currentView === 'admin'"
      @navigate="handleNavigate"
    />

    <!-- Public Portfolio View -->
    <div v-else class="portfolio-view">
      <HeroSection />
      <div class="section-ambient-divider" aria-hidden="true"></div>
      <AboutSection />
      <div class="section-ambient-divider" aria-hidden="true"></div>
      <SkillsSection />
      <div class="section-ambient-divider" aria-hidden="true"></div>
      <ProjectsSection />
      <div class="section-ambient-divider" aria-hidden="true"></div>
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
