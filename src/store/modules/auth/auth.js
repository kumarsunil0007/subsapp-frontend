/* eslint-disable promise/param-names */
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_STATE,
  FETCH_SUBSCRIPTION,
  AUTH_LOGOUT,
  AUTH_USER,
  AUTH_SUBSCRIPTION,
  AUTH_TOKEN,
  SET_SUBSCRIPTION,
  SET_PROFILE,
  FETCH_PROFILE,
  AUTH_STATUS,
  AUTH_MESSAGE
} from "./auth-actions";
import { saveToken, destroyToken, getToken } from "@/common/api/jwt.service";
import { authService, billingService } from "@/common/api/api.service";

const getUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem("auth-user"));
  } catch (e) {
    return [];
  }
};
const removeUser = () => {
  window.localStorage.removeItem("auth-user");
};

const getSubscription = () => {
  return JSON.parse(window.localStorage.getItem("subscription"));
};
const removeLocalSubscription = () => {
  window.localStorage.removeItem("subscription");
};

const state = {
  token: getToken(),
  user: getUser(),
  subscription: getSubscription(),
  status: "PENDING",
  userProfileLoading: true,
  message: "",
  hasLoadedOnce: false
};

const getters = {
  isAuthenticated: state => !!state.token,
  userProfileLoading: state => state.userProfileLoading,
  [AUTH_USER]: state => state.user,
  [AUTH_SUBSCRIPTION]: state => state.subscription,
  [AUTH_TOKEN]: state => state.token,
  [AUTH_STATUS]: state => state.status,
  [AUTH_MESSAGE]: state => state.message
};

const actions = {
  [AUTH_REQUEST]: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      // The Promise used for router redirect in login
      commit(AUTH_REQUEST);
      authService
        .login(user)
        .then(resp => {
          if (resp.data.success) {
            const token = resp.data.token;
            saveToken(token);

            const roles = resp.data.user_type;
            // eslint-disable-next-line no-unused-vars
            let select_role;
            if (roles.indexOf("admin") !== -1) {
              select_role = roles[roles.indexOf("admin")];
            } else if (roles.indexOf("club_admin") !== -1) {
              select_role = roles[roles.indexOf("club_admin")];
            } else if (roles.indexOf("coach") !== -1) {
              select_role = roles[roles.indexOf("coach")];
            } else {
              select_role = roles[roles.indexOf("member")];
            }

            let userData = JSON.stringify({
              user: resp.data.user,
              user_type: resp.data.user_type,
              no_of_cards : resp.data.no_of_cards,
              select_role: select_role,
              app: resp.data.app
            });
            window.localStorage.setItem("auth-user", userData);
            window.localStorage.setItem(
              "subscription",
              JSON.stringify(resp.data.subscription)
            );
            commit(AUTH_SUCCESS, resp.data);
            resolve(true);
          } else {
            commit(AUTH_ERROR, resp.data.message);
            resolve(false);
          }
        })
        .catch(err => {
          commit(AUTH_ERROR, "Incorrect Details");
          destroyToken();
          removeUser();
          reject(err);
        });
    });
  },
  // eslint-disable-next-line no-unused-vars
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      // The Promise used for router redirect in login
      authService
        .logout()
        // eslint-disable-next-line no-unused-vars
        .then(resp => {
          commit(AUTH_LOGOUT);
          resolve(true);
        })
        .catch(err => {
          // if resp is unauthorized, logout, to
          commit(AUTH_LOGOUT);
          reject(err);
        });
    });
  },
  [FETCH_PROFILE]: ({ commit, state }) => {
    state.userProfileLoading = true;
    authService.fetchProfile().then(resp => {
      if (resp.data.success) {
        commit(SET_PROFILE, resp.data.result);
      } else {
        commit(AUTH_LOGOUT);
      }
      state.userProfileLoading = false;
    });
  },
  [FETCH_SUBSCRIPTION]: ({ commit, state }) => {
    billingService
      .getCustomSubscriptions({
        auth: {
          type: "club",
          id: state.user.user.user_id
        }
      })
      .then(resp => {
        if (resp.data.success) {
          commit(SET_SUBSCRIPTION, resp.data.result);
        } else {
          commit(AUTH_LOGOUT);
        }
      });
  }
};

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = "loading";
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = "success";
    state.token = resp.token;
    state.user = getUser();
    state.subscription = getSubscription();
    state.hasLoadedOnce = true;
  },
  [AUTH_STATE]: state => {
    state.user = getUser();
  },
  [AUTH_ERROR]: (state, message) => {
    state.status = "error";
    state.message = message;
    state.hasLoadedOnce = true;
  },
  [SET_PROFILE]: (state, data) => {
    let user = getUser();
    user.user = data;
    window.localStorage.setItem("auth-user", JSON.stringify(user));
    state.user = getUser();
    state.hasLoadedOnce = true;
  },
  [SET_SUBSCRIPTION]: (state, data) => {
    window.localStorage.setItem("subscription", JSON.stringify(data));
    state.subscription = getSubscription();
    //state.hasLoadedOnce = true;
  },
  [AUTH_LOGOUT]: state => {
    destroyToken();
    removeLocalSubscription();
    removeUser();
    state.token = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
