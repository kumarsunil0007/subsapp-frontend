
<template>
  <a-menu theme="dark" mode="inline">
    <a-menu-item-group key="g2" class="gx-menu-group">
      <a-menu-item key="dashboard" @click="hideSidebar">
        <router-link to="/dashboard">
          <a-icon type="home" />
          <span>My Events</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="members" @click="hideSidebar">
        <router-link to="/members">
          <a-icon type="smile" />
          <span>Members</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="teams" @click="hideSidebar">
        <router-link to="/teams-list">
          <a-icon type="team" />
          <span>Teams</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        v-if="user.select_role === 'club_admin'" 
        key="admins"
        @click="hideSidebar"
      >
        <router-link to="/admin-list">
          <a-icon type="smile" />
          <span>Coaches</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        v-if="user.select_role === 'club_admin'"   
        key="club-billing"
        @click="hideSidebar"
      >
        <router-link to="/club/billing">
          <a-icon type="file" />
          <span>Club Billing</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        v-if="user.select_role === 'club_admin'"
        key="subscription" 
        @click="hideSidebar" 
      >
        <router-link to="/subscription">
          <a-icon type="euro" />
          <span>Subscription</span>
        </router-link>
      </a-menu-item>
      <!-- <a-menu-item key="club_admins" @click="hideSidebar">
        <router-link to="/club/admins">
          <a-icon type="solution" />
          <span>Club Managers</span>
        </router-link>
      </a-menu-item> -->
      <a-menu-item key="club_config" @click="hideSidebar" v-if="user.select_role != 'coach'">
        <router-link to="/club/settings/my-club">
          <a-icon type="setting" />
          <span>Club Details</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="club_config" @click="hideSidebar" v-if="user.select_role == 'coach'">
        <router-link to="/clubs-list">
          <a-icon type="setting" />
          <span>Clubs</span>
        </router-link>
      </a-menu-item>
      <a-menu-item  key="my_profile" @click="hideSidebar">
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
  name: "MenuClub",
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