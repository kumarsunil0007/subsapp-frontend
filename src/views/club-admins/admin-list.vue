<template>
  <n-page v-if="renderComponent">
    <a-row type="flex">
      <a-col :span="24" class="gx-text-right">
        <a-button type="primary" @click="openAdminModal(null)">
          Create a new Coach
        </a-button>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="24">
        <a-card title="Teams" class="gx-card-table-full">
          <club-admins-list-table @edit="openAdminModal" />
        </a-card>
      </a-col>
    </a-row>
    <club-admin-edit-modal
      :admin-id="currentAdmin"
      :visible="clubAdminModal"
      @close="closeAdminModal"
    />
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import ClubAdminsListTable from "@/components/club-admins/club-admins-list-table";
import ClubAdminEditModal from "@/components/club-admins/club-admin-edit-modal";
export default {
  name: "ClubAdmins",
  components: { ClubAdminEditModal, ClubAdminsListTable, NPage },
  data() {
    return {
      currentAdmin: null,
      renderComponent: true,
      clubAdminModal: false
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
    closeAdminModal() {
      this.currentAdmin = null;
      this.clubAdminModal = false;
      this.forceRerender();
    }
  }
};
</script>

<style scoped></style>
