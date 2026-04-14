import { useEffect, useState } from 'react';
import './Loader.css';

function Loader({ onLoadComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onLoadComplete();
      }, 1200);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div className={`loader-container ${isExiting ? 'exit' : ''}`}>
      <div className="loader-background">
        <div className="grid-3d"></div>
        <div className="orbs">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="orb" style={{
              '--orb-delay': `${i * 0.5}s`,
              '--orb-duration': `${3 + i}s`
            }}></div>
          ))}
        </div>
      </div>
      
      <div className="loader-content">
        <div className="logo-3d-wrapper">
          <div className="logo-cube">
            <div className="cube-face front">M</div>
            <div className="cube-face back">M</div>
            <div className="cube-face left">M</div>
            <div className="cube-face right">M</div>
            <div className="cube-face top">M</div>
            <div className="cube-face bottom">M</div>
          </div>
          
          <div className="rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>
        
        <div className="loader-text-3d">
          <div className="text-wrapper">
            <span className="letter" data-letter="C">C</span>
            <span className="letter" data-letter="r">r</span>
            <span className="letter" data-letter="a">a</span>
            <span className="letter" data-letter="f">f</span>
            <span className="letter" data-letter="t">t</span>
            <span className="letter" data-letter="i">i</span>
            <span className="letter" data-letter="n">n</span>
            <span className="letter" data-letter="g">g</span>
            <span className="letter-space"></span>
            <span className="letter" data-letter="E">E</span>
            <span className="letter" data-letter="x">x</span>
            <span className="letter" data-letter="c">c</span>
            <span className="letter" data-letter="e">e</span>
            <span className="letter" data-letter="l">l</span>
            <span className="letter" data-letter="l">l</span>
            <span className="letter" data-letter="e">e</span>
            <span className="letter" data-letter="n">n</span>
            <span className="letter" data-letter="c">c</span>
            <span className="letter" data-letter="e">e</span>
          </div>
          <div className="text-shadow">
            <span>C</span>
            <span>r</span>
            <span>a</span>
            <span>f</span>
            <span>t</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
            <span className="letter-space"></span>
            <span>E</span>
            <span>x</span>
            <span>c</span>
            <span>e</span>
            <span>l</span>
            <span>l</span>
            <span>e</span>
            <span>n</span>
            <span>c</span>
            <span>e</span>
          </div>
        </div>
        
        <div className="loading-bar-3d">
          <div className="bar-container">
            <div className="loading-progress"></div>
            <div className="bar-glow"></div>
          </div>
          <div className="percentage">Loading...</div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
