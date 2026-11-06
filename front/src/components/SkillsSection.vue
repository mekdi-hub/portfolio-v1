<script setup>
import { ref } from 'vue'

const activeIndex = ref(0)

const skills = [
  {
    id: '01',
    name: 'VUE.JS',
    role: 'Frontend Framework',
    description: 'Production-grade Vue 3 single page applications built with the Composition API, Vite, Pinia state management, dynamic reactive components, and seamless REST API integration.',
    level: '92%',
    svg: `<svg viewBox="0 0 261.76 226.69" width="36" height="36"><path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="currentColor"/><path d="M161.096.001l-30.225 52.351L100.647.001H52.846l78.026 135.145L208.897.001z" fill="#06b6d4"/></svg>`
  },
  {
    id: '02',
    name: 'LARAVEL',
    role: 'Backend Framework',
    description: 'Robust backend engineering with Laravel 11/12, featuring modular MVC architecture, Eloquent ORM, RESTful API design, Sanctum authentication, and scalable database migrations.',
    level: '95%',
    svg: `<svg viewBox="0 0 50 50" width="36" height="36"><path fill="currentColor" d="M46.7 13.9L26.3 2.1c-.8-.5-1.8-.5-2.6 0L3.3 13.9c-.8.5-1.3 1.3-1.3 2.3v23.6c0 .9.5 1.8 1.3 2.3l20.4 11.8c.4.2.9.4 1.3.4s.9-.1 1.3-.4l20.4-11.8c.8-.5 1.3-1.3 1.3-2.3V16.2c0-1-.5-1.8-1.3-2.3zm-21.7-8l16.4 9.5-6.6 3.8-16.4-9.5 6.6-3.8zm-1.8 19.4L6.8 15.8l6.6-3.8 16.4 9.5-6.6 3.8zm-17.4-6.4l16.4 9.5v7.6l-16.4-9.5v-7.6zm18.2 27.2L7.6 36.6v-7.6l16.4 9.5v7.6zm1.8-9.4l16.4-9.5v7.6l-16.4 9.5v-7.6zm0-9.4l-6.6-3.8 16.4-9.5 6.6 3.8-16.4 9.5z"/></svg>`
  },
  {
    id: '03',
    name: 'REACT',
    role: 'UI Library',
    description: 'Modern React web applications built with functional components, custom hooks, reusable component hierarchies, virtual DOM optimization, and client-side routing.',
    level: '88%',
    svg: `<svg viewBox="-11.5 -10.23 23 20.46" width="36" height="36"><circle cx="0" cy="0" r="2.05" fill="currentColor"/><g stroke="currentColor" stroke-width="1.2" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`
  },
  {
    id: '04',
    name: 'JAVASCRIPT',
    role: 'Core Language',
    description: 'Deep modern ES6+ JavaScript capabilities: asynchronous programming, event loop mechanics, closures, functional array manipulation, and Web APIs.',
    level: '94%',
    svg: `<svg viewBox="0 0 630 630" width="36" height="36"><rect width="630" height="630" fill="currentColor" rx="80"/><path fill="#f4f5f7" d="m165.32 478.41c10.59 18.04 26.77 31.88 53.45 31.88 24.79 0 40.5-12.44 40.5-29.62 0-20.72-16.46-27.98-44.18-39.87l-15.17-6.49c-43.59-18.59-72.33-41.97-72.33-91.48 0-45.54 35.14-80.46 90.17-80.46 39.13 0 67.24 15.65 86.87 50.19l-38.38 24.62c-8.49-15.15-19.82-21.5-48.49-21.5-20.08 0-33.12 12.63-33.12 28.18 0 19.38 13.46 26.68 39.52 37.89l15.17 6.49c51.98 22.35 83.24 45.42 83.24 94.73 0 54.08-42.54 84.44-98.54 84.44-55.22 0-90.87-28.71-105.77-58.49zm216.98-8.24c8.68 15.34 20.37 25.13 43.8 25.13 22.11 0 36.27-8.91 36.27-43.68v-196.44h48.42v196.88c0 62.45-36.68 89.9-85.39 89.9-46.73 0-73.49-24.34-86.3-51.56z"/></svg>`
  },
  {
    id: '05',
    name: 'PHP',
    role: 'Backend Language',
    description: 'Object-oriented PHP 8+ development focusing on strict typing, dependency injection, PSR standards, database communication, and high-performance server logic.',
    level: '90%',
    svg: `<svg viewBox="0 0 256 138" width="36" height="36"><path fill="currentColor" d="M128 0C57.3 0 0 30.9 0 69s57.3 69 128 69 128-30.9 128-69-57.3-69-128-69zm-73.8 100.8H34.5l14.8-63.7h28.3c16.6 0 26.5 7.7 23.4 21.2-3.4 14.8-16 23.1-32.9 23.1H59.1zm38.1-21.2c1.9-7.7-2.8-12-11.7-12h-9.2l-5.5 24h9.2c8.3 0 15.4-4.3 17.2-12zm40.7 21.2h-19.7l14.8-63.7h19.7l-4.9 21.2h18.5c16.6 0 26.4 7.7 23.4 21.2-3.4 14.8-16 23.1-32.9 23.1h-18.5zm40.9-21.2c1.8-7.7-2.8-12-11.7-12h-9.2l-5.6 24h9.3c8.3 0 15.3-4.3 17.2-12zm40.3 21.2h-19.7l14.8-63.7h28.3c16.6 0 26.4 7.7 23.4 21.2-3.4 14.8-16 23.1-32.9 23.1h-14.8zm38.2-21.2c1.8-7.7-2.8-12-11.7-12h-9.2l-5.6 24h9.3c8.3 0 15.3-4.3 17.2-12z"/></svg>`
  },
  {
    id: '06',
    name: 'TAILWIND',
    role: 'CSS Framework',
    description: 'Fast, scalable user interfaces designed with Tailwind CSS: customized themes, responsive grid systems, fluid layouts, and clean aesthetic micro-interactions.',
    level: '95%',
    svg: `<svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>`
  },
  {
    id: '07',
    name: 'POSTGRESQL',
    role: 'Database',
    description: 'Advanced relational database architecture, relational schema design, complex joins, indexing optimization, data integrity constraints, and query profiling.',
    level: '86%',
    svg: `<svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.32 14.77c-.44.57-1.12.96-1.9.96-.32 0-.62-.07-.89-.2l-.12-.06c-.44-.23-.84-.57-1.16-.98-.48-.63-.78-1.42-.87-2.29-.06-.59.01-1.17.2-1.7.27-.75.76-1.37 1.39-1.78.43-.28.93-.45 1.46-.49.5-.04 1 .04 1.46.23.49.21.9.54 1.21.97.41.57.63 1.25.64 1.96.01.76-.23 1.49-.66 2.08-.2.27-.45.5-.75.69z"/></svg>`
  },
  {
    id: '08',
    name: 'MYSQL',
    role: 'Database',
    description: 'Production relational databases managed with MySQL: normalized schema modeling, transaction management, automated backups, and index tuning for high read/write volume.',
    level: '90%',
    svg: `<svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M19.78 12.3c-.34-.14-.7-.25-1.07-.33.27-.45.48-.95.61-1.48.16-.67.16-1.35 0-2.01-.17-.7-.52-1.32-1.01-1.82-.55-.56-1.26-.95-2.04-1.13-.78-.18-1.61-.13-2.37.15-.71.26-1.33.72-1.79 1.31-.46.59-.73 1.3-.78 2.05-.05.75.12 1.5.49 2.16.29.52.7.96 1.19 1.28-.48.24-.92.56-1.29.95-.49.52-.84 1.15-1.02 1.83-.18.68-.18 1.4-.01 2.08.17.68.52 1.29 1.01 1.79.55.56 1.25.96 2.03 1.14.78.18 1.6.14 2.37-.13.72-.25 1.35-.7 1.82-1.29.47-.59.75-1.3.82-2.05.07-.75-.08-1.51-.44-2.17-.29-.53-.71-.97-1.21-1.31.5-.24.96-.57 1.34-.97.42-.44.73-.97.91-1.54.18-.57.22-1.18.12-1.77z"/></svg>`
  },
  {
    id: '09',
    name: 'REST API',
    role: 'API Architecture',
    description: 'Clean, well-architected RESTful API endpoints with structured JSON responses, route middleware, request validation, CORS configuration, and bearer token security.',
    level: '95%',
    svg: `<svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-4h2v4zm-2-8a1 1 0 110-2 1 1 0 010 2zm4 8h-2V7h2v10z"/></svg>`
  },
  {
    id: '10',
    name: 'DOCKER',
    role: 'Containerization',
    description: 'Containerized environments built with Docker and Docker Compose, ensuring seamless consistency between local development setups and production deployments.',
    level: '82%',
    svg: `<svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186zm5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.929 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zm-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zM23.79 11.78c-.288-.172-.94-.356-1.89-.356-.514 0-.962.062-1.332.185-.157-.847-.732-1.39-1.428-1.39-.327 0-.638.12-.9.345-.19-.68-.69-1.196-1.342-1.196-.448 0-.846.242-1.107.618a3.7 3.7 0 00-.458-.029H1.42a.42.42 0 00-.42.42c0 .618.156 2.057.818 3.327C2.927 15.82 5.093 17 8.27 17c6.19 0 10.92-3.13 13.064-7.447.46.062.924.093 1.385.093.535 0 .93-.042 1.07-.113.12-.062.21-.197.21-.357 0-.276-.083-.432-.21-.506z"/></svg>`
  },
  {
    id: '11',
    name: 'GIT',
    role: 'Version Control',
    description: 'Version control mastery using Git & GitHub: interactive rebasing, feature branching, merge strategies, pull requests, and automated deployment actions.',
    level: '92%',
    svg: `<svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M21.707 11.293l-9-9a.999.999 0 0 0-1.414 0l-9 9a.999.999 0 0 0 0 1.414l9 9a.999.999 0 0 0 1.414 0l9-9a.999.999 0 0 0 0-1.414zM13 15.586V12.414a2 2 0 1 0-2 0v3.172a2 2 0 1 0 2 0z"/></svg>`
  },
  {
    id: '12',
    name: 'THREE.JS',
    role: '3D Graphics',
    description: 'Interactive 3D WebGL scenes, custom GLSL vertex and fragment shaders, procedural noise displacement, camera controls, and high-performance canvas rendering.',
    level: '85%',
    svg: `<svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M12 2.248L2 19.5h20L12 2.248zm0 4.195L18.423 17.5H5.577L12 6.443z"/></svg>`
  }
]
</script>

<template>
  <section id="skills" class="skills-tech-section">
    <div class="skills-wrapper">
      <!-- Top Section Header -->
      <div class="skills-top-bar">
        <div class="skills-label">
          <span class="label-code">03 — SKILLS</span>
        </div>
        <div class="skills-divider-line"></div>
        <div class="skills-search-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <!-- Tech Metadata Row -->
      <div class="skills-meta-row">
        <span class="meta-status-dot"></span>
        <span class="meta-status-text">TABLE ONLINE</span>
        <span class="meta-sep">&nbsp;&nbsp;</span>
        <span class="meta-dim">ELEMENTS: 12</span>
        <span class="meta-sep">&nbsp;&nbsp;</span>
        <span class="meta-dim">HOVER OR TAP A TILE TO INSPECT</span>
      </div>

      <!-- Main Layout: Left Inspector Card + Right Matrix Grid -->
      <div class="skills-matrix-layout">
        <!-- Left: Inspector Panel -->
        <div class="inspector-card">
          <!-- Technical Corner Accent -->
          <div class="corner-bracket"></div>

          <div class="inspector-tag">
            ELEMENT_{{ skills[activeIndex].id }} // INSPECT
          </div>

          <div class="inspector-logo" v-html="skills[activeIndex].svg"></div>

          <h3 class="inspector-title">{{ skills[activeIndex].name }}</h3>
          <span class="inspector-role">{{ skills[activeIndex].role }}</span>

          <p class="inspector-description">
            {{ skills[activeIndex].description }}
          </p>

          <!-- Status Bar -->
          <div class="inspector-progress-track">
            <div class="inspector-progress-fill" :style="{ width: skills[activeIndex].level }"></div>
          </div>
        </div>

        <!-- Right: 4x3 Interactive Tile Matrix -->
        <div class="tiles-matrix">
          <div
            v-for="(skill, index) in skills"
            :key="skill.id"
            class="matrix-tile"
            :class="{ active: activeIndex === index }"
            @mouseenter="activeIndex = index"
            @click="activeIndex = index"
          >
            <!-- Index Number in top-left -->
            <span class="tile-number">{{ skill.id }}</span>

            <!-- Center Logo -->
            <div class="tile-logo" v-html="skill.svg"></div>

            <!-- Tile Name -->
            <span class="tile-name">{{ skill.name }}</span>

            <!-- Underline Progress Bar -->
            <div class="tile-progress-bar">
              <div class="tile-progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-tech-section {
  position: relative;
  width: 100%;
  background-color: #f7f8fa;
  padding: 6rem 3rem 8rem 3rem;
  box-sizing: border-box;
}

.skills-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* Top Bar */
.skills-top-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 0.8rem;
}

.skills-label {
  flex-shrink: 0;
}

.label-code {
  font-family: 'Space Mono', monospace;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0284c7;
  letter-spacing: 0.18em;
}

.skills-divider-line {
  flex: 1;
  height: 1px;
  background-color: rgba(203, 213, 225, 0.7);
}

.skills-search-icon {
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.skills-search-icon:hover {
  transform: scale(1.1);
}

/* Metadata Subtitle */
.skills-meta-row {
  display: flex;
  align-items: center;
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: #64748b;
  margin-bottom: 3.5rem;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.meta-status-dot {
  width: 7px;
  height: 7px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px #22c55e;
  display: inline-block;
  margin-right: 0.4rem;
}

.meta-status-text {
  color: #0f172a;
  font-weight: 600;
}

.meta-dim {
  color: #94a3b8;
}

/* Matrix Layout (Left: Inspector / Right: Tiles) */
.skills-matrix-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 3.5rem;
  align-items: stretch;
}

/* Left: Inspector Card */
.inspector-card {
  position: relative;
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  padding: 3rem 2.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Technical Corner Bracket */
.corner-bracket {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 14px;
  height: 14px;
  border-top: 2px solid #0f172a;
  border-left: 2px solid #0f172a;
}

.inspector-tag {
  font-family: 'Space Mono', monospace;
  font-size: 0.82rem;
  letter-spacing: 0.15em;
  color: #94a3b8;
  margin-bottom: 2.2rem;
  text-transform: uppercase;
}

.inspector-logo {
  color: #0f172a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.inspector-logo :deep(svg) {
  width: 52px;
  height: 52px;
}

.inspector-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 0.3rem;
}

.inspector-role {
  font-family: 'Space Mono', monospace;
  font-size: 0.88rem;
  color: #0284c7;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 1.8rem;
  display: inline-block;
}

.inspector-description {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  line-height: 1.75;
  color: #334155;
  flex-grow: 1;
  margin-bottom: 2.5rem;
}

/* Bottom Progress Track */
.inspector-progress-track {
  width: 100%;
  height: 4px;
  background-color: #e2e8f0;
  position: relative;
  overflow: hidden;
}

.inspector-progress-fill {
  height: 100%;
  background-color: #0f172a;
  transition: width 0.35s ease;
}

/* Right: 4x3 Matrix Grid */
.tiles-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
}

.matrix-tile {
  position: relative;
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  padding: 1.8rem 1.2rem 1.4rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.22s ease;
  min-height: 140px;
  color: #0f172a;
}

.matrix-tile:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

/* Active Tile (Matches Black Hero Tile in Reference) */
.matrix-tile.active {
  background-color: #121214;
  border-color: #121214;
  color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.tile-number {
  position: absolute;
  top: 10px;
  left: 12px;
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  color: #94a3b8;
  letter-spacing: 0.05em;
  transition: color 0.2s ease;
}

.matrix-tile.active .tile-number {
  color: #71717a;
}

.tile-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: currentColor;
  transition: transform 0.2s ease;
}

.matrix-tile:hover .tile-logo {
  transform: scale(1.08);
}

.tile-logo :deep(svg) {
  width: 32px;
  height: 32px;
}

.tile-name {
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: currentColor;
  margin-bottom: 1rem;
}

/* Underline Progress Bar in Tile */
.tile-progress-bar {
  width: 80%;
  height: 2px;
  background-color: rgba(226, 232, 240, 0.8);
  position: relative;
}

.tile-progress-fill {
  width: 0%;
  height: 100%;
  background-color: #0f172a;
  transition: width 0.25s ease;
}

.matrix-tile.active .tile-progress-bar {
  background-color: rgba(255, 255, 255, 0.2);
}

.matrix-tile.active .tile-progress-fill {
  width: 100%;
  background-color: #ffffff;
}

/* Responsive */
@media (max-width: 1200px) {
  .skills-matrix-layout {
    grid-template-columns: 320px 1fr;
    gap: 2rem;
  }
  .tiles-matrix {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .skills-matrix-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .inspector-card {
    padding: 2.2rem 1.8rem;
  }
  .tiles-matrix {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .skills-tech-section {
    padding: 4rem 1.2rem 5rem 1.2rem;
  }
  .tiles-matrix {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  .matrix-tile {
    min-height: 120px;
    padding: 1.4rem 0.8rem;
  }
  .tile-logo :deep(svg) {
    width: 26px;
    height: 26px;
  }
  .tile-name {
    font-size: 0.72rem;
  }
}
</style>
