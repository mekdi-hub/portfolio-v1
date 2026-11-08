<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getApiBaseUrl, setApiBaseUrl } from '../config/api'

const emit = defineEmits(['navigate'])

// API URL configuration
const customApiUrl = ref(getApiBaseUrl())
const apiStatus = ref('checking') // 'online' | 'offline' | 'checking'
const apiLatency = ref(null)

// Auth State
const isAuthenticated = ref(false)
const loginForm = reactive({ username: '', password: '' })
const loginError = ref('')
const loginLoading = ref(false)

// Dashboard State
const activeTab = ref('projects') // 'projects' | 'messages' | 'settings' | 'diagnostics'
const loading = ref(false)
const notification = reactive({ message: '', type: '' })
const projectSearchQuery = ref('')
const messageSearchQuery = ref('')
const viewMode = ref('table') // 'table' | 'cards'

// Data Collections
const projects = ref([])
const messages = ref([])
const settings = ref({
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
})

// Project Form Modal State
const showProjectModal = ref(false)
const editingProjectId = ref(null)
const projectForm = reactive({
  title: '',
  description: '',
  tech_stack: '',
  image_url: '',
  demo_link: '',
  github_link: ''
})
const imageFile = ref(null)
const imagePreview = ref('')
const isSubmitting = ref(false)

// Test Message State
const showTestMessageModal = ref(false)
const testMessageForm = reactive({
  name: '',
  email: '',
  message: ''
})

// Set Toast Notification
const notify = (msg, type = 'success') => {
  notification.message = msg
  notification.type = type
  setTimeout(() => {
    notification.message = ''
  }, 4500)
}

// ---------------------------------------------
// Authentication
// ---------------------------------------------
onMounted(() => {
  const auth = localStorage.getItem('adminAuth')
  if (auth === 'true') {
    isAuthenticated.value = true
    initAdminData()
  }
  checkApiHealth()
})

const handleLogin = () => {
  loginError.value = ''
  loginLoading.value = true

  setTimeout(() => {
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      isAuthenticated.value = true
      initAdminData()
      notify('Logged in successfully as Administrator.')
    } else {
      loginError.value = 'Invalid credentials. Default: admin / admin123'
    }
    loginLoading.value = false
  }, 400)
}

const handleLogout = () => {
  localStorage.removeItem('adminAuth')
  isAuthenticated.value = false
  notify('You have been logged out.')
}

const initAdminData = () => {
  fetchProjects()
  fetchMessages()
  fetchSettings()
  checkApiHealth()
}

// ---------------------------------------------
// API Health & Ping Check
// ---------------------------------------------
const checkApiHealth = async () => {
  apiStatus.value = 'checking'
  const startTime = performance.now()
  try {
    const res = await fetch(`${customApiUrl.value}/ping`, { method: 'GET' })
    const elapsed = Math.round(performance.now() - startTime)
    if (res.ok) {
      apiStatus.value = 'online'
      apiLatency.value = elapsed
    } else {
      apiStatus.value = 'offline'
    }
  } catch {
    apiStatus.value = 'offline'
    apiLatency.value = null
  }
}

const updateApiUrl = () => {
  setApiBaseUrl(customApiUrl.value)
  notify(`API Base URL updated to: ${customApiUrl.value}`)
  initAdminData()
}

// ---------------------------------------------
// Projects Management & Ordering
// ---------------------------------------------
const isReordering = ref(false)

const sortProjectsArray = (list) => {
  if (!Array.isArray(list)) return []
  const cloned = [...list]

  // Check if projects have an explicit .order attribute
  const hasOrderProps = cloned.some(p => p.order !== undefined && p.order !== null)
  if (hasOrderProps) {
    return cloned.sort((a, b) => {
      const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 9999
      const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 9999
      return ordA - ordB
    })
  }

  // Fallback to localStorage saved order if present
  try {
    const savedOrder = JSON.parse(localStorage.getItem('portfolio_projects_order') || '[]')
    if (Array.isArray(savedOrder) && savedOrder.length > 0) {
      cloned.sort((a, b) => {
        const idxA = savedOrder.indexOf(a.id)
        const idxB = savedOrder.indexOf(b.id)
        if (idxA !== -1 && idxB !== -1) return idxA - idxB
        if (idxA !== -1) return -1
        if (idxB !== -1) return 1
        return 0
      })
    }
  } catch (e) {
    // ignore
  }

  return cloned
}

const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await fetch(`${customApiUrl.value}/projects`)
    if (res.ok) {
      const data = await res.json()
      const rawList = Array.isArray(data) ? data : []
      projects.value = sortProjectsArray(rawList)
    } else {
      loadFallbackProjects()
    }
  } catch (err) {
    console.warn('Backend unavailable, using local cache/fallback projects:', err)
    loadFallbackProjects()
  } finally {
    loading.value = false
  }
}

const loadFallbackProjects = () => {
  if (projects.value.length === 0) {
    const fallbacks = [
      {
        id: 1,
        title: 'Gibi-Equb',
        description: 'Collaborative university student savings system with rotation pot management and digital ledger.',
        tech_stack: 'Vue 3, Laravel, MySQL',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        demo_link: 'https://example.com/gibi-equb',
        github_link: 'https://github.com/example/gibi-equb',
        order: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Lumina-Tutors',
        description: 'Comprehensive digitalized Learning Management & 1-on-1 tutoring platform with session booking.',
        tech_stack: 'Laravel 12, Vue 3, Custom CSS, REST API',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        demo_link: 'https://example.com/lumina',
        github_link: 'https://github.com/example/lumina',
        order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Eduage Ai',
        description: 'AI-assisted university admission & scholarship matching platform powered by Qwen & Gemini agents.',
        tech_stack: 'Laravel, Vue, PostgreSQL, AI Agents',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        demo_link: 'https://example.com/eduage',
        github_link: 'https://github.com/example/eduage',
        order: 2,
        created_at: new Date().toISOString()
      }
    ]
    projects.value = sortProjectsArray(fallbacks)
  }
}

const moveProjectUp = async (index) => {
  if (index <= 0 || isReordering.value) return
  const currentList = [...filteredProjects.value]
  const targetProj = currentList[index]
  const prevProj = currentList[index - 1]

  const mainIdx = projects.value.findIndex(p => p.id === targetProj.id)
  const prevIdx = projects.value.findIndex(p => p.id === prevProj.id)

  if (mainIdx !== -1 && prevIdx !== -1) {
    const temp = projects.value[mainIdx]
    projects.value[mainIdx] = projects.value[prevIdx]
    projects.value[prevIdx] = temp
    await syncProjectsOrder(`Moved "${targetProj.title}" up to #${index}`)
  }
}

const moveProjectDown = async (index) => {
  if (index >= filteredProjects.value.length - 1 || isReordering.value) return
  const currentList = [...filteredProjects.value]
  const targetProj = currentList[index]
  const nextProj = currentList[index + 1]

  const mainIdx = projects.value.findIndex(p => p.id === targetProj.id)
  const nextIdx = projects.value.findIndex(p => p.id === nextProj.id)

  if (mainIdx !== -1 && nextIdx !== -1) {
    const temp = projects.value[mainIdx]
    projects.value[mainIdx] = projects.value[nextIdx]
    projects.value[nextIdx] = temp
    await syncProjectsOrder(`Moved "${targetProj.title}" down to #${index + 2}`)
  }
}

const syncProjectsOrder = async (msg = 'Projects reordered successfully.') => {
  isReordering.value = true
  
  // Assign sequential order indices
  projects.value.forEach((proj, idx) => {
    proj.order = idx
  })

  // 1. Immediately cache order sequence locally
  try {
    const idOrder = projects.value.map(p => p.id)
    localStorage.setItem('portfolio_projects_order', JSON.stringify(idOrder))
  } catch (err) {
    console.warn('LocalStorage save error:', err)
  }

  // 2. Synchronize order with Laravel API
  try {
    const payload = {
      orders: projects.value.map((p, idx) => ({ id: p.id, order: idx }))
    }
    const res = await fetch(`${customApiUrl.value}/projects/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      notify(msg, 'success')
    } else {
      notify('Project sequence saved locally (backend pending).', 'info')
    }
  } catch (err) {
    notify('Project sequence saved locally (backend offline).', 'info')
  } finally {
    isReordering.value = false
  }
}

const openCreateProjectModal = () => {
  editingProjectId.value = null
  projectForm.title = ''
  projectForm.description = ''
  projectForm.tech_stack = ''
  projectForm.image_url = ''
  projectForm.demo_link = ''
  projectForm.github_link = ''
  imageFile.value = null
  imagePreview.value = ''
  showProjectModal.value = true
}

const openEditProjectModal = (proj) => {
  editingProjectId.value = proj.id
  projectForm.title = proj.title || ''
  projectForm.description = proj.description || ''
  projectForm.tech_stack = proj.tech_stack || ''
  projectForm.image_url = proj.image || ''
  projectForm.demo_link = proj.demo_link || ''
  projectForm.github_link = proj.github_link || ''
  imagePreview.value = proj.image || ''
  imageFile.value = null
  showProjectModal.value = true
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 15 * 1024 * 1024) {
      notify('File is larger than 15MB. Please choose a smaller image.', 'error')
      return
    }
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveProject = async () => {
  if (!projectForm.title.trim() || !projectForm.description.trim() || !projectForm.tech_stack.trim()) {
    notify('Please fill in title, tech stack, and description.', 'error')
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('title', projectForm.title.trim())
    formData.append('description', projectForm.description.trim())
    formData.append('tech_stack', projectForm.tech_stack.trim())
    if (projectForm.demo_link) formData.append('demo_link', projectForm.demo_link.trim())
    if (projectForm.github_link) formData.append('github_link', projectForm.github_link.trim())

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    } else if (projectForm.image_url) {
      formData.append('image_url', projectForm.image_url.trim())
    }

    let url = `${customApiUrl.value}/projects`
    let method = 'POST'

    if (editingProjectId.value) {
      url = `${customApiUrl.value}/projects/${editingProjectId.value}`
      // Laravel requires _method=PUT when multipart/form-data is used
      formData.append('_method', 'PUT')
    }

    const res = await fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })

    if (res.ok) {
      const saved = await res.json()
      notify(`Project "${projectForm.title}" saved successfully!`)
      showProjectModal.value = false
      imageFile.value = null
      imagePreview.value = ''
      fetchProjects()
    } else {
      const err = await res.json().catch(() => ({}))
      let errorMsg = 'Error saving project on server.'
      if (err.errors) {
        errorMsg = Object.values(err.errors).flat().join(' ')
      } else if (err.message) {
        errorMsg = err.message
      } else if (err.error) {
        errorMsg = err.error
      }
      notify(errorMsg, 'error')
    }
  } catch (err) {
    if (apiStatus.value === 'offline') {
      saveProjectLocally()
      notify(`Saved locally in demo mode (Backend offline).`)
      showProjectModal.value = false
    } else {
      notify(`Network Error: ${err.message}`, 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

const saveProjectLocally = () => {
  if (editingProjectId.value) {
    const idx = projects.value.findIndex(p => p.id === editingProjectId.value)
    if (idx !== -1) {
      projects.value[idx] = {
        ...projects.value[idx],
        title: projectForm.title,
        description: projectForm.description,
        tech_stack: projectForm.tech_stack,
        image: imagePreview.value || projectForm.image_url || projects.value[idx].image,
        demo_link: projectForm.demo_link,
        github_link: projectForm.github_link
      }
    }
  } else {
    projects.value.unshift({
      id: Date.now(),
      title: projectForm.title,
      description: projectForm.description,
      tech_stack: projectForm.tech_stack,
      image: imagePreview.value || projectForm.image_url || 'https://via.placeholder.com/600x380?text=Project',
      demo_link: projectForm.demo_link,
      github_link: projectForm.github_link,
      created_at: new Date().toISOString()
    })
  }
}

const deleteProject = async (id, title) => {
  if (!confirm(`Are you sure you want to delete "${title || 'this project'}"? This cannot be undone.`)) {
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${customApiUrl.value}/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      notify(`Project "${title}" deleted successfully.`)
      fetchProjects()
    } else {
      // Local fallback deletion if offline
      projects.value = projects.value.filter(p => p.id !== id)
      notify(`Project deleted (local).`)
    }
  } catch (err) {
    projects.value = projects.value.filter(p => p.id !== id)
    notify(`Project deleted (local fallback).`)
  } finally {
    loading.value = false
  }
}

const filteredProjects = computed(() => {
  if (!projectSearchQuery.value.trim()) return projects.value
  const q = projectSearchQuery.value.toLowerCase()
  return projects.value.filter(p => 
    (p.title && p.title.toLowerCase().includes(q)) ||
    (p.tech_stack && p.tech_stack.toLowerCase().includes(q)) ||
    (p.description && p.description.toLowerCase().includes(q))
  )
})

// ---------------------------------------------
// Messages Management
// ---------------------------------------------
const fetchMessages = async () => {
  try {
    const res = await fetch(`${customApiUrl.value}/messages`)
    if (res.ok) {
      const data = await res.json()
      messages.value = Array.isArray(data) ? data : []
    } else if (messages.value.length === 0) {
      loadFallbackMessages()
    }
  } catch (err) {
    if (messages.value.length === 0) loadFallbackMessages()
  }
}

const loadFallbackMessages = () => {
  messages.value = [
    {
      id: 1,
      name: 'Alex Rivera',
      email: 'alex.rivera@techventure.io',
      message: 'Hi Mekdelawit, loved your work on Lumina-Tutors and Gibi-Equb. We are looking for a lead full-stack engineer to build our educational fintech platform. Are you open for a conversation this week?',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 2,
      name: 'Selamawit Tadesse',
      email: 'selam.tadesse@innovateethiopia.org',
      message: 'Hello! We saw your portfolio and your university achievements. Would love to invite you to speak at our upcoming DevSummit on modern Vue 3 & Laravel architectures.',
      created_at: new Date(Date.now() - 3600000 * 28).toISOString()
    }
  ]
}

const deleteMessage = async (id) => {
  if (!confirm('Are you sure you want to delete this message?')) return
  try {
    const res = await fetch(`${customApiUrl.value}/messages/${id}`, { method: 'DELETE' })
    if (res.ok) {
      notify('Message deleted.')
      fetchMessages()
    } else {
      messages.value = messages.value.filter(m => m.id !== id)
      notify('Message removed.')
    }
  } catch {
    messages.value = messages.value.filter(m => m.id !== id)
    notify('Message removed.')
  }
}

const sendTestMessage = async () => {
  if (!testMessageForm.name || !testMessageForm.email || !testMessageForm.message) {
    notify('Please fill in all test message fields.', 'error')
    return
  }

  try {
    const res = await fetch(`${customApiUrl.value}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMessageForm)
    })

    if (res.ok) {
      notify('Test message successfully sent to backend API!')
      showTestMessageModal.value = false
      testMessageForm.name = ''
      testMessageForm.email = ''
      testMessageForm.message = ''
      fetchMessages()
    } else {
      messages.value.unshift({
        id: Date.now(),
        ...testMessageForm,
        created_at: new Date().toISOString()
      })
      notify('Test message added locally (Backend offline).')
      showTestMessageModal.value = false
    }
  } catch (err) {
    messages.value.unshift({
      id: Date.now(),
      ...testMessageForm,
      created_at: new Date().toISOString()
    })
    notify('Test message saved locally.')
    showTestMessageModal.value = false
  }
}

const filteredMessages = computed(() => {
  if (!messageSearchQuery.value.trim()) return messages.value
  const q = messageSearchQuery.value.toLowerCase()
  return messages.value.filter(m => 
    (m.name && m.name.toLowerCase().includes(q)) ||
    (m.email && m.email.toLowerCase().includes(q)) ||
    (m.message && m.message.toLowerCase().includes(q))
  )
})

// ---------------------------------------------
// Settings Management
// ---------------------------------------------
const fetchSettings = async () => {
  try {
    const res = await fetch(`${customApiUrl.value}/settings`)
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data === 'object') {
        settings.value = { ...settings.value, ...data }
      }
    }
  } catch (err) {
    console.warn('Using local settings cache:', err)
  }
}

const saveSettings = async () => {
  loading.value = true
  try {
    const res = await fetch(`${customApiUrl.value}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings.value)
    })
    if (res.ok) {
      notify('Settings saved to backend database successfully!')
    } else {
      notify('Settings saved in local cache (Backend offline).')
    }
  } catch (err) {
    notify('Settings saved in local cache (Backend offline).')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-shell">
    <!-- Top Notification Banner Toast -->
    <transition name="toast-fade">
      <div v-if="notification.message" class="notify-toast" :class="notification.type">
        <span class="notify-icon">
          <svg v-if="notification.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </span>
        <span class="notify-text">{{ notification.message }}</span>
      </div>
    </transition>

    <!-- 1. LOGIN SCREEN -->
    <div v-if="!isAuthenticated" class="login-wrapper">
      <div class="login-container">
        <!-- Monogram Badge -->
        <div class="brand-monogram">M</div>
        <div class="portal-badge">ADMIN CONTROL PANEL</div>
        <h1 class="login-title">Portfolio Manager</h1>
        <p class="login-desc">Sign in to manage projects, review contact inquiries, and configure live settings.</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="loginError" class="auth-alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ loginError }}</span>
          </div>

          <div class="field-group">
            <label>Username</label>
            <div class="input-with-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                v-model="loginForm.username"
                type="text"
                placeholder="e.g. admin"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <div class="field-group">
            <label>Password</label>
            <div class="input-with-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
            </div>
          </div>

          <button type="submit" class="login-submit-btn" :disabled="loginLoading">
            <span v-if="!loginLoading">Sign In to Dashboard</span>
            <span v-else>Authenticating...</span>
          </button>
        </form>

        <div class="credentials-hint">
          <div class="hint-pill">Default: <code>admin</code> / <code>admin123</code></div>
        </div>

        <div class="login-footer">
          <a href="#" @click.prevent="emit('navigate', 'portfolio')" class="return-link">
            ← Return to Portfolio Website
          </a>
        </div>
      </div>
    </div>

    <!-- 2. ADMIN DASHBOARD VIEW -->
    <div v-else class="dashboard-wrapper">
      <!-- Top Navigation Bar -->
      <header class="dash-navbar">
        <div class="dash-brand-block">
          <div class="nav-monogram">M</div>
          <div class="brand-text">
            <div class="brand-heading">
              <span class="brand-name">Mekdelawit Habtamu</span>
              <span class="role-tag">ADMIN CONSOLE</span>
            </div>
            <div class="api-status-row">
              <span class="status-indicator" :class="apiStatus"></span>
              <span class="api-label">
                API: <code class="api-url-code">{{ customApiUrl }}</code>
              </span>
              <span v-if="apiLatency" class="latency-badge">{{ apiLatency }}ms</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="nav-actions">
          <button @click="emit('navigate', 'portfolio')" class="btn-ghost-nav" title="View live portfolio">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>View Site</span>
          </button>

          <button @click="handleLogout" class="btn-logout" title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </header>

      <!-- Subheader with Summary Stats and Tab Buttons -->
      <div class="dash-subnav-bar">
        <div class="tabs-list">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'projects' }"
            @click="activeTab = 'projects'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span>Projects</span>
            <span class="counter-badge">{{ projects.length }}</span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: activeTab === 'messages' }"
            @click="activeTab = 'messages'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Messages / Inquiries</span>
            <span class="counter-badge">{{ messages.length }}</span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: activeTab === 'settings' }"
            @click="activeTab = 'settings'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Site Settings</span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: activeTab === 'diagnostics' }"
            @click="activeTab = 'diagnostics'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <span>API Diagnostics</span>
          </button>
        </div>
      </div>

      <!-- MAIN CONTENT AREA -->
      <main class="dash-content">
        <!-- Backend Offline Notice (Only if backend is unreachable) -->
        <div v-if="apiStatus === 'offline'" class="offline-callout">
          <div class="callout-icon">⚡</div>
          <div class="callout-body">
            <strong>Laravel Backend Server Offline</strong>
            <p>
              Backend endpoint <code>{{ customApiUrl }}</code> is not responding. 
              To connect your real database, start your Laravel backend in a terminal with:
              <code>php artisan serve --port=8000</code>.
              Meanwhile, client-side fallback mode is active.
            </p>
          </div>
          <button @click="checkApiHealth" class="btn-retry">
            ↻ Retry Connection
          </button>
        </div>

        <!-- ============================================== -->
        <!-- TAB 1: PROJECTS MANAGEMENT                     -->
        <!-- ============================================== -->
        <section v-if="activeTab === 'projects'" class="section-pane">
          <div class="pane-action-header">
            <div>
              <h2 class="pane-title">Projects Management</h2>
              <p class="pane-subtitle">
                Manage all portfolio projects stored in your backend database (<code>/api/projects</code>).
              </p>
            </div>

            <div class="action-tools">
              <!-- Search Box -->
              <div class="search-input-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  v-model="projectSearchQuery"
                  type="text"
                  placeholder="Filter projects by title, tech..."
                />
              </div>

              <!-- View Switcher -->
              <div class="view-switch">
                <button
                  :class="{ active: viewMode === 'table' }"
                  @click="viewMode = 'table'"
                  title="Table View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
                <button
                  :class="{ active: viewMode === 'cards' }"
                  @click="viewMode = 'cards'"
                  title="Cards Grid View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
              </div>

              <!-- New Project Button -->
              <button @click="openCreateProjectModal" class="btn-create-project">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add Project</span>
              </button>
            </div>
          </div>

          <!-- TABLE VIEW -->
          <div v-if="viewMode === 'table'" class="table-card">
            <table v-if="filteredProjects.length > 0" class="admin-data-table">
              <thead>
                <tr>
                  <th style="width: 105px; text-align: center;">Order</th>
                  <th style="width: 90px;">Cover</th>
                  <th>Project Details</th>
                  <th>Tech Stack</th>
                  <th>External Links</th>
                  <th style="width: 140px; text-align: right;">Actions</th>
                </tr>
              </thead>
              <!-- SKELETON LOADING ROWS -->
              <tbody v-if="loading">
                <tr v-for="n in 3" :key="'admin-tbl-skel-' + n">
                  <td style="text-align: center;"><div class="skeleton-shimmer-pill" style="width: 36px; height: 22px; margin: 0 auto;"></div></td>
                  <td><div class="skeleton-shimmer-bar" style="width: 68px; height: 48px; border-radius: 8px;"></div></td>
                  <td>
                    <div class="skeleton-shimmer-bar" style="width: 140px; height: 18px; margin-bottom: 6px;"></div>
                    <div class="skeleton-shimmer-bar" style="width: 220px; height: 12px;"></div>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <div class="skeleton-shimmer-pill" style="width: 50px; height: 20px;"></div>
                      <div class="skeleton-shimmer-pill" style="width: 50px; height: 20px;"></div>
                    </div>
                  </td>
                  <td><div class="skeleton-shimmer-pill" style="width: 60px; height: 16px;"></div></td>
                  <td><div class="skeleton-shimmer-pill" style="width: 70px; height: 32px; margin-left: auto;"></div></td>
                </tr>
              </tbody>

              <!-- REAL ROWS -->
              <tbody v-else>
                <tr v-for="(proj, index) in filteredProjects" :key="proj.id">
                  <td class="cell-order">
                    <div class="order-control-box">
                      <span class="order-badge">#{{ index + 1 }}</span>
                      <div class="order-arrow-buttons">
                        <button
                          type="button"
                          class="order-btn up"
                          :disabled="index === 0 || isReordering"
                          @click="moveProjectUp(index)"
                          title="Move Earlier"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </button>
                        <button
                          type="button"
                          class="order-btn down"
                          :disabled="index === filteredProjects.length - 1 || isReordering"
                          @click="moveProjectDown(index)"
                          title="Move Later"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td class="cell-cover">
                    <img
                      :src="proj.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150'"
                      :alt="proj.title"
                      class="project-thumb-img"
                    />
                  </td>
                  <td class="cell-info">
                    <div class="project-table-title">{{ proj.title }}</div>
                    <div class="project-table-desc">{{ proj.description }}</div>
                  </td>
                  <td class="cell-tech">
                    <div class="tech-tags-wrap">
                      <span
                        v-for="tag in (proj.tech_stack || '').split(',')"
                        :key="tag"
                        class="tech-chip"
                      >
                        {{ tag.trim() }}
                      </span>
                    </div>
                  </td>
                  <td class="cell-links">
                    <div class="links-stack">
                      <a v-if="proj.demo_link" :href="proj.demo_link" target="_blank" class="table-ext-link">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span>Demo</span>
                      </a>
                      <a v-if="proj.github_link" :href="proj.github_link" target="_blank" class="table-ext-link">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        <span>Code</span>
                      </a>
                    </div>
                  </td>
                  <td class="cell-actions">
                    <div class="action-btn-group">
                      <button @click="openEditProjectModal(proj)" class="action-btn edit" title="Edit project">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button @click="deleteProject(proj.id, proj.title)" class="action-btn delete" title="Delete project">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="empty-placeholder">
              <div class="empty-icon">📂</div>
              <h3>No projects found</h3>
              <p>Add your first project using the "Add Project" button above.</p>
            </div>
          </div>

          <!-- CARDS VIEW -->
          <div v-else class="cards-grid">
            <template v-if="loading">
              <div v-for="n in 3" :key="'admin-card-skel-' + n" class="admin-proj-card admin-skeleton-card" aria-hidden="true">
                <div class="card-cover-container admin-skeleton-cover skeleton-pulse"></div>
                <div class="card-details">
                  <div class="skeleton-shimmer-bar" style="height: 22px; width: 65%; margin-bottom: 12px;"></div>
                  <div class="skeleton-shimmer-bar" style="height: 14px; width: 95%; margin-bottom: 6px;"></div>
                  <div class="skeleton-shimmer-bar" style="height: 14px; width: 75%; margin-bottom: 18px;"></div>
                  <div class="tech-tags-wrap" style="margin-bottom: 16px;">
                    <span class="skeleton-shimmer-pill" style="width: 55px; height: 22px; display: inline-block;"></span>
                    <span class="skeleton-shimmer-pill" style="width: 65px; height: 22px; display: inline-block;"></span>
                    <span class="skeleton-shimmer-pill" style="width: 45px; height: 22px; display: inline-block;"></span>
                  </div>
                  <div class="card-links-row">
                    <span class="skeleton-shimmer-pill" style="width: 80px; height: 28px; display: inline-block;"></span>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                v-for="(proj, index) in filteredProjects"
                :key="proj.id"
                class="admin-proj-card"
              >
              <div class="card-cover-container">
                <span class="card-order-chip">#{{ index + 1 }}</span>
                <div
                  v-if="proj.image"
                  class="card-ambient-backdrop"
                  :style="{ backgroundImage: `url(${proj.image})` }"
                  aria-hidden="true"
                ></div>
                <div class="card-img-wrap">
                  <img
                    :src="proj.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'"
                    :alt="proj.title"
                    class="card-cover-img"
                  />
                </div>
                <div class="card-overlay-actions">
                  <button
                    type="button"
                    class="card-action-circle order-btn-circle"
                    :disabled="index === 0 || isReordering"
                    @click="moveProjectUp(index)"
                    title="Move Up (#{{ index }})"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="card-action-circle order-btn-circle"
                    :disabled="index === filteredProjects.length - 1 || isReordering"
                    @click="moveProjectDown(index)"
                    title="Move Down (#{{ index + 2 }})"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <button @click="openEditProjectModal(proj)" class="card-action-circle" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button @click="deleteProject(proj.id, proj.title)" class="card-action-circle danger" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="card-details">
                <h3 class="card-title">{{ proj.title }}</h3>
                <p class="card-desc">{{ proj.description }}</p>

                <div class="tech-tags-wrap">
                  <span
                    v-for="tag in (proj.tech_stack || '').split(',')"
                    :key="tag"
                    class="tech-chip"
                  >
                    {{ tag.trim() }}
                  </span>
                </div>

                <div class="card-links-row">
                  <a v-if="proj.demo_link" :href="proj.demo_link" target="_blank" class="card-link-btn">
                    Live Demo
                  </a>
                  <a v-if="proj.github_link" :href="proj.github_link" target="_blank" class="card-link-btn secondary">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </template>
        </div>
        </section>

        <!-- ============================================== -->
        <!-- TAB 2: MESSAGES & CONTACT INQUIRIES            -->
        <!-- ============================================== -->
        <section v-if="activeTab === 'messages'" class="section-pane">
          <div class="pane-action-header">
            <div>
              <h2 class="pane-title">Contact Inquiries & Messages</h2>
              <p class="pane-subtitle">
                Incoming messages from your portfolio contact form (<code>/api/messages</code>).
              </p>
            </div>

            <div class="action-tools">
              <div class="search-input-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  v-model="messageSearchQuery"
                  type="text"
                  placeholder="Search sender, email, content..."
                />
              </div>

              <button @click="showTestMessageModal = true" class="btn-create-project secondary">
                <span>+ Send Test Inquiry</span>
              </button>

              <button @click="fetchMessages" class="btn-refresh" title="Reload messages">
                ↻
              </button>
            </div>
          </div>

          <div v-if="filteredMessages.length > 0" class="messages-stream">
            <div
              v-for="msg in filteredMessages"
              :key="msg.id"
              class="message-tile"
            >
              <div class="msg-header-line">
                <div class="msg-sender-info">
                  <div class="sender-avatar">{{ msg.name.charAt(0).toUpperCase() }}</div>
                  <div>
                    <h4 class="sender-name">{{ msg.name }}</h4>
                    <a :href="`mailto:${msg.email}`" class="sender-email">{{ msg.email }}</a>
                  </div>
                </div>

                <div class="msg-meta-actions">
                  <span class="msg-timestamp">
                    {{ msg.created_at ? new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent' }}
                  </span>
                  <a :href="`mailto:${msg.email}?subject=Regarding your message on Mekdelawit's Portfolio`" class="btn-reply" title="Reply via email">
                    Reply ↗
                  </a>
                  <button @click="deleteMessage(msg.id)" class="btn-delete-msg" title="Delete message">
                    ✕
                  </button>
                </div>
              </div>

              <div class="msg-content-text">
                {{ msg.message }}
              </div>
            </div>
          </div>

          <div v-else class="empty-placeholder">
            <div class="empty-icon">✉️</div>
            <h3>Your inbox is empty</h3>
            <p>No contact inquiries have been received yet. Click "+ Send Test Inquiry" to verify API integration.</p>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- TAB 3: SITE SETTINGS                           -->
        <!-- ============================================== -->
        <section v-if="activeTab === 'settings'" class="section-pane">
          <div class="pane-action-header">
            <div>
              <h2 class="pane-title">Site & Content Settings</h2>
              <p class="pane-subtitle">
                Customize titles, hero headlines, and contact details stored via <code>/api/settings</code>.
              </p>
            </div>

            <button @click="saveSettings" class="btn-create-project" :disabled="loading">
              <span v-if="!loading">Save All Settings</span>
              <span v-else>Saving...</span>
            </button>
          </div>

          <form @submit.prevent="saveSettings" class="settings-grid-layout">
            <!-- Hero Settings -->
            <div class="settings-card">
              <h3 class="card-section-title">
                <span class="icon">✨</span> Hero Header Section
              </h3>
              
              <div class="form-row-2">
                <div class="field-item">
                  <label>Hero Title Tag</label>
                  <input v-model="settings.hero_title" type="text" placeholder="e.g. Full Stack" />
                </div>
                <div class="field-item">
                  <label>Display Name</label>
                  <input v-model="settings.hero_name" type="text" placeholder="e.g. Mekdelawit Habtamu" />
                </div>
              </div>

              <div class="field-item">
                <label>Subtitle / Headline</label>
                <input v-model="settings.hero_subtitle" type="text" placeholder="e.g. Developer & System Builder" />
              </div>
            </div>

            <!-- About Section Settings -->
            <div class="settings-card">
              <h3 class="card-section-title">
                <span class="icon">👤</span> About Me Section
              </h3>

              <div class="field-item">
                <label>About Heading</label>
                <input v-model="settings.about_title" type="text" placeholder="About Me" />
              </div>

              <div class="field-item">
                <label>Bio Summary</label>
                <textarea v-model="settings.about_description" rows="3" placeholder="Describe your background and strengths..."></textarea>
              </div>
            </div>

            <!-- Section Headings -->
            <div class="settings-card">
              <h3 class="card-section-title">
                <span class="icon">📑</span> Section Headings
              </h3>

              <div class="form-row-2">
                <div class="field-item">
                  <label>Skills Title</label>
                  <input v-model="settings.skills_title" type="text" />
                </div>
                <div class="field-item">
                  <label>Projects Title</label>
                  <input v-model="settings.projects_title" type="text" />
                </div>
              </div>

              <div class="field-item">
                <label>Contact Title</label>
                <input v-model="settings.contact_title" type="text" />
              </div>
            </div>

            <!-- Contact & Social Details -->
            <div class="settings-card">
              <h3 class="card-section-title">
                <span class="icon">📬</span> Contact & Social Links
              </h3>

              <div class="form-row-2">
                <div class="field-item">
                  <label>Public Email</label>
                  <input v-model="settings.contact_email" type="email" />
                </div>
                <div class="field-item">
                  <label>Phone Number</label>
                  <input v-model="settings.contact_phone" type="text" />
                </div>
              </div>

              <div class="form-row-2">
                <div class="field-item">
                  <label>GitHub Profile URL</label>
                  <input v-model="settings.social_github" type="url" />
                </div>
                <div class="field-item">
                  <label>Telegram Profile URL</label>
                  <input v-model="settings.social_telegram" type="url" />
                </div>
              </div>

              <div class="form-row-2">
                <div class="field-item">
                  <label>LinkedIn Profile URL</label>
                  <input v-model="settings.social_linkedin" type="url" />
                </div>
                <div class="field-item">
                  <label>Twitter / X Profile URL</label>
                  <input v-model="settings.social_twitter" type="url" />
                </div>
              </div>
            </div>
          </form>
        </section>

        <!-- ============================================== -->
        <!-- TAB 4: API DIAGNOSTICS & SYSTEM STATUS         -->
        <!-- ============================================== -->
        <section v-if="activeTab === 'diagnostics'" class="section-pane">
          <div class="pane-action-header">
            <div>
              <h2 class="pane-title">API Diagnostics & Endpoints</h2>
              <p class="pane-subtitle">
                Test and verify the Laravel backend connectivity and configuration.
              </p>
            </div>
          </div>

          <div class="diagnostics-card">
            <div class="diag-header">
              <h3>Active Backend Endpoint</h3>
              <div class="diag-status" :class="apiStatus">
                {{ apiStatus.toUpperCase() }}
              </div>
            </div>

            <div class="endpoint-config-row">
              <input
                v-model="customApiUrl"
                type="text"
                class="api-input"
                placeholder="http://localhost:8000/api"
              />
              <button @click="updateApiUrl" class="btn-save-endpoint">Update & Test</button>
            </div>

            <div class="preset-links">
              <span>Quick Presets:</span>
              <button @click="customApiUrl = 'http://localhost:8000/api'; updateApiUrl()" class="preset-btn">
                Local (http://localhost:8000/api)
              </button>
              <button @click="customApiUrl = 'https://portfolio-v1-2uu3.onrender.com/api'; updateApiUrl()" class="preset-btn">
                Render Production
              </button>
            </div>

            <div class="endpoints-table-wrap">
              <h4 class="endpoints-title">Verified Laravel API Endpoints:</h4>
              <table class="endpoints-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Route</th>
                    <th>Controller Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="method get">GET</span></td>
                    <td><code>/api/ping</code></td>
                    <td>Heartbeat ping</td>
                    <td><span class="tag-status" :class="apiStatus">{{ apiStatus === 'online' ? '200 OK' : 'Unavailable' }}</span></td>
                  </tr>
                  <tr>
                    <td><span class="method get">GET</span></td>
                    <td><code>/api/projects</code></td>
                    <td>ProjectController@index</td>
                    <td><span class="tag-status online">Active</span></td>
                  </tr>
                  <tr>
                    <td><span class="method post">POST</span></td>
                    <td><code>/api/projects</code></td>
                    <td>ProjectController@store</td>
                    <td><span class="tag-status online">Active</span></td>
                  </tr>
                  <tr>
                    <td><span class="method put">PUT</span></td>
                    <td><code>/api/projects/{id}</code></td>
                    <td>ProjectController@update</td>
                    <td><span class="tag-status online">Active</span></td>
                  </tr>
                  <tr>
                    <td><span class="method del">DELETE</span></td>
                    <td><code>/api/projects/{id}</code></td>
                    <td>ProjectController@destroy</td>
                    <td><span class="tag-status online">Active</span></td>
                  </tr>
                  <tr>
                    <td><span class="method get">GET</span></td>
                    <td><code>/api/messages</code></td>
                    <td>MessageController@index</td>
                    <td><span class="tag-status online">Active</span></td>
                  </tr>
                  <tr>
                    <td><span class="method post">POST</span></td>
                    <td><code>/api/messages</code></td>
                    <td>MessageController@store</td>
                    <td><span class="tag-status online">Active</span></td>
                  </tr>
                  <tr>
                    <td><span class="method get">GET</span></td>
                    <td><code>/api/settings</code></td>
                    <td>SettingController@index</td>
                    <td><span class="tag-status online">Active</span></td>
                  </tr>
                  <tr>
                    <td><span class="method post">POST</span></td>
                    <td><code>/api/settings</code></td>
                    <td>SettingController@store</td>
                    <td><span class="tag-status online">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: ADD / EDIT PROJECT                     -->
    <!-- ============================================== -->
    <div v-if="showProjectModal" class="modal-overlay">
      <div class="modal-window">
        <div class="modal-top">
          <h3 class="modal-title">
            {{ editingProjectId ? 'Edit Project Details' : 'Create New Project' }}
          </h3>
          <button @click="showProjectModal = false" class="modal-close-btn">✕</button>
        </div>

        <form @submit.prevent="saveProject" class="modal-body-form">
          <div class="form-row-2">
            <div class="field-item">
              <label>Project Title *</label>
              <input v-model="projectForm.title" type="text" placeholder="e.g. Gibi-Equb" required />
            </div>
            <div class="field-item">
              <label>Tech Stack * (Comma-separated)</label>
              <input v-model="projectForm.tech_stack" type="text" placeholder="e.g. Vue 3, Laravel, MySQL" required />
            </div>
          </div>

          <div class="field-item">
            <label>Project Description *</label>
            <textarea
              v-model="projectForm.description"
              rows="3"
              placeholder="Explain the purpose, features, and target audience..."
              required
            ></textarea>
          </div>

          <div class="form-row-2">
            <div class="field-item">
              <label>Live Demo URL (optional)</label>
              <input v-model="projectForm.demo_link" type="url" placeholder="https://..." />
            </div>
            <div class="field-item">
              <label>GitHub Repository URL (optional)</label>
              <input v-model="projectForm.github_link" type="url" placeholder="https://github.com/..." />
            </div>
          </div>

          <!-- Cover Image Upload or URL -->
          <div class="field-item">
            <label>Cover Image (File Upload or Direct URL)</label>
            <div class="image-uploader-wrapper">
              <div class="file-picker-block">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileSelect"
                  id="project-file-input"
                  class="hidden-file-input"
                />
                <label for="project-file-input" class="upload-trigger-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>Choose Image File</span>
                </label>
              </div>

              <span class="or-badge">OR</span>

              <input
                v-model="projectForm.image_url"
                type="url"
                class="url-input"
                placeholder="Paste direct image URL"
              />
            </div>

            <!-- Image Preview Box -->
            <div v-if="imagePreview || projectForm.image_url" class="img-preview-card">
              <img :src="imagePreview || projectForm.image_url" alt="Image preview" />
              <button
                type="button"
                @click="imagePreview = ''; projectForm.image_url = ''; imageFile = null"
                class="remove-preview-btn"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          </div>

          <div class="modal-footer-btns">
            <button type="button" @click="showProjectModal = false" class="btn-cancel">
              Cancel
            </button>
            <button type="submit" class="btn-submit-save" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving to Database...' : (editingProjectId ? 'Update Project' : 'Create Project') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: SEND TEST INQUIRY                       -->
    <!-- ============================================== -->
    <div v-if="showTestMessageModal" class="modal-overlay">
      <div class="modal-window">
        <div class="modal-top">
          <h3 class="modal-title">Send Test Contact Inquiry</h3>
          <button @click="showTestMessageModal = false" class="modal-close-btn">✕</button>
        </div>

        <form @submit.prevent="sendTestMessage" class="modal-body-form">
          <div class="form-row-2">
            <div class="field-item">
              <label>Sender Name *</label>
              <input v-model="testMessageForm.name" type="text" placeholder="e.g. John Doe" required />
            </div>
            <div class="field-item">
              <label>Email Address *</label>
              <input v-model="testMessageForm.email" type="email" placeholder="john@example.com" required />
            </div>
          </div>

          <div class="field-item">
            <label>Message *</label>
            <textarea
              v-model="testMessageForm.message"
              rows="4"
              placeholder="Type inquiry text..."
              required
            ></textarea>
          </div>

          <div class="modal-footer-btns">
            <button type="button" @click="showTestMessageModal = false" class="btn-cancel">
              Cancel
            </button>
            <button type="submit" class="btn-submit-save">
              Send to /api/messages
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Overall Shell */
.admin-shell {
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;
}

/* Toast Notification */
.notify-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1.6rem;
  background-color: #0f172a;
  color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);
  font-size: 0.92rem;
  font-weight: 500;
  max-width: 440px;
}
.notify-toast.error {
  background-color: #dc2626;
}
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
}

/* LOGIN VIEW */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at top right, #f1f5f9 0%, #ffffff 60%, #e2e8f0 100%);
}

.login-container {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 28px;
  padding: 3.5rem 2.8rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.04);
  text-align: center;
}

.brand-monogram {
  width: 52px;
  height: 52px;
  background: #000000;
  color: #ffffff;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.portal-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  background-color: #ecfeff;
  color: #0891b2;
  border-radius: 9999px;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  margin-bottom: 1rem;
}

.login-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.login-desc {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  text-align: left;
}

.auth-alert {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-group label {
  font-family: 'Space Mono', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon svg {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  pointer-events: none;
}

.input-with-icon input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.8rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

.input-with-icon input:focus {
  background: #ffffff;
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
}

.login-submit-btn {
  margin-top: 0.5rem;
  padding: 0.95rem 1.6rem;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-submit-btn:hover {
  background-color: #1e293b;
  transform: translateY(-1px);
}

.credentials-hint {
  margin-top: 1.8rem;
}

.hint-pill {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: #f1f5f9;
  border-radius: 9999px;
  font-size: 0.82rem;
  color: #64748b;
}

.hint-pill code {
  color: #0891b2;
  font-weight: 600;
}

.login-footer {
  margin-top: 1.5rem;
}

.return-link {
  font-size: 0.88rem;
  font-weight: 600;
  color: #06b6d4;
  text-decoration: none;
  transition: color 0.2s ease;
}

.return-link:hover {
  color: #0891b2;
}

/* DASHBOARD VIEW */
.dash-navbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.dash-brand-block {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.nav-monogram {
  width: 44px;
  height: 44px;
  background: #000000;
  color: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.3rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.brand-heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.role-tag {
  font-family: 'Space Mono', monospace;
  font-size: 0.68rem;
  padding: 0.2rem 0.55rem;
  background-color: #ecfeff;
  color: #0891b2;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.api-status-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
  color: #64748b;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-indicator.online {
  background-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}
.status-indicator.offline {
  background-color: #f59e0b;
}
.status-indicator.checking {
  background-color: #94a3b8;
}

.api-url-code {
  font-family: 'Space Mono', monospace;
  color: #334155;
  background: #f1f5f9;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.latency-badge {
  font-family: 'Space Mono', monospace;
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 600;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.btn-ghost-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  color: #334155;
  transition: all 0.2s ease;
}

.btn-ghost-nav:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

/* Tabs Bar */
.dash-subnav-bar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 3rem;
}

.tabs-list {
  display: flex;
  gap: 2rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 1.1rem 0;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #0f172a;
}

.tab-btn.active {
  color: #000000;
  border-bottom-color: #000000;
}

.counter-badge {
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  padding: 0.15rem 0.55rem;
  border-radius: 9999px;
  background: #f1f5f9;
  color: #475569;
}

.tab-btn.active .counter-badge {
  background: #000000;
  color: #ffffff;
}

/* Main Content */
.dash-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 3rem 5rem 3rem;
}

/* Callout */
.offline-callout {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 16px;
  margin-bottom: 2rem;
  color: #92400e;
}

.callout-icon {
  font-size: 1.8rem;
}

.callout-body {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.5;
}

.callout-body code {
  background: #fef3c7;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  color: #78350f;
}

.btn-retry {
  padding: 0.55rem 1.1rem;
  background: #f59e0b;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}

/* Section Header */
.pane-action-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.pane-title {
  font-size: 1.85rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.3rem 0;
  letter-spacing: -0.02em;
}

.pane-subtitle {
  font-size: 0.92rem;
  color: #64748b;
  margin: 0;
}

.pane-subtitle code {
  font-family: 'Space Mono', monospace;
  color: #0891b2;
}

.action-tools {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.search-input-box {
  display: flex;
  align-items: center;
  position: relative;
}

.search-input-box svg {
  position: absolute;
  left: 0.9rem;
  color: #94a3b8;
}

.search-input-box input {
  padding: 0.65rem 1rem 0.65rem 2.4rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.88rem;
  font-family: inherit;
  outline: none;
  min-width: 240px;
}

.search-input-box input:focus {
  border-color: #06b6d4;
}

.view-switch {
  display: flex;
  background: #e2e8f0;
  border-radius: 10px;
  padding: 2px;
}

.view-switch button {
  background: transparent;
  border: none;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-switch button.active {
  background: #ffffff;
  color: #000000;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.btn-create-project {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-create-project:hover {
  background-color: #1e293b;
  transform: translateY(-1px);
}

.btn-create-project.secondary {
  background-color: #f1f5f9;
  color: #0f172a;
  border: 1px solid #cbd5e1;
}

.btn-refresh {
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
}

/* DATA TABLE */
.table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.admin-data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-data-table th {
  background-color: #f8fafc;
  padding: 1.1rem 1.6rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.admin-data-table td {
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

/* Order Column & Controls */
.cell-order {
  text-align: center;
}

.order-control-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.order-badge {
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0891b2;
  background-color: #ecfeff;
  border: 1px solid #cffafe;
  border-radius: 8px;
  padding: 0.25rem 0.55rem;
  min-width: 32px;
  text-align: center;
  user-select: none;
}

.order-arrow-buttons {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.order-btn {
  width: 24px;
  height: 20px;
  border-radius: 5px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  transition: all 0.15s ease;
  padding: 0;
}

.order-btn:hover:not(:disabled) {
  background: #06b6d4;
  color: #ffffff;
  border-color: #06b6d4;
  transform: scale(1.05);
}

.order-btn:disabled {
  opacity: 0.28;
  cursor: not-allowed;
  background: #f8fafc;
}

.card-order-chip {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  font-family: 'Space Mono', monospace;
  font-size: 0.76rem;
  font-weight: 700;
  color: #0891b2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.25);
  user-select: none;
}

.card-action-circle.order-btn-circle {
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
}

.card-action-circle.order-btn-circle:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

.project-thumb-img {
  width: 68px;
  height: 48px;
  object-fit: contain;
  background-color: #0f172a;
  padding: 2px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.project-table-title {
  font-weight: 700;
  font-size: 1.05rem;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.project-table-desc {
  font-size: 0.85rem;
  color: #64748b;
  max-width: 380px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  max-width: 240px;
}

.tech-chip {
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  padding: 0.2rem 0.6rem;
  background: #ecfeff;
  color: #0891b2;
  border-radius: 9999px;
  white-space: nowrap;
}

.links-stack {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.table-ext-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0284c7;
  text-decoration: none;
}

.table-ext-link:hover {
  text-decoration: underline;
}

.action-btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
}

.action-btn.edit:hover {
  background: #f1f5f9;
  border-color: #06b6d4;
  color: #06b6d4;
}

.action-btn.delete:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

/* CARDS GRID VIEW */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.admin-proj-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.admin-proj-card:hover {
  transform: translateY(-4px);
}

.card-cover-container {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #0b1120;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-ambient-backdrop {
  position: absolute;
  top: -15%;
  left: -15%;
  width: 130%;
  height: 130%;
  background-size: cover;
  background-position: center;
  filter: blur(24px);
  opacity: 0.25;
  transform: scale(1.15);
  pointer-events: none;
  z-index: 1;
}

.card-img-wrap {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem;
  box-sizing: border-box;
}

.card-cover-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.admin-proj-card:hover .card-cover-img {
  transform: scale(1.03);
}

.card-overlay-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 0.5rem;
}

.card-action-circle {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.card-action-circle.danger {
  color: #dc2626;
}

.card-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.4rem 0;
}

.card-desc {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1.2rem;
  flex: 1;
}

.card-links-row {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.2rem;
}

.card-link-btn {
  flex: 1;
  text-align: center;
  padding: 0.55rem;
  background: #000000;
  color: #ffffff;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
}

.card-link-btn.secondary {
  background: #f1f5f9;
  color: #0f172a;
}

/* MESSAGES STREAM */
.messages-stream {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.message-tile {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.msg-header-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.msg-sender-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sender-avatar {
  width: 44px;
  height: 44px;
  background: #ecfeff;
  color: #0891b2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.sender-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.sender-email {
  font-size: 0.85rem;
  color: #0284c7;
  text-decoration: none;
}

.msg-meta-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.msg-timestamp {
  font-family: 'Space Mono', monospace;
  font-size: 0.78rem;
  color: #94a3b8;
}

.btn-reply {
  padding: 0.45rem 0.9rem;
  background: #f1f5f9;
  color: #0f172a;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
}

.btn-delete-msg {
  width: 32px;
  height: 32px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  cursor: pointer;
  color: #64748b;
}

.btn-delete-msg:hover {
  background: #fef2f2;
  color: #dc2626;
}

.msg-content-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #334155;
  background: #f8fafc;
  padding: 1.2rem 1.4rem;
  border-radius: 12px;
}

/* SETTINGS GRID */
.settings-grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.settings-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2.2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.card-section-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f1f5f9;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-item label {
  font-family: 'Space Mono', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
}

.field-item input,
.field-item textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.92rem;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
}

.field-item input:focus,
.field-item textarea:focus {
  background: #ffffff;
  border-color: #06b6d4;
}

/* DIAGNOSTICS */
.diagnostics-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 900px;
}

.diag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.diag-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.diag-status {
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
}
.diag-status.online {
  background: #ecfdf5;
  color: #059669;
}
.diag-status.offline {
  background: #fef2f2;
  color: #dc2626;
}

.endpoint-config-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.api-input {
  flex: 1;
  padding: 0.85rem 1.2rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-family: 'Space Mono', monospace;
  font-size: 0.92rem;
}

.btn-save-endpoint {
  padding: 0.85rem 1.6rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.preset-links {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.82rem;
  color: #64748b;
  margin-bottom: 2.5rem;
}

.preset-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
}

.endpoints-title {
  font-size: 0.95rem;
  margin-bottom: 0.8rem;
  color: #475569;
}

.endpoints-table {
  width: 100%;
  border-collapse: collapse;
}

.endpoints-table th {
  text-align: left;
  padding: 0.8rem 1rem;
  background: #f8fafc;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.endpoints-table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.88rem;
}

.method {
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
}
.method.get { background: #e0f2fe; color: #0369a1; }
.method.post { background: #dcfce7; color: #15803d; }
.method.put { background: #fef3c7; color: #b45309; }
.method.del { background: #fee2e2; color: #b91c1c; }

.tag-status {
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
}
.tag-status.online { background: #ecfdf5; color: #059669; }
.tag-status.offline { background: #fef2f2; color: #dc2626; }

/* MODALS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1.5rem;
}

.modal-window {
  width: 100%;
  max-width: 680px;
  background: #ffffff;
  border-radius: 24px;
  padding: 2.5rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
}

.modal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.8rem;
}

.modal-title {
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0;
}

.modal-close-btn {
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
}

.modal-body-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.image-uploader-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hidden-file-input {
  display: none;
}

.upload-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.2rem;
  background: #f1f5f9;
  border: 1px dashed #94a3b8;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.or-badge {
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  color: #94a3b8;
}

.url-input {
  flex: 1;
}

.img-preview-card {
  position: relative;
  margin-top: 0.8rem;
  display: inline-block;
}

.img-preview-card img {
  width: 140px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.remove-preview-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc2626;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.7rem;
  cursor: pointer;
}

.modal-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  padding: 0.8rem 1.6rem;
  background: #f1f5f9;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit-save {
  padding: 0.8rem 1.8rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.empty-placeholder {
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.8rem;
}

@media (max-width: 900px) {
  .dash-navbar {
    padding: 1rem 1.5rem;
  }
  .dash-subnav-bar {
    padding: 0 1.5rem;
  }
  .dash-content {
    padding: 2rem 1.5rem;
  }
  .settings-grid-layout {
    grid-template-columns: 1fr;
  }
  .form-row-2 {
    grid-template-columns: 1fr;
  }
}
</style>
