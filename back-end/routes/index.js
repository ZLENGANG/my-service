import myServiceRouter from "./my-service.js";
import userRouter from "./user.js";
import { verifyToken } from "../service/user/token.js";

const myRouter = function (app) {
  return function (req, res, next) {
    app.use("/my-service/*", verifyToken).use("/my-service", myServiceRouter);
    app.use("/user", userRouter);
    next();
  };
};

export default myRouter;
