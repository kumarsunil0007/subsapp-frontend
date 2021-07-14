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
      <a-tag
        v-if="text === 'accepted'"
        color="#27ae60"
        style="width: 135px; line-height: 33px;
    height: 33px; text-align: center;"
        >Active</a-tag
      >
      <a-tag
        v-if="text === 'invited'"
        color="#f39c12"
        style="width: 135px; line-height: 33px;
    height: 33px; text-align: center;"
        >Invite Pending</a-tag
      >
      <a-tag
        v-if="text === 'requested'"
        color="#8e44ad"
        style="width: 135px; line-height: 33px;
    height: 33px; text-align: center;"
        >Has Requested to Join</a-tag
      >
      <a-tag v-if="text === 'archived'" color="#d35400">Archived</a-tag>
      <a-tag v-if="text === 'declined'" color="#c0392b"
        >Declined Invitation</a-tag
      >
    </div>
    <div slot="handlers" slot-scope="text, record" class="gx-text-right">
      <router-link :to="'/club/member/' + record.user_id">
        <a-button
          size="small"
          style="margin-bottom:0  ;   height: 32px;
    font-size: 20px;"
          type="primary"
          ><a-icon type="user"
        /></a-button>
      </router-link>
      <router-link :to="''">
        <a-button
          size="small"
          class="gx-btn-red"
          style="margin-bottom:0  ;   height: 32px;
    font-size: 20px;margin-left:5px;"
          type="danger"
          ><a-icon type="delete"
        /></a-button>
      </router-link>
      <a-button
        v-if="record.status === 'accepted'"
        size="small"
        type="danger"
        style="margin-bottom:0  ;   height: 32px;
    font-size: 20px; margin-left:5px;"
        @click="userTableList(record.id, 'archived')"
        ><a-icon type="download"
      /></a-button>
      <a-button
        v-if="
          record.status !== 'accepted' &&
            record.status !== 'invited' &&
            record.status !== 'declined' &&
            record.status !== 'requested'
        "
        size="small"
        class="gx-btn-cyan"
        style="margin-bottom:0  ;   height: 32px;
    font-size: 20px; margin-left:5px;"
        @click="userTableList(record.id, 'accepted')"
        >Make Active</a-button
      >
      <a-button
        v-if="record.status === 'requested'"
        size="small"
        class="gx-btn-cyan"
        style="margin-bottom:0  ;   height: 32px;
    font-size: 20px; margin-left:5px;"
        @click="userTableList(record.id, 'accepted')"
        ><a-icon type="check"
      /></a-button>
      <a-button
        v-if="record.status === 'invited'"
        size="small"
        class="gx-btn-red"
        style="margin-bottom:0  ;   height: 32px;
    font-size: 20px; margin-left:5px;"
        @click="userTableList(record.id, 'cancelled')"
        ><a-icon type="close"
      /></a-button>
    </div>
  </a-table>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";

const columns = [
  {
    title: "Club Name",
    dataIndex: "club_name",
    key: "club_name",
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
    dataIndex: "email",
    key: "email",
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
    dataIndex: "contact_number",
    key: "contact_number",
    scopedSlots: {
      customRender: "phone"
    }
  },
  {
    title: "Club Admin",
    dataIndex: "club_admin",
    key: "club_admin"
  }
  // {
  //   dataIndex: "handlers",
  //   key: "handlers",
  //   scopedSlots: {
  //     customRender: "handlers"
  //   }
  // }
];

import { memberService } from "@/common/api/api.service";
import { adminService } from "@/common/api/api.service";

export default {
  name: "ClubMemberTable",
  mixins: [nTime, nCurrency],
  props: {
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
    userTableList(memberId, status) {
      memberService
        .userTableList(memberId, {
          status: status,
          clubId: this.clubId
        })
        .then(resp => {
          if (resp.data.success) {
            this.getClubMembers();
          }
        });
    },
    getClubMembers() {
      const data = {};

      if (this.filters) {
        if (this.filters.keyword) {
          data.keyword = this.filters.keyword;
        }
        if (this.filters.type) {
          data.type = this.filters.type;
        }
      }

      // memberService.query(data).then(resp => {
      //   if (resp.data.success) {
      //     this.schedule = resp.data.result;
      //   }
      // });
      adminService.query(data).then(resp => {
        if (resp.data.success) {
          this.schedule = resp.data.result;
        }
      });
    }
  }
};
</script>
