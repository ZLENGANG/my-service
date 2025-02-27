import LeaguesModel from "../../../schema/Leagues.js";
import { getLatelyFiveGameResult } from "./task.js";
import { getAllLeaguesTotalGames } from "./utils.js";

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
      await LeaguesModel.updateOne(
        { code: data.code },
        {
          disabled: data.disabled,
          leaguesName: data.leaguesName,
          code: data.newCode,
          totalGames: Number(data.totalGames),
          avgGames: Number(data.avgGames),
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

  async updateAllLeagues(req, res, next) {
    try {
      // 获取新数据
      const list = await LeaguesModel.find();
      const newList = await getAllLeaguesTotalGames(list);

      for (const item of newList) {
        const { totalGames, avgGames } = item; // 使用对象解构排除 _id 字段

        await LeaguesModel.updateOne(
          { code: item._doc.code },
          {
            totalGames,
            avgGames,
          }
        );
      }

      res.json({
        code: 200,
        message: "整表更新成功",
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
