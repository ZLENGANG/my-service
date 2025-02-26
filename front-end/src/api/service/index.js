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

export const getLeaguesList = (params) => {
  return $http.get("/my-service/footballGame/leagues/list", { params });
};

export const getLatelyFiveGameResult = (params) => {
  return $http.post("/my-service/footballGame/leagues/fiveGameResult", params);
};

export const addLeagues = (params) => {
  return $http.post("/my-service/footballGame/leagues/add", params);
};

export const updateLeagues = (params) => {
  return $http.post("/my-service/footballGame/leagues/update", params);
};

export const updateAllLeagues = (params) => {
  return $http.post("/my-service/footballGame/leagues/updateAllLeagues", params);
};

export const deleteLeagues = (params) => {
  return $http.post("/my-service/footballGame/leagues/delete", params);
};

export const getLeaguesTop4GameList = (params) => {
  return $http.get("/my-service/leaguesTop4/list", { params });
};

export const getLeaguesTop4GameDetailByDate = (params) => {
  return $http.get("/my-service/leaguesTop4/detail", { params });
};

export const updateGameInfo = (params) => {
  return $http.post("/my-service/leaguesTop4/update", params);
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
