<template>
  <a-modal
    :visible="visible"
    title="Add a new Card"
    ok-text=""
    class="hide-ok-button"
    @cancel="close"
  >
    <!--stripe="pk_live_GrKLWgdBEmSWdfax3yZDX8ED"-->
    <!--stripe="pk_test_vtiw9yjBNR5blLsfDUKMA3pY"-->
    <!-- for testing -->
    <!-- pk_test_51J7cRySDwmaq7Guvcfo34XOHvrV5eFyxyBkskUEDetAmNJn5RT0k1WJKNushY53PksZxm57TY2FWJM6snZtqgIxE006sBsVAUk -->

    <stripe-card
      v-if="visible"
      stripe="pk_test_51J7cRySDwmaq7Guvcfo34XOHvrV5eFyxyBkskUEDetAmNJn5RT0k1WJKNushY53PksZxm57TY2FWJM6snZtqgIxE006sBsVAUk"
      :options="{}"
      @token="saveCard"
    />
    <div slot="footer" style="padding-left:8px;padding-right: 8px;">
      <a-row>
        <a-col :xs="10" :sm="6" class="gx-text-left">
          <img src="@/assets/ssl_rapid_secured.gif" />
        </a-col>
        <a-col :xs="14" :sm="18" style="text-align: right;">
          <a-button>Cancel</a-button>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>
<style>
.hide-ok-button .ant-modal-footer .ant-btn.ant-btn-primary {
  display: none;
}
.hide-ok-button .ant-modal-footer .ant-btn.ant-btn-default {
  margin: 0;
}
</style>
<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import StripeCard from "@/components/billing/stripe-card/stripe-card";

export default {
  name: "StripeNewCardModal",
  components: { StripeCard },
  mixins: [nTime, nCurrency],
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean
    }
  },
  data() {
    return {};
  },
  methods: {
    saveCard(tk) {
      this.$emit("token", tk);
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
