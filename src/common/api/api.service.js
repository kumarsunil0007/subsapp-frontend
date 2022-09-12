import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import Router from "@/router";
import JwtService from "@/common/api/jwt.service";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    // Vue.axios.defaults.baseURL = "https://subs.api.novnik.com/api";
    // if (process.env.VUE_APP_API_HOST) {
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_HOST;
    // } else {
    //   Vue.axios.defaults.baseURL = "https://api.subsapp.com/api/";
    // }
    // Vue.axios.defaults.baseURL = "https://api.subsapp.com/api/";
    axios.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        if (error.response.status === 401) {
          Router.push("/login");
        }
        return Promise.reject(error);
      }
    );
  },

  setHeader() {
    Vue.axios.defaults.headers.common[
      "authorization"
    ] = `Bearer ${JwtService.getToken()}`;
  },

  query(resource, params) {
    ApiService.setHeader();
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource, slug = "") {
    ApiService.setHeader();
    if(slug != "") {
      return Vue.axios.get(`${resource}/${slug}`).catch(error => {
        throw new Error(`[RWV] ApiService ${error}`);
      });
    }
    else {
      return Vue.axios.get(`${resource}`).catch(error => {
        throw new Error(`[RWV] ApiService ${error}`);
      });
    }
    
  },

  post(resource, params) {
    ApiService.setHeader();
    return Vue.axios.post(`${resource}`, params);
  },

  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  put(resource, params) {
    ApiService.setHeader();
    return Vue.axios.put(`${resource}`, params);
  },
  download(resource, params, filename) {
    ApiService.setHeader();
    return Vue.axios
      .post(`${resource}`, params, {
        responseType: "blob" // important
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      });
  },
  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};
export const authService = {
  login(params) {
    return ApiService.post("/auth/login", params);
  },
  init(){
    return ApiService.get("/init");
  },
  logout() {
    return ApiService.post("/auth/logout");
  },
  clubRegister(params) {
    return ApiService.post("/auth/register-club", params);
  },
  userRegister(params) {
    return ApiService.post("/auth/register-user", params);
  },
  fetchProfile(params) {
    return ApiService.post("/auth/fetch-profile", params);
  },
  passwordResetRequest(params) {
    return ApiService.post("/auth/password-reset", params);
  },
  passwordCodeCheck(params) {
    return ApiService.post("/auth/password-reset-check", params);
  },
  passwordReset(params) {
    return ApiService.post("/auth/password-reset", params);
  },
  updateUserLoggedIn() {
    return ApiService.get("/update-user-loggedin");
  },
};
export const subAccountsService = {
  query(params) {
    return ApiService.query("/sub-user/query", { params: params });
  },
  get(user_id) {
    return ApiService.get("/sub-user/get", user_id);
  },
  put(params) {
    return ApiService.post("/sub-user/put", params);
  },
  update(user_id, params) {
    return ApiService.update("/sub-user/update", user_id, params);
  }
};
export const scheduleService = {
  query(params) {
    return ApiService.query("/schedule/query", { params: params });
  },
  get(id) {
    return ApiService.get("/schedule/get", id);
  },
  put(params) {
    return ApiService.post("/schedule/put", params);
  },
  getInvoices(sessionId) {
    return ApiService.get("/schedule/get-invoices", sessionId);
  }
};
export const memberService = {
  query(params) {
    return ApiService.query("/member/query", { params: params });
  },
  get(id) {
    return ApiService.get("/member/get", id);
  },
  addMember(params) {
    return ApiService.post("/member/add-club-admin", params);
  },
  addMember2(params) {
    return ApiService.post("/member/add-member", params);
  },
  put(params) {
    return ApiService.post("/member/put", params);
  },
  update(id, params) {
    return ApiService.update("/member/update", id, params);
  },
  searchMembers(params) {
    return ApiService.query("/member/search-members", { params: params });
  },
  searchTeamMembers(params) {
    return ApiService.query("/member/search-team-members", { params: params });
  },
  inviteMember(params) {
    return ApiService.post("/member/invite-member", params);
  },
  getSchedule(memberId) {
    return ApiService.post("/member/get-schedule", { memberId: memberId });
  },
  getTeamSchedules(id) {
    return ApiService.get("/member/get-team-schedule", id);
  },
  updateClubMember(memberId, data) {
    return ApiService.update("/member/update-club-member", memberId, data);
  },
  deleteClubMember(data) {
    return ApiService.post("/member/delete", data);
  },
  UserTablelist(memberId, data) {
    return ApiService.update("/member/update-club-member", memberId, data);
  },
  ClubTablelist(memberId, data) {
    return ApiService.update("/club/update-club-status", memberId, data);
  },
  updateTeamMember(data) {
    return ApiService.post("/member/update-team-member", data);
  },
  userProfile() {
    return ApiService.query("/get/user-profile");
  },
  updateProfile(data) {
    return ApiService.post("/update/user-profile", data);
  },
  makeCoach(data) {
    return ApiService.post("member/make-coach", data);
  },
  memberTeams() {
    return ApiService.query("/member/teams-query");
  },
  TeamTablelist(memberId, data) {
    return ApiService.update("/team/update-team-status", memberId, data);
  },
  uploadAvatar(data) {
    return ApiService.post("/member/upload-avatar", data);
  },
  deleteAvatar(data) {
    return ApiService.post("member/remove-avatar");
  },
  updateCommission(commission){ 
    return ApiService.post("club-admin/update-commision",commission);

  },
};
export const adminService = {
  query(params) {
    return ApiService.query("/club-admin/query", { params: params });
  },
  updateAdminService(){
    return ApiService.post("/club-admin/update-club-info",);
  }
  
};
export const memberBillingService = {
  query(params) {
    return ApiService.query("/member-billing/query", { params: params });
  },
  get(id) {
    return ApiService.get("/member-billing/get", id);
  }
};
export const attendanceService = {
  getTeamAttendance(params) {
    return ApiService.query("/attendance/get-team-attendance", {
      params: params
    });
  },
  addAttendance(params) {
    return ApiService.post("/attendance/add-member-attendance", params);
  },
  removeAttendance(params) {
    return ApiService.post("/attendance/remove-member-attendance", params);
  },
  refundAmount(params) {
    return ApiService.post("/attendance/refund-amount", params);
  },
  removeTeamMember(params) {
    return ApiService.post("/attendance/remove-team-member", params);
  }
};
export const teamService = {
  query(params) {
    return ApiService.query("/team/query", { params: params });
  },
  get(teamId) {
    return ApiService.get("/team/get", teamId);
  },
  put(params) {
    return ApiService.post("/team/put", params);
  },
  update(teamId, params) {
    return ApiService.update("/team/update", teamId, params);
  },
  searchTeam(params) {
    return ApiService.post("/search-team", params);
  },
  deleteTeam(data) {
    return ApiService.post("/team/delete", data);
  },
};
export const clubAdminsService = {
  query(params) {
    return ApiService.query("/club-admins/query", { params: params });
  },
  get(id) {
    return ApiService.get("/club-admins/get", id);
  },
  put(params) {
    return ApiService.post("/club-admins/put", params);
  },
  contact(params) {
    return ApiService.post("/club-admin/contact-form", params);
  },
  remove(params) {
    return ApiService.post("/club-admins/remove", params);
  },
  update(id, params) {
    return ApiService.update("/club-admins/update", id, params);
  },
  searchCoach(params) {
    return ApiService.query("/admin/search-coach", { params: params });
  },
  addCoach(params) {
    return ApiService.post("/admin/add-coach", params);
  },
  clubInfo(id) {
    return ApiService.get("/get/club-info", id);
  },
  TeamInfo(id, params) {
    return ApiService.query("/get/team-info/" + id, { params: params });
  }
};
export const clubManagerService = {
  query(params) {
    return ApiService.query("/club-manager/query", { params: params });
  },
  put(params) {
    return ApiService.post("/club-manager/put", params);
  }
};

export const clubService = {
  query(params) {
    return ApiService.query("/club/query", { params: params });
  },
  clubQuery(params) {
    return ApiService.query("/club/member-clubs", { params: params });
  },
  get(clubId) {
    return ApiService.get("/club/get", clubId);
  },
  update(clubId, params) {
    return ApiService.update("/club/update", clubId, params);
  },
  getMyClub(params) {
    return ApiService.query("/club/get-my-club", params);
  },
  getMyAllClub() {
    return ApiService.get("/club/get-all-clubs");
  },
  getMyClubBilling(params) {
    return ApiService.query("/club/get-my-club-billing", params);
  },
  searchClubs(params) {
    return ApiService.post("/club/search-clubs", params);
  },
  requestToJoin(params) {
    return ApiService.post("/club/request-to-join", params);
  },
  fetchRoles() {
    return ApiService.query("club/get-member-role");
  },
  fetchStats(params) {
    return ApiService.query("club/dashboard-data", params);
  },
  clubDashboad(params) {
    return ApiService.query("admin/club-schedule", params);
  }
};

export const billingService = {
  listInvoices(params) {
    return ApiService.post("/billing/list-invoices", params);
  },
  saveCard(params) {
    return ApiService.post("/billing/save-card", params);
  },
  listCards(params) {
    return ApiService.post("/billing/list-cards", params);
  },
  setDefaultCard(params) {
    return ApiService.post("/billing/set-default-card", params);
  },
  removeCard(params) {
    return ApiService.post("/billing/remove-card", params);
  },
  listsPlans(params) {
    return ApiService.post("/billing/list-plans", params);
  },
  getCustomSubscriptions(params) {
    return ApiService.post("/billing/get-customer-subscriptions", params);
  },
  attemptUpgrade(params) {
    return ApiService.post("/billing/attempt-upgrade", params);
  },
  cancelSubscription() {
    return ApiService.post("/billing/cancel-subscription");
  },
  redirectStripe(){
    return ApiService.post("/stripe-create-account");
  },
 
  listBankDetails(){
      return ApiService.post('/account-list');
  }

};

export default ApiService;
