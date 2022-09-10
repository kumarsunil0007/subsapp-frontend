<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="teams"
    :loading="dataLoading"
  >
    <div slot="operations" slot-scope="text, row" class="gx-text-left">
      <a-button
        class="gx-btn-cyan"
        size="small"
        style="margin-left:5px; "
        @click="emitEdit(row.id)"
      >
        Manage
      </a-button>
      <a-button
        v-if="row && row.role !== 'Admin'"
        class="gx-btn-danger"
        size="small"
        style="margin-left:5px; "
        @click="removeAdmin(row.id)"
      >
        Remove
      </a-button>
    </div>
  </a-table>
</template>

<script>
import timeMixing from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import { clubAdminsService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";

const columns = [
  {
    title: "Name",
    dataIndex: "preferred_name",
    key: "id"
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
      dataLoading: true
    };
  },
  mounted() {
    this.getAdmins();
  },
  methods: {
    emitEdit(user_id) {
      this.$emit("edit", user_id);
    },
    removeAdmin(admin_id) {
      clubAdminsService
        .remove({
          admin_id,
          url: window.location.origin
        })
        .then(resp => {
          if (resp.data.success) {
            this.getAdmins();
            notifications.success("Coach removed successfully");
          } else {
            notifications.success(resp.data.message);
          }
        });
    },
    getAdmins() {
      clubAdminsService.query().then(resp => {
        if (resp.data.success) {
          this.teams = resp.data.result;
        }
        this.dataLoading = false;
      });
    }
  }
};
</script>

<style scoped></style>
