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
          <span>Club Admins</span>
        </router-link>
      </a-menu-item>
      <!-- <a-menu-item key="my_profile" @click="hideSidebar">
        <router-link to="/admin/my-profile">
          <a-icon type="user" />
          <span>My Profile</span>
        </router-link>
      </a-menu-item> -->
      <!-- <a-menu-item key="members" @click="hideSidebar">
        <router-link to="/admin/members">
          <a-icon type="smile" />
          <span>Members</span>
        </router-link>
      </a-menu-item> -->
      <!-- <a-menu-item key="club-billing" @click="hideSidebar">
        <router-link to="/admin/club-billing">
          <a-icon type="file" />
          <span>Club Billing</span>
        </router-link>
      </a-menu-item> -->
      <!-- <a-menu-item key="subscription" @click="hideSidebar">
        <router-link to="/admin/subscription">
          <a-icon type="euro" />
          <span>Subscription</span>
        </router-link>
      </a-menu-item> -->
      <!-- <a-menu-item key="club-mangers" @click="hideSidebar">
        <router-link to="/admin/club-managers">
          <a-icon type="solution" />
          <span>Club Managers</span>
        </router-link>
      </a-menu-item> -->
      <!-- <a-menu-item key="club-details" @click="hideSidebar">
        <router-link to="/admin/club-details">
          <a-icon type="setting" />
          <span>Club Details</span>
        </router-link>
      </a-menu-item> -->
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
          this.$router.replace("/login");
        })
        .catch(() => {
          this.$router.replace("/login");
        });
    }
  }
};
</script>

<style scoped></style>
