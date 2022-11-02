<template>
  <n-page>
    <a-row type="flex">
      <a-col :xs="24" :sm="24" :md="14" :lg="16">
        <a-row type="flex" :gutter="10">
          <a-col :xs="24" :sm="24" :md="8" :lg="6">
            <a-input
              v-model="filters.keyword"
              style="width:100%;margin-bottom: 12px"
              placeholder="Keyword Search"
            ></a-input>
          </a-col>
          <a-col :xs="24" :sm="24" :md="8" :lg="6">
            <a-select
              v-model="filters.type"
              style="min-width: 100%;margin-bottom: 10px;"
            >
              <a-select-option value="all">All Members</a-select-option>
              <a-select-option value="accepted">Active Members</a-select-option>
              <a-select-option value="requested"
                >Requested To Join</a-select-option
              >
              <a-select-option value="invited"
                >Pending Invitation Acceptance</a-select-option
              >
              <a-select-option value="archived"
                >Archived Members</a-select-option
              >
              <a-select-option value="declined"
                >Declined Invitations</a-select-option
              >
            </a-select>
          </a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :sm="24" :md="10" :lg="8" class="gx-text-right">
        <a-button
          size="small"
          type="primary"
          class="gx-sm-full"
          style="margin-bottom: 12px;background-color: rgb(39, 174, 96) !important;  height:35px; border-color:rgb(39, 174, 96) !important;"
          @click="addMemberModal"
          >Add Club Admin</a-button
        >
      </a-col>
      <a-col :span="24">
        <a-card class="gx-card-table-full gx-table-responsive">
          <UserTablelist :filters="filters" />
        </a-card>
      </a-col>
    </a-row>
    <invite-member-modal
      :visible="inviteMemberVisible"
      @close="closeMemberModal"
    ></invite-member-modal>
    <add-club-modal
      :visible="addMemberVisible"
      @close="closeMemberModal"
    ></add-club-modal>
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import UserTablelist from "@/components/admin/user/user-table-list";
import InviteMemberModal from "@/components/club-member/invite-member-modal/invite-member-modal";
import AddClubModal from "@/components/club-member/add-club-modal/add-club-modal";

export default {
  name: "Userlist",
  components: {
    InviteMemberModal,
    AddClubModal,
    UserTablelist,
    NPage
  },
  data() {
    return {
      members: [],
      inviteMemberVisible: false,
      addMemberVisible: false,
      filters: {
        keyword: ""
      }
    };
  },
  methods: {
    fetchMembers() {},
    openMemberModal() {
      this.inviteMemberVisible = true;
    },
    addMemberModal() {
      this.addMemberVisible = true;
    },

    closeMemberModal() {
      if (this.inviteMemberVisible) {
        this.inviteMemberVisible = false;
      }
      if (this.addMemberVisible) {
        this.addMemberVisible = false;
      }
    }
  }
};
</script>
