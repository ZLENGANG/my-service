import ServiceModel from "../../schema/Service.js";
import footballTask from "./football/task.js";
import winwinTask from "./winwin/task.js";
import dltTask from "./dlt/task.js";
import ssqTask from "./ssq/task.js";
import leaguesTop4GameTask from "./leagues/task.js";
import { NEED_TOKEN_ID_ARR } from "../../config/index.js";

const task = {
  "football-game": footballTask,
  winwin: winwinTask,
  dlt: dltTask,
  ssq: ssqTask,
  "leagues-top4-game": leaguesTop4GameTask,
};

const myService = {
  // 获取服务列表
  async getServiceList(req, res, next) {
    const { page, size } = req.query;
    try {
      const list = await ServiceModel.find({})
        .skip((page - 1) * size)
        .limit(size)
        .sort({ _id: -1 });

      const total = await ServiceModel.countDocuments();
      res.json({
        list,
        page,
        size,
        total,
      });
    } catch (error) {
      res.json({ code: 500, message: error?.message || error });
    }
  },

  // 切换服务状态
  async changeStatusById(req, res, next) {
    try {
      const { id, status, token } = req.body;

      if (NEED_TOKEN_ID_ARR.includes(id) && !token && status) {
        res.json({
          code: -1,
          message: "请输入token",
        });
        return;
      }

      let result = null;
      if (status) {
        result = await task[id].start(req.body);
      } else {
        result = await task[id].stop(req.body);
      }

      let sendInfo =
        typeof result === "object" ? result : { status: 200, data: result };
      res.json(sendInfo);
    } catch (error) {
      res.json({ code: 500, message: error?.message || error });
    }
  },

  // 关闭所有服务
  stopAllTask: () => {
    return new Promise((resolve) => {
      let pArr = [];
      for (let id in task) {
        pArr.push(task[id].stop({ id }));
      }
      Promise.all(pArr).then((res) => {
        resolve(res);
      });
    });
  },
};

export default myService;
