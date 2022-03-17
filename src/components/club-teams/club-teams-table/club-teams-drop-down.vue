<template>
    <div class="dropdown">
      <a-card title="Select Team For Manage" class="gx-card-table-full">
      <!-- <select v-model="selectedTeamId" @change="onChangeTeam">
        <option
          v-for="(team, index) in teams"
          :value="team.id"
          :key="index"
        >
        {{team.team_name}}
        </option>
      </select> -->
    <a-select style="width: 150px" v-model="selectedTeamId" @change="onChangeTeam">
      <a-select-option  disabled hidden value="">Select One</a-select-option>>
      <a-select-option  v-for="(team, index) in teams"
          :value="team.id"
          :key="index">
        {{team.team_name}}
      </a-select-option>
    </a-select>
     <a-button type="primary" @click="manageTeamRedirect" :disabled='!selectedTeamId'>
      Manage Team
    </a-button>
      </a-card>
    </div>
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
      teamsLoading: true,
      selected: "",
      selectedTeamId:""
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
     manageTeamRedirect:function(){
          var team_id = this.selectedTeamId;
          this.$router.push('/teams/' +
                    team_id);  
     },

     ManageEvent2:function(event){
               var team_id =    event.target.value;
               this.$router.push('/teams/' +
                    team_id );  
     },
    ManageTeam() {
      this.$store.commit("SET_TEAM_ZERO");
    },
      displaynumbers : function(event) {
          alert("test");
    }
  }
};
</script>

<style scoped>
.ant-card{
  margin-bottom:0;
}
button.ant-btn.ant-btn-primary {
    margin-bottom: 0;
    margin-left: 14px;
}
</style>
