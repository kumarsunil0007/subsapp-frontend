<template>
  <!-- <a-menu
    v-if="user && user.user_type.indexOf('member') !== -1"
    theme="dark"
    mode="inline"
  >
    <a-menu-item-group key="g2" class="gx-menu-group">
      <a-menu-item  key="dashboard" @click="hideSidebar">
        <router-link to="/">
          <a-icon type="user" />
          <span>My Calendar</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="my_clubs" @click="hideSidebar">
        <router-link to="/my-clubs">
          <a-icon type="trophy" />
          <span>My Clubs </span>
        </router-link>
      </a-menu-item>


      <a-menu-item key="my_teams" @click="hideSidebar" :class="this.$router.currentRoute.path=='/my-teams' ? 'active' : ''">
        <router-link to="/my-teams">
          <a-icon type="team" />
          <span>My Teams</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="my_billing" @click="hideSidebar">
        <router-link to="/my-billing">
          <a-icon type="euro" />
          <span>My Billing</span>
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
  </a-menu> -->

  <nav class="navbar navbar-expand-lg fixed-top row left-menu">
        <router-link tag="li" class="col" class-active="active" to="/dashboard" exact>
          <a-icon type="user" />
          <span>My Calendar</span>
        </router-link>
       <router-link tag="li" class="col" class-active="active" to="/my-clubs" exact>
           <a-icon type="trophy" />
          <span>My Clubs </span>
        </router-link>
        <router-link tag="li" class="col" class-active="active" to="/my-teams" exact>
         <a-icon type="team" />
          <span>My Teams</span>
        </router-link>
        <router-link tag="li" class="col" class-active="active" to="/my-billing" exact>
         <a-icon type="euro" />
          <span>My Billing</span>
        </router-link>
       <router-link tag="li" class="col" class-active="active" to="/my-profile" exact>
         <a-icon type="user" />
          <span>My Profile</span>
        </router-link>
        <router-link tag="li" class="col" class-active="active" to="/logout"  exact>
         <a-icon type="logout" />
          <span>Logout</span>
        </router-link>
    </nav> 
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
      collapsed: false,
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
mounted(){
  console.log('path is ::', this.$router.currentRoute.path)
  var routherLink = this.$router.currentRoute.path;
  
  


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

<style scoped>
.col{
width: 100%;
}
.router-link-exact-active {
 color: #fff;
  font-weight: 700;
}
.left-menu {
margin-top:40px;
}
.left-menu li{
list-style: none;
padding:0 30px 0 40px;
height: 42px;
cursor: pointer;
}
.left-menu li i{
margin-right: 10px;

}
</style>
