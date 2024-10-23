import ClubModel from "../../../schema/Club.js";

const clubService = {
  // 获取俱乐部列表
  async getClubList(req, res, next) {
    try {
      const list = await ClubModel.find({});
      res.json({
        code: 200,
        list,
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  // 新增俱乐部
  async addClub(req, res, next) {
    const data = req.body;
    try {
      const findObj = await ClubModel.findOne({ id: data.id });
      if (findObj) {
        res.json({
          code: -1,
          message: "该俱乐部已存在！",
        });
      }
      await ClubModel.create(data);
      res.json({
        code: 200,
        message: "ok",
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  // 修改俱乐部是否可用状态
  async updateClub(req, res, next) {
    const data = req.body;
    try {
      await ClubModel.findOneAndUpdate(
        { id: data.id },
        { disabled: data.disabled, club: data.club, id: data.id }
      );
      res.json({
        code: 200,
        message: "ok",
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  // 删除俱乐部
  async deleteClub(req, res, next) {
    const data = req.body;
    try {
      await ClubModel.deleteOne({ id: data.id });
      res.json({
        code: 200,
        message: "ok",
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },
};

export default clubService;
