<template>
  <n-page>
    <a-row type="flex">
      <a-col :xs="24" :sm="24" :md="14" :lg="16">
        <a-row type="flex" :gutter="10">
          <a-col :xs="24" :sm="24" :md="8" :lg="6">
            <a-input
              v-model="filters.keyword"
              style="width:100%;margin-bottom: 10px;"
              placeholder="Keyword Search"
            ></a-input>
          </a-col>
          <a-col :xs="24" :sm="24" :md="8" :lg="6">
            <a-select
              v-model="filters.type"
              style="min-width: 100%;margin-bottom: 10px;"
            >
              <a-select-option value="all">Any</a-select-option>
              <a-select-option value="paid">Paid</a-select-option>
              <a-select-option value="unpaid">Unpaid</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-card title="Club Billing" class="gx-card-table-full">
          <club-billing-invoice-table :filters="filters" />
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_CLUB_BILLING } from "@/store/modules/club/club-actions";
import NPage from "@/components/ui/n-page/n-page";
import { clubService, billingService } from "@/common/api/api.service";
import ClubBillingInvoiceTable from "@/components/club-billing/club-billing-invoices-table/club-billing-invoice-table";

export default {
  name: "ClubBillingOverview",
  components: { ClubBillingInvoiceTable, NPage },
  data() {
    return {
      newCardModalVisible: false,
      cards: [],
      filters: {
        keyword: "",
        type: "all"
      }
    };
  },
  computed: {
    ...mapGetters({
      club: "getClub",
      clubLoadingStatus: "getClubLoadingStatus"
    })
  },
  mounted() {
    this.$store.dispatch(GET_CLUB_BILLING);
  },
  methods: {
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit(values);
        }
      });
    },
    handleFormSubmit(values) {
      clubService.update(this.club.id, values).then(resp => {
        if (resp.data.success) {
          this.close();
        }
      });
    },
    openNewCardModal() {
      this.newCardModalVisible = true;
    },
    closeNewCardModalVisible() {
      this.newCardModalVisible = false;
    },
    removeCard(tk) {
      billingService
        .removeCard({
          auth: {
            id: this.user.user.user_id,
            type: "user"
          },
          tk: tk
        })
        .then(() => {
          this.listCards();
        });
    },
    setDefault(tk) {
      billingService
        .setDefaultCard({
          auth: {
            id: this.user.user.user_id,
            type: "user"
          },
          tk: tk
        })
        .then(() => {
          this.listCards();
        });
    },
    saveCard(token) {
      billingService.saveCard({
        auth: {
          id: this.user.user.user_id,
          type: "user"
        },
        tk: token
      });
    },
    listCards() {
      billingService
        .listCards({
          auth: {
            id: this.user.user.user_id,
            type: "user"
          }
        })
        .then(resp => {
          if (resp.data.success) {
            this.cards = resp.data.result;
          }
        });
    }
  }
};
</script>


<style scoped></style>
