import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (password: string): Promise<string> => {
  const {data} = await api.post<{token: string}>('/auth', {password});
  sessionStorage.setItem('token', data.token);
  return data.token;
};

export const sendMessage = async (
  message: string,
  categories: string[],
): Promise<void> => {
  await api.post('/send', {message, categories});
};
