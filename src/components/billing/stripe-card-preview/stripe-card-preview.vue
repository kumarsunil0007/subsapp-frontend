<template>
  <a-row type="flex" justify="space-around" align="middle">
    <a-col class="card-number" :xs="24" :sm="24" :md="10" :lg="12">
      <a-icon type="credit-card" />
      **** **** **** {{ card.last4 }}
      <br />
      {{ card.exp_month }}/{{ card.exp_year }}
    </a-col>
    <a-col :xs="24" :sm="24" :md="4" :lg="4">
      <div v-if="card.default" class="card-default">
        <a-tag color="#108ee9">Default</a-tag>
      </div>
    </a-col>
    <a-col :xs="24" :sm="24" :md="10" :lg="8" class="gx-text-right">
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
      <a-button size="small" block type="danger" @click="removeCard">
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
