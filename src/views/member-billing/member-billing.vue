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
          title="Manage My Payments History"
          class="gx-card-table-full gx-table-responsive"
        >
          <member-billing-history-table />
        </a-card>
      </a-col>
    </a-row>
    <div class="member-welcome-modal">
      <a-modal v-model="visible" :mask-closable="false" class="welcome-modal">
        <a-carousel :after-change="onMemberModalChange" arrows>
          <div>
            <a-row type="flex" align="middle" class="gx-pt-5">
              <a-col :lg="14" :md="24">
                <h1>WELCOME</h1>
                <h2>To Subsapp.com</h2>
                <p>You have successfully logged in as a Member.</p>
              </a-col>
              <a-col :lg="10" :md="24">
                <img src="../../assets/images/slide1.png" alt="slide1" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle" class="gx-pt-5">
              <a-col :lg="12" :md="24">
                <h3>As a member you can check your schedule.</h3>
              </a-col>
              <a-col :lg="12" :md="24">
                <img src="../../assets/images/slide2.png" alt="slide2" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle" class="gx-pt-4">
              <a-col :lg="12" :md="24">
                <h4>
                  As a member you may join a club and accept/decline club and
                  event invitations.
                </h4>
              </a-col>
              <a-col :lg="12" :md="24">
                <img src="../../assets/images/slide3.png" alt="slide3" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle" class="gx-pb-5">
              <a-col :lg="12" :md="24">
                <h3>Subsapp.com helps you check team status.</h3>
              </a-col>
              <a-col :lg="12" :md="24">
                <img src="../../assets/images/slider4.png" alt="slide4" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle">
              <a-col :lg="12" :md="24">
                <p>
                  Subsapp.com operates in partnership with Stripe. Meaning
                  payments are easy and secure.
                </p>
              </a-col>
              <a-col :lg="12" :md="24">
                <img src="../../assets/images/slider5.png" alt="slide5" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle" class="gx-pt-5">
              <a-col :lg="12" :md="24">
                <h2>Enter your</h2>
                <p>card details and become a member</p>
              </a-col>
              <a-col :lg="12" :md="24">
                <img src="../../assets/images/slider6.png" alt="slide6" />
              </a-col>
            </a-row>
          </div>
          <template v-if="displayMemberPreviousBtn" #prevArrow>
            <div class="custom-slick-arrow" style="z-index: 1; left: 8px">
              Previous
            </div>
          </template>
          <template v-if="displayMemberNextBtn" #nextArrow>
            <div class="custom-slick-arrow" style="right: 8px">Next</div>
          </template>
        </a-carousel>
        <div
          v-if="!displayMemberNextBtn"
          class="custom-slick-arrow click-btn custom-btn"
          @click="updateIsloggedIn"
        >
          Click here
        </div>
      </a-modal>
    </div>
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
import { billingService, authService } from "@/common/api/api.service";
import MemberBillingHistoryTable from "@/components/member-billing/member-billing-history-table/member-billing-history-table";
import StripeNewCardModal from "@/components/billing/stripe-new-card-modal/stripe-new-card-modal";
import StripeCardPreview from "@/components/billing/stripe-card-preview/stripe-card-preview";
// import BankCardPreview from "@/components/billing/bank-card-preview/bank-card-preview";
import notifications from "@/common/notifications/notification.service";
import { clubService } from "@/common/api/api.service";
export default {
  name: "MemberBilling",
  components: {
    StripeCardPreview,
    StripeNewCardModal,
    MemberBillingHistoryTable,
    // BankCardPreview,
    NPage,
  },
  data() {
    return {
      newCardModalVisible: false,
      cards: [],
      visible: true,
      displayMemberPreviousBtn: false,
      displayMemberNextBtn: true,
      error_msg: false,
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER,
    }),
  },
  mounted() {
    this.listCards();
    this.fetchBankDetails();
    this.checkModalDisplay();
  },
  methods: {
    openNewCardModal() {
      this.newCardModalVisible = true;
    },
    onMemberModalChange(index) {
      console.log(index);
      this.displayMemberPreviousBtn = index === 0 ? false : true;
      this.displayMemberNextBtn = index === 5 ? false : true;
    },
    getA: async () => {},
    closeNewCardModalVisible() {
      this.newCardModalVisible = false;
    },
    fetchRoles() {
      clubService.fetchRoles().then((resp) => {
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
            type: "user",
          },
          tk: tk,
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
            type: "user",
          },
          tk: tk,
        })
        .then((resp) => {
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
            type: "user",
          },
          tk: token,
        })
        .then((resp) => {
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

    redirectStripeAccount() {
      billingService
        .redirectStripe({
          auth: {
            id: this.user.user.user_id,
            type: "club",
          },
        })
        .then((resp) => {
          if (resp.data.success) {
            window.open(resp.data.data, "_blank");
          }
        });
    },

    listCards() {
      billingService
        .listCards({
          auth: {
            id: this.user.user.user_id,
            type: "user",
          },
        })
        .then((resp) => {
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
            type: "club",
          },
        })
        .then((resp) => {
          this.bankLoading = false;
          if (resp.data.success) {
            this.bank = resp.data.data;
            console.log("this.bank => ", this.bank);
          }
        });
    },
    checkModalDisplay() {
      let userData = JSON.parse(localStorage.getItem("authUserData"));
      console.log("userData => ", userData);
      this.visible =
        userData.is_logged_in || this.user.user.is_logged_in ? false : true;
    },
    updateIsloggedIn() {
      authService.updateUserLoggedIn().then(() => {
        let userData = JSON.parse(localStorage.getItem("authUserData"));
        userData.is_logged_in = 1;
        window.localStorage.setItem("authUserData", JSON.stringify(userData));
        this.visible = false;
      });
    },
  },
};
</script>

<style scoped>
.welcome-modal .ant-modal-body {
  padding: 0;
}

.welcome-modal .ant-modal .ant-modal-content {
  padding: 20px;
}

.welcome-modal .ant-modal-body {
  padding: 0;
}

#show-cal {
  color: #2c3e50;
  height: 67vh;
  margin-left: auto;
  margin-right: auto;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 120px;
  height: 36px;
  font-size: 16px;
  color: #38d0f9;
  background-color: #fff;
  text-align: center;
  opacity: 1;
  line-height: 36px;
  border-radius: 20px;
  bottom: 0;
  top: 94%;
}

.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}

.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.8;
}

.ant-carousel >>> .slick-slide {
  line-height: 100px;
  padding: 50px 0;
}

.ant-carousel >>> .slick-slide h1 {
  color: #fff;
  letter-spacing: 0.05em;
  font-weight: 500;
  line-height: 80px;
  font-size: 64px;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
}

.ant-carousel >>> .slick-slide h2 {
  color: #fff;
  font-size: 45px;
  font-weight: 500;
  line-height: 60px;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
  letter-spacing: 0.05em;
}

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
  font-size: 42px;
  font-weight: 500;
  line-height: 50px;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
  letter-spacing: 0.05em;
}

.ant-carousel >>> .slick-slide h4 {
  color: #fff;
  font-size: 36px;
  font-weight: 500;
  line-height: 50px;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
  letter-spacing: 0.05em;
}

.ant-carousel >>> .slick-slide p {
  color: #fff;
  font-size: 30px;
  line-height: 40px;
  margin-top: 10px;
  letter-spacing: 0.1em;
  font-weight: 400;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
}

.welcome-modal .ant-modal .ant-modal-content {
  padding: 20px;
}

.welcome-modal .ant-modal-body {
  padding: 0;
}

.ant-carousel .click-btn .custom-slick-arrow {
  cursor: pointer;
}
</style>
