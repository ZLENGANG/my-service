import mongoose from "../database/index.js";

// 定义模型
const ServiceSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    status: Boolean,
    execTime: String,
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model("Service", ServiceSchema);

export default ServiceModel;
