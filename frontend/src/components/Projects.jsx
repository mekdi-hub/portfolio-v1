import { useState, useEffect } from 'react';
import './Projects.css';

const API_URL = 'http://localhost:8000/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to hardcoded projects if API fails
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
      <div className="projects-header-fixed">
        <div className="projects-header-content">
          <div className="projects-header-badge">Portfolio</div>
          <h2 className="projects-title glitch" data-text="My Projects">My Projects</h2>
          <div className="projects-title-underline"></div>
          <p className="projects-scroll-text">Scroll to view my projects</p>
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
                className="project-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-card-image">
                  <img 
                    src={project.image || `https://via.placeholder.com/400x250/22D3EE/ffffff?text=${encodeURIComponent(project.title)}`} 
                    alt={project.title} 
                  />
                </div>
                <div className="project-card-content">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <p className="project-tech">{project.tech_stack}</p>
                  {project.demo_link ? (
                    <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="project-btn">
                      View Project
                    </a>
                  ) : (
                    <button className="project-btn">View Project</button>
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
