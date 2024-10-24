import $http from "../index";

export const login = (params) => {
  return $http.post("/user/login", params);
};
