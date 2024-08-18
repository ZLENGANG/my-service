import mongoose from "../database/index.js";

// 定义模型
const WinWinSchema = new mongoose.Schema(
  {
    type: String,
    count: Number,
    game: String,
    date: String,
    time: String,
    name: String,
    contents: String,
  },
  { timestamps: true }
);

const WinWinModel = mongoose.model("Winwin", WinWinSchema);

export default WinWinModel;
