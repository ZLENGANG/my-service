import SsqModel from "../../../schema/Ssq.js";

const ssqService = {
  // 获取双色球列表
  async getSsqList(req, res, next) {
    const { page, size } = req.query;
    try {
      const list = await SsqModel.find({})
        .skip((page - 1) * size)
        .limit(size)
        .sort({ _id: -1 });

      const total = await SsqModel.countDocuments();
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

  // 根据日期查询当日双色球详情
  async getSsqDetailByDate(req, res, next) {
    const { date } = req.query;
    try {
      const result = await SsqModel.findOne({ date });
      res.json({
        code: 200,
        data: result || {},
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },
};

export default ssqService;
