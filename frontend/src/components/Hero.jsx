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
            {/* React Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#61DAFB">
              <circle cx="12" cy="12" r="2"/>
              <path d="M12 1C9.8 1 8 2.8 8 5v14c0 2.2 1.8 4 4 4s4-1.8 4-4V5c0-2.2-1.8-4-4-4z" fill="none" stroke="#61DAFB" strokeWidth="1"/>
              <ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1"/>
              <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(60 12 12)" fill="none" stroke="#61DAFB" strokeWidth="1"/>
              <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(120 12 12)" fill="none" stroke="#61DAFB" strokeWidth="1"/>
            </svg>
            React
          </span>
          <span className="hero-skill">
            {/* Laravel Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF2D20">
              <path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027c-.008.002-.016.008-.024.01a.348.348 0 0 1-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 0 1-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.04-.027.007-.005.011-.012.019-.015L9.93.05a.375.375 0 0 1 .374 0l9.42 5.4c.008.003.012.01.019.015.015.009.028.017.04.027.008.01.02.03.033.045.008.011.02.02.023.033.012.016.021.044.023.058.009.006.014.021.016.032zm-1.092 5.29V6.41l-1.785 1.028-2.467 1.42v4.31L23.55 10.72zm-4.252 7.388v-4.31l-2.423 1.353-6.263 3.496v4.366l8.686-4.905zm-17.656-6.5L9.93 4.588v4.31l-4.252 2.445-1.785-1.028V5.608zm1.085-.78l1.785 1.151L9.93 10.12l-1.785 1.028L.642 5.72zm8.328 13.257l2.467-1.42 1.785-1.028v-4.31L9.93 17.415v4.31z"/>
            </svg>
            Laravel
          </span>
          <span className="hero-skill">
            {/* MySQL Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4479A1">
              <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.274.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H.002c.055-1.966.192-3.81.41-5.53h1.15c.47 1.674.85 3.135 1.153 4.41h.007c.313-1.312.674-2.772 1.15-4.41h1.11c.26 1.72.41 3.564.488 5.53zm9.794-2.95c0 1.358-.365 2.24-.805 2.24-.3 0-.49-.26-.49-.65 0-.39.197-.65.49-.65.295 0 .805.26.805.65zm0 0c0 1.358-.365 2.24-.805 2.24-.3 0-.49-.26-.49-.65 0-.39.197-.65.49-.65.295 0 .805.26.805.65zm-.805.65c0-.39.197-.65.49-.65.295 0 .805.26.805.65 0 1.358-.365 2.24-.805 2.24-.3 0-.49-.26-.49-.65z"/>
              <path d="M24 8.315c0-4.567-4.615-8.27-10.307-8.27-5.691 0-10.307 3.703-10.307 8.27 0 .995.238 1.947.668 2.822.906 1.85 2.677 3.24 4.916 3.98.239.078.455-.131.455-.39v-1.406c-2.666.578-3.229-1.284-3.229-1.284-.436-1.106-1.066-1.401-1.066-1.401-.872-.596.066-.584.066-.584.964.068 1.471 1.009 1.471 1.009.856 1.465 2.246 1.042 2.793.797.087-.62.335-1.042.609-1.282-2.134-.243-4.376-1.067-4.376-4.748 0-1.049.374-1.905 1.01-2.578-.103-.243-.439-1.218.095-2.538 0 0 .823-.258 2.699 1.006.783-.218 1.622-.327 2.455-.331.834.004 1.673.113 2.457.331 1.874-1.264 2.696-1.006 2.696-1.006.535 1.32.2 2.295.097 2.538.636.673 1.008 1.529 1.008 2.578 0 3.69-2.247 4.502-4.388 4.74.346.297.652.884.652 1.782v2.645c0 .261.218.472.459.389 2.236-.742 4.004-2.131 4.908-3.979.431-.874.669-1.826.669-2.821z"/>
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
