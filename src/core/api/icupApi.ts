import axios from 'axios';
import { setupAuthInterceptor } from './interceptors/auth.interceptor';

//* Create instance of axios
export const icupApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {},
});

setupAuthInterceptor(icupApi);
