<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="teams"
    :loading="teamsLoading"
    :row-key="record => record.id"
    :pagination="pagination"
    @change="handleTableChange"
  >
    <div slot="operations" slot-scope="text, row" class="gx-text-right">
      <router-link :to="'/teams/' + row.id" @click.native="ManageTeam">
        <a-button type="primary" size="small">
          View members
        </a-button>
      </router-link>
    </div>
  </a-table>
</template>

<script>
import timeMixing from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import { clubAdminsService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";

const columns = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name"
  },
  {
    title: "",
    scopedSlots: {
      customRender: "operations"
    }
  }
];

export default {
  name: "ClubTeamsTable",
  mixins: [nCurrency, timeMixing],
  data() {
    return {
      columns,
      teams: [],
      pagination: {
        pageSize: 1,
        current: 1
      },
      teamsLoading: true
    };
  },
  mounted() {
    this.getTeams({
      results: this.pagination.pageSize,
      page: this.pagination.current
    });
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getTeams({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      });
    },
    getTeams(params = {}) {
      const id = this.$route.params.id;
      console.log(params);
      clubAdminsService.TeamInfo(id, params).then(resp => {
        if (resp.data.success) {
          this.teams = resp.data.result;
        }
        this.teamsLoading = false;
      });
    },
    ManageTeam() {
      this.$store.commit("SET_TEAM_ZERO");
    }
  }
};
</script>

<style scoped></style>
