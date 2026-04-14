import { useState, useEffect, useRef } from 'react';
import './About.css';
import AboutBackground from './AboutBackground';

const TIMELINE_ITEMS = [
  { 
    year: '2023', 
    title: 'Started Coding', 
    description: 'Began my journey into software development, learning the fundamentals of programming and web technologies.',
    icon: '🚀'
  },
  { 
    year: '2024', 
    title: 'Built First Systems', 
    description: 'Created foundational projects and learned core concepts in full-stack development, database design, and system architecture.',
    icon: '💻'
  },
  { 
    year: '2025', 
    title: 'Full-Stack Projects', 
    description: 'Mastered React and Laravel for complete solutions, building scalable web applications with modern technologies.',
    icon: '⚡'
  },
  { 
    year: 'Now', 
    title: 'Real-World Solutions', 
    description: 'Building scalable applications that solve real problems, focusing on performance, security, and user experience.',
    icon: '🎯'
  },
];

function About() {
  const [activeTab, setActiveTab] = useState('about');
  const [prevTab, setPrevTab] = useState('about');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [counts, setCounts] = useState({ years: 0, projects: 0, technologies: 0 });
  const [hasCountedOnce, setHasCountedOnce] = useState(false);
  const statsRef = useRef(null);

  // Intersection Observer for counting animation when stats come into view
  useEffect(() => {
    if (activeTab !== 'about' || !statsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasCountedOnce) {
            setHasCountedOnce(true);
            startCounting();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px'
      }
    );

    observer.observe(statsRef.current);

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [activeTab, hasCountedOnce]);

  // Reset hasCountedOnce when switching tabs
  useEffect(() => {
    if (activeTab === 'about') {
      setHasCountedOnce(false);
      setCounts({ years: 0, projects: 0, technologies: 0 });
    }
  }, [activeTab]);

  const startCounting = () => {
    const targets = { years: 3, projects: 20, technologies: 10 };
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCounts({
        years: Math.floor(targets.years * progress),
        projects: Math.floor(targets.projects * progress),
        technologies: Math.floor(targets.technologies * progress)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCounts(targets);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (activeTab === 'journey') {
      setVisibleItems([]);
      TIMELINE_ITEMS.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 200 + 300);
      });
    }
  }, [activeTab]);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    setPrevTab(activeTab);
    
    setTimeout(() => {
      setActiveTab(newTab);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 400);
  };

  return (
    <div className="about-page-new">
      <AboutBackground />
      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <h1 className="about-title" data-text="About Me">About Me</h1>
        </div>

        {/* Tabs */}
        <div className="about-tabs">
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleTabChange('about')}
          >
            About Me
          </button>
          <button 
            className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => handleTabChange('education')}
          >
            Education
          </button>
          <button 
            className={`tab-btn ${activeTab === 'journey' ? 'active' : ''}`}
            onClick={() => handleTabChange('journey')}
          >
            My Journey
          </button>
        </div>

        {/* Tab Content with Transition */}
        <div className="tab-content-wrapper">
          <div className={`tab-content ${isTransitioning ? 'transitioning' : ''} ${isTransitioning ? `exit-${prevTab}` : ''} ${!isTransitioning ? `enter-${activeTab}` : ''}`}>
            {activeTab === 'about' && (
              <div className="about-content-single">
                <div className="about-info-full">
                  <h2 className="about-name">
                    Hello, I'm <span className="highlight glitch-text-about" data-text="Mekdelawit Habtamu">Mekdelawit Habtamu</span>
                  </h2>
                  <p className="about-role">Full-Stack Developer & System Builder</p>
                  
                  <div className="about-description">
                    <p>
                      A dedicated software engineer specializing in the development of robust and scalable web applications. 
                      My journey in software engineering began at Wollo University, where I developed a strong foundation in 
                      software engineering and programming.
                    </p>
                    <p>
                      With a particular focus on React and Laravel, I am committed to delivering high-quality solutions that 
                      meet both user needs and business objectives. My expertise extends across the full software development 
                      lifecycle, from conceptualization to implementation.
                    </p>
                    <p>
                      I am driven by the challenges of problem-solving and continuously seek to enhance my skills to stay at 
                      the forefront of the ever-evolving technology landscape.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="about-stats" ref={statsRef}>
                    <div className="stat-item">
                      <div className="stat-number">{counts.years}+</div>
                      <div className="stat-label">Years Experience</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">{counts.projects}+</div>
                      <div className="stat-label">Projects Completed</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">{counts.technologies}+</div>
                      <div className="stat-label">Technologies</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="education-content">
                <div className="education-card-main">
                  <div className="education-icon">🎓</div>
                  <h2 className="education-degree">Bachelor of Science in Software Engineering</h2>
                  <h3 className="education-university">Wollo University</h3>
                  <p className="education-years">Expected Graduation: 2025</p>
                  
                  <div className="education-description">
                    <p>
                      Currently studying Software Engineering at Wollo University, where I am building a strong 
                      foundation in full-stack development, data structures, and software architecture. My academic 
                      journey has equipped me with the skills to design and develop efficient, scalable, and 
                      user-focused systems, supported by hands-on projects and continuous learning.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'journey' && (
              <div className="journey-content">
                <div className="journey-intro">
                  <h2 className="journey-title">My Journey</h2>
                  <p className="journey-description">
                    From my first line of code to building complex systems, here's how my journey has evolved over the years.
                  </p>
                </div>

                <div className="timeline-vertical">
                  <div className="timeline-line-vertical"></div>
                  {TIMELINE_ITEMS.map((item, index) => (
                    <div 
                      key={index} 
                      className={`timeline-item-vertical ${visibleItems.includes(index) ? 'visible' : ''}`}
                    >
                      <div className="timeline-dot-vertical">
                        <span className="timeline-icon">{item.icon}</span>
                      </div>
                      <div className="timeline-content-vertical">
                        <div className="timeline-year-vertical">{item.year}</div>
                        <h3 className="timeline-title-vertical">{item.title}</h3>
                        <p className="timeline-desc-vertical">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
