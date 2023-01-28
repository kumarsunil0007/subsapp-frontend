<template>
  <a-menu
    v-if="user && user.user_type.indexOf('member') !== -1"
    theme="dark"
    mode="inline"
  >
    <a-menu-item-group key="g2" class="gx-menu-group">
      <a-menu-item key="dashboard" @click="hideSidebar">
        <router-link to="/">
          <a-icon type="user" />
          <span>My Calendar</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="my_clubs" @click="hideSidebar">
        <router-link to="/my-clubs">
          <a-icon type="trophy" />
          <span>Club Management </span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="my_teams" @click="hideSidebar">
        <router-link to="/my-teams">
          <a-icon type="team" />
          <span>Team Membership</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="my_billing" @click="hideSidebar">
        <router-link to="/my-billing">
          <a-icon type="euro" />
          <span>Manage My Payments</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="my_profile" @click="hideSidebar">
        <router-link to="/my-profile">
          <a-icon type="user" />
          <span>My Profile</span>
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
  name: "MenuUser",
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
        return "http://api.subsapp.com/uploads/" + this.user.user.avatar;
      } else {
        return "http://api.subsapp.com/missing.png";
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
          console.log("here1");
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

<style scoped></style>
