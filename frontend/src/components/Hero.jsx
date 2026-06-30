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
            {/* React Icon - Keep this perfect one */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" fill="none"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 12 12)"/>
            </svg>
            React
          </span>
          <span className="hero-skill">
            {/* Laravel Icon - Clean Laravel "L" */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF2D20">
              <path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027c-.008.002-.016.008-.024.01a.348.348 0 0 1-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 0 1-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.04-.027.007-.005.011-.012.019-.015L9.93.05a.375.375 0 0 1 .374 0l9.42 5.4c.008.003.012.01.019.015.015.009.028.017.04.027.008.01.02.03.033.045.008.011.02.02.023.033.012.016.021.044.023.058.009.006.014.021.016.032zM1.085 5.628L9.93 10.12l8.845-4.491-8.845-5.024L1.085 5.628zM.642 5.72L9.93 10.76v12.855L.642 18.31V5.72zm10.662 17.615V10.76l9.288-5.04v12.59l-9.288 5.305z"/>
            </svg>
            Laravel
          </span>
          <span className="hero-skill">
            {/* MySQL Icon - Clean MySQL text style */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4479A1">
              <path d="M16.4 5.5c-.1 0-.2 0-.3.03v.01h.01c.05.1.15.18.21.27.05.11.1.21.15.32l.01-.01c.09-.07.14-.17.14-.33-.04-.05-.05-.09-.08-.14-.04-.07-.13-.1-.18-.15zM5.8 18.7h-.9c-.1-1.5-.2-2.9-.3-4.4h-.01l-1.4 4.4H2.5l-1.4-4.4h-.01c-.1 1.5-.15 2.9-.2 4.4H0c.06-2 .2-3.8.4-5.5h1.2c.47 1.7.85 3.1 1.15 4.4h.01c.31-1.3.67-2.8 1.15-4.4h1.1c.26 1.7.41 3.6.49 5.5zm9.8-2.9c0 1.4-.37 2.2-.8 2.2-.3 0-.5-.26-.5-.65s.2-.65.5-.65c.3 0 .8.26.8.65z"/>
              <path d="M21.3 18.1c0 .4-.2.7-.5.7-.2 0-.4-.1-.6-.3l-.8.8c.4.5 1 .7 1.6.7 1 0 1.7-.6 1.7-1.5v-.2c0-.4-.1-.7-.4-1l-1.5-1.3c-.2-.2-.3-.4-.3-.6v-.1c0-.2.2-.4.5-.4.2 0 .4.1.6.3l1.2-1c-.3-.2-.6-.4-1.1-.4-.9 0-1.4.6-1.4 1.5v.3c0 .3.1.6.3.8l1.5 1.3c.2.2.4.4.4.7v.1c0 .3-.2.5-.6.5-.3 0-.6-.2-.8-.4z"/>
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
