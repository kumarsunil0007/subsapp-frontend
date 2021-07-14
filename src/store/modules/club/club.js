import { clubService } from "@/common/api/api.service";
import { GET_MY_CLUB, SET_CLUB, GET_CLUB_BILLING, SET_CLUB_BILLING } from "@/store/modules/club/club-actions";

export default {
  state: {
    club: [],
    clubLoading: true,
    billing: [],
    billingStatus: [],
    clubBillingLoading: true,
    status: ""
  },
  getters: {
    getClub: state => state.club,
    getClubLoadingStatus: state => state.clubLoading,
    getClubBilling: state => state.billing,
    ClubBillingLoading: state => state.clubBillingLoading,
    getClubBillingStatus: state => state.billingStatus,
  },
  mutations: {
    [SET_CLUB]: (state, payload) => {
      state.club = payload;
      state.status = "OK";
    },
    [SET_CLUB_BILLING]: (state, payload) => {
      state.billing = payload;
      state.getClubBillingStatus = "OK";
    }
  },
  actions: {
    [GET_MY_CLUB]: ({ commit, state }) => {
      state.clubLoading = true;
      clubService.getMyClub().then(res => {
        if (res.data.success) {
          res.data.result.id = parseInt(res.data.result.id);
          commit(SET_CLUB, res.data.result);
        }
        state.clubLoading = false;
      });
    },
    [GET_CLUB_BILLING]: ({ commit }) => {
      clubService.getMyClubBilling().then(res => {
        if (res.data.success) {
          commit(SET_CLUB_BILLING, res.data.result);
        }
      });
    }
  }
};
