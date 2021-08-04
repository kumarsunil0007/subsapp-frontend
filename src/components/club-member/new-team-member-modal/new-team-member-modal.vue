<template>
  <a-modal v-model="isVisible" title="Add/Remove Team Members" @cancel="close">
    <a-row type="flex" :gutter="1">
      <a-col :xs="18">
        <a-input
          v-model="keyword"
          type="email"
          placeholder="Enter members email"
        ></a-input>
      </a-col>
      <a-col :xs="6">
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
        <a-col :span="12">
          {{ member.work_email }}
        </a-col>
        <a-col :span="6" class="gx-text-right">
          <a-button
            v-if="member.teams && !member.teams.length"
            block
            class="gx-btn-cyan"
            size="small"
            @click="updateTeamMember(member.id, 'create')"
          >
            Add to Team
          </a-button>
          <a-button
            v-if="member.teams && member.teams.length"
            type="danger"
            class="gx-btn-danger"
            block
            size="small"
            @click="updateTeamMember(member.id, 'remove')"
          >
            Remove Member
          </a-button>
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
      members: []
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
      user: AUTH_USER,
    }),
  },
  methods: {
    updateTeamMember(memberId, action) {
      memberService
        .updateTeamMember({
          memberId: memberId,
          teamId: this.teamId,
          action: action
        })
        .then(resp => {
          if (resp.data.success) {
            this.searchEmails();
            notifications.success("Member updated successfully");
          } else {
            notifications.warn("We could not add this member");
          }
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
