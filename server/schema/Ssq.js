import mongoose from "../database/index.js";

// 定义模型
const SsqSchema = new mongoose.Schema(
  {
    date: String,
    time: String,
    red: String,
    blue: String,
    recommend: String,
  },
  { timestamps: true }
);

const SsqModel = mongoose.model("Ssq", SsqSchema);

export default SsqModel;
