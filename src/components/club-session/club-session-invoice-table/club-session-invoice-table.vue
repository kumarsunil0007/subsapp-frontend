<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="invoices"
  >
    <div slot="member" slot-scope="text, row">
      <template v-if="row && row.first_name">
        {{ row.first_name }} {{ row.last_name }}
      </template>
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
import { GET_SESSION_INVOICES } from "@/store/modules/session/session-actions";
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
    title: "Total",
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
    dataIndex: "handlers",
    key: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  },
  {
    title: "Refund Amount",
    dataIndex: "refund_amount",
    key: "refund_amount"
  }
];

export default {
  name: "ClubSessionInvoiceTable",
  mixins: [nCurrency],
  props: {
    sessionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns
    };
  },
  computed: {
    ...mapGetters({
      invoices: "getSessionInvoices"
    })
  },
  mounted() {
    this.getInvoices();
  },
  methods: {
    getInvoices() {
      this.$store.dispatch(GET_SESSION_INVOICES, this.sessionId);
    }
  }
};
</script>

<style scoped></style>
