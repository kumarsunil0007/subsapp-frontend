<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="schedule"
  >
    <div slot="startTimeRender" slot-scope="text">
      {{ nTime(text) }}
    </div>
    <div slot="sessionLength" slot-scope="text">
      {{ floatToHour(text) }} Hours
    </div>
    <div slot="dob" slot-scope="text">
      {{ nFormat(text) }}
    </div>
    <div slot="created_at" slot-scope="text">
      {{ nFormat(text) }}
    </div>
    <div slot="phone" slot-scope="text">
      <template v-if="text">+353 {{ text }}</template>
      <template v-else>N/A</template>
    </div>
    <div slot="status" slot-scope="text">
      <a-tag
        v-if="text === 'accept'"
        color="#27ae60"
        class="gx-mb-0"
        style="border-radius: 30px;"
        >Active</a-tag
      >
      <a-tag
        v-if="text === 'invite'"
        color="#f39c12"
        class="gx-mb-0"
        style="border-radius: 30px;"
        >Invite Pending</a-tag
      >
      <a-tag
        v-if="text === 'request'"
        color="#d35400"
        class="gx-mb-0"
        style="border-radius: 30px;"
        >Pending Club Acceptance</a-tag
      >
      <a-tag
        v-if="text === 'archive' || text === 'cancel'"
        color="#d35400"
        class="gx-mb-0"
        style="border-radius: 30px;"
        >No Longer a Member</a-tag
      >
      <a-tag
        v-if="text === 'decline'"
        color="#c0392b"
        class="gx-mb-0"
        style="border-radius: 30px;"
        >Declined Invitation</a-tag
      >
    </div>
    <div slot="handlers" slot-scope="text, record" class="gx-text-left">
      <a-button
        v-if="record.status === 'request'"
        size="small"
        type="danger"
        style="margin-bottom:0; margin-left:5px;"
        @click="userTableList(record.id, record.id, 'cancel', record.cmId)"
      >
        Cancel Join Request
      </a-button>
      <a-button
        v-if="record.status === 'accept'"
        size="small"
        type="danger"
        style="margin-bottom:0; margin-left:5px;"
        @click="userTableList(record.id, record.id, 'archive', record.cmId)"
      >
        Leave Club
      </a-button>
      <a-button
        v-if="record.status === 'invite'"
        size="small"
        type="danger"
        class="gx-btn-cyan"
        style="margin-bottom:0; margin-left:5px;"
        @click="userTableList(record.id, record.id, 'accept', record.cmId)"
      >
        Accept Invite
      </a-button>
      <a-button
        v-if="record.status === 'invite'"
        size="small"
        class="gx-btn-red"
        style="margin-bottom:0; margin-left:5px;"
        @click="userTableList(record.id, record.id, 'decline', record.cmId)"
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
    title: "Club",
    dataIndex: "club_name",
    key: "club_name",
    sorter: (a, b) => {
      if (a.club_name < b.club_name) {
        return -1;
      }
      if (a.club_name > b.club_name) {
        return 1;
      }
      return 0;
    }
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "club_email"
  },
  {
    title: "Phone",
    dataIndex: "contact_number",
    key: "club_phone"
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
    dataIndex: "handlers",
    title: "Actions",
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
    this.getTeamSchedule();
  },
  methods: {
    userTableList(memberId, inviteId, status, cmID) {
      memberService
        .ClubTablelist(memberId, {
          status: status,
          inviteId: inviteId,
          cmID: cmID
        })
        .then(resp => {
          if (resp.data.success) {
            this.getTeamSchedule();
          }
        });
    },
    getTeamSchedule() {
      if (this.memberId)
        clubService
          .clubQuery({
            status: "all",
            memberId: this.memberId
          })
          .then(resp => {
            if (resp.data.success) {
              this.schedule = resp.data.result;
            }
          });
    }
  }
};
</script>
