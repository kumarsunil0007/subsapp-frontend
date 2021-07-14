<template>
  <n-page>
    <div v-if="user.select_role === 'member'">
      <a-card title="Your Schedule" class="gx-card-full">
        <member-calendar />
      </a-card>
    </div>
    <div v-else>
      <a-row type="flex">
        <a-col :xs="24" :sm="24" :md="6">
          <n-box to="/teams-list">
            <div slot="title">
              Teams
            </div>
            <div slot="description">
              Schedule new training session, add and remove team members and
              manage anything else related to that team.
            </div>
          </n-box>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6">
          <n-box to="/members">
            <div slot="title">
              Global Members
            </div>
            <div slot="description">
              Manage your global clubs members, grow your club by inviting new
              members or just manage your existing members.
            </div>
          </n-box>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6">
          <n-box to="/club/billing">
            <div slot="title">
              Billing
            </div>
            <div slot="description">
              View a breakdown of your clubs billing history. Track pending
              payments and view individual transaction invoices.
            </div>
          </n-box>
        </a-col>
      </a-row>
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
import NBox from "@/components/ui/n-box/n-box";
import NPage from "@/components/ui/n-page/n-page";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
import MemberCalendar from "@/components/member-calendar/member-calendar";
export default {
  name: "Dashboard",
  components: { NPage, NBox, MemberCalendar },
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
  }
};
</script>
