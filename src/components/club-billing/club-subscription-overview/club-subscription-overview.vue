<template>
  <a-card
    class="gx-card-widget gx-card-widget gx-card-full gx-p-3 gx-bg-red gx-text-white"
    :class="[{ 'gx-bg-cyan': sub && sub.active }]"
  >
    <div class="gx-media gx-align-items-center gx-flex-nowrap">
      <div class="gx-mr-2 gx-mr-xxl-3">
        <a-icon type="euro" class="gx-fs-icon-lg" />
      </div>
      <div class="gx-media-body">
        <a-row type="flex">
          <a-col v-if="sub && sub.active" :span="24">
            <h4 class="gx-text-white">
              Great! You have an active subscription
            </h4>
            <p>
              <strong>{{ sub.members }} Members</strong>
              <strong
                >{{ sub.admins }} Club Admin<template v-if="sub.admins > 1"
                  >s</template
                >
              </strong>
            </p>
            <p style="padding:0;">
              Renew date:
              {{ sub.current_period_end }}
            </p>
          </a-col>
          <a-col v-else :span="24">
            <h4 class="gx-text-white" style="margin-bottom:0;">
              You currently have no subscription, please upgrade to start using
              SubsApp
            </h4>
          </a-col>
          <a-col :span="24" class="gx-pt-3">
            <a-button type="primary" @click="openUpgradeModal">
              Select Subscription
            </a-button>
            <a-popconfirm
              v-if="sub && sub.active"
              placement="top"
              ok-text="Yes"
              cancel-text="No"
              @confirm="cancelSubscription"
            >
              <template slot="title">
                <p>Are you sure to cancel the subscription</p>
              </template>
              <a-button type="danger">Cancel Subscription</a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </div>
    </div>
    <subscription-upgrade-modal
      :visible="upgradeModal"
      @close="closeUpgradeModal"
      @openModal="openModal"
    />
    <contact-form-modal
      :show-contact-form-modal="showContactFormModal"
      @close="showContactFormModal = false"
    ></contact-form-modal>
  </a-card>
</template>

<script>
import { mapGetters } from "vuex";
import notifications from "@/common/notifications/notification.service";
import time from "@/mixins/time";
import contactFormModal from "@/components/club-billing/club-contact-form/contact-form-modal.vue";
import {
  AUTH_USER,
  AUTH_SUBSCRIPTION,
  FETCH_SUBSCRIPTION
} from "@/store/modules/auth/auth-actions";
import SubscriptionUpgradeModal from "@/components/club-billing/subscription-upgrade-modal/subscription-upgrade-modal";
import { billingService } from "@/common/api/api.service";
export default {
  name: "ClubSubscriptionOverview",
  components: { SubscriptionUpgradeModal, contactFormModal },
  mixins: [time],
  // eslint-disable-next-line vue/require-prop-types
  props: ["cards"],
  data() {
    return {
      newCardModalVisible: false,
      billing: [],
      plans: [],
      subscriptions: [],
      upgradeModal: false,
      showContactFormModal: false
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER,
      sub: AUTH_SUBSCRIPTION
    })
  },
  mounted() {
    this.fetchSubscription();
  },
  methods: {
    openModal(){
      this.upgradeModal = false;
      this.showContactFormModal = true;
    },
    fetchSubscription() {
      this.$store.dispatch(FETCH_SUBSCRIPTION);
    },
    openUpgradeModal() {
      if (this.cards.length <= 0) {
        notifications.warn("Please add a card to your account first");
      } else {
        this.upgradeModal = true;
      }
    },
    closeUpgradeModal() {
      this.$store.dispatch(FETCH_SUBSCRIPTION);
      this.upgradeModal = false;
    },
    async cancelSubscription() {
      await billingService.cancelSubscription().then(resp => {
        if (resp.data.success) {
          notifications.success("Your subscription is cancelled");
        } else {
          notifications.warn(resp.data.message);
        }
      });
      this.$store.dispatch(FETCH_SUBSCRIPTION);
    }
  }
};
</script>

<style scoped></style>
