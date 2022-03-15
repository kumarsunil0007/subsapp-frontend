<template>
  <n-page>
    <div v-if="user.user_type === 'admin'">
      <a-row type="flex">
        <a-col :xs="24" :sm="24" :md="6">
          <n-box to="/teams-list">
            <div
              slot="title"
              class="title-heading"
              style="font-size: 20px;
      color: #0058c6;"
            >
              Teams
            </div>
            <div slot="description">
              Schedule new training session, add and remove team members and
              manage anything else related to that team.
            </div>
          </n-box>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6">
          <n-box to="/members">
            <div
              slot="title"
              class="title-heading"
              style="font-size: 20px;
      color:rgb(39, 174, 96);"
            >
              Global Members
            </div>
            <div slot="description">
              Manage your global clubs members, grow your club by inviting new
              members or just manage your existing members.
            </div>
          </n-box>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6">
          <n-box to="/club/billing">
            <div
              slot="title"
              class="title-heading"
              style="font-size: 20px;
      color: #f18805;"
            >
              Billing
            </div>
            <div slot="description">
              View a breakdown of your clubs billing history. Track pending
              payments and view individual transaction invoices.
            </div>
          </n-box>
        </a-col>
      </a-row>
    </div>
  </n-page>
</template>
<script>
import NBox from "@/components/ui/n-box/n-box";
import NPage from "@/components/ui/n-page/n-page";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";

import { mapGetters } from "vuex";
export default {
  name: "AdminDashboard",
  components: { NPage, NBox },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  }
};
</script>
<style lang="scss">
.teams-box {
  &--name {
    font-weight: 100;
  }
  &--title {
    font-size: 22px;
    color: #f5f5f5;
    margin-bottom: 2px;
  }
}
</style>
