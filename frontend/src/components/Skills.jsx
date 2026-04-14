import { useState } from 'react';
import './Skills.css';
import AboutBackground from './AboutBackground';

const SKILLS_DATA = [
  { name: 'React', color: '#61DAFB', delay: 0 },
  { name: 'Laravel', color: '#FF2D20', delay: 0.5 },
  { name: 'JavaScript', color: '#F7DF1E', delay: 1 },
  { name: 'Node.js', color: '#339933', delay: 1.5 },
  { name: 'TypeScript', color: '#3178C6', delay: 0.3 },
  { name: 'MySQL', color: '#4479A1', delay: 0.7 },
  { name: 'Docker', color: '#2496ED', delay: 1.2 },
  { name: 'Git', color: '#F05032', delay: 0.9 },
  { name: 'PHP', color: '#777BB4', delay: 0.4 },
  { name: 'Tailwind', color: '#06B6D4', delay: 0.8 },
  { name: 'MongoDB', color: '#47A248', delay: 1.3 },
  { name: 'Vue.js', color: '#4FC08D', delay: 0.6 },
];

function Skills() {
  return (
    <div className="skills-page-orb">
      <AboutBackground />
      <div className="skills-container-orb">
        <div className="skills-header-orb animate-in">
          <div className="glow-line-orb"></div>
          <h2 className="skills-title-orb glitch-skills" data-text="Tech Universe">Tech Universe</h2>
          <p className="skills-subtitle-orb">Hover over the orbs to explore</p>
        </div>

        <div className="skills-orbs-grid animate-in">
          {SKILLS_DATA.map((skill, index) => (
            <div
              key={skill.name}
              className="skill-orb"
              style={{ 
                animationDelay: `${skill.delay}s`,
                '--orb-color': skill.color
              }}
            >
              <span className="orbit-dot" style={{ animationDelay: `${skill.delay}s` }}></span>
              <span className="skill-orb-name">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
