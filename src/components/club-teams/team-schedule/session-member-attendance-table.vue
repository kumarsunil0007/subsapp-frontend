<template>
  <a-table :columns="columns" :data-source="getSessionMembers" :pagination="false">
    <div slot="startTimeRender" slot-scope="text">
      {{ text }}
    </div>
    <div slot="handlers" slot-scope="text, record" class="gx-text-right">
      <a-button
        v-if="record.schedule && record.schedule.id"
        class="gx-btn-success gx-mb-0"
        icon="check"
        @click="removeMemberAttendance(record)"
      >
        Present
      </a-button>
      <a-button
        v-else
        class="gx-btn-danger gx-mb-0"
        @click="createNewSchedule(record)"
      >
        Absent
      </a-button>
    </div>
  </a-table>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";

const columns = [
  {
    title: "Member",
    dataIndex: "member.preferred_name",
    key: "member.preferred_name",
    scopedSlots: {
      customRender: "startTimeRender"
    }
  },
  {
    dataIndex: "handlers",
    key: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  }
];

import { GET_SESSION_MEMBERS, REMOVE_MEMBER_ATTENDANCE, NEW_MEMBER_ATTENDANCE, GET_SESSION_INVOICES } from "@/store/modules/session/session-actions";
import { mapGetters } from 'vuex'

export default {
  name: "SessionMemberAttendanceTable",
  mixins: [nTime, nCurrency],
  props: {
    teamId: {
      required: true,
      type: Number
    },
    sessionId: {
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
  watch: {
    teamId: function() {
      this.getTeamSchedule();
    },
    sessionId: function() {
      this.getTeamSchedule();
    }
  },
  mounted() {
    this.getTeamSchedule();
  },
  methods: {
    removeMemberAttendance(row) {
      this.$store.dispatch(REMOVE_MEMBER_ATTENDANCE, {
        memberId: row.member.id,
        teamId: this.teamId,
        sessionId: this.sessionId
      });
      this.$store.dispatch(GET_SESSION_INVOICES, this.sessionId);
    },
    createNewSchedule(row) {
      this.$store.dispatch(NEW_MEMBER_ATTENDANCE, {
        memberId: row.member.id,
        teamId: this.teamId,
        sessionId: this.sessionId
      });
      this.$store.dispatch(GET_SESSION_INVOICES, this.sessionId);
    },
    getTeamSchedule() {
      if (this.teamId && this.sessionId)
        this.$store.dispatch(GET_SESSION_MEMBERS, {
          teamId: this.teamId,
          sessionId: this.sessionId
        });
    }
  },
  computed: {
    ...mapGetters([
      'getSessionMembers'
    ])
  }
};
</script>
