import { useState, useEffect, useRef } from 'react';
import './Projects.css';

const API_URL = 'http://localhost:8000/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const projectRefs = useRef([]);

  useEffect(() => {
    fetchProjects();
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [projects]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([
        {
          id: 1,
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce solution with payment integration',
          tech_stack: 'React, Laravel, MySQL, Stripe',
          image: 'https://via.placeholder.com/400x250/22D3EE/ffffff?text=E-Commerce'
        },
        {
          id: 2,
          title: 'Task Management App',
          description: 'Collaborative task management with real-time updates',
          tech_stack: 'React, Node.js, MongoDB, Socket.io',
          image: 'https://via.placeholder.com/400x250/3B82F6/ffffff?text=Task+Manager'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="projects-header-fixed" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="projects-header-content">
          <div className="projects-header-badge">Portfolio</div>
          <h2 className="projects-title">My Projects</h2>
          <div className="projects-title-underline"></div>
          <p className="projects-scroll-text">Scroll to explore my work</p>
          <div className="scroll-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="projects-scrollable-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            Loading projects...
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="project-card fade-in-up"
                ref={(el) => (projectRefs.current[index] = el)}
              >
                <div className="project-card-media">
                  {project.image && project.image.includes('youtube.com') ? (
                    <iframe
                      src={project.image.replace('watch?v=', 'embed/')}
                      title={project.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : project.image && (project.image.endsWith('.mp4') || project.image.endsWith('.webm')) ? (
                    <video 
                      src={project.image} 
                      alt={project.title}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img 
                      src={project.image || `https://via.placeholder.com/400x250/22D3EE/ffffff?text=${encodeURIComponent(project.title)}`} 
                      alt={project.title} 
                    />
                  )}
                  <div className="media-overlay"></div>
                </div>
                
                <div className="project-card-content">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-tech-tags">
                    {project.tech_stack.split(',').map((tech, i) => (
                      <span key={i} className="tech-tag">{tech.trim()}</span>
                    ))}
                  </div>

                  {(project.demo_link || project.github_link) && (
                    <div className="project-actions">
                      {project.demo_link && (
                        <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="project-btn primary">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                          </svg>
                          Live Demo
                        </a>
                      )}
                      {project.github_link && (
                        <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="project-btn secondary">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Projects;
