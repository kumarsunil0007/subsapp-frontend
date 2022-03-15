<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="schedule"
    :looading="dataLoading"
  >
    <div slot="startTimeRender" slot-scope="text">
      {{ nTime(text) }}
    </div>
    <div slot="sessionLength" slot-scope="text">
      {{ floatToMinutes(text) }}
    </div>
    <div slot="sessionCost" slot-scope="text">€{{ formatMoney(text) }}</div>
    <div slot="sessionCost" slot-scope="text">€{{ formatMoney(text) }}</div>
    <div slot="handlers" slot-scope="text, record">
      <router-link :to="'/teams/' + record.team_id + '/session/' + record.id">
        <a-button block size="small" style="margin-bottom:0;" type="primary">
          Manage
        </a-button>
      </router-link>
    </div>
  </a-table>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";

const columns = [
  {
    title: "Starting Time",
    dataIndex: "start",
    key: "id",
    scopedSlots: {
      customRender: "startTimeRender"
    }
  },
  {
    title: "Est. Length",
    dataIndex: "length",
    scopedSlots: {
      customRender: "sessionLength"
    }
  },
  {
    title: "Session Cost",
    dataIndex: "cost",
    scopedSlots: {
      customRender: "sessionCost"
    }
  },
  {
    title: "Location",
    dataIndex: "location"
  },
  {
    dataIndex: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  }
];

import { scheduleService } from "@/common/api/api.service";

export default {
  name: "TeamScheduleTable",
  mixins: [nTime, nCurrency],
  props: {
    clubId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      columns,
      dataLoading: true,
      schedule: []
    };
  },
  mounted() {
    this.getTeamSchedule();
  },
  methods: {
    getTeamSchedule() {
      this.dataLoading = true;
      if (this.clubId)
        scheduleService
          .query({
            clubId: this.clubId
          })
          .then(resp => {
            if (resp.data.success) {
              this.schedule = resp.data.result;
              this.dataLoading = false;
            }
          });
    }
  }
};
</script>
