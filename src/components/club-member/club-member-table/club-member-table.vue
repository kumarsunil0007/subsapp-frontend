<template>
  <a-table :columns="columns" :data-source="schedule">
    <div slot="startTimeRender" slot-scope="text">{{ nTime(text) }}</div>
    <div slot="sessionLength" slot-scope="text">
      {{ floatToHour(text) }} Hours
    </div>
    <div slot="dob" slot-scope="text">{{ nFormat(text) }}</div>
    <div slot="created_at" slot-scope="text">{{ nFormat(text) }}</div>
    <div slot="phone" slot-scope="text">
      <template v-if="text">+353 {{ text }}</template>
      <template v-else>N/A</template>
    </div>
    <div slot="status" slot-scope="text" class="status_data">
      <a-tag v-if="text === 'accept'" color="#27ae60">Active</a-tag>
      <a-tag v-if="text === 'invite'" color="#f39c12">Invite Pending</a-tag>
      <a-tag v-if="text === 'request'" color="#8e44ad"
        >Has Requested to Join</a-tag
      >
      <a-tag v-if="text === 'cancel'" color="#8e44ad">Cancel</a-tag>
      <a-tag v-if="text === 'archive'" color="#d35400">Archived</a-tag>
      <a-tag v-if="text === 'decline'" color="#c0392b"
        >Declined Invitation</a-tag
      >
    </div>
    <div slot="handlers" slot-scope="text, record" class="gx-text-right">
      <router-link :to="'/club/member/' + record.user_id">
        <a-button size="small" type="primary" style="margin-right: 5px"
          >View Profile</a-button
        >
      </router-link>
      <a-button
        v-if="record.status === 'accept'"
        size="small"
        style="color: #f5222d; background-color: #f5f5f5; border-color: #d9d9d9;"
        type="danger"
        @click="updateClubMember(record.id, 'archive')"
        >Archive</a-button
      >
      <a-button
        v-if="
          record.status !== 'accept' &&
            record.status !== 'invite' &&
            record.status !== 'decline' &&
            record.status !== 'request' &&
            record.status !== 'cancel'
        "
        size="small"
        class="gx-btn-cyan"
        @click="updateClubMember(record.id, 'accept')"
        >Make Active</a-button
      >
      <a-button
        v-if="record.status === 'request'"
        size="small"
        class="gx-btn-cyan"
        @click="updateClubMember(record.id, 'accept')"
        >Accept Request</a-button
      >
      <a-button
        v-if="record.status === 'cancel'"
        size="small"
        type="primary"
        @click="updateClubMember(record.id, 'invite')"
        >Send Invite</a-button
      >
      <a-button
        v-if="record.status === 'invite'"
        size="small"
        class="gx-btn-red"
        @click="updateClubMember(record.id, 'cancel')"
        >Cancel Invite</a-button
      >
    </div>
  </a-table>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import { mapGetters } from "vuex";
const columns = [
  {
    title: "Full Name",
    dataIndex: "preferred_name",
    key: "preferred_name",
    sorter: (a, b) => {
      if (a.preferred_name < b.preferred_name) {
        return -1;
      }
      if (a.preferred_name > b.preferred_name) {
        return 1;
      }
      return 0;
    }
  },
  {
    title: "Email",
    dataIndex: "work_email",
    key: "work_email",
    sorter: (a, b) => {
      if (a.work_email < b.work_email) {
        return -1;
      }
      if (a.work_email > b.work_email) {
        return 1;
      }
      return 0;
    }
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    scopedSlots: {
      customRender: "phone"
    }
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
    key: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  }
];

import { memberService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";

export default {
  name: "ClubMemberTable",
  mixins: [nTime, nCurrency],
  props: {
    clubId: {
      default: null,
      type: [Number, String]
    },
    filters: {
      required: false,
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      columns,
      schedule: []
    };
  },
  computed: {
    ...mapGetters(["AUTH_USER"])
  },
  watch: {
    filters: {
      handler: function() {
        this.getClubMembers();
      },
      deep: true
    }
  },
  mounted() {
    this.getClubMembers();
  },
  methods: {
    updateClubMember(memberId, status) {
      memberService
        .updateClubMember(memberId, {
          status: status,
          role: this.AUTH_USER.select_role
        })
        .then(resp => {
          if (resp.data.success) {
            this.getClubMembers();
          } else {
            notifications.warn(resp.data.message);
          }
        });
    },
    getClubMembers() {
      let data = {
        role: this.AUTH_USER.select_role
      };
      if (this.filters) {
        if (this.filters.keyword) {
          data.keyword = this.filters.keyword;
        }
        if (this.filters.type) {
          data.type = this.filters.type;
        }
      }

      memberService.query(data).then(resp => {
        if (resp.data.success) {
          this.schedule = resp.data.result;
        }
      });
    }
  }
};
</script>
