<template>
  <a-modal
    v-model="isVisible"
    class="search_member-popup"
    title="Search Team & Invite Member"
    @cancel="close"
  >
    <a-row type="flex" :gutter="1">
      <a-col :xs="18">
        <a-input
          v-model="keyword"
          type="text"
          placeholder="Enter team name"
        ></a-input>
      </a-col>
      <a-col :xs="6">
        <a-button block type="primary" @click="searchEmails">Search</a-button>
      </a-col>
    </a-row>
    <div>
      <a-row v-for="team of teams" :key="team.id" type="flex" :gutter="4">
        <a-col :span="16"> Team name: {{ team.team_name }} </a-col>
        <a-col :span="8" class="gx-text-right">
          <a-button
            v-if="!team.members.length"
            block
            size="small"
            :loading="loader && selectId === team.id"
            @click="updateTeamMember(selectMemberId, 'invite', team.id)"
          >
            Add to team
          </a-button>
          <a-button
            v-if="
              team.members.length && team.members[0].pivot.status === 'accept'
            "
            block
            size="small"
            :loading="loader && selectId === team.id"
            @click="updateTeamMember(selectMemberId, 'archive', team.id)"
          >
            Remove from team
          </a-button>
          <a-button
            v-if="
              team.members.length && team.members[0].pivot.status === 'invite'
            "
            type="danger"
            block
            size="small"
            :loading="loader && selectId === team.id"
            @click="updateTeamMember(selectMemberId, 'archive', team.id)"
          >
            Cancel Invitation
          </a-button>
        </a-col>
      </a-row>
    </div>
    <div v-if="teams.length < 1 && error_msg" class="gx-text-center">
      Team not found
    </div>
    <div slot="footer"></div>
  </a-modal>
</template>

<script>
import notifications from "@/common/notifications/notification.service";
import { teamService } from "@/common/api/api.service";
import { memberService } from "@/common/api/api.service";
import { mapGetters } from "vuex";

export default {
  name: "InviteMemberModal",
  props: {
    searchTeamModal: {
      default: false,
      required: true,
      type: Boolean
    },
    selectMemberId: {
      required: true,
      type: [Number, String]
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      keyword: "",
      error_msg: false,
      teams: [],
      loader: false,
      selectId: ""
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.searchTeamModal;
      },
      set() {
        return false;
      }
    },
    ...mapGetters(["AUTH_USER"])
  },
  methods: {
    updateTeamMember(memberId, action, id) {
      this.loader = true;
      this.selectId = id;
      memberService
        .updateTeamMember({
          memberId: memberId,
          teamId: id,
          action: action,
          url: window.location.origin + "/#/login"
        })
        .then(resp => {
          this.loader = false;
          if (resp.data.success) {
            this.searchEmails();
            notifications.success("Member updated successfully");
          } else {
            notifications.warn("We could not add this member");
          }
        })
        .catch(() => {
          this.loader = false;
        });
    },
    searchEmails() {
      this.error_msg = false;
      teamService
        .searchTeam({
          keyword: this.keyword,
          memberId: this.selectMemberId,
          role: this.AUTH_USER.select_role
        })
        .then(resp => {
          if (resp.data.success) {
            this.teams = resp.data.result;
            this.error_msg = true;
          } else {
            this.error_msg = true;
            notifications.warn(resp.data.message);
          }
        })
        .catch(() => {
          this.error_msg = true;
        });
    },
    close() {
      this.keyword = "";
      this.teams = [];
      this.error_msg = false;
      this.$emit("close");
    }
  }
};
</script>
<style>
.search_member-popup .ant-modal-footer {
  padding: 10px 16px;
  text-align: right;
  border-top: 1px solid #e8e8e8;
  border-radius: 0 0 6px 6px;
  display: none;
}
</style>
