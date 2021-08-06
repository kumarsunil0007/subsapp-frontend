<template>
  <a-row type="flex">
    <a-col :xs="24" :sm="24" :md="6">
      <a-card>
        <a-row>
          <a-col :xs="16" :sm="16" :md="16">
            <a-statistic
              title="Active Members"
              :value="members"
              :value-style="{ color: '#262626' }"
              style="margin-right: 50px"
            >
            </a-statistic>
          </a-col>
          <a-col :xs="8" :sm="8" :md="8">
            <template>
              <a-icon type="user" />
            </template>
          </a-col>
          <div class="text-dashboard">
            Grow your club by inviting new members or just manage your existing
            members.
          </div>
        </a-row>
      </a-card>
      <!-- <n-box to="/teams-list">
            <div slot="title">
              Teams
            </div>
            <div slot="description">
              Schedule new training session, add and remove team members and
              manage anything else related to that team.
            </div>
          </n-box> -->
    </a-col>
    <a-col :xs="24" :sm="24" :md="6">
      <a-card>
        <a-row>
          <a-col :xs="16" :sm="16" :md="16">
            <a-statistic
              title="Teams"
              :value="teams"
              :value-style="{ color: '#262626' }"
              style="margin-right: 50px"
            >
            </a-statistic>
          </a-col>
          <a-col :xs="8" :sm="8" :md="8">
            <template>
              <a-icon type="team" />
            </template>
          </a-col>
          <div class="text-dashboard">
            Schedule new training session, add and remove team members and
            manage.
          </div>
        </a-row>
      </a-card>
    </a-col>
    <a-col :xs="24" :sm="24" :md="6">
      <a-card>
        <a-row>
          <a-col :xs="16" :sm="16" :md="16">
            <h4>Billing</h4>
          </a-col>
          <a-col :xs="8" :sm="8" :md="8">
            <template>
              <a-icon type="money-collect" />
            </template>
          </a-col>
          <div class="text-dashboard">
            View a breakdown of your clubs billing history. Track pending
            payments and view individual transaction invoices.
          </div>
        </a-row>
      </a-card>
      <!-- <n-box to="/club/billing">
            <div slot="title">
              Billing
            </div>
            <div slot="description">
              View a breakdown of your clubs billing history. Track pending
              payments and view individual transaction invoices.
            </div>
          </n-box> -->
    </a-col>
  </a-row>
</template>

<script>
import { clubService } from "@/common/api/api.service";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dashboard_data: "",
      members: 0,
      teams: 0
    };
  },
  computed: {
    ...mapGetters(["AUTH_USER"])
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    fetchStats() {
      const data = {
        role: this.AUTH_USER.select_role
      };
      clubService.fetchStats({ params: data }).then(resp => {
        if (resp.data.success) {
          this.members = resp.data.members;
          this.teams = resp.data.teams;
        }
      });
    }
  }
};
</script>

<style scoped>
.ant-card {
  z-index: 1;
  margin-bottom: 32px;
  box-shadow: -1px 6px 11px 1px #d6d4d4;
  border-bottom: 5px solid #028fd6;
}
.ant-statistic-title {
  margin-bottom: 4px;
  color: #595959;
  font-size: 18px;
}
i {
  font-size: 32px;
  align-items: center;
  display: flex;
  justify-content: center;
}
.text-dashboard {
  margin: 11px;
  color: goldenrod;
}
.ant-card-body {
  padding: 18px;
  padding-bottom: 4px;
  zoom: 1;
}
.ant-card-body {
  padding: 18px;
  padding-bottom: 8px !important;
  zoom: 1;
}
</style>
