import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../pages/home/index.vue";
import Login from "../pages/login/index.vue";
import Winwin from "../pages/winwin/index.vue";
import FootballGame from "../pages/football-game/index.vue";
import FootballGameDetail from "../pages/football-game/detail.vue";
import FootballGameClubs from "../pages/football-game/clubs.vue";
import Ssq from "../pages/ssq/index.vue";
import Dlt from "../pages/dlt/index.vue";

const routes = [
  { path: "/", component: Home, meta: { title: "首页" } },
  { path: "/login", component: Login, meta: { title: "登录" } },

  { path: "/winwin", component: Winwin, meta: { title: "双赢彩票" } },
  {
    path: "/football-game",
    component: FootballGame,
    meta: { title: "足球比赛" },
  },
  {
    path: "/football-game/detail",
    component: FootballGameDetail,
    meta: { title: "今日足球比赛详情" },
  },
  {
    path: "/football-game/clubs",
    component: FootballGameClubs,
    meta: { title: "俱乐部维护" },
  },
  {
    path: "/ssq",
    component: Ssq,
    meta: { title: "双色球推荐" },
  },
  {
    path: "/dlt",
    component: Dlt,
    meta: { title: "大乐透推荐" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.path !== "/login" && !localStorage.getItem("token")) {
    next("login");
  }
  next();
});

export default router;
