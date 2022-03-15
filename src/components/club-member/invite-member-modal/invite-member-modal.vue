<template>
  <a-modal
    v-model="isVisible"
    class="search_member-popup"
    title="Search & Invite new Members"
    @cancel="close"
  >
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
            v-if="!member.status || member.status === 'decline'"
            block
            size="small"
            :loading="loader && selectId === member.id"
            @click="inviteMember(member.id)"
          >
            Send Invite
          </a-button>
          <a-button
            v-if="
              member.status === 'invite' ||
                member.status === 'accept' ||
                member.status === 'archive'
            "
            type="danger"
            block
            size="small"
            :loading="loader && selectId === member.id"
          >
            <template v-if="member.status === 'invite'"
              >Invitation Pending</template
            >
            <template v-if="member.status === 'archive'">Archived</template>
            <template v-if="member.status === 'accept'"
              >Already a Member</template
            >
          </a-button>
        </a-col>
      </a-row>
    </div>
    <div v-if="members.length < 1 && error_msg" class="gx-text-center">
      Member not found
    </div>
    <div slot="footer"></div>
  </a-modal>
</template>

<script>
import notifications from "@/common/notifications/notification.service";
import { memberService } from "@/common/api/api.service";
import { mapGetters } from "vuex";

export default {
  name: "InviteMemberModal",
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      keyword: "",
      error_msg: false,
      members: [],
      loader: false,
      selectId: ""
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
    ...mapGetters(["AUTH_USER"])
  },
  methods: {
    inviteMember(memberId) {
      this.selectId = memberId;
      this.loader = true;
      const param = {
        memberId: memberId,
        role: this.AUTH_USER.select_role,
        url: window.location.origin
      };
      memberService
        .inviteMember(param)
        .then(resp => {
          this.loader = false;
          if (resp.data.success) {
            this.searchEmails();
            notifications.success("An invite has been sent");
          } else {
            notifications.warn(resp.data.message);
          }
        })
        .catch(() => {
          this.loader = false;
        });
    },
    searchEmails() {
      this.error_msg = false;
      memberService
        .searchMembers({
          keyword: this.keyword,
          role: this.AUTH_USER.select_role
        })
        .then(resp => {
          if (resp.data.success) {
            this.members = resp.data.result;
            this.error_msg = true;
          } else {
            notifications.warn(resp.data.message);
          }
        });
    },
    close() {
      this.keyword = "";
      this.members = [];
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
