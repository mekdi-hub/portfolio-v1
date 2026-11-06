<script setup>
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle-btn"
    :class="{ 'is-dark': isDark }"
    @click="toggleTheme"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
  >
    <div class="icon-flipper">
      <!-- Sun Icon (shown in Dark mode to switch to Light) -->
      <svg
        v-if="isDark"
        class="theme-svg sun-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>

      <!-- Moon Icon (shown in Light mode to switch to Dark) -->
      <svg
        v-else
        class="theme-svg moon-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>
  </button>
</template>

<style scoped>
.theme-toggle-btn {
  position: fixed;
  top: 1.8rem;
  right: 2.2rem;
  z-index: 9999;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.95);
  color: #0f172a;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
}

.theme-toggle-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #06b6d4;
  color: #06b6d4;
}

.theme-toggle-btn.is-dark {
  background-color: rgba(17, 19, 26, 0.85);
  border-color: rgba(255, 255, 255, 0.12);
  color: #22d3ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(6, 182, 212, 0.2);
}

.theme-toggle-btn.is-dark:hover {
  border-color: #06b6d4;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6), 0 0 16px rgba(6, 182, 212, 0.4);
}

.icon-flipper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-toggle-btn:hover .icon-flipper {
  transform: rotate(25deg);
}

.theme-svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .theme-toggle-btn {
    top: 1.2rem;
    right: 1.2rem;
    width: 40px;
    height: 40px;
  }
  .theme-svg {
    width: 18px;
    height: 18px;
  }
}
</style>

