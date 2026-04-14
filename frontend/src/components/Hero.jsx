import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';

function Hero({ scrollToSection }) {
  const [displayText, setDisplayText] = useState('');

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

  // Removed mousemove parallax effect for performance

  return (
    <section id="home" className="hero">
      <ParticleBackground />
      <div className="animated-gradient"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="typing-text">{displayText}</span>
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
          <button className="cta-button" onClick={scrollToSection}>
            See My Work
          </button>
          <button className="secondary-button" onClick={() => window.location.href = '#contact'}>
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
