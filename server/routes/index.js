import myServiceRouter from "./my-service.js";

const myRouter = function (app) {
  return function (req, res, next) {
    app.use("/my-service", myServiceRouter);
    next();
  };
};

export default myRouter;
