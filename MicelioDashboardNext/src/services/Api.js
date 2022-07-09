import axios from 'axios';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default Api;
