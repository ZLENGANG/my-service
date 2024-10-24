import express from "express";
import userService from "../service/user/index.js";

const userRouter = express.Router();

userRouter.post(`/login`, (req, res, next) => {
  userService.login(req, res, next);
});

export default userRouter;
