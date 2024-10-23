export const DB_CONFIG = {
  URL: "49.235.164.239:27017",
  USER: "root",
  PASSWORD: "RjQCM6lntnLSU0dl",
  DB_NAME: "myservice",
  PORT: 20717,
};

// 消息发送key
export const SEND_KEY = "SCT252192TnpgEYho5O5EPR0f4Fegi6jht";

// 消息发送链接
export const SEND_URL = `https://sctapi.ftqq.com/${SEND_KEY}.send`;

// 我的服务发送链接
export const MY_SEND_URL = "http://103.143.72.25:1998/sendMsg";

// 双赢彩票游戏配置
export const WINWIN_MAP = {
  AULUCKY10: "澳洲幸运10",
  AULUCKY20: "澳洲幸运20",
  AULUCKY5: "澳洲幸运5",
  AULUCKY8: "澳洲幸运8",
  BJKL8: "北京快乐8",
  BJPK10: "北京赛车(PK10)",
  BJPK10BJL: "极速百家乐",
  FTJSC: "极速番摊",
  CQSSC: "重庆时时彩",
  F3D: "福彩3D",
  GD11X5: "广东11选5",
  GDKLSF: "广东快乐十分",
  GXK3: "广西快3",
  GXKLSF: "广西快乐十分",
  HK6: "香港六合彩",
  TWDLT: "台湾大乐透",
  JLK3: "吉林快3",
  PCEGG: "PC蛋蛋(旧)",
  AUPCEGG: "PC蛋蛋",
  PK10JSC: "极速赛车",
  PL3: "体彩排列3",
  SSCJSC: "极速时时彩",
  TJSSC: "天津时时彩",
  XJSSC: "新疆时时彩",
  TXFFC: "腾讯分分彩",
  XYNC: "重庆幸运农场",
  LUCKYSB: "极速飞艇",
  HK6JSC: "极速六合彩",
  K3JSC: "极速快3",
  KLSFJSC: "极速快乐十分",
  KL8JSC: "极速快乐8",
  "11X5JSC": "极速11选5",
  PK10JSCNN: "极速牛牛",
  PK10JSCNN_A: "极速牛牛",
  XYFT: "幸运飞艇",
  SGFT: "SG飞艇",
  XYSSC: "幸运时时彩",
  CQHLSX: "重庆欢乐生肖",
  PL5: "体彩排列5",
  JSK3: "江苏快3",
  HUBK3: "湖北快3",
  BJK3: "北京快3",
  HEBK3: "河北快3",
  GSK3: "甘肃快3",
  SHK3: "上海快3",
  GZK3: "贵州快3",
  SGK3: "SG快3",
  FKL8: "快乐8",
  SGSSC: "SG时时彩",
  SGKL8: "SG快乐8",
  SGKLSF: "SG快乐十分",
  SG11X5: "SG11选5",
  PCEGGJSC: "极速蛋蛋",
  TRONSSC: "波场时时彩",
  ETHSSC: "以太时时彩",
};

// 排除耗时很久的游戏
export const EXCLUDE_GAME_ARR = ["F3D", "HK6", "PL3", "PL5", "FKL8", "TWDLT"];

// 需要token的服务
export const NEED_TOKEN_ID_ARR = ["winwin"];

export const SERVER_ADDRESS = "http://roninz.xyz";
