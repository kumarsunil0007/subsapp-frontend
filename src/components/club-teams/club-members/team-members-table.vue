<template>
  <a-table :columns="columns" :data-source="members" :loading="dataLoading">
    <div slot="startTimeRender" slot-scope="text">
      {{ nTime(text) }}
    </div>
    <div slot="sessionLength" slot-scope="text">
      {{ floatToHour(text) }} Hours
    </div>
    <div slot="dob" slot-scope="text">
      {{ nFormat(text) }}
    </div>
    <div slot="created_at" slot-scope="text">
      {{ nFormat(text) }}
    </div>
    <div slot="fullAddress" slot-scope="text, record, index">
      <span v-if="record.address_1">{{ record.address_1 }}</span>
      <span v-if="record.address_2">, {{ record.address_2 }}</span>
      <span v-if="record.town">, {{ record.town }}</span>
      <span v-if="record.region">, {{ record.region }}</span>
      <span v-if="record.postcode">, {{ record.postcode }}</span>
    </div>
    <div slot="handlers" slot-scope="text, record">
      <router-link :to="'/club/member/' + record.id">
        <a-button block size="small" style="margin-bottom:0;" type="primary">
          View Profile
        </a-button>
      </router-link>
    </div>
  </a-table>
</template>

<script>
import { memberService } from "@/common/api/api.service";

const columns = [
  {
    title: "Full Name",
    dataIndex: "preferred_name",
    key: "user_id"
  },
  {
    title: "Email",
    dataIndex: "work_email"
  },
  {
    title: "Phone",
    dataIndex: "phone"
  },
  {
    title: "Date of Birth",
    dataIndex: "dob",
    scopedSlots: {
      customRender: "dob"
    }
  },
  {
    dataIndex: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  }
];

export default {
  name: "TeamMembersTable",
  props: {
    teamId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      columns,
      dataLoading: true,
      members: []
    };
  },
  mounted() {
    this.getMembers();
  },
  methods: {
    getMembers() {
      this.dataLoading = true;
      memberService
        .query({
          teamId: this.teamId
        })
        .then(resp => {
          this.dataLoading = false;
          if (resp.data.success) {
            this.members = resp.data.result;
          }
        });
    }
  }
};
</script>

<style scoped></style>
