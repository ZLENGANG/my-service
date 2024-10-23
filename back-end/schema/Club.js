import mongoose from "../database/index.js";

// 定义模型
const ClubSchema = new mongoose.Schema(
  {
    id: String,
    club: String,
    disabled: Boolean,
  },
  { timestamps: true }
);

const ClubModel = mongoose.model("Club", ClubSchema);

export default ClubModel;
