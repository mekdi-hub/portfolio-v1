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
    const saved = localStorage.getItem('portfolio_theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark.value = true
    } else {
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

