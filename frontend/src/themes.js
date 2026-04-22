export const themes = {
  dark: {
    name: 'Dark Mode',
    primary: '#22D3EE',
    secondary: '#3B82F6',
    accent: '#8B5CF6',
    background: '#000000',
    backgroundAlt: '#111827',
    text: '#ffffff',
    textSecondary: '#94A3B8',
    gradient: 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%)',
    glow: 'rgba(34, 211, 238, 0.5)',
    cardBg: 'rgba(17, 24, 39, 0.4)',
    borderColor: 'rgba(71, 85, 105, 0.2)'
  },
  
  light: {
    name: 'Light Mode',
    primary: '#22D3EE',
    secondary: '#0EA5E9',
    accent: '#06B6D4',
    background: '#ffffff',
    backgroundAlt: '#e2e8f0',
    text: '#000000',
    textSecondary: '#1e293b',
    gradient: 'linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)',
    glow: 'rgba(34, 211, 238, 0.4)',
    cardBg: 'rgba(226, 232, 240, 0.6)',
    borderColor: 'rgba(34, 211, 238, 0.4)'
  }
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.dark;
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
  return localStorage.getItem('portfolioTheme') || 'dark';
};
