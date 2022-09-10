<template>
  <n-page>
    <a-row type="flex">
      <a-col :xs="24" :sm="24" :md="14" :lg="16">
        <a-row type="flex" :gutter="10">
          <a-col :xs="24" :sm="24" :md="8" :lg="6">
            <a-input
              v-model="filters.keyword"
              style="width:100%;margin-bottom:10px"
              placeholder="Keyword Search"
            ></a-input>
          </a-col>
          <a-col :xs="24" :sm="24" :md="8" :lg="6">
            <a-select
              v-model="filters.type"
              style="min-width: 100%;margin-bottom: 10px;"
            >
              <a-select-option value="all">All Members</a-select-option>
              <a-select-option value="accept">Active Members</a-select-option>
              <a-select-option value="request"
                >Requested To Join</a-select-option
              >
              <a-select-option value="invite"
                >Pending Invitation Acceptance</a-select-option
              >
              <a-select-option value="archive"
                >Archived Members</a-select-option
              >
              <a-select-option value="decline"
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
          style="margin-bottom: 12px; background-color: rgb(39, 174, 96) !important;border-color:rgb(39, 174, 96) !important;"
          @click="addMemberModal"
          >Add Member</a-button
        >
        <a-button
          size="small"
          type="primary"
          style="margin-bottom: 12px;"
          @click="openMemberModal"
          >Search & Invite Members</a-button
        >
      </a-col>
      <a-col :span="24">
        <a-card class="gx-card-table-full gx-table-responsive">
          <club-member-table
            ref="club_member_Listing"
            :filters="filters"
          ></club-member-table>
        </a-card>
      </a-col>
    </a-row>
    <invite-member-modal
      :visible="inviteMemberVisible"
      @close="closeMemberModal"
    ></invite-member-modal>
    <add-member-modal
      :visible="addMemberVisible"
      @close="closeMemberModal"
    ></add-member-modal>
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import ClubMemberTable from "@/components/club-member/club-member-table/club-member-table";
import InviteMemberModal from "@/components/club-member/invite-member-modal/invite-member-modal";
import AddMemberModal from "@/components/club-member/add-member-modal/add-member-modal";

export default {
  name: "ClubMembersOverview",
  components: {
    InviteMemberModal,
    AddMemberModal,
    ClubMemberTable,
    NPage
  },
  data() {
    return {
      members: [],
      inviteMemberVisible: false,
      addMemberVisible: false,
      filters: {
        keyword: "",
        type: "all"
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
        this.$refs.club_member_Listing.getClubMembers();
        this.inviteMemberVisible = false;
      }
      if (this.addMemberVisible) {
        this.$refs.club_member_Listing.getClubMembers();
        this.addMemberVisible = false;
      }
    }
  }
};
</script>
