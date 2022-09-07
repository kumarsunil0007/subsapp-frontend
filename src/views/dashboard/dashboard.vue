<template>
  <n-page>
    <div v-if="user.select_role === 'member'">
      <div style="display: flex">
        <p style=" margin-right: 20px;">
          <span
            style="    padding: 6px;
    height: 10px;
    display: inline-block;
    width: 10px;
    border-radius: 50%;
    background: #559f3f;"
          ></span>
          Joined .
        </p>
        <p>
          <span
            style="    padding: 6px;
    height: 10px;
    display: inline-block;
    width: 10px;
    border-radius: 50%;
    background: #4b7bec;"
          ></span>
          Not Joined .
        </p>
      </div>
      <a-card title="Your Schedules" class="gx-card-full">
        <member-calendar />
      </a-card>
    </div>
    <div v-else>
      <a-card title="Events" class="gx-card-full">
        <ClubDashboard />
      </a-card>
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

import moment from "moment";
export default {
  name: "Dashboard",
  components: {
    NPage,
    MemberCalendar,
    ClubDashboard
  },
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
      ],
      showDate: new Date(),
      items: [
        {
          id: 1,
          startDate: moment(),
          endDate: moment().add(1, "hours"),
          title: "heldfsdfsdfslo"
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
          let userData = JSON.parse(localStorage.getItem("authUserData"));
          userData.user_type = resp.data.result;
          window.localStorage.setItem("authUserData", JSON.stringify(userData));
          this.$store.commit("AUTH_STATE");
        }
      });
    },
    setShowDate(d) {
      console.log("hit");
      this.showDate = d;
    },
    getHeader(t) {
      console.log(t);
      return {
        value: "sdsdas"
      };
    }
  }
};
</script>
<style scoped>
#show-cal {
  color: #2c3e50;
  height: 67vh;
  margin-left: auto;
  margin-right: auto;
}
</style>
