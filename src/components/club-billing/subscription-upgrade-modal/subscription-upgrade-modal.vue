<template>
  <a-modal
    v-model="isVisible"
    title="Subscription Plans"
    width="1200px"
    @cancel="close"
    @ok="close"
  >
    <a-spin :spinning="spinning">
      <a-row type="flex" :gutter="10">
        <!-- <a-col :xs="24" :sm="24" :md="6" :lg="6">
          <div class="gx-package">
            <div class="gx-package-header gx-bg-primary gx-text-white">
              <h2 class="gx-price">
                <i class="icon icon-halfstar"></i>Free Plan
              </h2>
              <p
                class="gx-letter-spacing-base gx-text-white gx-text-uppercase gx-mb-0"
              >
                <span>€0.00/month</span>
              </p>
            </div>
            <div class="gx-package-body">
              <ul class="gx-package-items">
                <li>
                  <a-icon type="user" />
                  Up to 20 Club Members
                </li>
                <li>
                  <a-icon type="team" />
                  1 Club Coach
                </li>
                <li>
                  <a-icon type="euro" />
                  2% + €0.30 Transaction processing rate
                </li>
                <li>
                  <a-icon type="safety-certificate" />
                  Monthly Payouts
                </li>
              </ul>
              <div class="gx-package-footer">
                <!--<a-button-->
        <!--type="primary"-->
        <!--@click="attemptUpgrade('stripe_plan_free')">-->
        <!--Select Plan plan_F90t4jMmr704Up-->
        <!--Select Plan plan_F90uT88HPbLzYO,plan_F90uIZHiMeBaVm-->
        <!--</a-button>
                <a-button
                  type="primary"
                  @click="attemptUpgrade('price_1JCh7LSDwmaq7GuvvefvXn2G')"
                >
                  Select Plan
                </a-button>
              </div>
            </div>
          </div>
        </a-col> -->
        <a-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="gx-package">
            <div class="gx-package-header gx-bg-cyan gx-text-white">
              <h2 class="gx-price"><i class="icon icon-halfstar"></i>Silver</h2>
              <p
                class="gx-letter-spacing-base gx-text-white gx-text-uppercase gx-mb-0"
              >
                <span>€9.99/month</span>
              </p>
            </div>
            <div class="gx-package-body">
              <ul class="gx-package-items">
                <li>
                  <a-icon type="user" />
                  Up to 200 Club Members
                </li>
                <li>
                  <a-icon type="team" />
                  20 Club Coach
                </li>
                <li>
                  <a-icon type="euro" />
                  2% + €0.30 Transaction processing rate
                </li>
                <li>
                  <a-icon type="safety-certificate" />
                  Monthly Payouts
                </li>
              </ul>
              <div class="gx-package-footer">
                <a-button
                  class="gx-btn-cyan"
                  @click="attemptUpgrade('price_1KjIINCg8u1Dv8tMWEa3IRa0')"
                >
                  Select Plan
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="gx-package">
            <div class="gx-package-header gx-bg-cyan gx-text-white">
              <h2 class="gx-price"><i class="icon icon-halfstar"></i>Gold</h2>
              <p
                class="gx-letter-spacing-base gx-text-white gx-text-uppercase gx-mb-0"
              >
                <span>€19.99/month</span>
              </p>
            </div>
            <div class="gx-package-body">
              <ul class="gx-package-items">
                <li>
                  <a-icon type="user" />
                  Up to 500 Club Members
                </li>
                <li>
                  <a-icon type="team" />
                  50 Club Coach
                </li>
                <li>
                  <a-icon type="euro" />
                  2% + €0.30 Transaction processing rate
                </li>
                <li>
                  <a-icon type="safety-certificate" />
                  Monthly Payouts
                </li>
              </ul>
              <div class="gx-package-footer">
                <a-button
                  class="gx-btn-cyan"
                  @click="attemptUpgrade('price_1KjIItCg8u1Dv8tMzdst1LKV')"
                >
                  Select Plan
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="gx-package">
            <div class="gx-package-header gx-bg-primary gx-text-white">
              <h2 class="gx-price">
                <i class="icon icon-halfstar"></i>Unlimited
              </h2>
              <p
                class="gx-letter-spacing-base gx-text-white gx-text-uppercase gx-mb-0"
              >
                <span>Contact Us!</span>
              </p>
            </div>
            <div class="gx-package-body">
              <ul class="gx-package-items">
                <li>
                  <a-icon type="user" />
                  Unlimited Club Members
                </li>
                <li>
                  <a-icon type="team" />
                  Unlimited Club Coaches
                </li>
                <li>
                  <a-icon type="euro" />
                  Tailored transaction fees
                </li>
                <li>
                  <a-icon type="safety-certificate" />
                  Tailored Payouts
                </li>
              </ul>
              <div class="gx-package-footer">
                <!-- href="mailto:info@subsapp.com" -->

                <a-button type="primary" @click="contactForm">
                  Contact Us
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-spin>
    <div slot="footer" />
  </a-modal>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import { billingService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";
export default {
  name: "SubscriptionUpgradeModal",
  mixins: [nTime, nCurrency],
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      spinning: false,
      contactFormModal: false
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.visible;
      },
      set() {
        return false;
      }
    }
  },
  methods: {
    attemptUpgrade(plan) {
      this.spinning = true;
      billingService
        .attemptUpgrade({
          planId: plan
        })
        .then(resp => {
          this.spinning = false;
          if (resp.data.success) {
            this.close();
            notifications.success("Successfully upgraded your account.");
          } else {
            notifications.warn(resp.data.message);
          }
        })
        .catch(() => {
          this.spinning = false;
          notifications.warn(
            "We could not upgrade your account, please ensure your account has a valid card or contact support."
          );
        });
    },
    contactForm() {
      console.log("hitt");
      this.$emit("openModal");
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>