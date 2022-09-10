<template>
  <n-page>
    <a-row type="flex">
      <a-col :xs="24" :sm="24" :md="14" :lg="16">
        <a-row type="flex" :gutter="10">
          <!-- <a-col :xs="24" :sm="24" :md="8" :lg="6">
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
          </a-col> -->
        </a-row>
      </a-col>
      <!-- <a-col :xs="24" :sm="24" :md="10" :lg="8" class="gx-text-right">
        <a-button
          size="small"
          type="primary"
          class="gx-sm-full"
          style="margin-bottom: 12px; margin-right:0px; background-color: rgb(39, 174, 96) !important;border-color:rgb(39, 174, 96) !important;"
          @click="addMemberModal"
          >Add Member</a-button
        >
        <a-button
          size="small"
          type="primary"
          class="gx-sm-full"
          style="margin-bottom: 12px; margin-left:5px"
          @click="openMemberModal"
          >Find & Invite Members</a-button
        >
      </a-col> -->
      <a-col :span="24">
        <a-card title="Members" class="gx-card-table-full gx-table-responsive">
          <ClubMemberTableAdmin
            ref="club_member_Listing"
            :filters="filters"
          ></ClubMemberTableAdmin>
        </a-card>
      </a-col>
    </a-row>
    <!-- <invite-member-modal
      :visible="inviteMemberVisible"
      @close="closeMemberModal"
    ></invite-member-modal> -->
    <!-- <add-member-modal
      :visible="addMemberVisible"
      @close="closeMemberModal"
    ></add-member-modal> -->
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import ClubMemberTableAdmin from "@/components/club-member/club-member-table/club-member-table-admin";

export default {
  name: "ClubMemberTableAdmin",
  components: {
    ClubMemberTableAdmin,
    NPage
  },
  data() {
    return {
      members: [],
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
    }
  }
};
</script>
