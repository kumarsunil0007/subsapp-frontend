<template>
  <n-page v-if="renderComponent">
    <a-row type="flex">
      <a-col :span="24" class="gx-text-right">
        <a-button type="primary" @click="openNewTeamModal">
          Create a new Team
        </a-button>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="24">
        <a-card title="Teams" class="gx-card-table-full">
          <club-teams-table />
        </a-card>
      </a-col>
    </a-row>
    <new-team-modal :visible="newTeamModalVisible" @close="closeNewTeamModal" />
  </n-page>
</template>
<script>
import NPage from "@/components/ui/n-page/n-page";
import ClubTeamsTable from "@/components/club-teams/club-teams-table/club-teams-table";
import NewTeamModal from "@/components/club-teams/modals/new-team-modal/new-team-modal";
export default {
  name: "ClubTeamsList",
  components: { NewTeamModal, ClubTeamsTable, NPage },
  data() {
    return {
      renderComponent: true,
      newTeamModalVisible: false
    };
  },
  created() {
    this.set_team();
  },
  methods: {
    set_team() {
      this.$store.commit("SET_TEAM_ZERO");
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
    openNewTeamModal() {
      this.newTeamModalVisible = true;
    },
    closeNewTeamModal() {
      this.newTeamModalVisible = false;
      this.forceRerender();
    }
  }
};
</script>

<style scoped></style>
