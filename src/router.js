import Vue from "vue";
import Router from "vue-router";
import store from "@/store/index";

Vue.use(Router);

function authGuard(to, from, next) {
  if (store.state.auth.token) {
    if (
      to.meta &&
      to.meta.permission &&
      to.meta.permission.indexOf(store.state.auth.user.select_role) === -1
    ) {
      next("/404");
    } else {
      if (to.meta.billing && store.state.auth.user.select_role !== "coach") {
        if (
          store.state.auth.subscription &&
          store.state.auth.subscription.active
        ) {
          next(); // allow to enter route
        } else {
          next("/subscription");
        }
      } else {
        next(); // allow to enter route
      }
    }
  } else {
    next("/login"); // go to '/login';
  }
}

function authCheck(to, from, next) {
  if (store.state.auth.token) {
    next("/");
  } else {
    next();
  }
}



export default new Router({
  mode: process.env.CORDOVA_PLATFORM ? "hash" : "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "",
      redirect: () => {
        if (store.state.auth.token) {
          const role = store.state.auth.user.select_role;
          if (role === "admin") {
            return "/admin";
          } else {
            return "/dashboard";
          }
        } else {
          return "/login";
        }
      }
    },
    {
      path: "",
      component: () => import("./layouts/main-layout.vue"),
      children: [
        {
          path: "/",
          beforeEnter: authGuard,
          component: () => import("@/views/dashboard/dashboard.vue")
        },
        {
          path: "/dashboard",
          component: () => import("@/views/dashboard/dashboard.vue"),
          beforeEnter: authGuard
        },
        {
          path: "teams-list",
          component: () => import("@/views/club-teams/club-teams-list"),
          meta: {
            permission: ["club_admin", "coach"],
            billing: true
          },
          beforeEnter: authGuard
        },
        {
          path: "teams/:teamId",
          component: () => import("@/views/club-teams/club-team-overview"),
          meta: {
            permission: ["club_admin", "coach"],
            billing: true
          },
          beforeEnter: authGuard
        },
        {
          path: "teams/:teamId/session/:sessionId",
          component: () => import("@/views/club-teams/team-session"),
          meta: {
            permission: ["club_admin", "coach"],
            billing: true
          },
          beforeEnter: authGuard
        },
        {
          path: "club/member/:userId",
          component: () => import("@/views/club-members/club-member"),
          meta: {
            permission: ["club_admin", "coach"],
            billing: true
          },
          beforeEnter: authGuard
        },
        {
          path: "club/member/:userId/attendance",
          component: () =>
            import("@/views/club-members/club-member-attendance"),
          meta: {
            permission: "club_admin",
            billing: true
          },
          beforeEnter: authGuard
        },
        {
          path: "club/settings/my-club",
          component: () => import("@/views/club-manage/my-club"),
          meta: {
            permission: ["club_admin", "coach"],
            billing: true
          },
          beforeEnter: authGuard
        },
        {
          path: "club/billing",
          component: () => import("@/views/club-billing/billing-overview"),
          meta: {
            permission: ["club_admin"]
          },
          beforeEnter: authGuard
        },
        {
          path: "members/",
          component: () => import("@/views/club-members/club-members-overview"),
          meta: {
            permission: ["club_admin", "coach"],
            billing: true
          },
          beforeEnter: authGuard
        },
        {
          path: "admin-list",
          component: () => import("@/views/club-admins/admin-list"),
          meta: {
            permission: ["club_admin"],
            billing: true
          },
          beforeEnter: authGuard
        },
        // All Regular User related stuff here
        {
          path: "my-billing/",
          component: () => import("@/views/member-billing/member-billing"),
          meta: {
            permission: "member"
          },
          beforeEnter: authGuard
        },
        {
          path: "my-payment-cards/",
          component: () => import("@/views/my-payment-cards/my-payment-cards"),
          meta: {
            permission: "member"
          },
          beforeEnter: authGuard
        },
        {
          path: "my-clubs/",
          component: () => import("@/views/my-clubs/my-clubs"),
          meta: {
            permission: "member"
          },
          beforeEnter: authGuard
        },
        {
          path: "my-teams/",
          component: () => import("@/views/members/my-teams"),
          meta: {
            permission: "member"
          },
          beforeEnter: authGuard
        },
        {
          path: "team/schedules/:id",
          component: () => import("@/views/members/team-schedules"),
          meta: {
            permission: ["member"]
          },
          beforeEnter: authGuard
        },
        {
          path: "my-profile/",
          component: () => import("@/views/my-profile/my-profile"),
          beforeEnter: authGuard
        },
        {
          path: "subscription",
          component: () => import("@/views/club-billing/subscription-overview"),
          meta: {
            permission: ["club_admin"]
          },
          beforeEnter: authGuard
        },
        {
          path: "club/admins",
          component: () => import("@/views/club-admins/club-manager"),
          meta: {
            permission: ["club_admin"]
          },
          beforeEnter: authGuard
        }
      ]
    },
    {
      path: "/admin",
      name: "admin",
      meta: {
        permission: "admin"
      },
      beforeEnter: authGuard,
      component: () => import("./layouts/main-layout.vue"),
      children: [
        {
          path: "/admin/dashboard",
          name: "admin-dashboard",
          meta: {
            permission: ["admin"]
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/dashboard/dashboard.vue")
        },
        {
          path: "/admin/users",
          name: "admin-user",
          meta: {
            permission: ["admin"]
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/users/user")
        },
        {
          path: "/admin/member-listing/:id",
          name: "admin-user",
          meta: {
            permission: ["admin"]
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/member/member-listing")
        },
        {
          path: "/admin/club-info/:id",
          name: "club info",
          meta: {
            permission: ["admin"]
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/club-info/club-info")
        },
        {
          path: "/admin/member-listing/:id",
          name: "Member Listing",
          meta: {
            permission: ["admin"]
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/members/member-listing-club")
        },
        {
          path: "/admin/my-profile",
          name: "admin-user",
          meta: {
            permission: ["admin"]
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/my-profile/my-profile.vue")
        },
        {
          path: "/admin/members",
          name: "admin-user",
          meta: {
            permission: ["admin"]
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/members/members.vue")
        },
        {
          path: "/admin/club-billing",
          name: "admin-user",
          meta: {
            permission: ["admin"]
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/club-billing/club-billing.vue")
        },
        {
          path: "/admin/club-details",
          name: "admin-user",
          meta: {
            permission: "admin"
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/club-details/club-details.vue")
        },
        {
          path: "/admin/club-managers",
          name: "admin-user",
          meta: {
            permission: "admin"
          },
          beforeEnter: authGuard,
          component: () =>
            import("@/views/admin/club-managers/club-managers.vue")
        },
        {
          path: "/admin/subscription",
          name: "admin-user",
          meta: {
            permission: "admin"
          },
          beforeEnter: authGuard,
          component: () => import("@/views/admin/subscription/subscription.vue")
        }
      ]
    },
    {
      path: "/register-club",
      name: "club-registration",
      beforeEnter: authCheck,
      component: () => import("./views/auth/registration/club-register.vue")
    },
    {
      path: "/register-user",
      name: "user-registration",
      beforeEnter: authCheck,
      component: () => import("./views/auth/registration/user-register.vue")
    },
    {
      path: "/login",
      name: "auth-login",
      meta: {
        permission: "member"
      },
      beforeEnter: authCheck,
      component: () => import("./views/auth/login.vue")
    },
    {
      path: "/auth/forgot-password",
      name: "auth-fw-pw",
      component: () => import("./views/auth/forgot-password.vue")
    },
    {
      path: "/set-password/:hash",
      name: "home",
      meta: {
        permission: "auth-set-pw"
      },
      component: () => import("./views/auth/set-password.vue")
    },
    {
      path: "/logout",
      name: "auth-lg",
      component: () => import("./views/auth/logout.vue")
    },
    {
      path: "*",
      component: () => import("@/views/errors/404.vue")
    }
  ]
});
