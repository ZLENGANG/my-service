import LeaguesGameModel from "../../../schema/LeaguesGame.js";
const leaguesTop4GameService = {
  // 获取足球信息列表
  async getLeaguesTop4GameList(req, res, next) {
    const { page, size } = req.query;
    try {
      const list = await LeaguesGameModel.find({})
        .skip((page - 1) * size)
        .limit(size)
        .sort({ _id: -1 });

      const total = await LeaguesGameModel.countDocuments();
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
  async getLeaguesTop4GameDetailByDate(req, res, next) {
    const { date } = req.query;
    try {
      const result = await LeaguesGameModel.findOne({ date });
      res.json({
        code: 200,
        data: result || {},
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  // 更新当日足球信息
  async updateGameInfoById(req, res, next) {
    const data = req.body;
    try {
      await LeaguesGameModel.findOneAndUpdate(
        { _id: data._id },
        {
          game: data.game,
        }
      );
      res.json({
        code: 200,
        message: "ok",
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },
};

export default leaguesTop4GameService;
