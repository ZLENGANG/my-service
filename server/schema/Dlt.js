import mongoose from "../database/index.js";

// 定义模型
const DltSchema = new mongoose.Schema(
  {
    date: String,
    time: String,
    red: String,
    blue: String,
    recommend: String,
  },
  { timestamps: true }
);

const DltModel = mongoose.model("Dlt", DltSchema);

export default DltModel;
