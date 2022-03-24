<template>
  <a-row type="flex" justify="space-around" align="middle">
    <a-col class="card-number" :xs="24" :sm="24" :md="24" :lg="14">
      <a-icon type="credit-card" />
      **** **** **** {{ card.last4 }}
      <br />
      {{ card.exp_month }}/{{ card.exp_year }}
    </a-col>
    <a-col :xs="24" :sm="24" :md="24" :lg="10" class="gx-text-right">
      <div v-if="card.default" class="card-default">
        <a-tag color="#108ee9"  style="margin-right:0;">Default</a-tag>
      </div>
      <a-button
        v-if="!card.default"
        style="margin-top:12px;"
        size="small"
        block
        type="primary"
        @click="setDefault"
      >
        Make Default
      </a-button>
      <a-button  v-if="card.default!=1" size="small" block type="danger" @click="removeCard">
        Remove
      </a-button>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: "StripeCardPreview",
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeCard() {
      this.$emit("remove", this.card.tk);
    },
    setDefault() {
      this.$emit("setDefault", this.card.tk);
    }
  }
};
</script>

<style scoped lang="scss">
.credit-cards {
  & > div {
    background: #f9f9f9;
    font-size: 16px;
    padding: 12px;
  }
  & > div:nth-child(odd) {
    background: #ededed;
  }
}
</style>
