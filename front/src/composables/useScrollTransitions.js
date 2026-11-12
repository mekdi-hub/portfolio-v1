import { ref } from 'vue'

const activeSection = ref('hero')
const scrollProgress = ref(0)

export function useScrollTransitions() {
  let sectionObserver = null
  let revealObserver = null

  const sections = ['hero', 'about', 'skills', 'projects', 'contact']

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const updateScrollProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    if (totalHeight > 0) {
      scrollProgress.value = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
    }
  }

  const initScrollTransitions = () => {
    // 1. Section tracker observer
    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id && sections.includes(id)) {
              activeSection.value = id
            }
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '-10% 0px -25% 0px'
      }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) sectionObserver.observe(el)
    })

    // 2. Element reveal observer
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
          } else {
            // When scrolled back above the element, reset so scrolling down triggers entrance
            const rect = entry.boundingClientRect
            if (rect.top > window.innerHeight) {
              entry.target.classList.remove('is-revealed')
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      revealObserver.observe(el)
    })

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()

    // Immediately reveal hero if at top of page
    const heroEl = document.getElementById('hero')
    if (heroEl && window.scrollY < 100) {
      const heroReveal = heroEl.querySelector('.scroll-reveal') || heroEl
      heroReveal.classList.add('is-revealed')
    }
  }

  const cleanupScrollTransitions = () => {
    if (sectionObserver) sectionObserver.disconnect()
    if (revealObserver) revealObserver.disconnect()
    window.removeEventListener('scroll', updateScrollProgress)
  }

  return {
    activeSection,
    scrollProgress,
    scrollToSection,
    initScrollTransitions,
    cleanupScrollTransitions
  }
}

