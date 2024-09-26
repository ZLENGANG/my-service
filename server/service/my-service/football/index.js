import FootballGameModel from "../../../schema/FootballGame.js";
import footballTask from "./task.js";
const footballService = {
  // 获取足球信息列表
  async getFootballGameList(req, res, next) {
    const { page, size } = req.query;
    try {
      const list = await FootballGameModel.find({})
        .skip((page - 1) * size)
        .limit(size)
        .sort({ _id: -1 });

      const total = await FootballGameModel.countDocuments();
      res.json({
        list,
        page,
        size,
        total,
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  // 根据日期查询当日足球信息
  async getFootballGameDetailByDate(req, res, next) {
    const { date } = req.query;
    try {
      const result = await FootballGameModel.findOne({ date });
      res.json({
        code: 200,
        data: result || {},
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  // 查询赔率
  async getFootballGameRate(req, res, next) {
    const { code } = req.query;

    try {
      const result = await footballTask.getRate(code);
      res.json({
        code: 200,
        data: result || [],
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },
};

export default footballService;
