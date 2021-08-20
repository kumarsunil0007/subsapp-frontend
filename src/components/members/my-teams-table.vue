<template>
  <a-table :columns="columns"  class="gx-table-responsive" :data-source="schedule">
    <div slot="status" slot-scope="text">
      <a-tag v-if="text === 'accept'" color="#27ae60">Active</a-tag>
      <a-tag v-if="text === 'invite'" color="#f39c12">Invite Pending</a-tag>
      <a-tag v-if="text === 'request'" color="#d35400" 
        >Pending Club Acceptance</a-tag
      >
      <a-tag v-if="text === 'archive'" color="#d35400"
        >No Longer a Member</a-tag
      >
      <a-tag v-if="text === 'decline'" color="#c0392b"
        >Declined Invitation</a-tag
      >
      <a-tag v-if="text === 'cancel'" color="#c0392b">Cancelled Request</a-tag>
    </div>
    <div slot="handlers" slot-scope="text, record" class="gx-text-right">
      <a-button
        v-if="record.status === 'request'"
        size="small"
        type="danger"
        style="margin-bottom:0; margin-left:5px;"
        @click="userTableList(record.team_id, 'archive')"
      >
        Cancel Join Request
      </a-button>
      <a-button
        v-if="record.status === 'accept'"
        size="small"
        type="danger"
        style="margin-bottom:0; margin-left:5px;"
        @click="teamSchedule(record.team_id)"
      >
        View
      </a-button>
      <a-button
        v-if="record.status === 'invite'"
        size="small"
        type="danger"
        class="gx-btn-cyan"
        style="margin-bottom:0; margin-left:5px;"
        @click="userTableList(record.team_id, 'accept')"
      >
        Accept Invite
      </a-button>
      <a-button
        v-if="record.status === 'invite'"
        size="small"
        class="gx-btn-red"
        style="margin-bottom:0; margin-left:5px;"
        @click="userTableList(record.team_id, 'decline')"
      >
        Decline Invite
      </a-button>
    </div>
  </a-table>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";
// import notifications from "@/common/notifications/notification.service";
import { memberService, clubService } from "@/common/api/api.service";
const columns = [
  {
    title: "Team",
    dataIndex: "one_team.team_name",
    key: "one_team.team_name"
  },
  {
    title: "Club",
    dataIndex: "one_team.club.club_name",
    key: "one_team.club.club_name"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    scopedSlots: {
      customRender: "status"
    }
  },
  {
    title: "Action",
    dataIndex: "handlers",
    key: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  }
];

export default {
  name: "MyClubsTable",
  mixins: [nTime, nCurrency],
  props: {
    memberId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      columns,
      schedule: []
    };
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    userTableList(teamId, status) {
      memberService
        .TeamTablelist(teamId, {
          status: status,
          teamId: teamId
        })
        .then(resp => {
          if (resp.data.success) {
            this.getTeams();
          }
        });
    },
    getTeams() {
      memberService.memberTeams().then(resp => {
        if (resp.data.success) {
          this.schedule = resp.data.result;
        }
      });
    },
    teamSchedule(id) {
      this.$router.push(`team/schedules/${id}`);
    }
  }
};
</script>
