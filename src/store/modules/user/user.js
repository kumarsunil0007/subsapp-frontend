import { memberService } from "@/common/api/api.service";
import { GET_USER, SET_USER } from "@/store/modules/user/user-actions";

export default {
  state: {
    user: {},
    player_profile: {},
    status: ""
  },
  getters: {
    getUser: state => state.user
  },
  mutations: {
    [SET_USER]: (state, payload) => {
      state.user = payload;
      state.status = "OK";
    }
  },
  actions: {
    [GET_USER]: ({ commit }, userId) => {
      memberService.get(userId).then(res => {
        if (res.data.success) {
          res.data.result.user_id = parseInt(res.data.result.user_id);
          commit(SET_USER, res.data.result);
        }
      });
    }
  }
};
