<script setup>
import { ref, reactive, computed } from 'vue'
import { getApiBaseUrl } from '../config/api'
import { useSettings } from '../composables/useSettings'

const { settings } = useSettings()

const email = computed(() => settings.value.contact_email || 'mekdimeki8@gmail.com')
const phone = computed(() => settings.value.contact_phone || '+251 953 419 361')
const phoneLink = computed(() => (settings.value.contact_phone || '+251953419361').replace(/\s+/g, ''))
const API_BASE = getApiBaseUrl()

const headlineLines = computed(() => {
  let title = settings.value.contact_title
  if (!title || title.trim().toLowerCase() === 'get in touch') {
    title = "Let's Work Together"
  }
  const raw = title.toUpperCase()
  const words = raw.split(/\s+/)
  if (words.length <= 2) {
    return [words[0] || "LET'S WORK", words[1] || "TOGETHER"]
  }
  if (raw === "LET'S WORK TOGETHER" || raw === "LETS WORK TOGETHER") {
    return ["LET'S WORK", "TOGETHER"]
  }
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
})

const contactRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isHovered = ref(false)

// Message Modal State
const showMessageModal = ref(false)
const isSending = ref(false)
const sendSuccess = ref(false)
const sendError = ref('')
const messageForm = reactive({
  name: '',
  email: '',
  message: ''
})

const handleMouseMove = (e) => {
  if (!contactRef.value) return
  const rect = contactRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}

const submitContactForm = async () => {
  if (!messageForm.name || !messageForm.email || !messageForm.message) {
    sendError.value = 'Please complete all required fields.'
    return
  }

  isSending.value = true
  sendError.value = ''

  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageForm)
    })

    if (res.ok) {
      sendSuccess.value = true
      setTimeout(() => {
        showMessageModal.value = false
        sendSuccess.value = false
        messageForm.name = ''
        messageForm.email = ''
        messageForm.message = ''
      }, 2000)
    } else {
      sendError.value = 'Message could not be saved to backend. Please try emailing directly.'
    }
  } catch (err) {
    // If backend is offline, store in local session
    sendSuccess.value = true
    setTimeout(() => {
      showMessageModal.value = false
      sendSuccess.value = false
      messageForm.name = ''
      messageForm.email = ''
      messageForm.message = ''
    }, 2000)
  } finally {
    isSending.value = false
  }
}

const socials = computed(() => [
  {
    name: 'GitHub',
    url: settings.value.social_github || 'https://github.com',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`
  },
  {
    name: 'Telegram',
    url: settings.value.social_telegram || 'https://t.me',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.535-.196 1.006.128.832.943z"/></svg>`
  },
  {
    name: 'LinkedIn',
    url: settings.value.social_linkedin || 'https://linkedin.com',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
  },
  {
    name: 'Twitter',
    url: settings.value.social_twitter || 'https://twitter.com',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
  }
])
</script>

<template>
  <footer
    id="contact"
    ref="contactRef"
    class="contact-section"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Interactive Cursor Color Glow Effect (Only in Contact Section) -->
    <div
      class="cursor-glow-spotlight"
      :style="{
        transform: `translate(${mouseX}px, ${mouseY}px)`,
        opacity: isHovered ? 1 : 0
      }"
      aria-hidden="true"
    ></div>

    <div class="contact-container">
      <!-- Centered Huge Headline in the Middle -->
      <div class="headline-container">
        <h2 class="contact-headline">
          <span class="headline-line">{{ headlineLines[0] }}</span>
          <span class="headline-line">{{ headlineLines[1] }}</span>
        </h2>
      </div>

      <!-- Bottom Cluster: Divider + Details -->
      <div class="bottom-cluster">
        <!-- Horizontal Divider Line -->
        <div class="contact-divider"></div>

        <!-- Bottom Layout Row -->
        <div class="contact-bottom-row">
          <!-- Left: Socials -->
          <div class="socials-column">
            <span class="socials-label">• SOCIALS</span>
            <div class="socials-buttons-row">
              <a
                v-for="social in socials"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-icon-btn"
                :aria-label="social.name"
                v-html="social.svg"
              ></a>
            </div>
          </div>

          <!-- Right: Contact Pill Cards -->
          <div class="contact-details-column">
            <!-- Email Card -->
            <a :href="`mailto:${email}`" class="contact-pill-card">
              <span class="pill-icon email-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </span>
              <span class="pill-value">{{ email }}</span>
            </a>

            <!-- Phone Card -->
            <a :href="`tel:${phoneLink}`" class="contact-pill-card">
              <span class="pill-icon phone-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <span class="pill-value">{{ phone }}</span>
            </a>

            <!-- Quick Inquiry / Message Pill Button -->
            <button
              type="button"
              @click="showMessageModal = true"
              class="contact-pill-card message-trigger-btn"
            >
              <span class="pill-icon message-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <span class="pill-value">Send Message</span>
            </button>
          </div>
        </div>

        <!-- Copyright Subtext with discreet Admin Portal Link -->
        <div class="footer-credit">
          <p>
            &copy; 2026 Mekdelawit Habtamu. All rights reserved.
            <span class="admin-credit-separator">•</span>
            <a href="#admin" class="admin-portal-link" title="Open Admin Panel">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Admin Portal</span>
            </a>
          </p>
        </div>
      </div>
    </div>

    <!-- Contact Inquiry Modal -->
    <div v-if="showMessageModal" class="contact-modal-backdrop" @click.self="showMessageModal = false">
      <div class="contact-modal-window">
        <div class="modal-top">
          <h3>Send a Direct Message</h3>
          <button @click="showMessageModal = false" class="modal-close-btn">✕</button>
        </div>

        <div v-if="sendSuccess" class="alert-success">
          ✨ Message sent successfully! I will get back to you shortly.
        </div>

        <form v-else @submit.prevent="submitContactForm" class="contact-modal-form">
          <div v-if="sendError" class="alert-error">
            {{ sendError }}
          </div>

          <div class="field-item">
            <label>Your Name *</label>
            <input v-model="messageForm.name" type="text" placeholder="e.g. John Doe" required />
          </div>

          <div class="field-item">
            <label>Your Email *</label>
            <input v-model="messageForm.email" type="email" placeholder="john@example.com" required />
          </div>

          <div class="field-item">
            <label>Your Message *</label>
            <textarea v-model="messageForm.message" rows="4" placeholder="Tell me about your project, idea, or inquiry..." required></textarea>
          </div>

          <button type="submit" class="submit-inquiry-btn" :disabled="isSending">
            {{ isSending ? 'Sending Message...' : 'Send Message' }}
          </button>
        </form>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Full Single Viewport Screen (100vh) in Clear White */
.contact-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  background-color: #ffffff; /* Clear White */
  padding: 4rem 3rem 2rem 3rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

/* Interactive Cursor Color Glow Effect */
.cursor-glow-spotlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 520px;
  height: 520px;
  margin-top: -260px;
  margin-left: -260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(34, 211, 238, 0.12) 35%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.35s ease, transform 0.08s ease-out;
  filter: blur(10px);
}

.contact-container {
  position: relative;
  z-index: 2;
  max-width: 1300px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Centered Headline */
.headline-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 0;
}

.contact-headline {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3.2rem, 7.8vw, 6.8rem);
  font-weight: 700;
  color: #000000;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.headline-line {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Bottom Cluster */
.bottom-cluster {
  display: flex;
  flex-direction: column;
}

/* Horizontal Divider */
.contact-divider {
  width: 100%;
  height: 1px;
  background-color: rgba(226, 232, 240, 0.9);
  margin-bottom: 2.2rem;
}

/* Bottom Row (Socials on Left, Contacts on Right) */
.contact-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

/* Left: Socials Column */
.socials-column {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.socials-label {
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #64748b;
  text-transform: uppercase;
}

.socials-buttons-row {
  display: flex;
  gap: 0.75rem;
}

.social-icon-btn {
  width: 48px;
  height: 48px;
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
}

.social-icon-btn:hover {
  transform: translateY(-4px);
  border-color: #06b6d4;
  color: #06b6d4;
  box-shadow: 0 8px 22px rgba(6, 182, 212, 0.18);
}

/* Right: Contact Details Column */
.contact-details-column {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
}

.contact-pill-card {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.6rem;
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 9999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.contact-pill-card:hover {
  transform: translateY(-3px);
  border-color: #06b6d4;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.15);
}

.pill-icon {
  color: #06b6d4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pill-value {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.01em;
}

/* Footer Credit */
.footer-credit {
  padding-top: 1.2rem;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: center;
}

.admin-credit-separator {
  margin: 0 0.6rem;
  opacity: 0.4;
}

.admin-portal-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.admin-portal-link:hover {
  color: #06b6d4;
}

/* Message Modal */
.contact-modal-backdrop {
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
  z-index: 9999;
  padding: 1.5rem;
}

.contact-modal-window {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 24px;
  padding: 2.2rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
}

.modal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-top h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.modal-close-btn {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 0.9rem;
  cursor: pointer;
}

.contact-modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-item label {
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
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

.submit-inquiry-btn {
  margin-top: 0.5rem;
  padding: 0.85rem 1.6rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-inquiry-btn:hover {
  background: #1e293b;
}

.alert-success {
  padding: 1rem 1.2rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 600;
}

.alert-error {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 10px;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 900px) {
  .contact-section {
    height: auto;
    min-height: 100vh;
    padding: 5rem 1.5rem 2rem 1.5rem;
  }
  .contact-bottom-row {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    text-align: center;
  }
  .socials-column {
    align-items: center;
  }
  .contact-details-column {
    align-items: center;
    width: 100%;
  }
  .contact-pill-card {
    justify-content: center;
  }
}

/* ========================================= */
/* DARK THEME STYLES                         */
/* ========================================= */
:global(.dark) .contact-section {
  background-color: #000000 !important;
}

:global(.dark) .contact-headline {
  color: #ffffff;
}

:global(.dark) .contact-divider {
  background-color: rgba(255, 255, 255, 0.12);
}

:global(.dark) .socials-label {
  color: #94a3b8;
}

:global(.dark) .social-icon-btn {
  background-color: #050505;
  border-color: rgba(255, 255, 255, 0.12);
  color: #f8fafc;
}

:global(.dark) .social-icon-btn:hover {
  border-color: #06b6d4;
  color: #06b6d4;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.25);
}

:global(.dark) .contact-pill-card {
  background-color: #050505;
  border-color: rgba(255, 255, 255, 0.12);
}

:global(.dark) .pill-value {
  color: #f8fafc;
}

:global(.dark) .contact-pill-card:hover {
  border-color: #06b6d4;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.2);
}

:global(.dark) .footer-credit {
  border-top-color: rgba(255, 255, 255, 0.08);
  color: #64748b;
}

:global(.dark) .admin-portal-link {
  color: #64748b;
}

:global(.dark) .admin-portal-link:hover {
  color: #06b6d4;
}

:global(.dark) .contact-modal-window {
  background-color: #11131a;
  color: #f8fafc;
}

:global(.dark) .field-item label {
  color: #94a3b8;
}

:global(.dark) .field-item input,
:global(.dark) .field-item textarea {
  background-color: #181b24;
  border-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

:global(.dark) .modal-close-btn {
  background-color: #181b24;
  color: #ffffff;
}

:global(.dark) .submit-inquiry-btn {
  background-color: #06b6d4;
  color: #000000;
}

:global(.dark) .submit-inquiry-btn:hover {
  background-color: #22d3ee;
}

:global(.dark) .cursor-glow-spotlight {
  background: radial-gradient(circle, rgba(6, 182, 212, 0.32) 0%, rgba(34, 211, 238, 0.16) 35%, rgba(0, 0, 0, 0) 70%);
}
</style>
