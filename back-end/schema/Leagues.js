import mongoose from "../database/index.js";

// 定义模型
const LeaguesSchema = new mongoose.Schema(
  {
    code: String,
    name: String,
    disabled: Boolean,
  },
  { timestamps: true }
);

const LeaguesModel = mongoose.model("Leagues", LeaguesSchema);

export default LeaguesModel;
