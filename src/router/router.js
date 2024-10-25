import { createRouter, createWebHistory } from "vue-router";
import AppLogin from "../components/AppLogin.vue";
import AppObjects from "../components/AppObjects.vue";
import CreateObject from "../components/CreateObject.vue";
import AppObject from "../components/AppObject.vue";
import AppProfile from "../components/AppProfile.vue";
import AppWork from "../components/AppWork.vue";
import WorkEdit from "../components/WorkEdit.vue";
import AppCategory from "../components/AppCategory.vue";
import CategoryEdit from "../components/CategoryEdit.vue";
import AppSubcategory from "../components/AppSubcategory.vue";
import SubcategoryEdit from "../components/SubcategoryEdit.vue";
import AppVacancy from "../components/AppVacancy.vue";
import VacancyEdit from "../components/VacancyEdit.vue";
import AppUsers from "../components/AppUsers.vue";
import CreateUsers from "../components/CreateUsers.vue";
import AppInspectors from "../components/AppInspectors.vue";
import UserCheck from "../components/UserCheck.vue";
import UserMarks from "../components/UserMarks.vue";
import ArchiveWorks from "../components/ArchiveWorks.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: AppLogin,
      name: "login",
    },
    {
      path: "/",
      component: AppObjects,
      name: "objects",
    },
    {
      path: "/objects/create",
      component: CreateObject,
      name: "create_objects",
    },
    {
      path: "/object",
      component: AppObject,
      name: "object",
    },
    {
      path: "/profile",
      component: AppProfile,
      name: "profile",
    },
    {
      path: "/object/work",
      component: AppWork,
      name: "work",
    },
    {
      path: "/object/work/edit",
      component: WorkEdit,
      name: "work_edit",
    },
    {
      path: "/object/work/category",
      component: AppCategory,
      name: "category",
    },
    {
      path: "/object/work/category/edit",
      component: CategoryEdit,
      name: "category_edit",
    },
    {
      path: "/object/work/category/subcategory",
      component: AppSubcategory,
      name: "subcategory",
    },
    {
      path: "/object/work/category/subcategory/edit",
      component: SubcategoryEdit,
      name: "subcategory_edit",
    },
    {
      path: "/users",
      component: AppUsers,
      name: "users",
    },
    {
      path: "/users/check",
      component: UserCheck,
      name: "user_check",
    },
    {
      path: "/users/check/marks",
      component: UserMarks,
      name: "user_marks",
    },
    {
      path: "/users/create",
      component: CreateUsers,
      name: "create_users",
    },
    {
      path: "/users/edit",
      component: CreateUsers,
      name: "edit_users",
    },
    {
      path: "/inspectors",
      component: AppInspectors,
      name: "inspectors",
    },
    {
      path: "/object/work/category/vacancy",
      component: AppVacancy,
      name: "vacancy",
    },
    {
      path: "/object/work/category/vacancy/edit",
      component: VacancyEdit,
      name: "edit_vacancy",
    },
    {
      path: "/profile/archive",
      component: ArchiveWorks,
      name: "archive",
    },
  ],
});

export default router;
