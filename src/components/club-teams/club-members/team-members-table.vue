<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="members"
    :loading="dataLoading"
  >
    <div slot="status" slot-scope="text">
      <a-tag v-if="text === 'accept'" color="#27ae60">Active</a-tag>
      <a-tag v-if="text === 'invite'" color="#f39c12">Invite Pending</a-tag>
      <a-tag v-if="text === 'decline'" color="#c0392b">Decline Invite</a-tag>
    </div>
    <div slot="handlers" slot-scope="text, record">
      <router-link :to="'/club/member/' + record.id">
        <a-button block size="small" style="margin-bottom:0;" type="primary">
          View Profile
        </a-button>
      </router-link>
    </div>
  </a-table>
</template>

<script>
import { memberService } from "@/common/api/api.service";

const columns = [
  {
    title: "Full Name",
    dataIndex: "preferred_name",
    key: "user_id"
  },
  {
    title: "Email",
    dataIndex: "work_email"
  },
  {
    title: "Status",
    dataIndex: "pivot.status",
    scopedSlots: {
      customRender: "status"
    }
  },
  {
    dataIndex: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  }
];

export default {
  name: "TeamMembersTable",
  props: {
    teamId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      columns,
      dataLoading: true,
      members: []
    };
  },
  mounted() {
    this.getMembers();
  },
  methods: {
    getMembers() {
      this.dataLoading = true;
      memberService
        .query({
          teamId: this.teamId
        })
        .then(resp => {
          this.dataLoading = false;
          if (resp.data.success) {
            this.members = resp.data.result;
          }
        });
    }
  }
};
</script>

<style scoped></style>
