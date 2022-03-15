<template>
  <n-page padding>
    <club-member-header :member="member"></club-member-header>
  </n-page>
</template>

<script>
import ClubMemberHeader from "../../components/club-member/club-member-header/club-member-header";
import NPage from "@/components/ui/n-page/n-page";
export default {
  name: "PageIndex",
  components: { NPage, ClubMemberHeader },
  data() {
    return {
      member: {
        user_id: 1,
        first_name: "Bobby",
        last_name: "Dease",
        currentSession: 0,
        balance: 0
      }
    };
  },
  mounted() {},
  methods: {
    togglePresence(index) {
      this.memebersList[index].currentSession = !this.memebersList[index]
        .currentSession;
    },
    fetchMembers() {}
  }
};
</script>
