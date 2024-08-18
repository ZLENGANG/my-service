import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import process from "node:process";

import myRouter from "./routes/index.js";
import "./database/index.js";
import myService from "./service/my-service/service.js";

// 初始化 Express 应用
const app = express();

// 跨域
app.use(cors());

// 支持post请求
app.use(bodyParser.json());

// 路由
app.use(myRouter(app));

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 监听退出事件
process.on("SIGINT", async function () {
  console.log(`退出程序`);
  await myService.stopAllTask();
  process.exit(0);
});
