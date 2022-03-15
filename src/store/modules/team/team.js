import { teamService } from "@/common/api/api.service";
import {
  GET_TEAM,
  SET_TEAM,
  SET_TEAM_ZERO
} from "@/store/modules/team/team-actions";

export default {
  state: {
    team: [],
    status: ""
  },
  getters: {
    getTeam: state => state.team,
    getTeamLoadingStatus: state => state.status
  },
  mutations: {
    [SET_TEAM]: (state, payload) => {
      state.team = payload;
      state.status = "OK";
    },
    [SET_TEAM_ZERO]: state => {
      state.team = [];
      state.status = "";
    }
  },
  actions: {
    [GET_TEAM]: ({ commit }, params) => {
      teamService.get(params).then(res => {
        if (res.data.success) {
          res.data.result.id = parseInt(res.data.result.id);
          res.data.result.club_id = parseInt(res.data.result.club_id);
          commit(SET_TEAM, res.data.result);
        }
      });
    }
  }
};
