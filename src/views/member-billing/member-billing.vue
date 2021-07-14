<template>
  <n-page>
    <a-row>
      <a-col :xs="24" :sm="24" :md="8">
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
      <a-col :xs="24" :sm="24" :md="16">
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
import notifications from "@/common/notifications/notification.service";
export default {
  name: "MemberBilling",
  components: {
    StripeCardPreview,
    StripeNewCardModal,
    MemberBillingHistoryTable,
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
  },
  methods: {
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
          this.listCards();
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
