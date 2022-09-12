<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="members"
    :loading="dataLoading"
  >
    <div slot="status" slot-scope="text">
      <a-tag
        v-if="text === 'accept'"
        color="#27ae60"
        class="gx-mb-0"
        style="border-radius: 30px;"
        >Active
      </a-tag>
      <a-tag
        v-if="text === 'invite'"
        color="#f39c12"
        class="gx-mb-0"
        style="border-radius: 30px;"
        >Invite Pending</a-tag
      >
      <a-tag
        v-if="text === 'decline'"
        color="#c0392b"
        class="gx-mb-0"
        style="border-radius: 30px;"
        >Decline Invite</a-tag
      >
    </div>
    <div slot="handlers" slot-scope="text, record">
      <a-button
        v-if="record.pivot.status === 'invite'"
        size="small"
        style="margin-bottom:5px;"
        type="danger"
        :loading="loader && selectedId === record.pivot.member_id"
        @click="updateTeamMember(record, 'archive')"
      >
        Cancel Invite
      </a-button>
      <a-button
        v-if="record.pivot.status === 'accept'"
        size="small"
        style="margin-bottom:5px;"
        type="danger"
        :loading="loader && selectedId === record.pivot.member_id"
        @click="updateTeamMember(record, 'archive')"
      >
        Remove
      </a-button>
      <router-link :to="'/club/member/' + record.id">
        <a-button size="small" style="margin-bottom:5px;" type="primary">
          View Profile
        </a-button>
      </router-link>
    </div>
  </a-table>
</template>

<script>
import { memberService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";
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
      members: [],
      selectedId: "",
      loader: false
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
    },
    updateTeamMember({ pivot }, action) {
      this.selectedId = pivot.member_id;
      this.loader = true;
      memberService
        .updateTeamMember({
          memberId: pivot.member_id,
          teamId: pivot.team_id,
          action: action,
          url: window.location.origin + "/#/login"
        })
        .then(resp => {
          this.loader = false;
          if (resp.data.success) {
            this.getMembers();
            notifications.success("Member updated successfully");
          } else {
            notifications.warn("We could not add this member");
          }
        })
        .catch(() => {
          this.loader = false;
        });
    }
  }
};
</script>

<style scoped></style>
