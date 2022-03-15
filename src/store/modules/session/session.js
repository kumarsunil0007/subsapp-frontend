import { attendanceService, scheduleService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";
import {
  SET_SESSION_MEMBERS,
  NEW_MEMBER_ATTENDANCE,
  REMOVE_MEMBER_ATTENDANCE,
  SET_NEW_MEMBER_ATTENDACE,
  GET_SESSION_MEMBERS,
  GET_SESSION_INVOICES,
  SET_SESSION_INVOICES,
  SET_ERROR_MSG,
  REFUND_AMOUNT,
  REMOVE_TEAM_MEMBER,
  CLEAR_ERROR
} from "@/store/modules/session/session-actions";

export default {
  state: {
    invoices: [],
    results: [],
    members: [],
    error_msg: "",
    status: "OK"
  },
  getters: {
    getSessionMembers: state => state.members,
    getSessionInvoices: state => state.invoices,
    getMembersAttending: state => {
      let total = 0;
      for (let member of state.members) {
        if (member.schedule && member.schedule.id) {
          total++;
        }
      }
      return total;
    },
    getMembersNotAttending: state => {
      let total = 0;
      for (let member of state.members) {
        if (!member.schedule || !member.schedule.id) {
          total++;
        }
      }
      return total;
    },
    getTotalInvoiceValue: state => {
      let total = 0;
      for (let invoice of state.invoices) {
        if (invoice && invoice.total) {
          total +=
            parseFloat(invoice.total) - parseFloat(invoice.refund_amount);
        }
      }
      return total;
    },
    getErrorMsg: state => {
      return state.error_msg;
    }
  },
  mutations: {
    [SET_SESSION_MEMBERS]: (state, payload) => {
      state.members = payload;
      state.status = "ok";
    },
    [SET_SESSION_INVOICES]: (state, payload) => {
      state.invoices = payload;
      state.status = "ok";
    },
    [SET_NEW_MEMBER_ATTENDACE]: (state, record) => {
      for (let member of state.members) {
        if (member.member.user_id == record.member_id) {
          member.schedule = record;
        }
      }
    },
    [SET_ERROR_MSG]: (state, payload) => {
      state.error_msg = payload;
    },
    [CLEAR_ERROR]: state => {
      state.error_msg = "";
    }
  },
  actions: {
    [GET_SESSION_MEMBERS]: async ({ commit }, params) => {
      await attendanceService.getTeamAttendance(params).then(res => {
        if (res.data.success) {
          commit(SET_SESSION_MEMBERS, res.data.result);
        }
      });
    },
    [GET_SESSION_INVOICES]: ({ commit }, params) => {
      scheduleService.getInvoices(params).then(res => {
        if (res.data.success) {
          commit(SET_SESSION_INVOICES, res.data.result);
        }
      });
    },
    [NEW_MEMBER_ATTENDANCE]: async ({ commit, dispatch }, params) => {
      commit(CLEAR_ERROR);
      await attendanceService.addAttendance(params).then(async res => {
        if (res.data.success) {
          await dispatch(GET_SESSION_MEMBERS, {
            teamId: params.teamId,
            sessionId: params.sessionId
          });
          //commit(SET_NEW_MEMBER_ATTENDACE, res.data.record);
        } else {
          commit(SET_ERROR_MSG, res.data.message);
        }
      });
    },
    [REMOVE_MEMBER_ATTENDANCE]: async ({ commit }, params) => {
      await attendanceService.removeAttendance(params).then(res => {
        if (res.data.success) {
          commit(SET_NEW_MEMBER_ATTENDACE, {
            member_id: params.memberId
          });
        } else {
          const msg = res.data.message;
          notifications.warn(msg);
        }
      });
    },
    // eslint-disable-next-line no-unused-vars
    [REFUND_AMOUNT]: async ({ commit }, params) => {
      await attendanceService.refundAmount(params).then(res => {
        if (res.data.success) {
          notifications.success("Successfully refund amount");
        } else {
          const msg = res.data.message;
          notifications.warn(msg);
        }
      });
    },
    // eslint-disable-next-line no-unused-vars
    [REMOVE_TEAM_MEMBER]: async ({ commit }, params) => {
      await attendanceService.removeTeamMember(params).then(res => {
        if (res.data.success) {
          notifications.success("Member removed successfully");
        } else {
          const msg = res.data.message;
          notifications.warn(msg);
        }
      });
    }
  }
};
