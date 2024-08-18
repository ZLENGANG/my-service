import axios from "axios";
import { getIPAddress } from "../../server/utils/index.js";
import { BACK_END_PORT } from "../../config.js";

const $http = axios.create({
  baseURL: `http://${getIPAddress()}:${BACK_END_PORT}`,
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
