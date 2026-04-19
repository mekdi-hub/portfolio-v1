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
    <div className="projects-page">
      <div className="projects-header">
        <span className="projects-badge">Portfolio</span>
        <h2 className="projects-title">My Projects</h2>
        <p className="projects-subtitle">Check out some of my recent work</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading projects...</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
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
              </div>
              
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                <div className="project-tech">
                  {project.tech_stack.split(',').map((tech, i) => (
                    <span key={i} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>

                {(project.demo_link || project.github_link) && (
                  <div className="project-links">
                    {project.demo_link && (
                      <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="btn-demo">
                        Live Demo
                      </a>
                    )}
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="btn-github">
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
  );
}

export default Projects;
