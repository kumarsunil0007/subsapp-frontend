<template>
  <transition name="fade" mode="out-in">
    <div
      class="loader-wrapper"
      :class="{
        'no-bg': !background,
        'small-loader': size === 'small',
        'full-bg': size === 'full'
      }"
    >
      <div class="loader-body">
        <p style="text-align: center"><a-spin /></p>
      </div>
    </div>
  </transition>
</template>
<style scoped>
.loader-wrapper.small-loader {
  padding: 4px !important;
}

/** Full Screen **/
.loader-wrapper.full-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-wrapper.full-bg loader-body {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 50%;
}

.loader-wrapper.no-bg {
  background: transparent !important;
}
.loader-wrapper {
  padding: 40px;
  background-image: linear-gradient(
    117deg,
    rgba(199, 239, 207, 0.5),
    rgba(111, 202, 179, 0.5) 98%,
    rgba(103, 181, 158, 0.5)
  );
}
.loader-body > div {
  margin-top: 32px;
}
.loader-body p {
  font-size: 18px;
  font-weight: bold;
  margin-top: 18px;
  color: #41b882;
}
</style>
<script>
export default {
  name: "NSectionLoading",
  props: {
    background: {
      default: true,
      type: Boolean
    },
    text: {
      default: "loading...",
      type: String
    },
    size: {
      default: "large",
      type: String
    }
  }
};
</script>
