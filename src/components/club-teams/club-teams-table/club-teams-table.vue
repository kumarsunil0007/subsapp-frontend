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
        <a-button
          type="primary"
          size="small"
          style="margin-left: 5px; margin-bottom: 0"
        >
          Manage Team
        </a-button>
      </router-link>
      <a-button
        v-if="row.status === 'active'"
        type="danger"
        size="small"
        style="margin-left: 5px; margin-bottom: 0"
        @click="archiveTeam(row.id)"
      >
        Archive
      </a-button>
      <a-button
        size="small"
        style="
          color: #f5222d;
          background-color: #f5f5f5;
          border-color: #d9d9d9;
          margin-right: 5px;
          margin-bottom: 0px;
        "
        type="danger"
        @click="deleteTeam(row.id)"
        >Delete</a-button
      >
      <a-button
        v-if="row.status === 'archived'"
        type="danger"
        size="small"
        style="margin-left: 5px; margin-bottom: 0"
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
import { mapGetters } from "vuex";
import notifications from "@/common/notifications/notification.service";
import Toaster from "@/common/sweetToast.js";

const columns = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name",
  },
  {
    title: "Club Name",
    dataIndex: "club.club_name",
    key: "club.club_name",
  },
  {
    title: "",
    scopedSlots: {
      customRender: "operations",
    },
  },
];

export default {
  name: "ClubTeamsTable",
  mixins: [nCurrency, timeMixing],
  data() {
    return {
      columns,
      teams: [],
      teamsLoading: true,
    };
  },
  mounted() {
    this.getTeams();
  },
  computed: {
    ...mapGetters(["AUTH_USER"]),
  },
  methods: {
    archiveTeam(teamId) {
      teamService
        .update(teamId, {
          status: "archived",
        })
        .then((resp) => {
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
          status: "active",
        })
        .then((resp) => {
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
      let data = {
        role: this.AUTH_USER.select_role,
      };
      teamService.query(data).then((resp) => {
        if (resp.data.success) {
          this.teams = resp.data.result;
          // alert(JSON.stringify(this.teams));
        }
        this.teamsLoading = false;
      });
    },
    ManageTeam() {
      this.$store.commit("SET_TEAM_ZERO");
    },
    deleteTeam(teamId) {
      console.log("teamId => ", teamId);
      Toaster.confirmation().then((resp) => {
        if (resp.isConfirmed) {
          teamService
            .deleteTeam({
              teamId: teamId
            })
            .then((resp) => {
              if (resp.data.success) {
                notifications.success(resp.data.message);
                this.getTeams();
              } else {
                notifications.warn(resp.data.message);
              }
            });
        }
      });
    },
  },
};
</script>

<style scoped></style>
