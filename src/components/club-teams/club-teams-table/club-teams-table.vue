<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="teams"
    :loading="teamsLoading"
  >
    <div slot="operations" slot-scope="text, row" class="gx-text-right">
      <router-link
        v-if="row.status === 'active'"
        :to="'/teams/' + row.id"
        @click.native="ManageTeam"
      >
        <a-button type="primary" size="small">
          Manage Team
        </a-button>
      </router-link>
      <a-button
        v-if="row.status === 'active'"
        type="danger"
        size="small"
        style="margin-left:5px; "
        @click="archiveTeam(row.id)"
      >
        Archive
      </a-button>
      <a-button
        v-if="row.status === 'archived'"
        type="danger"
        size="small"
        style="margin-left:5px; "
        @click="activateTeam(row.id)"
      >
        Make Active
      </a-button>
    </div>
  </a-table>
</template>

<script>
import timeMixing from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import { teamService } from "@/common/api/api.service";
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
      teamsLoading: true
    };
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    archiveTeam(teamId) {
      teamService
        .update(teamId, {
          status: "archived"
        })
        .then(resp => {
          if (resp.data.success) {
            this.getTeams();
            notifications.success("Team archived successfully");
          } else {
            if (resp.data.message) {
              notifications.warn(resp.data.message);
            } else {
              notifications.warn(
                "Something went wrong, we could not change the status for this team"
              );
            }
          }
        });
    },
    activateTeam(teamId) {
      teamService
        .update(teamId, {
          status: "active"
        })
        .then(resp => {
          if (resp.data.success) {
            this.getTeams();
            notifications.success("Team activated successfully");
          } else {
            if (resp.data.message) {
              notifications.warn(resp.data.message);
            } else {
              notifications.warn(
                "Something went wrong, we could not change the status for this team"
              );
            }
          }
        });
    },
    getTeams() {
      teamService.query().then(resp => {
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
