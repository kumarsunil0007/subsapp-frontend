<template>
  <n-page>
    <a-row>
      <a-col :xs="24" :sm="24" :md="8">
        <a-alert
          v-if="error_msg"
          message="Error"
          description="Something went wrong, we could not add this card."
          type="error"
          closable
          show-icon
          class="margin_top"
          @close="close_alert"
        />
        <club-subscription-overview :cards="cards" />
        <div class="add-new-card gx-text-right"></div>
        <a-card class="gx-card-full gx-card-header-full">
          <div slot="title">
            <a-row type="flex">
              <a-col :xs="12" :sm="14" :md="12" :lg="14">
                Active Cards
              </a-col>
              <a-col :xs="12" :sm="10" :md="12" :lg="10">
                <a-button
                  block
                  type="primary"
                  style="margin:0;"
                  size="small"
                  @click="openNewCardModal"
                >
                  Add new Card
                </a-button>
              </a-col>
            </a-row>
          </div>
          <div v-if="cards.length > 0" class="credit-cards">
            <stripe-card-preview
              v-for="(card, index) of cards"
              :key="index"
              :card="card"
              @remove="removeCard"
              @setDefault="setDefault"
            />
          </div>
          <n-section-loading v-if="cardsLoading" />
          <div v-if="!cardsLoading && cards.length === 0">
            <n-section-empty
              warning="You have no active cards, please add your first card"
            />
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="16">
        <a-card class="gx-card-table-full">
          <stripe-billing-history-table
            :billing="billing"
            :loading="billingLoading"
          />
        </a-card>
      </a-col>
    </a-row>
    <stripe-new-card-modal
      :visible="newCardModalVisible"
      @token="saveCard"
      @close="closeNewCardModalVisible"
    />
  </n-page>
</template>

<script>
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { billingService } from "@/common/api/api.service";
import { mapGetters } from "vuex";
import NPage from "@/components/ui/n-page/n-page";
import StripeCardPreview from "@/components/billing/stripe-card-preview/stripe-card-preview";
import StripeNewCardModal from "@/components/billing/stripe-new-card-modal/stripe-new-card-modal";
import NSectionEmpty from "@/components/ui/n-section-empty/n-section-empty";
import StripeBillingHistoryTable from "@/components/billing/stripe-billing-history-table/stripe-billing-history-table";
import ClubSubscriptionOverview from "@/components/club-billing/club-subscription-overview/club-subscription-overview";
import NSectionLoading from "@/components/ui/n-section-loading/n-section-loading";
import notifications from "@/common/notifications/notification.service";
export default {
  name: "SubscriptionOverview",
  components: {
    NSectionLoading,
    ClubSubscriptionOverview,
    StripeBillingHistoryTable,
    NSectionEmpty,
    StripeNewCardModal,
    StripeCardPreview,
    NPage
  },
  data() {
    return {
      newCardModalVisible: false,
      billing: [],
      plans: [],
      cards: [],
      cardsLoading: false,
      billingLoading: true,
      subscriptions: [],
      error_msg: false
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  },
  mounted() {
    this.listCards();
    this.listInvoices();
    this.listPlans();
    this.getSubscriptions();
  },
  methods: {
    getSubscriptions() {
      billingService
        .getCustomSubscriptions({
          auth: {
            id: this.user.user.user_id,
            type: "club"
          }
        })
        .then(resp => {
          this.subscriptions = resp.data.result;
        });
    },
    listPlans() {
      billingService.listsPlans().then(resp => {
        if (resp.data.success) {
          this.plans = resp.data.result.data;
        }
      });
    },
    listInvoices() {
      this.billingLoading = true;
      billingService
        .listInvoices({
          auth: {
            id: this.user.user.user_id,
            type: "club"
          }
        })
        .then(resp => {
          this.billingLoading = false;
          if (resp.data.success) {
            this.billing = resp.data.result.data;
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
            type: "club"
          },
          tk: tk
        })
        .then((resp) => {
          if(resp.data.success){
             notifications.success("Card Removed Successfully");
             this.listCards();
          }else{
            notifications.warn(resp.data.message);
          }
        });
    },
    setDefault(tk) {
      console.log(tk,'dd')
      billingService
        .setDefaultCard({
          auth: {
            id: this.user.user.user_id,
            type: "club"
          },
          tk: tk
        })
        .then(() => {
          this.listCards();
        });
    },
    saveCard(token) {
      this.error_msg = false;
      billingService
        .saveCard({
          auth: {
            id: this.user.user.user_id,
            type: "club"
          },
          tk: token
        })
        .then(resp => {
          if (!resp.data.success) {
            this.error_msg = true;
          }
          this.listCards();
        });
    },
    listCards() {
      this.cardsLoading = true;
      billingService
        .listCards({
          auth: {
            id: this.user.user.user_id,
            type: "club"
          }
        })
        .then(resp => {
          this.cardsLoading = false;
          if (resp.data.success) {
            this.cards = resp.data.result;
          }
        });
    },
    close_alert() {
      this.error_msg = false;
    }
  }
};
</script>
<style scoped>
.margin_top {
  margin-bottom: 20px;
}
</style>
