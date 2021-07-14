<template>
  <a-layout id="gx-layout">
    <a-layout-sider
      v-model="collapsed"
      :trigger="null"
      collapsible
      class="gx-app-sidebar gx-layout-sider-dark"
    >
      <div class="gx-layout-sider-header">
        <div class="gx-linebar">
          <i
            class="gx-icon-btn icon gx-text-white"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            :class="{
              'icon-menu-unfold': collapsed,
              'icon-menu-fold': !collapsed
            }"
            @click="toggleSidebar()"
          ></i>
        </div>
        <router-link class="gx-site-logo" to="/">
          <img
            style="max-height: 50px;"
            alt="SubsApp"
            src="@/assets/regular-logo.png"
          />
        </router-link>
      </div>
      <menu-club v-if="user.select_role === 'club_admin'" />
      <menu-user v-if="user.select_role === 'member'" />
      <menu-admin v-if="user.select_role === 'admin'" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <div
          class="gx-d-lg-none gx-d-block gx-linebar gx-mr-3"
          @click="toggleSidebar()"
        >
          <i class="gx-icon-btn icon icon-menu"></i>
        </div>
        <router-link class="gx-d-block gx-d-lg-none gx-pointer" to="/">
          <img
            style="max-height: 50px;"
            alt="LeadSurge"
            src="@/assets/regular-logo.png"
          />
        </router-link>
        <ul v-if="user && user.user" class="gx-header-notifications gx-ml-auto">
          <li class="gx-user-nav">
            <a-row type="flex">
              <div
                class="ant-avatar gx-avatar gx-pointer ant-avatar-circle ant-avatar-image"
              >
                <img alt="" :src="userProfileAvatar" />
              </div>
              <router-link to="/my-profile" tag="div" style="cursor:pointer;">
                <div class="gx-user-nav--name">
                  Hi {{ user.user.first_name }}
                </div>
              </router-link>
              <a-dropdown
                v-if="
                  user.user_type.indexOf('club_admin') !== -1 ||
                    user.user_type.indexOf('admin') !== -1
                "
                :trigger="['click']"
                style="margin-top: 15px"
              >
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  <a-icon type="more" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item key="0" disabled>
                    <span>Switch As</span>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item
                    v-if="user.user_type.indexOf('admin') !== -1"
                    key="1"
                  >
                    <a @click.prevent="setRole('admin')">Admin</a>
                  </a-menu-item>
                  <a-menu-item key="2">
                    <a @click.prevent="setRole('club_admin')">Club Admin</a>
                  </a-menu-item>
                  <a-menu-item key="3">
                    <a @click.prevent="setRole('member')">Member</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-row>
          </li>
        </ul>
      </a-layout-header>
      <a-layout-content class="gx-layout-content">
        <!-- <router-link
          v-if="checkPreviousPath()"
          class="back-button"
          :to="{ path: $routerHistory.previous().path }"
        >
          GO BACK
        </router-link> -->
        <a-button
          v-if="
            $route.path !== '/' &&
              $route.path !== '/admin' &&
              $route.path !== '/dashboard'
          "
          block
          class="back-button"
          @click="$router.go(-1)"
        >
          GO BACK {{ $router.path }}
        </a-button>
        <router-view />
      </a-layout-content>
    </a-layout>
    <div class="mobile-menu">
      <a-drawer
        placement="left"
        wrap-class-name="mobile-menu"
        :visible="collapsed"
        @close="hideSidebar()"
      >
        <menu-club v-if="user.select_role === 'club_admin'" />
        <menu-user v-if="user.select_role === 'member'" />
        <menu-admin v-if="user.select_role === 'admin'" />
      </a-drawer>
    </div>
  </a-layout>
</template>
<script>
import {
  AUTH_USER,
  AUTH_SUBSCRIPTION
} from "@/store/modules/auth/auth-actions";
import { UITypes } from "@/store/modules/ui/ui-actions";
import { mapGetters } from "vuex";
import MenuClub from "@/layouts/menus/menu-club";
import MenuUser from "@/layouts/menus/menu-user";
import MenuAdmin from "@/layouts/menus/menu-admin";
export default {
  components: { MenuUser, MenuClub, MenuAdmin },
  data() {
    return {
      selectRole: ""
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER,
      sub: AUTH_SUBSCRIPTION,
      collapsed: UITypes.getters.GET_SIDEBAR
    }),
    userProfileAvatar: function() {
      if (this.user.user.avatar) {
        return "https://api.subsapp.com/uploads/" + this.user.user.avatar;
      } else {
        return "https://api.subsapp.com/missing.png";
      }
    }
  },
  mounted() {
    this.selectRole = this.user.user_type[0];
    if (!this.user.user) {
      this.$router.push("/login");
    }
  },
  methods: {
    checkPreviousPath() {
      if (this.$routerHistory.hasPrevious()) {
        if (
          this.$routerHistory.previous().path !== "/login" &&
          this.$routerHistory.previous().path !== "/" &&
          this.$routerHistory.previous().path !== "/admin" &&
          this.$routerHistory.previous().path !== "/register-club" &&
          this.$routerHistory.previous().path !== "/register-user"
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    toggleSidebar() {
      this.$store.commit(UITypes.mutations.TOGGLE_SIDEBAR);
    },
    hideSidebar() {
      this.$store.commit(UITypes.mutations.HIDE_SIDEBAR);
    },
    setRole(role) {
      const roles = this.user.user_type;
      if (roles.indexOf(role) !== -1) {
        let userData = JSON.parse(localStorage.getItem("auth-user"));
        userData.select_role = role;
        window.localStorage.setItem("auth-user", JSON.stringify(userData));
        this.$store.commit("AUTH_STATE");
        if (role === "admin") {
          this.$router.replace("/admin");
        } else {
          if (this.$route.path === "/dashboard") return;
          this.$router.replace("/dashboard");
        }
      }
    }
  }
};
</script>
<style>
.back-button {
  background: #2f7397;
  color: white;
  text-align: left;
  cursor: pointer;
}
.back-button:hover {
  background: #255c7a;
  color: white;
}
.back-button:focus {
  background: #255c7a;
  color: white;
}
.mobile-menu {
  display: none;
}
.mobile-menu .ant-drawer-wrapper-body {
  background: #003366;
}
.ant-layout-header .ant-drawer-close {
  color: white;
  top: 10px;
}
@media screen and (min-width: 0px) and (max-width: 991px) {
  .mobile-menu {
    display: block;
  } /* show it on smaller screen */
}
@media screen and (min-width: 0px) and (max-width: 576px) {
  .ant-avatar {
    margin: 8px 4px;
  }
}
.gx-user-nav--name {
  font-size: 16px;
  padding: 16px 8px;
}
</style>
