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
            style="max-height: 50px"
            alt="SubsApp"
            src="@/assets/regular-logo.png"
          />
        </router-link>
      </div>
      <menu-club
        v-if="user.select_role === 'club_admin' || user.select_role === 'coach'"
      />
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
            style="max-height: 50px"
            alt="LeadSurge"
            src="@/assets/regular-logo.png"
          />
        </router-link>

        <ul v-if="user && user.user" class="gx-header-notifications gx-ml-auto">
          <li class="gx-user-nav">
            <a-row type="flex" style="align-items: center;">
              <div
                class="ant-avatar gx-avatar gx-pointer ant-avatar-circle ant-avatar-image"
              >
                <img alt="" :src="userProfileAvatar" v-if="userProfileAvatar" />
                <img alt="" src="@/assets/user.png" v-else />
              </div>
              <router-link to="/my-profile" tag="div" style="cursor: pointer">
                <div class="gx-user-nav--name">
                  Hi {{ user.user.first_name }}
                </div>
                <a-dropdown
                  v-if="user.user_type.length > 1"
                  :trigger="['click']"
                  class="switch-as"
                >
                  <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                    {{ this.UserName }} <a-icon type="setting" />
                  </a>

                  <a-menu slot="overlay">
                    <a-menu-item
                      v-if="user.user_type.indexOf('admin') !== -1"
                      key="1"
                    >
                      <a-menu-divider />
                      <a
                        class="switch-as-users"
                        @click.prevent="setRole('admin')"
                        >Use as Admin</a
                      >
                    </a-menu-item>
                    <a-menu-item
                      v-if="user.user_type.indexOf('club_admin') !== -1"
                      key="2"
                    >
                      <a
                        class="switch-as-users"
                        @click.prevent="setRole('club_admin')"
                        >{{ this.ClubAdmin }}</a
                      >
                    </a-menu-item>
                    <a-menu-item
                      v-if="user.user_type.indexOf('coach') !== -1"
                      key="3"
                    >
                      <a
                        class="switch-as-users"
                        @click.prevent="setRole('coach')"
                        >{{ this.Coach }}</a
                      >
                    </a-menu-item>
                    <a-menu-item
                      v-if="user.user_type.indexOf('member') !== -1"
                      key="4"
                    >
                      <a
                        class="switch-as-users"
                        @click.prevent="setRole('member')"
                        >{{ this.Member }}</a
                      >
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </router-link>
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
          class="back-button gx-mb-0"
          @click="$router.go(-1)"
        >
          <a-icon type="left" />Go Back {{ $router.path }}
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
        <menu-club
          v-if="
            user.select_role === 'club_admin' || user.select_role === 'coach'
          "
        />
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
      selectRole: "",
      UserName: "",
      ClubAdmin: "",
      Coach: "",
      Member: ""
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER,
      sub: AUTH_SUBSCRIPTION,
      collapsed: UITypes.getters.GET_SIDEBAR
    }),
    userProfileAvatar: function() {
      if (this.user.user.profile && this.user.user.profile.image) {
        return this.user.user.profile.image;
      } else {
        return null;
      }
    }
  },
  mounted() {
    this.selectRole = this.user.user_type[0];
    if (this.user.select_role == "club_admin") {
      this.UserName = "Club Admin";
      this.Member = "Switch to Member";
      this.ClubAdmin = "Current login as Club Admin";
      this.Coach = "Switch to Coach";
    }
    if (this.user.select_role == "member") {
      this.UserName = "Member";
      this.Member = "Current login as Member";
      this.ClubAdmin = "Switch to Club Admin";
      this.Coach = "Switch to Coach";
    }
    if (this.user.select_role == "coach") {
      this.UserName = "Coach";
      this.Member = "Switch to Member";
      this.ClubAdmin = "Switch to Club Admin";
      this.Coach = "Current login as Coach";
    }
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
      console.log("role => ", role)
      if (role === "club_admin") {
        //   this.$swal('You are selected as Club Admin');
        this.UserName = "Club Admin";
        this.Member = "Switch to Member";
        this.ClubAdmin = "Current login as Club Admin";
      }
      if (role === "member") {
        //  this.$swal('You are selected as Member');
        this.UserName = "Member";
        this.Member = "Current login as Member";
        this.ClubAdmin = "Switch to Club Admin";
      }
      if (role === "coach") {
        this.UserName = "Coach";
      }
      const roles = this.user.user_type;
      if (roles.indexOf(role) !== -1) {
        let userData = JSON.parse(localStorage.getItem("authUserData"));
        console.log("userData => ", userData)
        userData.select_role = role;
        window.localStorage.setItem("authUserData", JSON.stringify(userData));
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
.login-as-switch-case {
  font-size: 14px;
  color: #222;
  margin-top: 7px;
}
.switch-as {
  font-size: 14px;
  margin-left: 6px;
  margin-top: 0px;
}
.gx-user-nav--name {
  font-size: 16px;
  padding: 2px 8px;
}
.switch-as i.anticon.anticon-down {
  color: #ffc107;
  border: 3px solid #003366;
  /* box-shadow: 0 0 6px #ffc107; */
  background-color: #003366;
  color: #fff;
  border-radius: 29px;
  /* animation: animate 3s linear infinite; */
  padding: 3px 3px;
}
@keyframes animate {
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }
}
</style>
