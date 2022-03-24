<template>
  <a-modal v-model="isVisible" title="Add/Remove Team Members" @cancel="close">
    <a-row type="flex" :gutter="1">
      <a-col :xs="14">
        <a-input
          v-model="keyword"
          type="email"
          placeholder="Enter members email"
        ></a-input>
      </a-col>
      <a-col :xs="10">
        <a-button block type="primary" @click="searchEmails">Search</a-button>
      </a-col>
    </a-row>
    <div>
      <a-row
        v-for="member of members"
        :key="member.user_id"
        type="flex"
        :gutter="4"
      >
        <a-col :span="6">
          {{ member.first_name }} {{ member.last_name }}..
        </a-col>
        <a-col :span="10">
          {{ member.work_email }}
        </a-col>
        <a-col :span="8" class="gx-text-right">
          <a-button
            v-if="member.teams && !member.teams.length"
            block
            class="gx-btn-cyan"
            size="small"
            :loading="loader && selectedId === member.id"
            @click="updateTeamMember(member.id, 'invite')"
          >
            Invite to Team
          </a-button>
          <div v-if="member.teams && member.teams.length">
            <a-button
              v-if="member.teams[0].pivot.status === 'invite'"
              type="danger"
              class="gx-btn-danger"
              block
              size="small"
              :loading="loader && selectedId === member.id"
              @click="updateTeamMember(member.id, 'archive')"
            >
              Cancel invite
            </a-button>
            <a-button
              v-if="member.teams[0].pivot.status === 'decline'"
              type="danger"
              class="gx-btn-danger"
              block
              size="small"
              :loading="loader && selectedId === member.id"
              @click="updateTeamMember(member.id, 'invite')"
            >
              Send Invite Again
            </a-button>
            <a-button
              v-if="
                member.teams &&
                  member.teams.length &&
                  member.teams[0].pivot.status === 'accept'
              "
              type="danger"
              class="gx-btn-danger"
              block
              size="small"
              :loading="loader && selectedId === member.id"
              @click="updateTeamMember(member.id, 'archive')"
            >
              Remove Member
            </a-button>
          </div>
        </a-col>
      </a-row>
      <a-row v-if="members.length < 1 && error_msg"
        ><a-col :xs="18" class="gx-text-right">
          This Member not found in club member lists
        </a-col>
      </a-row>
    </div>
    <div slot="footer"></div>
  </a-modal>
</template>

<script>
import notifications from "@/common/notifications/notification.service";
import { memberService } from "@/common/api/api.service";
import { mapGetters } from "vuex";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
export default {
  name: "NewTeamMemberModal",
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean
    },
    teamId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      keyword: "",
      error_msg: false,
      members: [],
      loader: false,
      selectedId: ""
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.visible;
      },
      set() {
        return false;
      }
    },
    ...mapGetters({
      user: AUTH_USER
    })
  },
  methods: {
    updateTeamMember(memberId, action) {
      this.loader = true;
      this.selectedId = memberId;
      memberService
        .updateTeamMember({
          memberId: memberId,
          teamId: this.teamId,
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
      memberService
        .searchTeamMembers({
          keyword: this.keyword,
          teamId: this.teamId,
          role: this.user.select_role
        })
        .then(resp => {
          if (resp.data.success) {
            this.members = resp.data.result;
            this.error_msg = true;
          }
        });
    },
    close() {
      this.form.resetFields();
      this.keyword = "";
      this.members = [];
      this.error_msg = false;
      this.$emit("close");
    }
  }
};
</script>
