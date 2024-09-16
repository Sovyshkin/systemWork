import { createRouter, createWebHistory } from "vue-router";
import AppPolitics from "../components/AppPolitics.vue";
import AppMain from "../components/AppMain.vue";
import AppLogin from "../components/AppLogin.vue";
import AppAdmin from "../components/AppAdmin.vue";
import CreateService from "../components/CreateService.vue";
import AppService from "../components/AppService.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppMain,
      name: "main",
    },
    {
      path: "/politics",
      component: AppPolitics,
      name: "politics",
    },
    {
      path: "/login",
      component: AppLogin,
      name: "login",
    },
    {
      path: "/admin",
      component: AppAdmin,
      name: "admin",
    },
    {
      path: "/create_service",
      component: CreateService,
      name: "create",
    },
    {
      path: "/service",
      component: AppService,
      name: "service",
    },
  ],
});

export default router;
