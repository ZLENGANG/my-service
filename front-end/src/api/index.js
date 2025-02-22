import axios from "axios";
import { BACK_END_PORT } from "../../config.js";

const $http = axios.create({
  // baseURL: `http://${location.hostname}:${BACK_END_PORT}`,
  baseURL: `http://roninz.xyz:${BACK_END_PORT}`,
  timeout: 1000 * 60 * 10,
});

$http.interceptors.request.use(
  (config) => {
    config.headers.authorization = localStorage.getItem("token");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$http.interceptors.response.use(
  (response) => {
    if (response.data.code == 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default $http;
