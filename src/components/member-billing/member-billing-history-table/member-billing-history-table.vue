<template>
  <div>
    <a-table
      class="gx-table-responsive"
      :columns="columns"
      :data-source="invoices"
    >
      <div slot="operations" slot-scope="text, row">
        <a-button size="small" type="primary" @click="showInvoice(row)">
          View
        </a-button>
      </div>
      <div slot="total" slot-scope="text">€{{ formatMoney(text) }}</div>
      <div slot="refund" slot-scope="text, row">
        <p v-if="row.refund_amount > 0">{{ row.refund_amount }}</p>
        <p v-else>-</p>
      </div>
      <div slot="transaction" slot-scope="text, row">
        <template v-if="row.status === 'complete'">
          <a-tag color="green">Paid</a-tag>
        </template>
        <template v-if="row.status === 'refund'">
          <a-tag color="orange">Refund</a-tag>
        </template>
      </div>
    </a-table>

    <a-modal v-model="showDialog" width="400px">
      <template slot="footer">
        <a-button key="back" type="primary" @click="showDialog = false">
          Close
        </a-button>
      </template>
      <a-row>
        <a-col :xs="12" :lg="12">
          <h4>{{ selectedInvoice.club_name }}</h4>
          <p>{{ selectedInvoice.address }}</p>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: left">
          <p>
            <strong>Location:</strong>
            <span> {{ selectedInvoice.location }} </span>
          </p>
          <p>
            <strong>Attendee:</strong>
            <span>
              {{ selectedInvoice.first_name }}
              {{ selectedInvoice.last_name }}</span
            >
          </p>
          <p>
            <strong>Subtotal:</strong>
            <span> €{{ formatMoney(selectedInvoice.total) }}</span>
          </p>
          <p v-if="selectedInvoice.refund_amount > 0">
            <strong>Refund Amount:</strong>
            <span> {{ selectedInvoice.refund_amount }}</span>
          </p>
          <p v-if="selectedInvoice.created_at">
            <strong>Created At:</strong>
            <span> {{ nFormat(selectedInvoice.created_at) }}</span>
          </p>
          <p v-if="selectedInvoice.Transaction">
            <strong>Transaction ID:</strong>
            <span> {{ selectedInvoice.Transaction.transaction_id }}</span>
          </p>
          <!-- <p>
            <strong>Payment Card:</strong> <span> **** **** **** 4731</span>
          </p> -->
          <p
            v-if="selectedInvoice.Transaction && selectedInvoice.Transaction.id"
          >
            <strong>Payment Received:</strong>
            <span> {{ nTime(selectedInvoice.Transaction.created_at) }}</span>
          </p>
          <template v-if="selectedInvoice.status === 'complete'">
            <a-tag style="margin-right: 0;" color="green">Paid</a-tag>
          </template>
          <template v-else>
            <a-tag style="margin-right: 0;" color="orange">Refund</a-tag>
          </template>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { memberBillingService } from "@/common/api/api.service";
import timeMixing from "@/mixins/time";
import { mapGetters } from "vuex";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import nCurrency from "@/mixins/currency";

const columns = [
  {
    title: "Title",
    dataIndex: "title"
  },
  {
    title: "Location",
    dataIndex: "location"
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
    title: "Refund Amount",
    key: "refund_amount",
    dataIndex: "refund_amount",
    scopedSlots: {
      customRender: "refund"
    }
  },
  {
    scopedSlots: {
      customRender: "operations"
    }
  }
];

export default {
  name: "MemberBillingHistoryTable",
  mixins: [nCurrency, timeMixing],
  data() {
    return {
      columns,
      invoices: [],
      invoicesLoading: true,
      showDialog: false,
      selectedInvoice: {}
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  },
  mounted() {
    this.getInvoices();
  },
  methods: {
    showInvoice(invoice) {
      this.selectedInvoice = invoice;
      this.showDialog = true;
    },
    getInvoices() {
      memberBillingService
        .query({
          user_id: this.user.user.user_id
        })
        .then(resp => {
          this.invoicesLoading = false;
          this.invoices = resp.data.result;
        });
    }
  }
};
</script>

<style scoped></style>
