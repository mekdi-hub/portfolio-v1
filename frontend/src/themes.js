export const themes = {
  cyan: {
    name: 'Cyan Dream',
    primary: '#22D3EE',
    secondary: '#3B82F6',
    accent: '#8B5CF6',
    background: '#0f172a',
    backgroundAlt: '#1e293b',
    text: '#ffffff',
    textSecondary: '#94A3B8',
    gradient: 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%)',
    glow: 'rgba(34, 211, 238, 0.5)',
    cardBg: 'rgba(15, 23, 42, 0.4)',
    borderColor: 'rgba(71, 85, 105, 0.2)'
  },
  
  purple: {
    name: 'Purple Haze',
    primary: '#A855F7',
    secondary: '#EC4899',
    accent: '#F59E0B',
    background: '#1a0b2e',
    backgroundAlt: '#2d1b4e',
    text: '#ffffff',
    textSecondary: '#C4B5FD',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    glow: 'rgba(168, 85, 247, 0.5)',
    cardBg: 'rgba(26, 11, 46, 0.4)',
    borderColor: 'rgba(168, 85, 247, 0.2)'
  },
  
  emerald: {
    name: 'Emerald Forest',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    background: '#0a1f1a',
    backgroundAlt: '#1a3a2e',
    text: '#ffffff',
    textSecondary: '#A7F3D0',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    glow: 'rgba(16, 185, 129, 0.5)',
    cardBg: 'rgba(10, 31, 26, 0.4)',
    borderColor: 'rgba(16, 185, 129, 0.2)'
  },
  
  sunset: {
    name: 'Sunset Glow',
    primary: '#F59E0B',
    secondary: '#EF4444',
    accent: '#F97316',
    background: '#1a0f0a',
    backgroundAlt: '#2d1810',
    text: '#ffffff',
    textSecondary: '#FED7AA',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    glow: 'rgba(245, 158, 11, 0.5)',
    cardBg: 'rgba(26, 15, 10, 0.4)',
    borderColor: 'rgba(245, 158, 11, 0.2)'
  },
  
  ocean: {
    name: 'Ocean Blue',
    primary: '#0EA5E9',
    secondary: '#0284C7',
    accent: '#06B6D4',
    background: '#0a1929',
    backgroundAlt: '#1e3a5f',
    text: '#ffffff',
    textSecondary: '#BAE6FD',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    glow: 'rgba(14, 165, 233, 0.5)',
    cardBg: 'rgba(10, 25, 41, 0.4)',
    borderColor: 'rgba(14, 165, 233, 0.2)'
  },
  
  rose: {
    name: 'Rose Garden',
    primary: '#F43F5E',
    secondary: '#EC4899',
    accent: '#FB7185',
    background: '#1f0a14',
    backgroundAlt: '#3d1a2b',
    text: '#ffffff',
    textSecondary: '#FECDD3',
    gradient: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)',
    glow: 'rgba(244, 63, 94, 0.5)',
    cardBg: 'rgba(31, 10, 20, 0.4)',
    borderColor: 'rgba(244, 63, 94, 0.2)'
  },
  
  neon: {
    name: 'Neon Nights',
    primary: '#FF00FF',
    secondary: '#00FFFF',
    accent: '#FFFF00',
    background: '#0a0a0a',
    backgroundAlt: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#E0E0E0',
    gradient: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
    glow: 'rgba(255, 0, 255, 0.6)',
    cardBg: 'rgba(10, 10, 10, 0.6)',
    borderColor: 'rgba(255, 0, 255, 0.3)'
  },
  
  midnight: {
    name: 'Midnight Blue',
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#818CF8',
    background: '#0f0a1e',
    backgroundAlt: '#1e1537',
    text: '#ffffff',
    textSecondary: '#C7D2FE',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    glow: 'rgba(99, 102, 241, 0.5)',
    cardBg: 'rgba(15, 10, 30, 0.4)',
    borderColor: 'rgba(99, 102, 241, 0.2)'
  }
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.cyan;
  const root = document.documentElement;
  
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--background-alt', theme.backgroundAlt);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--text-secondary', theme.textSecondary);
  root.style.setProperty('--gradient', theme.gradient);
  root.style.setProperty('--glow', theme.glow);
  root.style.setProperty('--card-bg', theme.cardBg);
  root.style.setProperty('--border-color', theme.borderColor);
  
  // Store theme preference
  localStorage.setItem('portfolioTheme', themeName);
};

export const getStoredTheme = () => {
  return localStorage.getItem('portfolioTheme') || 'cyan';
};
