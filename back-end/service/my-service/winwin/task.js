import axios from "axios";
import moment from "moment";
import {
  WINWIN_MAP,
  SEND_URL,
  MY_SEND_URL,
  EXCLUDE_GAME_ARR,
} from "../../../config/index.js";
import WinWinSchema from "../../../schema/WinWin.js";
import ServiceModel from "../../../schema/Service.js";

let timer = null;

const writeFileAndSend = async (findObj) => {
  const sendInfo = {
    title: `${WINWIN_MAP[findObj.lottery]}->${findObj.game}-${
      findObj.contents
    }->${findObj.rank}`,
    desp: "恭喜",
    url: "https://www.mgvip18.com/mobile2/#/pages/tabBarPages/index/index",
  };

  const info = {
    type: findObj.lottery,
    name: WINWIN_MAP[findObj.lottery],
    count: findObj.rank,
    game: findObj.game,
    contents: findObj.contents,
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm:ss"),
  };

  const lastRecord = await WinWinSchema.findOne().sort({ _id: -1 });

  const lastData = lastRecord || {};
  if (
    !(
      lastData.type === findObj.lottery &&
      lastData.count === findObj.rank &&
      lastData.game === findObj.game
    )
  ) {
    axios.post(SEND_URL, sendInfo);
    axios.post(MY_SEND_URL, sendInfo);
    await WinWinSchema.create(info);
  }
};

const getDragonGames = (winwinToken) => {
  return new Promise((resolve, reject) => {
    const url = `https://222.capi080.com/web/rest/member/dragon/games?count=6`;
    axios
      .get(url, {
        headers: {
          Cookie: `_skin_=blue; token=${winwinToken}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const send = (winwinToken, id) => {
  getDragonGames(winwinToken)
    .then((res) => {
      if (res.status === 200) {
        const filterArr = (res.data.result || []).filter(
          (item) => !EXCLUDE_GAME_ARR.includes(item.lottery)
        );
        const findObj = filterArr.find((item) => item.rank > 15);
        if (findObj) {
          writeFileAndSend(findObj);
        }
      }
    })
    .catch((error) => {
      const info = {
        title: `winwin登录失效，请重新登录`,
        desp: "Error",
      };
      axios.post(SEND_URL, info).finally(() => {
        winwinTask.stop({ id });
      });
      console.log(info);
    });
};

const winwinTask = {
  start({ token: winwinToken, id }) {
    return new Promise((resolve, reject) => {
      getDragonGames(winwinToken)
        .then(async (res) => {
          timer = setInterval(() => {
            send(winwinToken, id);
          }, 30 * 1000);

          axios.post(SEND_URL, {
            title: `恭喜-双赢彩票监听服务启动已启动`,
          });
          await ServiceModel.findOneAndUpdate({ id }, { status: true });
          resolve("start");
        })
        .catch((err) => {
          resolve({
            code: -1,
            message: "Token 错误",
          });
        });
    });
  },
  stop({ id }) {
    return new Promise(async (resolve, reject) => {
      clearInterval(timer);
      await ServiceModel.findOneAndUpdate({ id }, { status: false });
      resolve("stop");
    });
  },
};

export default winwinTask;
