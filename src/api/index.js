import axios from "axios";
import { BACK_END_PORT } from "../../config.js";

const $http = axios.create({
  // baseURL: `http://${location.hostname}:${BACK_END_PORT}`,
  baseURL: `http://roninz.xyz:${BACK_END_PORT}`,
  timeout: 1000 * 60,
});

$http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default $http;
