<template>
  <a-table :columns="columns" :data-source="members" :loading="dataLoading">
    <div slot="handlers" slot-scope="text, record">
      <a-button
        block
        size="small"
        style="margin-bottom:0;"
        type="primary"
        @click="manageUser(record.user_id)"
      >
        Manage
      </a-button>
    </div>
  </a-table>
</template>

<script>
import { subAccountsService } from "@/common/api/api.service";

const columns = [
  {
    title: "Full Name",
    dataIndex: "preferred_name",
    key: "user_id"
  },
  {
    title: "Username",
    dataIndex: "work_email"
  },
  {
    dataIndex: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  }
];

export default {
  name: "SubAccountsTable",
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
    manageUser(user_id) {
      this.$emit("manage", user_id);
    },
    getMembers() {
      this.dataLoading = true;
      subAccountsService.query().then(resp => {
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
