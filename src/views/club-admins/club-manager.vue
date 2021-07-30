<template>
  <n-page v-if="renderComponent">
    <a-row type="flex">
      <a-col :span="24" class="gx-text-right">
        <a-button type="primary" @click="openAdminModal(null)">
          Create a new Manager
        </a-button>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="24">
        <a-card title="Teams" class="gx-card-table-full">
          <club-manager-list-table @edit="openAdminModal" />
        </a-card>
      </a-col>
    </a-row>
    <club-manager-edit-modal
      :admin-id="currentAdmin"
      :visible="clubAdminModal"
      @close="closeAdminModal"
    />
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import ClubManagerListTable from "@/components/club-admins/club-manager-list-table";
import ClubManagerEditModal from "@/components/club-admins/club-manager-edit-modal";
export default {
  name: "ClubAdmins",
  components: { ClubManagerEditModal, NPage , ClubManagerListTable},
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
