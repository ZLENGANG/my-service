import superagent from "superagent";
import { load } from "cheerio";
import fs from "fs";
const engBig6 = ["那不勒斯", "国米", "亚特兰大", "尤文", "拉齐奥", "AC米兰"];

superagent
  .get(`https://data.qtx.com/saicheng/Jnlj4Y2624_dpW5Z2G7PO.html`)
  .end((_err, res) => {
    if (_err) {
      console.log("error!", _err);
      return;
    }
    const $ = load(res.text, { decodeEntities: false });
    const arr = [];
    $("#schedule_list .competition_data .tc_center_value").each(
      (index, item) => {
        const score = $(item).find(".tc_schedule_td3").text().trim();
        const teamA = $(item).find(".tc_schedule_td2").text();
        const teamB = $(item).find(".tc_schedule_td4").text().trim();

        if (score !== "-") {
        //   if (engBig6.includes(teamA) || engBig6.includes(teamB)) {
            arr.push({
              round: $(item).find(".tc_schedule_td0").text().trim(),
              time: $(item).find(".tc_schedule_td1").text(),
              teamA,
              score,
              teamB,
              result: $(item).find(".tc_schedule_td5").text().trim(),
              half_result: $(item)
                .find(".tc_schedule_td6")
                .text()
                .replace("\n", "")
                .replaceAll(" ", "")
                .trim(),
              gameHref: $(item).find(".tc_schedule_td6").find("a").attr("href"),
            });
        //   }
        }
      }
    );
    fs.writeFileSync("./half.json", JSON.stringify(arr));
    getHalfResult(arr);
  });

function getHalfResult(arr) {
  const resArr = [];
  const resArr1 = [];
  const resArr2 = [];
  arr.forEach((item) => {
    const [halfA, halfB] = item.half_result.split("-");
    if (halfA === halfB) {
      resArr2.push(item);
      if (item.result !== "平") {
        resArr.push(item);
      } else {
        resArr1.push(item);
      }
    }
  });
  console.log(
    resArr.length,
    resArr1.length,
    resArr2.length,
    resArr.length / resArr2.length
  );

  //   fs.writeFileSync("./half.json", JSON.stringify(resArr1));
}
