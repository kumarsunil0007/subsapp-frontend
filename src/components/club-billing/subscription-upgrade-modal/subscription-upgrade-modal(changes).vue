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
        <a-col :xs="24" :sm="24" :md="8" :lg="8" v-for="fd2 in firebasedata" :key="fd2.id">
          <div class="gx-package">
            <div class="gx-package-header gx-bg-cyan gx-text-white">
              <h2 class="gx-price"><i class="icon icon-halfstar"></i>{{fd2.name}}</h2>
              <p
                class="gx-letter-spacing-base gx-text-white gx-text-uppercase gx-mb-0"
              >
                <span v-if="!!fd2.metadata.total_amount">€{{parseFloat(fd2.metadata.total_amount).toFixed(2)}}</span>
                <span v-else>Contact Us!</span>
              </p>
            </div>
            <div class="gx-package-body">
              <ul class="gx-package-items">
                <li>
                  <a-icon type="user" />
                  {{fd2.metadata.club_members}}
                </li>
                <li>
                  <a-icon type="team" />
                    {{fd2.metadata.club_coach}}
                </li>
                <li>
                  <a-icon type="euro" />
                  {{fd2.metadata.transaction_processing_rate}}
                  
                </li>
                <li>
                  <a-icon type="safety-certificate" />
                  {{fd2.metadata.payouts}}
                </li>
              </ul>
              <div class="gx-package-footer">
                <span>
                <a-button
                  class="gx-btn-cyan"
                  @click="attemptUpgrade(fd2.id)"
                >
                  Select Plan
                </a-button>
                </span>

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
//import { listPlansData } from "@/common/api/api.service";

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
      contactFormModal: false,
      firebasedata: []
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
  mounted() {
    this.listPlans();
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
    listPlans(){
       fetch("https://api.stripe.com/v1/plans?limit=3", {
          method: "GET",
            headers: {
              Authorization: "Bearer sk_test_VbvVoI0XEzjpzgvvHogLGql2"
           }
      })
    .then(res => res.json())
        .then(response => {
          this.firebasedata = response.data;
          console.log(JSON.stringify(this.firebasedata));
        // console.log(response.data);
    });
    },

    contactForm() {
      console.log("hitt");
      this.$emit("openModal");
    },
    close() {
      this.$emit("close");
    },
  }
};
</script>
