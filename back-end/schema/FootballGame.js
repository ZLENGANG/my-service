import mongoose from "../database/index.js";

// 定义模型
const FootballGameSchema = new mongoose.Schema(
  {
    date: String,
    game: String,
  },
  { timestamps: true }
);

const FootballGameModel = mongoose.model("FootballGame", FootballGameSchema);

export default FootballGameModel;
