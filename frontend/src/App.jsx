import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ContactForm from './components/ContactForm';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import { applyTheme, getStoredTheme } from './themes';
import './App.css';
import './rotation.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [skillsKey, setSkillsKey] = useState(0);
  const [aboutKey, setAboutKey] = useState(0);

  // Apply theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);
  }, []);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  const scrollToSection = (sectionIndex) => {
    setActiveSection(sectionIndex);
    
    // Reset scroll position for About page after section change
    if (sectionIndex === 1) {
      setTimeout(() => {
        const aboutSlide = document.querySelector('.about-slide');
        if (aboutSlide) {
          aboutSlide.scrollTop = 0;
          const scrollContainer = aboutSlide.querySelector('.about-scroll-container');
          if (scrollContainer) {
            scrollContainer.scrollTop = 0;
          }
          const content = aboutSlide.querySelector('.about-page');
          if (content) {
            content.style.transform = 'translateY(0px)';
          }
        }
        // Trigger counting animation by changing key
        setAboutKey(prev => prev + 1);
      }, 50);
    }
    
    // Reset scroll position and trigger animation for Skills page
    if (sectionIndex === 2) {
      setTimeout(() => {
        const skillsSlide = document.querySelector('.skills-slide');
        if (skillsSlide) {
          skillsSlide.scrollTop = 0;
        }
        // Trigger animation restart by changing key
        setSkillsKey(prev => prev + 1);
      }, 50);
    }

    // Reset scroll position for Projects page
    if (sectionIndex === 3) {
      setTimeout(() => {
        const projectsSlide = document.querySelector('.projects-slide');
        if (projectsSlide) {
          projectsSlide.scrollTop = 0;
        }
      }, 50);
    }
  };

  const sections = [
    { 
      id: 0, 
      name: 'Home',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    { 
      id: 1, 
      name: 'About',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
      )
    },
    { 
      id: 2, 
      name: 'Skills',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      )
    },
    { 
      id: 3, 
      name: 'Projects',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      )
    },
    { 
      id: 4, 
      name: 'Contact',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )
    }
  ];

  return (
    <div className="app">
      {/* Loading Screen */}
      {loading && <Loader onLoadComplete={handleLoadComplete} />}
      
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Side Icon Navigation */}
      <nav className="dot-navigation">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`dot-nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => scrollToSection(section.id)}
          >
            <span className="dot-icon">{section.icon}</span>
            <span className="dot-label">{section.name}</span>
          </div>
        ))}
      </nav>

      {/* Slides Container */}
      <div className="slides-container">
        {/* Hero Slide */}
        <div className={`slide ${activeSection === 0 ? 'active' : ''}`}>
          <Hero scrollToSection={() => scrollToSection(1)} />
        </div>

        {/* About Slide */}
        <div className={`slide about-slide ${activeSection === 1 ? 'active' : ''}`}>
          <About key={aboutKey} />
          <div className="scroll-indicator-about" onClick={() => scrollToSection(2)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Skills Slide */}
        <div className={`slide skills-slide ${activeSection === 2 ? 'active' : ''}`}>
          <Skills key={skillsKey} />
          <div className="scroll-indicator-skills" onClick={() => scrollToSection(3)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Projects Slide */}
        <div className={`slide projects-slide ${activeSection === 3 ? 'active' : ''}`}>
          <Projects />
        </div>

        {/* Contact Slide */}
        <div className={`slide contact-slide ${activeSection === 4 ? 'active' : ''}`}>
          <section id="contact" className="section">
            <ContactForm />
          </section>
          {/* Footer */}
          <footer className="footer">
            <p>&copy; 2026 Portfolio. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
