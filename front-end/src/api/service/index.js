import $http from "../index";

export const getServiceList = (params) => {
  return $http.get("/my-service/list", { params });
};

export const changeServiceStatusById = (params) => {
  return $http.post("/my-service/changeStatusById", params);
};

export const getWinWinList = (params) => {
  return $http.get("/my-service/getWinWinList", { params });
};

export const getFootballGameList = (params) => {
  return $http.get("/my-service/footballGame/list", { params });
};

export const getFootballGameDetailByDate = (params) => {
  return $http.get("/my-service/footballGame/detail", { params });
};

export const getFootballGameRate = (code) => {
  return $http.get("/my-service/footballGame/rate?code=" + code);
};

export const getClubList = (params) => {
  return $http.get("/my-service/footballGame/clubs/list", { params });
};

export const addClub = (params) => {
  return $http.post("/my-service/footballGame/clubs/add", params);
};

export const updateClub = (params) => {
  return $http.post("/my-service/footballGame/clubs/update", params);
};

export const deleteClub = (params) => {
  return $http.post("/my-service/footballGame/clubs/delete", params);
};

export const getDltList = (params) => {
  return $http.get("/my-service/dlt/list", params);
};

export const getDltDetail = (params) => {
  return $http.get("/my-service/dlt/detail", params);
};

export const getSsqList = (params) => {
  return $http.get("/my-service/ssq/list", params);
};

export const getSsqDetail = (params) => {
  return $http.get("/my-service/ssq/detail", params);
};
