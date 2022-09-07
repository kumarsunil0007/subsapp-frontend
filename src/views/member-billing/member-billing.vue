<template>
  <n-page>
    <a-row>
      <a-col :xs="24" :sm="24" :md="12">
        <div class="add-new-card gx-text-right">
          <a-button type="primary" @click="openNewCardModal">
            Add new Card 
          </a-button>
        </div>
        <a-card title="Active Cards" class="gx-card-full">
          <div class="credit-cards">
            <stripe-card-preview
              v-for="(card, index) of cards"
              :key="index"
              :card="card"
              @remove="removeCard"
              @setDefault="setDefault"
            />
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12">
        <a-card
          title="My Billing History"
          class="gx-card-table-full gx-table-responsive"
        >
          <member-billing-history-table />
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
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
import { billingService } from "@/common/api/api.service";
import MemberBillingHistoryTable from "@/components/member-billing/member-billing-history-table/member-billing-history-table";
import StripeNewCardModal from "@/components/billing/stripe-new-card-modal/stripe-new-card-modal";
import StripeCardPreview from "@/components/billing/stripe-card-preview/stripe-card-preview";
import BankCardPreview from "@/components/billing/bank-card-preview/bank-card-preview"
import notifications from "@/common/notifications/notification.service";
import { clubService } from "@/common/api/api.service";
export default {
  name: "MemberBilling",
  components: {
    StripeCardPreview,
    StripeNewCardModal,
    MemberBillingHistoryTable,
    BankCardPreview,
    NPage
  },
  data() {
    return {
      newCardModalVisible: false,
      cards: []
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  },
  mounted() {
    this.listCards();
    this.fetchBankDetails();

  },
  methods: {
    openNewCardModal() {
      this.newCardModalVisible = true;
    },
    getA : async() => {
        
    },
    closeNewCardModalVisible() {
      this.newCardModalVisible = false;
    },
  fetchRoles() {
      clubService.fetchRoles().then(resp => {
        if (resp.data.success) {
          let userData = JSON.parse(localStorage.getItem("authUserData"));
          userData.user_type = resp.data.result;
          window.localStorage.setItem("authUserData", JSON.stringify(userData));
          this.$store.commit("AUTH_STATE");
        }
      });
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
        .then(resp => {
          if (resp.data.success) {
            notifications.success("Awesome! Your default card was updated");
          } else {
            notifications.success(
              "Oops, something went wrong. We could updated your default your card."
            );
          }
          this.listCards();
        });
    },
    saveCard(token) {
      billingService
        .saveCard({
          auth: {
            id: this.user.user.user_id,
            type: "user"
          },
          tk: token
        })
        .then(resp => {
          if (resp.data.success) {
            notifications.success("Awesome! Your card was added successfully");
          } else {
            notifications.success(
              "Oops, something went wrong. We could not add your card."
            );
          }
        //  this.user.user.no_of_cards = this.user.user.no_of_cards +1 ;
          this.listCards();
          this.fetchRoles();
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
            this.user.user.no_of_cards = resp.data.no_of_cards;            

          }
        });
    },
  fetchBankDetails() {
      this.bankLoading = true;
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

  }
};
</script>

<style scoped></style>
