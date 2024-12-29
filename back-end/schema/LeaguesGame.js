import mongoose from "../database/index.js";

// 定义模型
const LeaguesGameSchema = new mongoose.Schema(
  {
    date: String,
    game: String,
  },
  { timestamps: true }
);

const LeaguesGameModel = mongoose.model("LeaguesGame", LeaguesGameSchema);

export default LeaguesGameModel;
