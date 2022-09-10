<template>
  <n-page v-if="renderComponent">
    <a-row type="flex">
      <a-col :span="24" class="gx-text-right">
        <a-space
          ><a-button type="primary" size="small" @click="openAdminModal(null)">
            Create a new Coach
          </a-button>
          <a-button size="small" type="primary" @click="openCoachModal"
            >Find & Add Coach</a-button
          >
        </a-space>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="24">
        <a-card title="Coaches" class="gx-card-table-full">
          <club-admins-list-table @edit="openAdminModal" />
        </a-card>
      </a-col>
    </a-row>
    <club-admin-edit-modal
      :admin-id="currentAdmin"
      :visible="clubAdminModal"
      @close="closeAdminModal"
    />
    <find-coach-modal :visible="findCoachModal" @close="closeAdminModal" />
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import ClubAdminsListTable from "@/components/club-admins/club-admins-list-table";
import ClubAdminEditModal from "@/components/club-admins/club-admin-edit-modal";
import FindCoachModal from "@/components/club-admins/find-coach-modal";
export default {
  name: "ClubAdmins",
  components: {
    ClubAdminEditModal,
    ClubAdminsListTable,
    NPage,
    FindCoachModal
  },
  data() {
    return {
      currentAdmin: null,
      renderComponent: true,
      clubAdminModal: false,
      findCoachModal: false
    };
  },
  methods: {
    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;
      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
    openAdminModal(id) {
      this.currentAdmin = id;
      this.clubAdminModal = true;
    },
    openCoachModal() {
      this.findCoachModal = true;
    },
    closeAdminModal() {
      this.currentAdmin = null;
      this.clubAdminModal = false;
      this.findCoachModal = false;
      this.forceRerender();
    }
  }
};
</script>

<style scoped></style>
