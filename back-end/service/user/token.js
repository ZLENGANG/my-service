import jwt from "jsonwebtoken";
const secretKey = "roninz";

export const generateToken = function (payload) {
  const token =
    "Bearer " +
    jwt.sign(payload, secretKey, {
      expiresIn: "3d",
    });
  return token;
};

export const verifyToken = function (req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.json({ code: 401, msg: "未携带token" });
  }

  const token = req.headers.authorization.split(" ")[1] || "";
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      console.log("token校验失败", err);
      return res.json({ code: 401, msg: "登录已失效" });
    }
    console.log("token校验成功", decoded);
    next();
  });
};
