import { ref } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('portfolio_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('portfolio_theme', 'light')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const initTheme = () => {
    // One-time migration to ensure clean transition to light mode as default
    if (!localStorage.getItem('portfolio_default_light_v1')) {
      localStorage.removeItem('portfolio_theme')
      localStorage.setItem('portfolio_default_light_v1', 'true')
    }

    const saved = localStorage.getItem('portfolio_theme')
    if (saved === 'dark') {
      isDark.value = true
    } else {
      // Default to light mode
      isDark.value = false
    }
    applyTheme()
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}

