<template>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="billing"
    :loading="loading"
  >
    <template slot="date" slot-scope="text">
      {{ nUnixTime(text) }}
    </template>
    <template slot="amount_due" slot-scope="text">
      €{{ formatStripeMoney(text) }}
    </template>
    <template slot="amount_paid" slot-scope="text">
      €{{ formatStripeMoney(text) }}
    </template>
    <template slot="operation" slot-scope="text, record">
      <div class="editable-row-operations gx-text-right">
        <a v-if="record.invoice_pdf" :href="record.invoice_pdf">
          <a-button type="primary" class="gx-mb-0 gx-mr-2">
            Download
          </a-button>
        </a>
        <a v-if="record.status === 'open'" :href="record.hosted_invoice_url">
          <a-button class="gx-btn-cyan gx-mb-0 gx-mr-2">
            Pay Invoice
          </a-button>
        </a>
      </div>
    </template>
  </a-table>
</template>

<script>
const columns = [
  {
    title: "Invoice Number",
    dataIndex: "number",
    key: "_id"
  },
  {
    title: "Status",
    dataIndex: "status"
  },
  {
    title: "Amount Paid",
    dataIndex: "amount_paid",
    scopedSlots: { customRender: "amount_paid" }
  },
  {
    title: "Total",
    dataIndex: "amount_due",
    scopedSlots: { customRender: "amount_due" }
  },
  {
    title: "Date",
    dataIndex: "created",
    scopedSlots: { customRender: "date" }
  },
  {
    title: "",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";
export default {
  name: "StripeBillingHistoryTable",
  mixins: [nTime, nCurrency],
  props: {
    billing: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      columns,
      dataLoading: true
    };
  }
};
</script>

<style scoped></style>
