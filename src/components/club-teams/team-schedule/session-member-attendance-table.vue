<template>
  <a-table
    :columns="columns"
    :data-source="getSessionMembers"
    :pagination="false"
    class="gx-table-responsive"
  >
    <div slot="startTimeRender" slot-scope="text">
      {{ text }}
    </div>
    <div slot="handlers" slot-scope="text, record" class="gx-text-right">
      <div
        v-if="
          sessionData.is_recurring == 0 || sessionData.payment_recurring == 1
        "
      >
        <a-popconfirm
          v-if="record.schedule && record.schedule.id"
          placement="top"
          ok-text="Yes"
          cancel-text="No"
          @confirm="removeMemberAttendance(record)"
        >
          <template slot="title">
            <p>Please select the Refund type</p>
            <a-radio-group v-model="refundType" name="radioGroup">
              <a-radio value="partial">
                Partial
              </a-radio>
              <a-radio value="full">
                Full
              </a-radio>
            </a-radio-group>
            <a-input
              v-if="refundType !== 'full'"
              v-model="amount"
              step="0.01"
              placeholder="Enter value to be refund"
              type="number"
              class="gx-mt-3"
            />
          </template>
          <a-button
            class="gx-btn-danger gx-mb-0"
            icon="check"
            :loading="select_member === record.member.id && loader"
            :disabled="select_member === record.member.id && loader"
            >Mark Absent</a-button
          >
        </a-popconfirm>
        <a-popconfirm
          v-else
          placement="top"
          ok-text="Yes"
          cancel-text="No"
          @confirm="createNewSchedule(record)"
        >
          <template slot="title">
            <p>Are you sure to mark Present</p>
          </template>
          <a-button
            class="gx-btn-success gx-mb-0"
            :loading="select_member === record.member.id && loading"
            :disabled="select_member === record.member.id && loading"
            >Mark Present</a-button
          >
        </a-popconfirm>
      </div>
      <div v-else>

                  <a-popconfirm
          v-if="record.schedule && record.schedule.id"
          placement="top"
          ok-text="Yes"
          cancel-text="No"
          @confirm="removeMemberAttendance(record)"
        >
          <template slot="title">
            <p>Please select the Refund type</p>
            <a-radio-group v-model="refundType" name="radioGroup">
              <a-radio value="partial">
                Partial
              </a-radio>
              <a-radio value="full">
                Full
              </a-radio>
            </a-radio-group>
            <a-input
              v-if="refundType !== 'full'"
              v-model="amount"
              step="0.01"
              placeholder="Enter value to be refund"
              type="number"
              class="gx-mt-3"
            />
          </template>
          <a-button
            class="gx-btn-danger gx-mb-0"
            icon="check"
            :loading="select_member === record.member.id && loader"
            :disabled="select_member === record.member.id && loader"
            >Mark Absent</a-button
          >
        </a-popconfirm>
        <a-popconfirm
          v-else
          placement="top"
          ok-text="Yes"
          cancel-text="No"
          @confirm="createNewSchedule(record)"
        >
          <template slot="title">
            <p>Are you sure to mark Present</p>
          </template>
          <a-button
            class="gx-btn-success gx-mb-0"
            :loading="select_member === record.member.id && loading"
            :disabled="select_member === record.member.id && loading"
            >Mark Present</a-button
          >
        </a-popconfirm>

      </div>
    </div>
  </a-table>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import notifications from "@/common/notifications/notification.service";
import moment from "moment";
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

import {
  GET_SESSION_MEMBERS,
  REMOVE_MEMBER_ATTENDANCE,
  REFUND_AMOUNT,
  REMOVE_TEAM_MEMBER,
  NEW_MEMBER_ATTENDANCE,
  GET_SESSION_INVOICES
} from "@/store/modules/session/session-actions";
import { mapGetters } from "vuex";

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
    },
    sessionStart: {
      type: String,
      required: true
    },
    sessionData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columns,
      schedule: [],
      loading: false,
      loader: false,
      refundLoading: false,
      select_member: "",
      refundType: "partial",
      amount: 0
    };
  },
  watch: {
    teamId: function() {
      this.getTeamSchedule();
    },
    sessionId: function() {
      this.getTeamSchedule();
    },
    getErrorMsg(value) {
      if (value) {
        notifications.warn(value);
      }
    }
  },
  mounted() {
    this.getTeamSchedule();
  },
  methods: {
    async removeMemberAttendance(row) {
      if (moment(this.sessionStart).isBefore(moment())) {
        notifications.warn(
          "Your event has passed.You can't mark absent or present now."
        );
        return;
      }
      this.select_member = row.member.id;
      this.loader = true;
      await this.$store.dispatch(REMOVE_MEMBER_ATTENDANCE, {
        memberId: row.member.id,
        teamId: this.teamId,
        sessionId: this.sessionId,
        refundType: this.refundType,
        amount: parseFloat(this.amount).toFixed(2)
      });
      this.loader = false;
      this.$store.dispatch(GET_SESSION_INVOICES, this.sessionId);
      this.amount = 0;
      this.getTeamSchedule();
    },
    async createNewSchedule(row) {
      if (moment(this.sessionStart).isBefore(moment())) {
        notifications.warn(
          "Your event has passed.You can't mark absent or present now."
        );
        return;
      }
      this.select_member = row.member.id;
      this.loading = true;
      await this.$store.dispatch(NEW_MEMBER_ATTENDANCE, {
        memberId: row.member.id,
        teamId: this.teamId,
        sessionId: this.sessionId
      });
      this.loading = false;
      this.$store.dispatch(GET_SESSION_INVOICES, this.sessionId);
      // this.getTeamSchedule();
    },
    getTeamSchedule() {
      if (this.teamId && this.sessionId)
        this.$store.dispatch(GET_SESSION_MEMBERS, {
          teamId: this.teamId,
          sessionId: this.sessionId
        });
    },
    async refundAmount(row) {
      if (moment(this.sessionStart).isBefore(moment())) {
        notifications.warn(
          "Your event has passed.You can't mark absent or present now."
        );
        return;
      }
      this.select_member = row.member.id;
      this.refundLoading = true;
      await this.$store.dispatch(REFUND_AMOUNT, {
        memberId: row.member.id,
        teamId: this.teamId,
        sessionId: this.sessionId,
        refundType: this.refundType,
        amount: parseFloat(this.amount).toFixed(2)
      });
      this.refundLoading = false;
      this.$store.dispatch(GET_SESSION_INVOICES, this.sessionId);
      this.amount = 0;
      this.getTeamSchedule();
    },
    async removeTeamMember(row) {
      if (moment(this.sessionStart).isBefore(moment())) {
        notifications.warn(
          "Your event has passed.You can't mark absent or present now."
        );
        return;
      }
      this.select_member = row.member.id;
      this.loader = true;
      await this.$store.dispatch(REMOVE_TEAM_MEMBER, {
        memberId: row.member.id,
        teamId: this.teamId,
        sessionId: this.sessionId,
        refundType: this.refundType,
        amount: parseFloat(this.amount).toFixed(2)
      });
      this.loader = false;
      this.$store.dispatch(GET_SESSION_INVOICES, this.sessionId);
      this.getTeamSchedule();
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(["getSessionMembers", "getErrorMsg"])
  }
};
</script>
