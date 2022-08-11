<template>
  <div>
    <a-table
      class="gx-table-responsive"
      :columns="columns"
      :pagination="pagination"
      :row-key="record => record.id"
      :data-source="schedule"
      @change="handleTableChange"
    >
      <div slot="work_email" slot-scope="text" class="email-block">
        <template
          >{{ text }}
          <a-icon
            type="copy"
            theme="twoTone"
            class="gx-ml-1"
            style="cursor: pointer"
            @click="copyEmail(text)"
        /></template>
      </div>
      <div slot="phone" slot-scope="text">
        <template v-if="text">+353 {{ text }}</template>
        <template v-else>N/A</template>
      </div>
      <div slot="status" slot-scope="text" class="status_data">
        <a-tag
          v-if="text === 'accept'"
          color="#27ae60"
          style="margin-bottom:0px;"
          >Active</a-tag
        >
        <a-tag
          v-if="text === 'invite'"
          color="#f39c12"
          style="margin-bottom:0px;"
          >Invite Pending</a-tag
        >
        <a-tag
          v-if="text === 'request'"
          color="#8e44ad"
          style="margin-bottom:0px;"
          >Has Requested to Join</a-tag
        >
        <a-tag
          v-if="text === 'cancel'"
          color="#8e44ad"
          style="margin-bottom:0px;"
          >No Longer a Member</a-tag
        >
        <a-tag
          v-if="text === 'archive'"
          color="#d35400"
          style="margin-bottom:0px;"
          >Archived</a-tag
        >
        <a-tag
          v-if="text === 'decline'"
          color="#c0392b"
          style="margin-bottom:0px;"
          >Declined Invitation</a-tag
        >
      </div>
      <div
        slot="handlers"
        slot-scope="text, record"
        type="flex"
        class="gx-text-right"
        style="display:flex;"
      >
        <router-link :to="'/club/member/' + record.user_id">
          <a-button
            size="small"
            type="primary"
            style="margin-right: 5px;margin-bottom:0px;"
            >View Profile</a-button
          >
        </router-link>
        <a-button
          v-if="record.status === 'accept'"
          size="small"
          style="color: #f5222d; background-color: #f5f5f5; border-color: #d9d9d9;margin-right: 5px;margin-bottom:0px;"
          type="danger"
          @click="updateClubMember(record.id, 'archive')"
          >Archive</a-button
        >
        <a-button
          v-if="record.status === 'accept'"
          size="small"
          style="color: #f5222d; background-color: #f5f5f5; border-color: #d9d9d9;margin-bottom:0px;"
          type="danger"
          @click="(searchTeamModal = true), (selectMemberId = record.id)"
          >Add to Team</a-button
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
          style="margin-bottom:0px;"
          @click="updateClubMember(record.id, 'accept')"
          >Accept Request</a-button
        >
        <a-button
          v-if="record.status === 'cancel'"
          size="small"
          type="primary"
          style="margin-bottom:0px;"
          @click="updateClubMember(record.id, 'invite')"
          >Send Invite</a-button
        >
        <a-button
          v-if="record.status === 'invite'"
          size="small"
          class="gx-btn-red gx-fs-sm"
          style="margin-bottom:0px;"
          @click="updateClubMember(record.id, 'cancel')"
          >Cancel Invite</a-button
        >
      </div>
    </a-table>
    <search-team-modal
      :search-team-modal="searchTeamModal"
      :select-member-id="selectMemberId"
      @close="searchTeamModal = false"
    />
  </div>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import { mapGetters } from "vuex";
import SearchTeamModal from "./search-team-modal.vue";
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
    scopedSlots: {
      customRender: "work_email"
    },
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
  components: {
    SearchTeamModal
  },
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
      schedule: [],
      pagination: {
        current: 1,
        pageSize: 10
      },
      searchTeamModal: false,
      selectMemberId: ""
    };
  },
  computed: {
    ...mapGetters(["AUTH_USER"])
  },
  watch: {
    filters: {
      handler: function() {
        this.fetch({
          results: this.pagination.pageSize,
          page: 1
        });
      },
      deep: true
    }
  },
  mounted() {
    //  this.getClubMembers();
    this.fetch({
      results: this.pagination.pageSize,
      page: this.pagination.current
    });
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      });
    },
    fetch(params = {}) {
      this.loading = true;
      params.role = this.AUTH_USER.select_role;
      if (this.filters) {
        if (this.filters.keyword) {
          params.keyword = this.filters.keyword;
        }
        if (this.filters.type) {
          params.type = this.filters.type;
        }
      }
      memberService
        .query({
          ...params
        })
        .then(resp => {
          if (resp.data.success) {
            const pagination = { ...this.pagination };
            pagination.total = resp.data.totalCount;
            this.loading = false;
            this.pagination = pagination;
            this.schedule = resp.data.result;
          }
        });
    },
    updateClubMember(memberId, status) {
      memberService
        .updateClubMember(memberId, {
          status: status,
          role: this.AUTH_USER.select_role,
          url: window.location.origin
        })
        .then(resp => {
          if (resp.data.success) {
            this.fetch({
              results: this.pagination.pageSize,
              page: this.pagination.current
            });
          } else {
            notifications.warn(resp.data.message);
          }
        });
    },
    copyEmail(email) {
      navigator.clipboard.writeText(email).then(() => {
        notifications.success("Email Copied");
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
<style scoped>
.email-block {
  display: flex;
}
</style>
