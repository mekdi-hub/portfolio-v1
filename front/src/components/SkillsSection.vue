<script setup>
const skills = [
  {
    name: 'Vue.js',
    color: '#42b883',
    svg: `<svg viewBox="0 0 261.76 226.69" width="24" height="24"><path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41b883"/><path d="M161.096.001l-30.225 52.351L100.647.001H52.846l78.026 135.145L208.897.001z" fill="#34495e"/></svg>`
  },
  {
    name: 'React',
    color: '#61dafb',
    svg: `<svg viewBox="-11.5 -10.23 23 20.46" width="24" height="24"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`
  },
  {
    name: 'Laravel',
    color: '#ff2d20',
    svg: `<svg viewBox="0 0 50 50" width="24" height="24"><path fill="#FF2D20" d="M46.7 13.9L26.3 2.1c-.8-.5-1.8-.5-2.6 0L3.3 13.9c-.8.5-1.3 1.3-1.3 2.3v23.6c0 .9.5 1.8 1.3 2.3l20.4 11.8c.4.2.9.4 1.3.4s.9-.1 1.3-.4l20.4-11.8c.8-.5 1.3-1.3 1.3-2.3V16.2c0-1-.5-1.8-1.3-2.3zm-21.7-8l16.4 9.5-6.6 3.8-16.4-9.5 6.6-3.8zm-1.8 19.4L6.8 15.8l6.6-3.8 16.4 9.5-6.6 3.8zm-17.4-6.4l16.4 9.5v7.6l-16.4-9.5v-7.6zm18.2 27.2L7.6 36.6v-7.6l16.4 9.5v7.6zm1.8-9.4l16.4-9.5v7.6l-16.4 9.5v-7.6zm0-9.4l-6.6-3.8 16.4-9.5 6.6 3.8-16.4 9.5z"/></svg>`
  },
  {
    name: 'JavaScript',
    color: '#f7df1e',
    svg: `<svg viewBox="0 0 630 630" width="24" height="24"><rect width="630" height="630" fill="#f7df1e" rx="60"/><path d="m165.32 478.41c10.59 18.04 26.77 31.88 53.45 31.88 24.79 0 40.5-12.44 40.5-29.62 0-20.72-16.46-27.98-44.18-39.87l-15.17-6.49c-43.59-18.59-72.33-41.97-72.33-91.48 0-45.54 35.14-80.46 90.17-80.46 39.13 0 67.24 15.65 86.87 50.19l-38.38 24.62c-8.49-15.15-19.82-21.5-48.49-21.5-20.08 0-33.12 12.63-33.12 28.18 0 19.38 13.46 26.68 39.52 37.89l15.17 6.49c51.98 22.35 83.24 45.42 83.24 94.73 0 54.08-42.54 84.44-98.54 84.44-55.22 0-90.87-28.71-105.77-58.49zm216.98-8.24c8.68 15.34 20.37 25.13 43.8 25.13 22.11 0 36.27-8.91 36.27-43.68v-196.44h48.42v196.88c0 62.45-36.68 89.9-85.39 89.9-46.73 0-73.49-24.34-86.3-51.56z"/></svg>`
  },
  {
    name: 'PHP',
    color: '#777bb4',
    svg: `<svg viewBox="0 0 256 138" width="24" height="24"><path fill="#777BB4" d="M128 0C57.3 0 0 30.9 0 69s57.3 69 128 69 128-30.9 128-69-57.3-69-128-69zm-73.8 100.8H34.5l14.8-63.7h28.3c16.6 0 26.5 7.7 23.4 21.2-3.4 14.8-16 23.1-32.9 23.1H59.1zm38.1-21.2c1.9-7.7-2.8-12-11.7-12h-9.2l-5.5 24h9.2c8.3 0 15.4-4.3 17.2-12zm40.7 21.2h-19.7l14.8-63.7h19.7l-4.9 21.2h18.5c16.6 0 26.4 7.7 23.4 21.2-3.4 14.8-16 23.1-32.9 23.1h-18.5zm40.9-21.2c1.8-7.7-2.8-12-11.7-12h-9.2l-5.6 24h9.3c8.3 0 15.3-4.3 17.2-12zm40.3 21.2h-19.7l14.8-63.7h28.3c16.6 0 26.4 7.7 23.4 21.2-3.4 14.8-16 23.1-32.9 23.1h-14.8zm38.2-21.2c1.8-7.7-2.8-12-11.7-12h-9.2l-5.6 24h9.3c8.3 0 15.3-4.3 17.2-12z"/></svg>`
  },
  {
    name: 'Tailwind CSS',
    color: '#06b6d4',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#06B6D4" d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>`
  },
  {
    name: 'PostgreSQL',
    color: '#336791',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#336791" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.32 14.77c-.44.57-1.12.96-1.9.96-.32 0-.62-.07-.89-.2l-.12-.06c-.44-.23-.84-.57-1.16-.98-.48-.63-.78-1.42-.87-2.29-.06-.59.01-1.17.2-1.7.27-.75.76-1.37 1.39-1.78.43-.28.93-.45 1.46-.49.5-.04 1 .04 1.46.23.49.21.9.54 1.21.97.41.57.63 1.25.64 1.96.01.76-.23 1.49-.66 2.08-.2.27-.45.5-.75.69z"/></svg>`
  },
  {
    name: 'MySQL',
    color: '#00758f',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#00758F" d="M19.78 12.3c-.34-.14-.7-.25-1.07-.33.27-.45.48-.95.61-1.48.16-.67.16-1.35 0-2.01-.17-.7-.52-1.32-1.01-1.82-.55-.56-1.26-.95-2.04-1.13-.78-.18-1.61-.13-2.37.15-.71.26-1.33.72-1.79 1.31-.46.59-.73 1.3-.78 2.05-.05.75.12 1.5.49 2.16.29.52.7.96 1.19 1.28-.48.24-.92.56-1.29.95-.49.52-.84 1.15-1.02 1.83-.18.68-.18 1.4-.01 2.08.17.68.52 1.29 1.01 1.79.55.56 1.25.96 2.03 1.14.78.18 1.6.14 2.37-.13.72-.25 1.35-.7 1.82-1.29.47-.59.75-1.3.82-2.05.07-.75-.08-1.51-.44-2.17-.29-.53-.71-.97-1.21-1.31.5-.24.96-.57 1.34-.97.42-.44.73-.97.91-1.54.18-.57.22-1.18.12-1.77z"/></svg>`
  },
  {
    name: 'Docker',
    color: '#2496ed',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#2496ED" d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186zm5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.929 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zm-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zM23.79 11.78c-.288-.172-.94-.356-1.89-.356-.514 0-.962.062-1.332.185-.157-.847-.732-1.39-1.428-1.39-.327 0-.638.12-.9.345-.19-.68-.69-1.196-1.342-1.196-.448 0-.846.242-1.107.618a3.7 3.7 0 00-.458-.029H1.42a.42.42 0 00-.42.42c0 .618.156 2.057.818 3.327C2.927 15.82 5.093 17 8.27 17c6.19 0 10.92-3.13 13.064-7.447.46.062.924.093 1.385.093.535 0 .93-.042 1.07-.113.12-.062.21-.197.21-.357 0-.276-.083-.432-.21-.506z"/></svg>`
  },
  {
    name: 'Git',
    color: '#f05032',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#F05032" d="M21.707 11.293l-9-9a.999.999 0 0 0-1.414 0l-9 9a.999.999 0 0 0 0 1.414l9 9a.999.999 0 0 0 1.414 0l9-9a.999.999 0 0 0 0-1.414zM13 15.586V12.414a2 2 0 1 0-2 0v3.172a2 2 0 1 0 2 0z"/></svg>`
  },
  {
    name: 'Node.js',
    color: '#339933',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#339933" d="M12 2l10 5.8v11.6L12 25.2 2 19.4V7.8L12 2zm0 2.3L4 8.8v9.4l8 4.7 8-4.7V8.8l-8-4.5z"/></svg>`
  },
  {
    name: 'Three.js',
    color: '#000000',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#0f172a" d="M12 2.248L2 19.5h20L12 2.248zm0 4.195L18.423 17.5H5.577L12 6.443z"/></svg>`
  }
]
</script>

<template>
  <section id="skills" class="skills-section">
    <div class="skills-container">
      <!-- Centered Header in Black -->
      <h2 class="skills-title">Skills & Technologies</h2>
      <p class="skills-subtitle">The tools, frameworks, and technologies I leverage to build modern web solutions</p>

      <!-- Clean Skills Grid With Official Logos (No Tabs) -->
      <div class="skills-grid">
        <div
          v-for="skill in skills"
          :key="skill.name"
          class="skill-item"
          :style="{ '--accent-color': skill.color }"
        >
          <div class="skill-logo" v-html="skill.svg"></div>
          <span class="skill-name">{{ skill.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
  position: relative;
  width: 100%;
  background-color: #f4f5f7;
  padding: 5rem 2rem 8rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.skills-container {
  max-width: 980px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Centered Title in Bold Black */
.skills-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 5.5vw, 4.4rem);
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 0.8rem;
}

.skills-subtitle {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  color: #64748b;
  max-width: 620px;
  margin-bottom: 3.5rem;
  line-height: 1.5;
}

/* Clean Skills Grid */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: center;
  max-width: 900px;
}

.skill-item {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.6rem;
  background-color: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.9);
  border-radius: 9999px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
}

.skill-item:hover {
  transform: translateY(-3px);
  border-color: var(--accent-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.skill-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.skill-logo :deep(svg) {
  display: block;
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.skill-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
}

@media (max-width: 768px) {
  .skills-section {
    padding: 4rem 1.5rem 6rem 1.5rem;
  }
  .skills-title {
    font-size: 2.4rem;
  }
  .skills-subtitle {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
  .skills-grid {
    gap: 0.85rem;
  }
  .skill-item {
    padding: 0.7rem 1.25rem;
  }
  .skill-name {
    font-size: 0.98rem;
  }
  .skill-logo {
    width: 20px;
    height: 20px;
  }
  .skill-logo :deep(svg) {
    width: 20px;
    height: 20px;
  }
}
</style>
