import { _UITypes } from "@/store/modules/ui/ui-actions";

export default {
  namespaced: true,
  state: {
    sidebar: false
  },
  getters: {
    [_UITypes.getters.GET_SIDEBAR]: state => state.sidebar
  },
  mutations: {
    [_UITypes.mutations.TOGGLE_SIDEBAR](state) {
      state.sidebar = !state.sidebar;
    },
    [_UITypes.mutations.HIDE_SIDEBAR]: state => {
      state.sidebar = false;
    }
  },
  actions: {}
};
