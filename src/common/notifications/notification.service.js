import Vue from "vue";

/**
 * System notifications
 * @type {{success(*=): void, warn(*=): void}}
 */
const notifications = {
  success(text) {
    Vue.notify({
      type: "success",
      title: text,
      group: "foo"
    });
  },
  warn(text) {
    Vue.notify({
      type: "warn",
      title: text,
      group: "foo"
    });
  }
};

export default notifications;
