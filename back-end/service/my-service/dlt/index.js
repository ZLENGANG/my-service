import DltModel from "../../../schema/Dlt.js";

const dltService = {
  // 获取大乐透列表
  async getDltList(req, res, next) {
    const { page, size } = req.query;
    try {
      const list = await DltModel.find({})
        .skip((page - 1) * size)
        .limit(size)
        .sort({ _id: -1 });

      const total = await DltModel.countDocuments();
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

  // 根据日期查询当日大乐透详情
  async getDltDetailByDate(req, res, next) {
    const { date } = req.query;
    try {
      const result = await DltModel.findOne({ date });
      res.json({
        code: 200,
        data: result || {},
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },
};

export default dltService;
