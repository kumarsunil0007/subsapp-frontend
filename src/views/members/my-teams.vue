<template>
  <n-page>
    <!-- <a-row type="flex">
      <a-col :span="24" class="gx-text-right">
        <a-button type="primary" @click="openClubSearch"
          >Join a new Club</a-button
        >
      </a-col>
    </a-row> -->
    <a-row type="flex">
      <a-col v-if="user && user.user" :span="24">
        <a-card class="gx-card-table-full" title="Team Membership">
          <my-teams-table
            ref="member_team_listing"
            :member-id="parseInt(user.user.id)"
          />
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import MyTeamsTable from "@/components/members/my-teams-table.vue";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
export default {
  name: "MyClubs",
  components: { MyTeamsTable, NPage },
  data() {
    return {
      clubSearchModal: false
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  },
  methods: {
    closeClubSearch() {
      this.$refs.member_club_listing.getTeamSchedule();
      this.clubSearchModal = false;
    },
    openClubSearch() {
      this.clubSearchModal = true;
    }
  }
};
</script>

<style scoped></style>
