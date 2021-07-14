import removeNamespace from "@/common/store-handlers/namespace-helper";

export const UITypes = {
  getters: {
    GET_SIDEBAR: "ui/GET_SIDEBAR"
  },
  mutations: {
    TOGGLE_SIDEBAR: "ui/TOGGLE_SIDEBAR",
    HIDE_SIDEBAR: "ui/HIDE_SIDEBAR"
  }
};

export const _UITypes = removeNamespace("ui/", UITypes);
