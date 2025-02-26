import express from "express";
import myService from "../service/my-service/service.js";
import winwinService from "../service/my-service/winwin/index.js";
import footballService from "../service/my-service/football/index.js";
import clubService from "../service/my-service/football/club.js";
import dltService from "../service/my-service/dlt/index.js";
import ssqService from "../service/my-service/ssq/index.js";
import leaguesService from "../service/my-service/leagues/leagues.js";
import leaguesTop4GameService from "../service/my-service/leagues/index.js";

const myServiceRouter = express.Router();

myServiceRouter.get(`/list`, (req, res, next) => {
  myService.getServiceList(req, res, next);
});

myServiceRouter.post(`/changeStatusById`, (req, res, next) => {
  myService.changeStatusById(req, res, next);
});

myServiceRouter.get(`/getWinWinList`, (req, res, next) => {
  winwinService.getWinWinList(req, res, next);
});

myServiceRouter.get(`/footballGame/list`, (req, res, next) => {
  footballService.getFootballGameList(req, res, next);
});

myServiceRouter.get(`/footballGame/detail`, (req, res, next) => {
  footballService.getFootballGameDetailByDate(req, res, next);
});

myServiceRouter.get(`/footballGame/rate`, (req, res, next) => {
  footballService.getFootballGameRate(req, res, next);
});

myServiceRouter.get(`/footballGame/clubs/list`, (req, res, next) => {
  clubService.getClubList(req, res, next);
});

myServiceRouter.post(`/footballGame/clubs/add`, (req, res, next) => {
  clubService.addClub(req, res, next);
});

myServiceRouter.post(`/footballGame/clubs/update`, (req, res, next) => {
  clubService.updateClub(req, res, next);
});

myServiceRouter.post(`/footballGame/clubs/delete`, (req, res, next) => {
  clubService.deleteClub(req, res, next);
});

myServiceRouter.get(`/footballGame/leagues/list`, (req, res, next) => {
  leaguesService.getLeaguesList(req, res, next);
});

myServiceRouter.post(`/footballGame/leagues/add`, (req, res, next) => {
  leaguesService.addLeagues(req, res, next);
});

myServiceRouter.post(`/footballGame/leagues/update`, (req, res, next) => {
  leaguesService.updateLeagues(req, res, next);
});

myServiceRouter.post(
  `/footballGame/leagues/updateAllLeagues`,
  (req, res, next) => {
    leaguesService.updateAllLeagues(req, res, next);
  }
);

myServiceRouter.post(`/footballGame/leagues/delete`, (req, res, next) => {
  leaguesService.deleteLeagues(req, res, next);
});

myServiceRouter.post(
  `/footballGame/leagues/fiveGameResult`,
  (req, res, next) => {
    leaguesService.getLatelyFiveGameResult(req, res, next);
  }
);

myServiceRouter.get(`/leaguesTop4/list`, (req, res, next) => {
  leaguesTop4GameService.getLeaguesTop4GameList(req, res, next);
});

myServiceRouter.get(`/leaguesTop4/detail`, (req, res, next) => {
  leaguesTop4GameService.getLeaguesTop4GameDetailByDate(req, res, next);
});

myServiceRouter.post(`/leaguesTop4/update`, (req, res, next) => {
  leaguesTop4GameService.updateGameInfoById(req, res, next);
});

myServiceRouter.get(`/dlt/list`, (req, res, next) => {
  dltService.getDltList(req, res, next);
});

myServiceRouter.get(`/dlt/detail`, (req, res, next) => {
  dltService.getDltDetailByDate(req, res, next);
});

myServiceRouter.get(`/ssq/list`, (req, res, next) => {
  ssqService.getSsqList(req, res, next);
});

myServiceRouter.get(`/ssq/detail`, (req, res, next) => {
  ssqService.getSsqDetailByDate(req, res, next);
});

export default myServiceRouter;
