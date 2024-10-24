import { generateToken } from "./token.js";
import UserModel from "../../schema/User.js";

const userService = {
  async login(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    try {
      const result = await UserModel.findOne({ username, password });
      if (!result) {
        return res.json({ code: -1, msg: "账号或密码错误" });
      }
    } catch (error) {
      return res.json({ code: -1, msg: "账号或密码错误" });
    }

    const token = generateToken({ username: username });
    res.json({
      code: 200,
      msg: "登录成功",
      data: { token },
    });
  },
};

export default userService;
