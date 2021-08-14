<template>
  <a-table class="gx-table-responsive" :columns="columns" :data-source="data">
    <div slot="member" slot-scope="text, row">
      <template v-if="row && row.first_name">
        {{ row.first_name }} {{ row.last_name }}
      </template>
    </div>
    <div slot="created_at" slot-scope="text">
      {{ nTime(text) }}
    </div>
    <div slot="total" slot-scope="text">€{{ formatMoney(text) }}</div>
    <div slot="transaction" slot-scope="text, row">
      <template v-if="row.status === 'complete'">
        <a-tag color="green">Payment Received</a-tag>
      </template>
      <template v-if="row.status === 'refund'">
        <a-tag color="orange">Payment Refund</a-tag>
      </template>
    </div>
  </a-table>
</template>

<script>
import timeMixing from "@/mixins/time";
import { mapGetters } from "vuex";
import nCurrency from "@/mixins/currency";

const columns = [
  {
    title: "Member",
    dataIndex: "receiver",
    key: "receiver",
    scopedSlots: {
      customRender: "member"
    }
  },
  {
    title: "Amount",
    dataIndex: "total",
    key: "total",
    scopedSlots: {
      customRender: "total"
    }
  },
  {
    title: "Payment Status",
    scopedSlots: {
      customRender: "transaction"
    }
  },
  {
    title: "Created At",
    key: "created_at",
    scopedSlots: {
      customRender: "created_at"
    }
  }
];
import { clubService } from "@/common/api/api.service";

export default {
  name: "ClubBillingInvoiceTable",
  mixins: [nCurrency, timeMixing],
  props: {
    filters: {
      required: false,
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      columns,
      data: [],
      dataLoading: true
    };
  },
  computed: {
    ...mapGetters({
      invoices: "getClubBilling"
    })
  },
  watch: {
    filters: {
      handler: function() {
        this.fetchData();
      },
      deep: true
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const data = {};

      if (this.filters) {
        if (this.filters.keyword) {
          data.keyword = this.filters.keyword;
        }
        if (this.filters.type) {
          data.type = this.filters.type;
        }
      }

      this.dataLoading = true;
      clubService.getMyClubBilling({ params: data }).then(res => {
        if (res.data.success) {
          this.data = res.data.result;
        }
        this.dataLoading = false;
      });
    }
  }
};
</script>

<style scoped></style>
