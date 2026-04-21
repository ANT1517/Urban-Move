import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('urban_move_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('urban_move_token');
      localStorage.removeItem('urban_move_user_mock');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
