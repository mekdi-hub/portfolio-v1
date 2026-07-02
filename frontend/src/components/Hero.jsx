import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import { themes, applyTheme, getStoredTheme } from '../themes';

function Hero({ scrollToSection }) {
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());

  const mekdiImage = '/mekdi.png';

  useEffect(() => {
    // Add or remove light-theme class on body
    if (currentTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <section id="home" className="hero">
      {/* Background */}
      <ParticleBackground />
      <div className="animated-gradient"></div>
      
      {/* Theme Toggle */}
      <div className="theme-selector">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {currentTheme === 'dark' ? (
            // Sun icon for light mode
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>

      <div className="hero-content">
       

        {/* Main Title */}
        <h1 className="hero-main-title">Hi, I'm Mekdi</h1>
        
        {/* Subtitle */}
        <h2 className="hero-subtitle-text">FULL STACK WEB DEVELOPER</h2>
        
        {/* Description */}
        <p className="hero-description">
          I design and build modern, responsive, and user-focused web applications that solve real-world problems. I enjoy transforming ideas into fast, secure, and scalable digital experiences.
          From intuitive user interfaces to reliable backend systems, I build solutions that make an impact.
        </p>
        
        {/* Action Buttons */}
        <div className="hero-actions">
          <button className="cta-button" onClick={() => scrollToSection(3)}>
            View Projects
          </button>
          <a href="/cv.pdf" download="Mekdi_CV.pdf" className="secondary-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download CV
          </a>
        </div>
      </div>

      <div className="scroll-indicator" onClick={() => scrollToSection(1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
