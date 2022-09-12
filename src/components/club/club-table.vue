<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="clubs"
    :loading="teamsLoading"
  >
    <div slot="operations" slot-scope="text, row" class="gx-text-left">
      <router-link :to="'/club/' + row.id">
        <a-button
          type="primary"
          size="small"
          style="margin-left: 5px; margin-bottom: 0"
        >
          View
        </a-button>
      </router-link>
    </div>
  </a-table>
</template>

<script>
import timeMixing from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import { clubService } from "@/common/api/api.service";

const columns = [
  {
    title: "Club Name",
    dataIndex: "club_name",
    key: "club_name"
  },
  {
    title: "Club Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Contact Number",
    dataIndex: "contact_number",
    key: "contact_number"
  },
  {
    title: "Actions",
    scopedSlots: {
      customRender: "operations"
    }
  }
];

export default {
  name: "ClubTeamsTable",
  mixins: [nCurrency, timeMixing],
  data() {
    return {
      columns,
      teams: [],
      clubs: [],
      teamsLoading: true
    };
  },
  mounted() {
    this.getClubs();
  },
  methods: {
    getClubs() {
      clubService.getMyAllClub().then(resp => {
        if (resp.data.success) {
          this.clubs = resp.data.result;
          console.log("this.clubs => ", this.clubs);
          // alert(JSON.stringify(this.teams));
        }
        this.teamsLoading = false;
      });
    }
  }
};
</script>

<style scoped></style>
