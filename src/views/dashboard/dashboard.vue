<template>
  <n-page>
    <div v-if="user.select_role === 'member'">
      <a-card title="Your Schedules" class="gx-card-full">
        <member-calendar />
      </a-card>
    </div>
    <div v-else>
      <club-dashboard />
    </div>
  </n-page>
</template>

<style lang="scss">
.teams-box {
  &--name {
    font-weight: 100;
  }
  &--title {
    font-size: 22px;
    color: #f5f5f5;
    margin-bottom: 2px;
  }
}
</style>

<script>
//import NBox from "@/components/ui/n-box/n-box";
import NPage from "@/components/ui/n-page/n-page";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
import MemberCalendar from "@/components/member-calendar/member-calendar";
import ClubDashboard from "@/components/club-admins/dashboard/club-dashboard";
import { clubService } from "@/common/api/api.service";

export default {
  name: "Dashboard",
  components: { NPage, MemberCalendar, ClubDashboard },
  data() {
    return {
      teams: [
        {
          teamID: 1,
          teamName: "Avonmore FC 95 Training Sub U18",
          totalMembers: 22,
          revenueThisWeek: 919
        },
        {
          teamID: 2,
          teamName: "Terenure College Rugby Football Club U21",
          totalMembers: 22,
          revenueThisWeek: 522
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  },
  mounted() {
    this.fetchRoles();
  },
  methods: {
    fetchRoles() {
      clubService.fetchRoles().then(resp => {
        if (resp.data.success) {
          let userData = JSON.parse(localStorage.getItem("auth-user"));
          userData.user_type = resp.data.result;
          window.localStorage.setItem("auth-user", JSON.stringify(userData));
          this.$store.commit("AUTH_STATE");
        }
      });
    }
  }
};
</script>
