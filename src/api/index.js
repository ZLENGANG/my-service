import axios from "axios";

const $http = axios.create({
  baseURL: "http://192.168.10.108:3000",
  timeout: 1000,
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
