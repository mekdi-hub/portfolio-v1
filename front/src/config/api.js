export const DEFAULT_API_URL =
  'https://portfolio-v1-2uu3.onrender.com/api'

export const getApiBaseUrl = () => {
  const savedUrl = localStorage.getItem('portfolio_api_base')
  const envUrl = import.meta.env.VITE_API_URL

  let url = (savedUrl || envUrl || DEFAULT_API_URL).trim()

  // Remove trailing slashes
  url = url.replace(/\/+$/, '')

  // Ensure the URL ends with /api
  if (!url.endsWith('/api')) {
    url += '/api'
  }

  return url
}

export const setApiBaseUrl = (url) => {
  if (url) {
    localStorage.setItem('portfolio_api_base', url)
  } else {
    localStorage.removeItem('portfolio_api_base')
  }
}