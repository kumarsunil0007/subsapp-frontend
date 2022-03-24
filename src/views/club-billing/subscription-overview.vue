<template>
  <n-page>
    <a-row type="flex">
      <a-col :xs="24" :sm="24" :md="8">
        <a-card class="subscription-cards">
          <a-row>
            <a-col :xs="16" :sm="16" :md="16">
              <a-statistic
                title="Active Members"
                :value="members"
                :value-style="{ color: '#262626' }"
                style="margin-right: 50px"
              >
              </a-statistic>
            </a-col>
            <a-col :xs="8" :sm="8" :md="8">
              <template>
                <a-icon type="user" />
              </template>
            </a-col>
            <div class="text-dashboard">
              Grow your club by inviting new members or just manage your
              existing members.
            </div>
          </a-row>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="8">
        <a-card class="subscription-cards">
          <a-row>
            <a-col :xs="16" :sm="16" :md="16">
              <a-statistic
                title="Teams"
                :value="teams"
                :value-style="{ color: '#262626' }"
                style="margin-right: 50px"
              >
              </a-statistic>
            </a-col>
            <a-col :xs="8" :sm="8" :md="8">
              <template>
                <a-icon type="team" />
              </template>
            </a-col>
            <div class="text-dashboard">
              Schedule new training sessions, add and remove team members and
              manage.
            </div>
            
          </a-row>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="8">
        <a-card class="subscription-cards">
          <a-row>
            <a-col :xs="16" :sm="16" :md="16">
              <a-statistic
                title="Billing"
                :value-style="{ color: '#ffffff' }"
                style="margin-right: 50px"
              >
              </a-statistic>
            </a-col>
            <a-col :xs="8" :sm="8" :md="8">
              <template>
                <a-icon type="money-collect" />
              </template>
            </a-col>
            <div class="text-dashboard">
              View a breakdown of your clubs billing history. Track pending
              payments and view individual transaction invoices.
            </div>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col :xs="24" :sm="24" :md="12">
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
        <club-subscription-overview :cards="cards" @fetchData="listInvoices" />
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
      <a-col :xs="24" :sm="24" :md="12">
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
    <a-row>
      <a-col :xs="24" :sm="24" :md="12">
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
        <div class="add-new-card gx-text-right"></div>
        <a-card class="gx-card-full gx-card-header-full">
          <div slot="title">
            <a-row type="flex">
              <a-col :xs="12" :sm="14" :md="12" :lg="14">
                Active Bank Detail
              </a-col>
              <a-col :xs="12" :sm="10" :md="12" :lg="10">
                <a-button
                  block
                  type="primary"
                  style="margin:0;"
                  size="small"
                  @click="redirectStripeAccount"
                >
                  Add Bank Account 
                </a-button>
              </a-col>
            </a-row>
          </div>

           <div v-if="bank.length > 0" class="credit-cards">
            <bank-card-preview
              v-for="(bbank, index) of bank"
              :key="index"
              :card="bbank"
            />
          </div>
          <n-section-loading  v-if="bankLoading" />
          <div v-if="!bankLoading && bank.length === 0">
            <n-section-empty
              warning="You have no bank account yet"
            />
          </div>
          
        </a-card>
      </a-col>
    </a-row>
    
  </n-page>

  
  
</template>

<script>
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { billingService } from "@/common/api/api.service";
import { mapGetters } from "vuex";
import NPage from "@/components/ui/n-page/n-page";
import StripeCardPreview from "@/components/billing/stripe-card-preview/stripe-card-preview";
import BankCardPreview from "@/components/billing/bank-card-preview/bank-card-preview"
import StripeNewCardModal from "@/components/billing/stripe-new-card-modal/stripe-new-card-modal";
import NSectionEmpty from "@/components/ui/n-section-empty/n-section-empty";
import StripeBillingHistoryTable from "@/components/billing/stripe-billing-history-table/stripe-billing-history-table";
import ClubSubscriptionOverview from "@/components/club-billing/club-subscription-overview/club-subscription-overview";
import NSectionLoading from "@/components/ui/n-section-loading/n-section-loading";
import notifications from "@/common/notifications/notification.service";
import { clubService } from "@/common/api/api.service";
export default {
  name: "SubscriptionOverview",
  components: {
    NSectionLoading,
    ClubSubscriptionOverview,
    StripeBillingHistoryTable,
    NSectionEmpty,
    StripeNewCardModal,
    StripeCardPreview,
    BankCardPreview,
    NPage
  },
  data() {
    return {
      newCardModalVisible: false,
      billing: [],
      plans: [],
      cards: [],
      bank:[],
      cardsLoading: false,
      billingLoading: true,
      bankLoading:false,
      subscriptions: [],
      error_msg: false,
      teams: 0,
      members: 0
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
    this.getSubscriptions();
    this.fetchStats();
    this.fetchBankDetails();
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
        .then(resp => {
          if (resp.data.success) {
            notifications.success("Card Removed Successfully");
            this.listCards();
          } else {
            notifications.warn(resp.data.message);
          }
        });
    },
    setDefault(tk) {
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
          this.fetchBankDetails();
        });
    },
    redirectStripeAccount(){
      billingService
        .redirectStripe({
          auth: {
            id: this.user.user.user_id,
            type: "club"
          }
        })
        .then(resp => {
          if (resp.data.success) {
            window.open(resp.data.data, '_blank')
          }
        });
    },

    
   fetchBankDetails() {
      this.bankLoading = false;
      billingService
        .listBankDetails({
          auth: {
            id: this.user.user.user_id,
            type: "club"
          }
        })
        .then(resp => {
          this.bankLoading = false;
          if (resp.data.success) {
            this.bank = resp.data.data;
            console.log("this.bank => ", this.bank)
          }
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
    },
    fetchStats() {
      const data = {
        role: this.user.select_role
      };
      clubService
        .fetchStats({ params: data })
        .then(resp => {
          if (resp.data.success) {
            this.teams = resp.data.teams;
            this.members = resp.data.members;
          }
        })
        .catch(() => {
          this.events = [];
        });
    }
  }
};
</script>
<style scoped>
.margin_top {
  margin-bottom: 20px;
}
.ant-card {
  z-index: 1;
  margin-bottom: 32px;
  box-shadow: -1px 6px 11px 1px #d6d4d4;
  border-bottom: 5px solid #028fd6;
}
.ant-statistic-title {
  margin-bottom: 4px;
  color: #595959;
  font-size: 18px;
}
i {
  font-size: 32px;
  align-items: center;
  display: flex;
  justify-content: center;
}
.text-dashboard {
  margin: 11px;
  color: goldenrod;
}
.ant-card-body {
  padding: 18px;
  padding-bottom: 4px;
  zoom: 1;
}
.ant-card-body {
  padding: 18px;
  padding-bottom: 8px !important;
  zoom: 1;
}
  .subscription-cards{
  height:160px
}
@media (max-width:1024px){
  .subscription-cards{
  height:210px
}
}
</style>
