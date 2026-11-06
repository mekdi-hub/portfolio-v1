<script setup>
import { ref } from 'vue'

const email = 'mekdimeki8@gmail.com'
const phone = '+251 953 419 361'
const phoneLink = '+251953419361'

const contactRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isHovered = ref(false)

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

const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`
  },
  {
    name: 'Telegram',
    url: 'https://t.me',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.535-.196 1.006.128.832.943z"/></svg>`
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
  }
]
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
          <span class="headline-line">LET'S WORK</span>
          <span class="headline-line">TOGETHER</span>
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
          </div>
        </div>

        <!-- Copyright Subtext -->
        <div class="footer-credit">
          <p>&copy; 2026 Mekdelawit Habtamu. All rights reserved.</p>
        </div>
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
  padding: 0.8rem 1.6rem;
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 9999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  text-decoration: none;
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
  font-size: 0.98rem;
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
</style>
