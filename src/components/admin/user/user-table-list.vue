<template>
  <a-table
    :columns="columns"
    :data-source="schedule"
    :row-key="record => record.id"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <div slot="startTimeRender" slot-scope="text">{{ nTime(text) }}</div>
    <div slot="sessionLength" slot-scope="text">
      {{ floatToHour(text) }} Hours
    </div>

    <div slot="created_at" slot-scope="text">{{ nFormat(text) }}</div>
    <div slot="phone" slot-scope="text">
      <template v-if="text">+353 {{ text }}</template>
      <template v-else>N/A</template>
    </div>
    <div slot="handlers" slot-scope="text, record" class="gx-text-right">
      <a-button size="small" type="primary" @click="viewClub(record)"
        >View</a-button
      >
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
      schedule: [],
      pagination: { pageSize: 10 },
      loading: false
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
    viewClub({ id }) {
      this.$router.push(`/admin/club-info/${id}`);
    },
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
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getClubMembers({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      });
    },
    getClubMembers(params = {}) {
      this.loading = true;
      let data;

      if (this.filters) {
        if (this.filters.keyword) {
          data = { keyword: this.filters.keyword };
        }
      }

      // memberService.query(data).then(resp => {
      //   if (resp.data.success) {
      //     this.schedule = resp.data.result;
      //   }
      // });
      adminService
        .query({
          results: this.pagination.pageSize,
          ...params,
          ...data
        })
        .then(resp => {
          this.loading = false;
          if (resp.data.success) {
            const pagination = { ...this.pagination };
            pagination.total = resp.data.result.total;
            this.pagination = pagination;
            this.schedule = resp.data.result.data;
          }
        });
    }
  }
};
</script>
