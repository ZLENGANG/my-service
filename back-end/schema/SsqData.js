import mongoose from "../database/index.js";

// 定义模型
const SsqDataSchema = new mongoose.Schema(
  {
    date: String,
    code: String,
    red: String,
    blue: String,
  },
  { timestamps: true }
);

const SsqDataModel = mongoose.model("Ssqdatas", SsqDataSchema);

export default SsqDataModel;
