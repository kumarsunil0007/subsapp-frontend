<template>
  <n-page>
    <a-row type="flex">
      <a-col :span="24" class="gx-text-right">
        <a-button type="primary" @click="openClubSearch"
          >Join a new Club</a-button
        >
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col v-if="user && user.user" :span="24">
        <a-card class="gx-card-table-full" title="My Clubs">
          <my-clubs-table
            ref="member_club_listing"
            :member-id="parseInt(user.user.id)"
          />
        </a-card>
      </a-col>
    </a-row>
    <search-clubs-modal :visible="clubSearchModal" @close="closeClubSearch" />
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import MyClubsTable from "@/components/my-clubs/my-clubs-table/my-clubs-table";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
import SearchClubsModal from "@/components/my-clubs/search-clubs-modal/search-clubs-modal";
export default {
  name: "MyClubs",
  components: { SearchClubsModal, MyClubsTable, NPage },
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
