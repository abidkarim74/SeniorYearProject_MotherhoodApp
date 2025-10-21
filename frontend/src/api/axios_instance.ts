import axios, { type AxiosInstance } from "axios";


const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default api;
