<template>
  <router-link tag="div" :to="to" class="box-list">
    <div v-if="icon" class="box-list--icon">
      <!--<font-awesome-icon :icon="icon" size="4x" />-->
    </div>
    <div class="box-list--body">
      <slot />
      <h4><slot name="title" /></h4>
      <slot name="description" />
    </div>
  </router-link>
</template>

<script>
export default {
  name: "NBox",
  props: {
    icon: {
      type: String,
      required: false,
      default: null
    },
    to: {
      required: false,
      default: "",
      type: String
    }
  }
};
</script>

<style scoped lang="scss">
.box-list {
  background: #f0f6ff59;
  border: 1px solid #d7dadca6;
  border-radius: 5px;
  margin: 6px;
  padding: 12px;
  cursor: pointer;
  transition: 0.25s ease-in-out all;
  &:hover {
    background: #eff5ff;
  }
  &--body {
    padding: 2px 14px;
  }
}
</style>
