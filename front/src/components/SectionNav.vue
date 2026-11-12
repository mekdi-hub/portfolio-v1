<script setup>
import { useScrollTransitions } from '../composables/useScrollTransitions'

const { activeSection, scrollProgress, scrollToSection } = useScrollTransitions()

const navSections = [
  { id: 'hero', number: '01', label: 'Hero' },
  { id: 'about', number: '02', label: 'About' },
  { id: 'skills', number: '03', label: 'Skills' },
  { id: 'projects', number: '04', label: 'Projects' },
  { id: 'contact', number: '05', label: 'Contact' }
]
</script>

<template>
  <nav class="section-nav-root" aria-label="Section Navigation">
    <!-- Top Hairline Scroll Progress Bar -->
    <div
      class="scroll-progress-line"
      :style="{ width: `${scrollProgress}%` }"
      aria-hidden="true"
    ></div>

    <!-- Right Floating Section Rail -->
    <div class="floating-section-rail">
      <ul class="nav-dots-list">
        <li
          v-for="item in navSections"
          :key="item.id"
          class="nav-dot-item"
        >
          <button
            type="button"
            class="nav-dot-btn"
            :class="{ 'is-active': activeSection === item.id }"
            :aria-label="`Scroll to ${item.label} section`"
            :title="`Scroll to ${item.label}`"
            @click="scrollToSection(item.id)"
          >
            <!-- Pill / Dot Indicator -->
            <span class="dot-indicator">
              <span class="dot-core"></span>
            </span>

            <!-- Flyout Tooltip Label -->
            <span class="dot-label">
              <span class="label-number">{{ item.number }}</span>
              <span class="label-name">{{ item.label }}</span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.section-nav-root {
  pointer-events: none;
}

/* Hairline Scroll Progress Indicator */
.scroll-progress-line {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #06b6d4 0%, #0284c7 60%, #38bdf8 100%);
  z-index: 10000;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
  transition: width 0.12s ease-out;
}

/* Floating Vertical Rail */
.floating-section-rail {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 900;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}

.nav-dots-list {
  list-style: none;
  padding: 0.6rem 0.4rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: 9999px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.nav-dot-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-dot-btn {
  position: relative;
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

/* Dot / Pill Graphic */
.dot-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.dot-core {
  width: 7px;
  height: 7px;
  background-color: #94a3b8;
  border-radius: 9999px;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-dot-btn:hover .dot-core {
  background-color: #0f172a;
  transform: scale(1.4);
}

/* Active Section State */
.nav-dot-btn.is-active .dot-core {
  background-color: #06b6d4;
  height: 18px;
  width: 7px;
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.7);
}

/* Hover / Focus Tooltip */
.dot-label {
  position: absolute;
  right: calc(100% + 12px);
  padding: 0.35rem 0.75rem;
  background-color: #0f172a;
  color: #ffffff;
  border-radius: 8px;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateX(8px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.label-number {
  color: #22d3ee;
}

.nav-dot-btn:hover .dot-label {
  opacity: 1;
  transform: translateX(0);
}

/* ========================================= */
/* DARK THEME STYLES                         */
/* ========================================= */
:global(.dark) .nav-dots-list {
  background-color: rgba(13, 17, 23, 0.75);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

:global(.dark) .dot-core {
  background-color: #475569;
}

:global(.dark) .nav-dot-btn:hover .dot-core {
  background-color: #e2e8f0;
}

:global(.dark) .nav-dot-btn.is-active .dot-core {
  background-color: #22d3ee;
  box-shadow: 0 0 14px rgba(34, 211, 238, 0.85);
}

:global(.dark) .dot-label {
  background-color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f8fafc;
}

/* Responsive: hide rail on small screens to save space */
@media (max-width: 860px) {
  .floating-section-rail {
    display: none;
  }
}
</style>

