/**
 * Central API configuration for the portfolio frontend.
 * Priority:
 * 1. Dynamic override from Admin Panel / localStorage ('portfolio_api_base')
 * 2. Environment variable VITE_API_URL from .env
 * 3. Default Render Production API URL
 */
export const DEFAULT_API_URL = 'https://portfolio-v1-2uu3.onrender.com/api'

export const getApiBaseUrl = () => {
  return localStorage.getItem('portfolio_api_base') || import.meta.env.VITE_API_URL || DEFAULT_API_URL
}

export const setApiBaseUrl = (url) => {
  if (url) {
    localStorage.setItem('portfolio_api_base', url)
  } else {
    localStorage.removeItem('portfolio_api_base')
  }
}
