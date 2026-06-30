import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import { themes, applyTheme, getStoredTheme } from '../themes';

function Hero({ scrollToSection }) {
  const [displayText, setDisplayText] = useState('');
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());

  const fullText = "Hi, I'm Mekdi";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

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
        <h1 className="hero-title">
          <span className="typing-text glitch-text" data-text={displayText}>{displayText}</span>
          <span className="cursor">|</span>
        </h1>
        <p className="hero-subtitle">
          I build modern, responsive web applications using React & Laravel.<br />
          I turn complex problems into clean, user-friendly solutions.
        </p>
        
        {/* Skills Highlights */}
        <div className="hero-skills">
          <span className="hero-skill">
            {/* React Icon - Simplified React Atom */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" fill="none"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 12 12)"/>
            </svg>
            React
          </span>
          <span className="hero-skill">
            {/* Laravel Icon - Simple L shape */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF2D20">
              <path d="M23.8 7.2v10.3c0 .2-.1.4-.3.5l-6.6 3.8v7.5c0 .2-.1.4-.3.5L2.8 22.2c-.2-.1-.3-.3-.3-.5V.8c0-.1 0-.2.1-.3l14.8 8.5V22c0 .2-.1.4-.3.5L9.5 19.1c-.2-.1-.3-.3-.3-.5V8.2L23.5 7c.2.1.3.1.3.2z"/>
            </svg>
            Laravel
          </span>
          <span className="hero-skill">
            {/* MySQL Icon - Simple dolphin/database shape */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4479A1">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.64-.21 1-.3.19-.05.39-.1.59-.17 1.92-.66 3.58-1.96 4.76-3.7C22.57 15.88 22.93 14 22.93 12c0-5.52-4.48-10-10.93-10zm6.92 15c-.9 1.22-2.1 2.2-3.5 2.83-.27.12-.55.22-.84.31-.94.3-1.94.46-2.98.46-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 1.65-.5 3.18-1.36 4.45z"/>
              <ellipse cx="12" cy="8" rx="8" ry="2" fill="#4479A1"/>
              <ellipse cx="12" cy="12" rx="8" ry="2" fill="#4479A1"/>
              <ellipse cx="12" cy="16" rx="8" ry="2" fill="#4479A1"/>
            </svg>
            MySQL
          </span>
        </div>

        <div className="hero-actions">
          <button className="cta-button" onClick={() => scrollToSection(3)}>
            See My Work
          </button>
          <button className="secondary-button" onClick={() => scrollToSection(4)}>
            Get in Touch
          </button>
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
