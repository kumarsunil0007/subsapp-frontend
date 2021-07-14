<template>
  <div class="credit-card-inputs" :class="{ complete }">
    <a-row>
      <a-col :span="24">
        <card-number
          ref="cardNumber"
          class="stripe-element card-number"
          :stripe="stripe"
          :options="options"
          @change="number = $event.complete"
        />
      </a-col>
      <a-col :span="12">
        <card-expiry
          ref="cardExpiry"
          class="stripe-element card-expiry"
          :stripe="stripe"
          :options="options"
          @change="expiry = $event.complete"
        />
      </a-col>
      <a-col :span="12">
        <card-cvc
          ref="cardCvc"
          class="stripe-element card-cvc"
          :stripe="stripe"
          :options="options"
          @change="cvc = $event.complete"
        />
      </a-col>
      <a-col :span="24">
        <a-button block type="primary" @click="getToken">Save</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  CardNumber,
  CardExpiry,
  CardCvc,
  createToken
} from "vue-stripe-elements-plus";

export default {
  components: { CardNumber, CardExpiry, CardCvc },
  props: ["stripe"],
  data() {
    return {
      options: {
        style: {
          base: {
            // Add your base input styles here. For example:
            fontSize: "16px",
            color: "#32325d"
          }
        }
      },
      complete: false,
      number: false,
      expiry: false,
      cvc: false
    };
  },
  watch: {
    number() {
      this.update();
    },
    expiry() {
      this.update();
    },
    cvc() {
      this.update();
    }
  },
  methods: {
    getToken() {
      createToken().then(resp => {
        this.$emit("token", resp.token);
      });
    },
    update() {
      this.complete = this.number && this.expiry && this.cvc;

      // field completed, find field to focus next
      if (this.number) {
        if (!this.expiry) {
          this.$refs.cardExpiry.focus();
        } else if (!this.cvc) {
          this.$refs.cardCvc.focus();
        }
      } else if (this.expiry) {
        if (!this.cvc) {
          this.$refs.cardCvc.focus();
        } else if (!this.number) {
          this.$refs.cardNumber.focus();
        }
      }
      // no focus magic for the CVC field as it gets complete with three
      // numbers, but can also have four
    }
  }
};
</script>

<style>
.StripeElement {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  list-style: none;
  position: relative;
  display: inline-block;
  padding: 12px 11px;
  width: 100%;
  height: 44px;
  line-height: 44px;
  color: rgba(0, 0, 0, 0.65);
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
.credit-card-inputs.complete {
  border: 2px solid green;
}
</style>
