<template>
  <n-page v-if="renderComponent">
    <a-row type="flex">
      <a-col :span="24" class="gx-text-right"> </a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="24">
        <a-card title="Clubs" class="gx-card-table-full">
          <ClubTable />
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>
<script>
import NPage from "@/components/ui/n-page/n-page";
import ClubTable from "@/components/club/club-table";
export default {
  name: "ClubsList",
  components: { ClubTable, NPage },
  data() {
    return {
      renderComponent: true,
      newTeamModalVisible: false,
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
    }
  },
};
</script>
<style scoped></style>
