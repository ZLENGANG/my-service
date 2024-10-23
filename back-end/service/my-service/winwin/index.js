import WinWinModel from "../../../schema/WinWin.js";

const winwinService = {
  // 获取双赢彩票列表
  async getWinWinList(req, res, next) {
    const { page, size } = req.query;
    try {
      const list = await WinWinModel.find({})
        .skip((page - 1) * size)
        .limit(size)
        .sort({ _id: -1 });

      const total = await WinWinModel.countDocuments();
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
};

export default winwinService;
