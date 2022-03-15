<template>
  <div class="error-container">
    <div class="">
      <div v-if="image" class="error-icon">
        <img :src="image" />
      </div>
      <div class="error-body">
        <div class="error-text">
          {{ warning }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NSectionEmpty",
  props: {
    image: {
      type: String,
      required: false,
      default: function() {
        return "";
      }
    },
    warning: {
      required: false,
      type: String,
      default: function() {
        return "No records found";
      }
    }
  }
};
</script>

<style scoped>
.error-container {
  padding: 32px 0;
  background-color: #ececec;
  text-align: center;
}
.error-icon {
  max-width: 96px;
  display: inline-block;
  border-radius: 50%;
  background: #efefef;
  padding: 12px;
  box-shadow: 0 0 3pt 2pt #0000000d;
  margin-right: 24px;
}
.error-body {
  padding: 0 24px;
  text-align: left;
  display: inline-block;
  max-width: 300px;
  font-size: 18px;
  color: #a7adbf;
  font-weight: 500;
}
.error-body .error-text {
  top: 6px;
  position: relative;
}
</style>
