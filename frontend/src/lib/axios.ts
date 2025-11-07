import axios from 'axios';

// If frontend and API are on the same Vercel project, relative base works
axios.defaults.baseURL = '/api';

// Attach token when present
try {
  const token = localStorage.getItem('token');
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
} catch {
  // ignore
}

export default axios;
