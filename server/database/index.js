import mongoose from "mongoose";
import { DB_CONFIG } from "../config/index.js";

// 连接 MongoDB 数据库
const dbUrl = `mongodb://${DB_CONFIG.USER}:${DB_CONFIG.PASSWORD}@${DB_CONFIG.URL}/${DB_CONFIG.DB_NAME}?authSource=admin`;
mongoose
  .connect(dbUrl, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

export default mongoose;
