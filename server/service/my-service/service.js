import ServiceModel from "../../schema/Service.js";
import footballTask from "./football/task.js";
import winwinTask from "./winwin/task.js";

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
      res.status(500).json({ message: "Error fetching users", error });
    }
  },

  // 切换服务状态
  async changeStatusById(req, res, next) {
    try {
      const { id, status } = req.body;
      const task = {
        "football-game": footballTask,
        winwin: winwinTask,
      };
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
      res.json({ code: 500, message: error.message });
    }
  },
};

export default myService;
