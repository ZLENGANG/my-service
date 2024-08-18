import { exec } from "child_process";

const child1 = exec("npm run front-end");
child1.stdout.on("data", (data) => {
  console.log(data.toString());
});

const child2 = exec("npm run back-end");
child2.stdout.on("data", (data) => {
  console.log(data.toString());
});
