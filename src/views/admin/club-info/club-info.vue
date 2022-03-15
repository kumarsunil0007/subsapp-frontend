<template>
  <n-page padding>
    <club-info-header :member="member"></club-info-header>
    <a-row>
      <a-col :xl="6" :lg="12" :md="12" :sm="24" :xs="24">
        <a-card class="gx-card-widget" title="Club admin">
          <ClubInfoCard :member="member" />
          <p v-if="pageLoading" style="text-align: center"><a-spin /></p>
        </a-card>
      </a-col>
      <a-col :xl="9" :lg="12" :md="12" :sm="24" :xs="24">
        <a-card class="gx-card-widget" title="Club Team">
          <club-teams-table />
        </a-card>
      </a-col>
      <a-col :xl="9" :lg="12" :md="12" :sm="24" :xs="24">
        <a-card class="gx-card-widget" title="Club Coach">
          <club-teams-table />
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import ClubInfoHeader from "@/components/admin/club-info/club-info-header";
import NPage from "@/components/ui/n-page/n-page";
import ClubInfoCard from "@/components/admin/club-info/club-info-card";
import { clubAdminsService } from "@/common/api/api.service";
import ClubTeamsTable from "@/components/admin/club-info/club-team";
export default {
  name: "PageIndex",
  components: { ClubInfoCard, NPage, ClubInfoHeader, ClubTeamsTable },
  data() {
    return {
      member: {},
      pageLoading: true
    };
  },
  mounted() {
    this.fetchMembers();
  },
  methods: {
    fetchMembers() {
      clubAdminsService
        .clubInfo(this.$route.params.id)
        .then(resp => {
          this.pageLoading = false;
          if (resp.data.success) {
            this.member = resp.data.result;
          }
        })
        .catch(resp => {
          this.pageLoading = false;
        });
    }
  }
};
</script>
