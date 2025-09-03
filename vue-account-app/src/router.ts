// src/router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// account pages
import AccountLogin from "./account/pages/login/AccountLogin.vue";
import PrivacyAgreement from "./account/pages/login/PrivacyAgreement.vue";
import AccountMy from "./account/pages/my/AccountMy.vue";
import ModifyIndex from "./account/pages/modify/ModifyIndex.vue";
import AccountWithdraw from "./account/pages/withdraw/AccountWithdraw.vue";
import AdminCodeInput from "./account/pages/admin-login/AdminCodeInput.vue";
import GithubAdminLogin from "./account/pages/admin-login/GithubAdminLogin.vue";

// 소셜/게스트 인증 리다이렉션
import KakaoRedirection from "./kakao/redirection/KakaoRedirection.vue";
import GoogleRedirection from "./google/redirection/GoogleRedirection.vue";
import GithubRedirection from "./github/redirection/GithubRedirection.vue";
import GuestRedirection from "./guest/redirection/GuestRedirection.vue";
import NaverRedirection from "./naver/redirection/NaverRedirection.vue";

const AdminLayout = () => import("./account/pages/adminPage/AdminLayout.vue");
const AdminOverview = () => import("./account/pages/adminPage/AdminOverview.vue");
const AdminUsers = () => import("./account/pages/adminPage/AdminUsers.vue");

const routes: Array<RouteRecordRaw> = [
  { path: "/account/login", name: "VueAccountLogin", component: AccountLogin },
  { path: "/account/privacy", component: PrivacyAgreement },
  { path: "/account/mypage", component: AccountMy },
  { path: "/account/modify/modify-profile", component: ModifyIndex },
  { path: "/account/withdraw", component: AccountWithdraw },
  { path: "/account/admin-code", component: AdminCodeInput },
  { path: "/account/admin-login", component: GithubAdminLogin },

  // ✅ 관리자 영역
  {
    path: "/account/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: "", name: "AdminOverview", component: AdminOverview },
      { path: "users", name: "AdminUsers", component: AdminUsers },
      // 필요 시 roles, logs, settings 등 추가
    ],
  },
  // 소셜/게스트 인증 콜백
  { path: "/kakao_oauth/kakao-access-token", component: KakaoRedirection },
  { path: "/google-oauth/redirect-access-token", component: GoogleRedirection },
  { path: "/github-oauth/redirect-access-token", component: GithubRedirection },
  { path: "/guest-oauth/redirect-access-token", component: GuestRedirection },
  { path: "/naver-oauth/redirect-access-token", component: NaverRedirection },

  // fallback: 404 or main
  { path: "/:pathMatch(.*)*", redirect: "/account/login" },
];

const router = createRouter({
  history: createWebHistory("/vue-account/"),
  routes,
});
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAdmin) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) return next("/account/login");
  }
  next();
});
export default router;
