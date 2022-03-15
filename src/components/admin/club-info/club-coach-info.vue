<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="teams"
    :loading="teamsLoading"
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
      const id = this.$route.params.id;
      clubAdminsService.TeamInfo(id).then(resp => {
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
