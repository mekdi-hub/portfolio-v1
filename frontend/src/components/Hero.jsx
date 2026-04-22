import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import { themes, applyTheme, getStoredTheme } from '../themes';

function Hero({ scrollToSection }) {
  const [displayText, setDisplayText] = useState('');
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

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

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    setShowThemeDropdown(false);
  };

  return (
    <section id="home" className="hero">
      <ParticleBackground />
      <div className="animated-gradient"></div>
      
      {/* Theme Selector */}
      <div className="theme-selector">
        <button 
          className="theme-toggle-btn"
          onClick={() => setShowThemeDropdown(!showThemeDropdown)}
        >
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
          <span>Theme</span>
        </button>
        
        {showThemeDropdown && (
          <div className="theme-dropdown">
            {Object.keys(themes).map((themeKey) => (
              <button
                key={themeKey}
                className={`theme-option ${currentTheme === themeKey ? 'active' : ''}`}
                onClick={() => handleThemeChange(themeKey)}
              >
                <span className="theme-color-preview" style={{ background: themes[themeKey].primary }}></span>
                <span>{themes[themeKey].name}</span>
                {currentTheme === themeKey && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
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
          <span className="hero-skill">⚛ React</span>
          <span className="hero-skill">🔥 Laravel</span>
          <span className="hero-skill">🗄 MySQL</span>
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
      <div className="scroll-indicator" onClick={scrollToSection}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
