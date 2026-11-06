<script setup>
import { ref, reactive, onMounted } from 'vue'

const emit = defineEmits(['navigate'])

// API URL - defaults to local Laravel backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Auth State
const isAuthenticated = ref(false)
const loginForm = reactive({ username: '', password: '' })
const loginError = ref('')
const loginLoading = ref(false)

// Dashboard State
const activeTab = ref('projects')
const loading = ref(false)
const notification = reactive({ message: '', type: '' })

// Data Lists
const projects = ref([])
const messages = ref([])
const settings = ref({
  hero_title: 'Full Stack',
  hero_name: 'Mekdelawit Habtamu',
  hero_subtitle: 'Developer',
  about_title: 'About Me',
  about_description: '',
  skills_title: 'Skills & Technologies',
  projects_title: 'My Projects',
  contact_title: "Let's Work Together"
})

// Project Form State
const showProjectForm = ref(false)
const editingProjectId = ref(null)
const projectForm = reactive({
  title: '',
  description: '',
  tech_stack: '',
  image: '',
  image_url: '',
  demo_link: '',
  github_link: ''
})
const imageFile = ref(null)
const imagePreview = ref('')

const setNotification = (msg, type = 'success') => {
  notification.message = msg
  notification.type = type
  setTimeout(() => {
    notification.message = ''
  }, 4000)
}

// Check Login on Mount
onMounted(() => {
  const auth = localStorage.getItem('adminAuth')
  if (auth === 'true') {
    isAuthenticated.value = true
    loadInitialData()
  }
})

// Login Handler
const handleLogin = () => {
  loginError.value = ''
  loginLoading.value = true

  // Standard authentication check (matches credentials)
  if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
    localStorage.setItem('adminAuth', 'true')
    isAuthenticated.value = true
    loadInitialData()
  } else {
    loginError.value = 'Invalid username or password (default: admin / admin123)'
  }
  loginLoading.value = false
}

const handleLogout = () => {
  localStorage.removeItem('adminAuth')
  isAuthenticated.value = false
}

// Load data when tab changes
const loadInitialData = () => {
  fetchProjects()
  fetchMessages()
  fetchSettings()
}

// 1. Projects API
const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/projects`)
    if (res.ok) {
      const data = await res.json()
      projects.value = Array.isArray(data) ? data : []
    }
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  } finally {
    loading.value = false
  }
}

const handleImageSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      imagePreview.value = uploadEvent.target.result
    }
    reader.readAsDataURL(file)
  }
}

const openCreateProject = () => {
  editingProjectId.value = null
  projectForm.title = ''
  projectForm.description = ''
  projectForm.tech_stack = ''
  projectForm.image = ''
  projectForm.image_url = ''
  projectForm.demo_link = ''
  projectForm.github_link = ''
  imageFile.value = null
  imagePreview.value = ''
  showProjectForm.value = true
}

const openEditProject = (p) => {
  editingProjectId.value = p.id
  projectForm.title = p.title || ''
  projectForm.description = p.description || ''
  projectForm.tech_stack = p.tech_stack || ''
  projectForm.image = p.image || ''
  projectForm.image_url = p.image || ''
  projectForm.demo_link = p.demo_link || ''
  projectForm.github_link = p.github_link || ''
  imagePreview.value = p.image || ''
  imageFile.value = null
  showProjectForm.value = true
}

const saveProject = async () => {
  if (!projectForm.title || !projectForm.description || !projectForm.tech_stack) {
    setNotification('Please fill in all required fields.', 'error')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('title', projectForm.title)
    formData.append('description', projectForm.description)
    formData.append('tech_stack', projectForm.tech_stack)
    if (projectForm.demo_link) formData.append('demo_link', projectForm.demo_link)
    if (projectForm.github_link) formData.append('github_link', projectForm.github_link)

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    } else if (projectForm.image_url) {
      formData.append('image_url', projectForm.image_url)
    }

    let url = `${API_BASE}/projects`
    let method = 'POST'

    // If editing, Laravel API supports POST with _method = PUT for multipart
    if (editingProjectId.value) {
      url = `${API_BASE}/projects/${editingProjectId.value}`
      formData.append('_method', 'PUT')
    }

    const res = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      setNotification(`Project ${editingProjectId.value ? 'updated' : 'created'} successfully!`)
      showProjectForm.value = false
      fetchProjects()
    } else {
      const errData = await res.json()
      setNotification(errData.message || 'Error saving project', 'error')
    }
  } catch (err) {
    setNotification(`API error: ${err.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const deleteProject = async (id) => {
  if (!confirm('Are you sure you want to delete this project?')) return
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setNotification('Project deleted successfully.')
      fetchProjects()
    } else {
      setNotification('Failed to delete project', 'error')
    }
  } catch (err) {
    setNotification(`API error: ${err.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 2. Messages API
const fetchMessages = async () => {
  try {
    const res = await fetch(`${API_BASE}/messages`)
    if (res.ok) {
      const data = await res.json()
      messages.value = Array.isArray(data) ? data : []
    }
  } catch (err) {
    console.error('Failed to fetch messages:', err)
  }
}

const deleteMessage = async (id) => {
  if (!confirm('Delete this message?')) return
  try {
    const res = await fetch(`${API_BASE}/messages/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setNotification('Message deleted.')
      fetchMessages()
    }
  } catch (err) {
    setNotification('Failed to delete message', 'error')
  }
}

// 3. Settings API
const fetchSettings = async () => {
  try {
    const res = await fetch(`${API_BASE}/settings`)
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data === 'object') {
        settings.value = { ...settings.value, ...data }
      }
    }
  } catch (err) {
    console.error('Failed to fetch settings:', err)
  }
}

const saveSettings = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings.value)
    })
    if (res.ok) {
      setNotification('Settings saved successfully!')
    } else {
      setNotification('Failed to save settings', 'error')
    }
  } catch (err) {
    setNotification(`Error: ${err.message}`, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-wrapper">
    <!-- Notification Toast -->
    <div v-if="notification.message" class="notification-toast" :class="notification.type">
      {{ notification.message }}
    </div>

    <!-- 1. LOGIN SCREEN -->
    <div v-if="!isAuthenticated" class="login-view">
      <div class="login-card">
        <div class="login-badge">PORTFOLIO CONTROL</div>
        <h2 class="login-title">Admin Login</h2>
        <p class="login-subtitle">Enter your credentials to manage projects & messages</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="loginError" class="alert-error">
            {{ loginError }}
          </div>

          <div class="form-field">
            <label>Username</label>
            <input 
              v-model="loginForm.username" 
              type="text" 
              placeholder="e.g. admin" 
              required 
              autofocus 
            />
          </div>

          <div class="form-field">
            <label>Password</label>
            <input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" class="submit-btn" :disabled="loginLoading">
            {{ loginLoading ? 'Authenticating...' : 'Sign In to Dashboard' }}
          </button>
        </form>

        <div class="login-help">
          <p>Default credentials: <code>admin</code> / <code>admin123</code></p>
          <a href="#" @click.prevent="emit('navigate', 'portfolio')" class="back-link">
            ← Return to Portfolio Website
          </a>
        </div>
      </div>
    </div>

    <!-- 2. ADMIN DASHBOARD SCREEN -->
    <div v-else class="dashboard-view">
      <!-- Dashboard Top Header -->
      <header class="dash-header">
        <div class="dash-brand">
          <div class="logo-mark">M</div>
          <div>
            <h1 class="dash-title">Portfolio Manager</h1>
            <span class="api-tag">API: {{ API_BASE }}</span>
          </div>
        </div>

        <div class="dash-actions">
          <button @click="emit('navigate', 'portfolio')" class="view-site-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>View Live Site</span>
          </button>

          <button @click="handleLogout" class="logout-btn">
            Log Out
          </button>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <div class="dash-tabs-bar">
        <button 
          class="dash-tab" 
          :class="{ active: activeTab === 'projects' }"
          @click="activeTab = 'projects'"
        >
          <span>📁 Projects ({{ projects.length }})</span>
        </button>
        <button 
          class="dash-tab" 
          :class="{ active: activeTab === 'messages' }"
          @click="activeTab = 'messages'"
        >
          <span>✉️ Messages ({{ messages.length }})</span>
        </button>
        <button 
          class="dash-tab" 
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          <span>⚙️ Site Settings</span>
        </button>
      </div>

      <!-- MAIN TAB VIEWS -->
      <main class="dash-main">
        <!-- 1. PROJECTS TAB -->
        <section v-if="activeTab === 'projects'" class="tab-pane">
          <div class="pane-header">
            <div>
              <h2 class="pane-title">Projects Management</h2>
              <p class="pane-desc">Manage, edit, or upload new projects displayed on your portfolio.</p>
            </div>
            <button @click="openCreateProject" class="primary-action-btn">
              + New Project
            </button>
          </div>

          <!-- Project Form Modal / Drawer -->
          <div v-if="showProjectForm" class="modal-backdrop">
            <div class="modal-card">
              <div class="modal-header">
                <h3>{{ editingProjectId ? 'Edit Project' : 'Create New Project' }}</h3>
                <button @click="showProjectForm = false" class="close-btn">✕</button>
              </div>

              <form @submit.prevent="saveProject" class="modal-form">
                <div class="form-row">
                  <div class="form-field">
                    <label>Project Title *</label>
                    <input v-model="projectForm.title" type="text" placeholder="e.g. Gibi-Equb" required />
                  </div>
                  <div class="form-field">
                    <label>Tech Stack *</label>
                    <input v-model="projectForm.tech_stack" type="text" placeholder="e.g. Vue 3, Laravel, MySQL" required />
                  </div>
                </div>

                <div class="form-field">
                  <label>Project Description *</label>
                  <textarea v-model="projectForm.description" rows="3" placeholder="Brief summary of what the project does..." required></textarea>
                </div>

                <div class="form-row">
                  <div class="form-field">
                    <label>Live Demo URL</label>
                    <input v-model="projectForm.demo_link" type="url" placeholder="https://..." />
                  </div>
                  <div class="form-field">
                    <label>GitHub Repository URL</label>
                    <input v-model="projectForm.github_link" type="url" placeholder="https://github.com/..." />
                  </div>
                </div>

                <!-- Image Upload & Preview -->
                <div class="form-field">
                  <label>Cover Image (File Upload or Image URL)</label>
                  <div class="image-uploader-box">
                    <input type="file" accept="image/*" @change="handleImageSelect" class="file-input" />
                    <span class="or-separator">OR</span>
                    <input v-model="projectForm.image_url" type="url" placeholder="Paste direct image URL" />
                  </div>

                  <div v-if="imagePreview" class="preview-box">
                    <img :src="imagePreview" alt="Preview" />
                  </div>
                </div>

                <div class="modal-actions">
                  <button type="button" @click="showProjectForm = false" class="cancel-btn">Cancel</button>
                  <button type="submit" class="submit-btn" :disabled="loading">
                    {{ loading ? 'Saving...' : 'Save Project' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Projects Table List -->
          <div class="table-container">
            <table v-if="projects.length > 0" class="data-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Tech Stack</th>
                  <th>Description</th>
                  <th>Links</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in projects" :key="p.id">
                  <td class="col-thumb">
                    <img :src="p.image || 'https://via.placeholder.com/80x50?text=No+Img'" :alt="p.title" />
                  </td>
                  <td class="col-title">
                    <strong>{{ p.title }}</strong>
                  </td>
                  <td class="col-tech">
                    <span class="tech-pill">{{ p.tech_stack }}</span>
                  </td>
                  <td class="col-desc">{{ p.description }}</td>
                  <td class="col-links">
                    <a v-if="p.demo_link" :href="p.demo_link" target="_blank" class="icon-link">Demo</a>
                    <a v-if="p.github_link" :href="p.github_link" target="_blank" class="icon-link">GitHub</a>
                  </td>
                  <td class="col-actions">
                    <button @click="openEditProject(p)" class="btn-edit">Edit</button>
                    <button @click="deleteProject(p.id)" class="btn-del">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="empty-state">
              <p>No projects found in database. Click <strong>+ New Project</strong> to add your first one!</p>
            </div>
          </div>
        </section>

        <!-- 2. MESSAGES TAB -->
        <section v-if="activeTab === 'messages'" class="tab-pane">
          <div class="pane-header">
            <div>
              <h2 class="pane-title">Contact Messages</h2>
              <p class="pane-desc">Inquiries and messages submitted by visitors from your portfolio.</p>
            </div>
            <button @click="fetchMessages" class="refresh-btn">↻ Refresh</button>
          </div>

          <div class="messages-list">
            <div v-if="messages.length > 0" class="messages-grid">
              <div v-for="msg in messages" :key="msg.id" class="message-card">
                <div class="msg-header">
                  <div>
                    <h4 class="msg-author">{{ msg.name }}</h4>
                    <a :href="`mailto:${msg.email}`" class="msg-email">{{ msg.email }}</a>
                  </div>
                  <button @click="deleteMessage(msg.id)" class="btn-del-sm" title="Delete message">✕</button>
                </div>
                <p class="msg-body">{{ msg.message }}</p>
                <span v-if="msg.created_at" class="msg-date">{{ new Date(msg.created_at).toLocaleDateString() }}</span>
              </div>
            </div>

            <div v-else class="empty-state">
              <p>Your inbox is clean. No contact messages received yet.</p>
            </div>
          </div>
        </section>

        <!-- 3. SETTINGS TAB -->
        <section v-if="activeTab === 'settings'" class="tab-pane">
          <div class="pane-header">
            <div>
              <h2 class="pane-title">Site & API Settings</h2>
              <p class="pane-desc">Customize header names, subtitles, and portfolio text.</p>
            </div>
          </div>

          <form @submit.prevent="saveSettings" class="settings-form">
            <div class="settings-group">
              <h3>Hero Section</h3>
              <div class="form-row">
                <div class="form-field">
                  <label>Author / Brand Name</label>
                  <input v-model="settings.hero_name" type="text" />
                </div>
                <div class="form-field">
                  <label>Primary Role Title</label>
                  <input v-model="settings.hero_subtitle" type="text" />
                </div>
              </div>
            </div>

            <div class="settings-group">
              <h3>Section Headings</h3>
              <div class="form-row">
                <div class="form-field">
                  <label>About Heading</label>
                  <input v-model="settings.about_title" type="text" />
                </div>
                <div class="form-field">
                  <label>Skills Heading</label>
                  <input v-model="settings.skills_title" type="text" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label>Projects Heading</label>
                  <input v-model="settings.projects_title" type="text" />
                </div>
                <div class="form-field">
                  <label>Contact Heading</label>
                  <input v-model="settings.contact_title" type="text" />
                </div>
              </div>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? 'Saving Settings...' : 'Save Settings' }}
            </button>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0f172a;
}

/* Toast */
.notification-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background-color: #000000;
  color: #ffffff;
  font-size: 0.95rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.notification-toast.error {
  background-color: #ef4444;
}

/* LOGIN VIEW */
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  border: 1px solid rgba(226, 232, 240, 0.9);
  text-align: center;
}

.login-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  background-color: #ecfeff;
  color: #0891b2;
  border-radius: 9999px;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
}

.login-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 0.92rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  text-align: left;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field label {
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
}

.form-field input,
.form-field textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-field input:focus,
.form-field textarea:focus {
  border-color: #06b6d4;
}

.submit-btn {
  padding: 0.85rem 1.6rem;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.submit-btn:hover {
  background-color: #1e293b;
}

.alert-error {
  padding: 0.75rem 1rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  color: #dc2626;
  border-radius: 10px;
  font-size: 0.85rem;
}

.login-help {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.back-link {
  color: #06b6d4;
  text-decoration: none;
  font-weight: 600;
}

/* DASHBOARD VIEW */
.dash-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dash-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-mark {
  width: 40px;
  height: 40px;
  background: #000000;
  color: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.dash-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
}

.api-tag {
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  color: #64748b;
}

.dash-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-site-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
}

.logout-btn {
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
}

.dash-tabs-bar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 3rem;
  display: flex;
  gap: 2rem;
}

.dash-tab {
  background: transparent;
  border: none;
  padding: 1rem 0;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.dash-tab.active {
  color: #000000;
  border-bottom-color: #000000;
}

.dash-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.pane-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.pane-desc {
  color: #64748b;
  font-size: 0.95rem;
}

.primary-action-btn {
  padding: 0.75rem 1.6rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}

.modal-card {
  width: 100%;
  max-width: 640px;
  background: #ffffff;
  border-radius: 20px;
  padding: 2.5rem;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.image-uploader-box {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.or-separator {
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  color: #94a3b8;
}

.preview-box {
  margin-top: 0.5rem;
}

.preview-box img {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  padding: 0.75rem 1.4rem;
  background: #f1f5f9;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

/* Table */
.table-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.02);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background: #f8fafc;
  padding: 1rem 1.5rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
}

.col-thumb img {
  width: 72px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
}

.tech-pill {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  background: #ecfeff;
  color: #0891b2;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-family: 'Space Mono', monospace;
}

.col-desc {
  max-width: 320px;
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.45;
}

.col-links {
  display: flex;
  gap: 0.6rem;
}

.icon-link {
  font-size: 0.82rem;
  color: #0284c7;
  text-decoration: none;
  font-weight: 600;
}

.btn-edit {
  padding: 0.4rem 0.9rem;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-del {
  padding: 0.4rem 0.9rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
}

/* Messages */
.messages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

.message-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.msg-author {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.msg-email {
  font-size: 0.85rem;
  color: #0284c7;
  text-decoration: none;
}

.msg-body {
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 1rem;
}

.msg-date {
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  color: #94a3b8;
}

.btn-del-sm {
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  color: #64748b;
}

/* Settings Form */
.settings-form {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-group h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
}
</style>
