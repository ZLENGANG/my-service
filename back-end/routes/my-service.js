import express from "express";
import myService from "../service/my-service/service.js";
import winwinService from "../service/my-service/winwin/index.js";
import footballService from "../service/my-service/football/index.js";
import clubService from "../service/my-service/football/club.js";
import dltService from "../service/my-service/dlt/index.js";
import ssqService from "../service/my-service/ssq/index.js";

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
