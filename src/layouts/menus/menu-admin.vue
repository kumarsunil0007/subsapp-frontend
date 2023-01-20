<template>
  <a-menu
    v-if="user && user.user_type.indexOf('admin') !== -1"
    theme="dark"
    mode="inline"
  >
    <a-menu-item-group key="g2" class="gx-menu-group">
      <a-menu-item key="admin_dashboard" @click="hideSidebar">
        <router-link to="/admin/dashboard">
          <a-icon type="home" />
          <span>Dashboard</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="users" @click="hideSidebar">
        <router-link to="/admin/users">
          <a-icon type="user" />
          <span>Club Admins</span><LeftOutlined />
        </router-link>
      </a-menu-item>
      <a-menu-item key="settings" @click="hideSidebar">
        <router-link to="/admin/settings">
          <a-icon type="solution" />
          <span>Settings</span><LeftOutlined />
        </router-link>
      </a-menu-item>
      <a-menu-item key="logout" @click="Logout">
        <a-icon type="logout" />
        <span>Logout</span>
      </a-menu-item>
    </a-menu-item-group>
  </a-menu>
</template>

<script>
import {
  AUTH_USER,
  AUTH_SUBSCRIPTION
} from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
import { UITypes } from "@/store/modules/ui/ui-actions";
import { AUTH_LOGOUT } from "@/store/modules/auth/auth-actions";

export default {
  name: "MenuAdmin",
  data() {
    return {
      collapsed: false
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER,
      sub: AUTH_SUBSCRIPTION
    }),
    userProfileAvatar: function() {
      if (this.user.user.avatar) {
        return "https://api.subsapp.com/uploads/" + this.user.user.avatar;
      } else {
        return "https://api.subsapp.com/missing.png";
      }
    }
  },
  methods: {
    hideSidebar() {
      this.$store.commit(UITypes.mutations.HIDE_SIDEBAR);
    },
    async Logout() {
      await this.$store
        .dispatch(AUTH_LOGOUT)
        .then(() => {
          console.log("here3");
          localStorage.removeItem("authUserData")
          localStorage.removeItem("isSubscribed")
          localStorage.removeItem("subscription")
          localStorage.removeItem("token")
          this.$router.replace("/login");
        })
        .catch(() => {
          localStorage.removeItem("authUserData")
          localStorage.removeItem("isSubscribed")
          localStorage.removeItem("subscription")
          localStorage.removeItem("token")
          this.$router.replace("/login");
        });
    }
  }
};
</script>
