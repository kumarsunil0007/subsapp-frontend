<template>
  <a-row type="flex" justify="space-around" align="middle">
   
    <a-col class="card-number" :xs="24" :sm="24" :md="24" :lg="14">
      <a-icon type="credit-card" />
        **** **** **** {{card.lastFourDigit}} 
      <br />
      {{ card.name }} 
    </a-col>
    </a-row>
</template>

<script>
export default {
  name: "BankCardPreview",
  props: {
    card: {
      type: Object,
      required: true
    }
  },

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
