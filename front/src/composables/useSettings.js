import { ref } from 'vue'
import { getApiBaseUrl } from '../config/api'

export const DEFAULT_SETTINGS = {
  hero_title: 'Full Stack',
  hero_name: 'Mekdelawit Habtamu',
  hero_subtitle: 'Developer & System Builder',
  about_title: 'About Me',
  about_description: 'Full-Stack Developer passionate about crafting resilient, high-performance web applications and intuitive digital experiences.',
  skills_title: 'Skills & Technologies',
  projects_title: 'My Projects',
  contact_title: "Let's Work Together",
  contact_email: 'mekdimeki8@gmail.com',
  contact_phone: '+251 953 419 361',
  social_github: 'https://github.com',
  social_telegram: 'https://t.me',
  social_linkedin: 'https://linkedin.com',
  social_twitter: 'https://twitter.com'
}

const STORAGE_KEY = 'portfolio_settings'

const sanitizeSettings = (raw) => {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SETTINGS }
  const result = { ...DEFAULT_SETTINGS, ...raw }
  if (result.contact_title && result.contact_title.trim().toLowerCase() === 'get in touch') {
    result.contact_title = "Let's Work Together"
  }
  return result
}

// Load initial state from localStorage if available, otherwise defaults
const loadCachedSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return sanitizeSettings(parsed)
    }
  } catch (e) {
    console.warn('Failed to parse cached settings:', e)
  }
  return { ...DEFAULT_SETTINGS }
}

// Global singleton reactive settings state
const settings = ref(loadCachedSettings())
const isLoadingSettings = ref(false)

// Listen for storage events (e.g., changes across tabs/windows)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const updated = JSON.parse(event.newValue)
        settings.value = sanitizeSettings({ ...settings.value, ...updated })
      } catch (e) {
        // ignore
      }
    }
  })
}

export function useSettings() {
  const fetchSettings = async () => {
    isLoadingSettings.value = true
    try {
      const apiBase = getApiBaseUrl()
      const res = await fetch(`${apiBase}/settings`, {
        headers: { Accept: 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === 'object') {
          settings.value = sanitizeSettings({ ...settings.value, ...data })
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
          } catch (e) {
            // ignore storage quota errors
          }
        }
      }
    } catch (err) {
      console.info('Using locally cached settings (Backend offline or cold start).')
    } finally {
      isLoadingSettings.value = false
    }
    return settings.value
  }

  const saveSettings = async (newSettings = null) => {
    if (newSettings && typeof newSettings === 'object') {
      settings.value = { ...settings.value, ...newSettings }
    }

    // Persist immediately to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (e) {
      // ignore
    }

    // Dispatch custom event for immediate same-window reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio-settings-updated', {
        detail: settings.value
      }))
    }

    // Persist to backend database
    const apiBase = getApiBaseUrl()
    const res = await fetch(`${apiBase}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(settings.value)
    })

    if (!res.ok) {
      throw new Error(`Failed to save settings to server (HTTP ${res.status})`)
    }

    const data = await res.json()
    if (data?.settings && typeof data.settings === 'object') {
      settings.value = { ...settings.value, ...data.settings }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    }

    return settings.value
  }

  return {
    settings,
    isLoadingSettings,
    fetchSettings,
    saveSettings,
    DEFAULT_SETTINGS
  }
}

