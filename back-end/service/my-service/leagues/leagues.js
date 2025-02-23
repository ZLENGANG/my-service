import LeaguesModel from "../../../schema/Leagues.js";
import { getLatelyFiveGameResult } from "./task.js";

const leaguesService = {
  // 获取联赛列表
  async getLeaguesList(req, res, next) {
    const { page, size, search } = req.query;
    try {
      const query = search ? { name: new RegExp(search, "i") } : {};
      const list = await LeaguesModel.find(query)
        .skip((page - 1) * size)
        .limit(size);
      const total = await LeaguesModel.countDocuments();

      res.json({
        code: 200,
        list,
        page,
        size,
        total,
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  // 新增联赛
  async addLeagues(req, res, next) {
    const data = req.body;
    try {
      const findObj = await LeaguesModel.findOne({ code: data.code });
      if (findObj) {
        res.json({
          code: -1,
          message: "该联赛已存在！",
        });
      }
      await LeaguesModel.create(data);
      res.json({
        code: 200,
        message: "ok",
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  // 修改联赛是否可用状态
  async updateLeagues(req, res, next) {
    const data = req.body;
    try {
      await LeaguesModel.findOneAndUpdate(
        { code: data.code },
        {
          disabled: data.disabled,
          leaguesName: data.leaguesName,
          code: data.code,
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

  // 删除联赛
  async deleteLeagues(req, res, next) {
    const data = req.body;
    try {
      await LeaguesModel.deleteOne({ code: data.code });
      res.json({
        code: 200,
        message: "ok",
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },

  async getLatelyFiveGameResult(req, res, next) {
    const data = req.body;
    const pArr = [];
    try {
      data.forEach((item) => {
        pArr.push(getLatelyFiveGameResult(item, true));
      });
      const list = await Promise.all(pArr);
      res.json({
        code: 200,
        list,
      });
    } catch (error) {
      res.json({ code: 500, message: error.message });
    }
  },
};

export default leaguesService;
