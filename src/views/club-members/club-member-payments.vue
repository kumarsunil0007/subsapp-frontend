<template>
  <q-page padding>
    <club-member-header :member="member"></club-member-header>
    <club-member-payments-table></club-member-payments-table>
  </q-page>
</template>

<script>
import ClubMemberPaymentsTable from "../../components/club-member/club-member-payments-table/club-member-payments-table";
import ClubMemberHeader from "../../components/club-member/club-member-header/club-member-header";
export default {
  name: "PageIndex",
  components: { ClubMemberHeader, ClubMemberPaymentsTable },
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
  methods: {
    togglePresence(index) {
      this.memebersList[index].currentSession = !this.memebersList[index]
        .currentSession;
    },
    fetchMembers() {}
  }
};
</script>
