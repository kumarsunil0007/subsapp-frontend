<template>
  <n-page padding>
    <club-member-header :member="member"></club-member-header>
    <a-row>
      <a-col :xxl="8" :lg="12" :md="12" :sm="24" :xs="24">
        <a-card class="gx-card-widget" title="Personal Details">
          <club-member-details :member="member" />
          <p v-if="pageLoading" style="text-align: center"><a-spin /></p>
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import ClubMemberHeader from "../../components/club-member/club-member-header/club-member-header";
import NPage from "@/components/ui/n-page/n-page";
import ClubMemberDetails from "@/components/club-member/club-member-details/club-member-details";
import { memberService } from "@/common/api/api.service";

export default {
  name: "PageIndex",
  components: { ClubMemberDetails, NPage, ClubMemberHeader },
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
      memberService
        .get(this.$route.params.userId)
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
