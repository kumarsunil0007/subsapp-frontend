<template>
  <n-page>
    <div v-if="teamLoading === 'OK'">
      <a-row>
        <a-col :span="24">
          <h1>{{ team.team_name }}</h1>
        </a-col>
      </a-row>
      <a-row>
        <a-col :xl="12" :lg="24" :md="24" :xs="24" :sm="24">
          <a-card
            title="Team Schedule"
            class="gx-card-table-full gx-table-responsive"
          >
            <div slot="extra">
              <a-button type="primary" size="small" @click="openScheduleModal">
                New Session
              </a-button>
            </div>
            <team-schedule-table ref="schedule_list" :club-id="team.id">
            </team-schedule-table>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :xs="24" :sm="24">
          <a-card
            title="Club Members in this team"
            class="gx-card-table-full gx-table-responsive"
          >
            <div slot="extra">
              <a-button type="primary" size="small" @click="openMemberModal">
                Add Member
              </a-button>
            </div>
            <team-members-table
              ref="members_list"
              :team-id="team.id"
            ></team-members-table>
          </a-card>
        </a-col>
      </a-row>
      <schedule-modal
        :visible="scheduleModalVisible"
        :team-id="team.id"
        @close="closeScheduleModal"
      ></schedule-modal>
      <new-team-member-modal
        :team-id="team.id"
        :visible="addMemberModalVisible"
        @close="closeMemberModal"
      />
    </div>
    <n-section-loading v-else title="Loading team details..." />
  </n-page>
</template>

<style lang="scss"></style>

<script>
import moment from "moment";
import NPage from "@/components/ui/n-page/n-page";
import { floatToHour } from "@/mixins/time";
import ScheduleModal from "@/components/club-teams/modals/new-schedule-modal/schedule-modal";
import TeamScheduleTable from "@/components/club-teams/team-schedule/team-schedule-table";
import TeamMembersTable from "@/components/club-teams/club-members/team-members-table";
import { mapGetters } from "vuex";
import { GET_TEAM } from "@/store/modules/team/team-actions";
import NSectionLoading from "@/components/ui/n-section-loading/n-section-loading";
import NewTeamMemberModal from "@/components/club-member/new-team-member-modal/new-team-member-modal";

export default {
  name: "PageIndex",
  components: {
    NewTeamMemberModal,
    NSectionLoading,
    TeamMembersTable,
    TeamScheduleTable,
    NPage,
    ScheduleModal
  },
  data() {
    return {
      scheduleModalVisible: false,
      addMemberModalVisible: false
    };
  },
  beforeCreate() {
    this.$store.dispatch(GET_TEAM, this.$route.params.teamId);
  },
  methods: {
    getCurrentTeam() {
      this.$store.dispatch(GET_TEAM, this.$route.params.teamId);
    },
    openScheduleModal() {
      this.scheduleModalVisible = true;
    },
    closeScheduleModal() {
      this.$store.dispatch(GET_TEAM, this.$route.params.teamId);
      this.$refs.schedule_list.getTeamSchedule();
      this.scheduleModalVisible = false;
    },
    openMemberModal() {
      this.addMemberModalVisible = true;
    },
    closeMemberModal() {
      this.$store.dispatch(GET_TEAM, this.$route.params.teamId);
      this.$refs.members_list.getMembers();
      this.addMemberModalVisible = false;
    }
  },
  computed: {
    ...mapGetters({
      team: "getTeam",
      teamLoading: "getTeamLoadingStatus"
    })
  }
};
</script>
