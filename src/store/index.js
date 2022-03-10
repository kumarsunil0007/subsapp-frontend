import Vue from "vue";
import Vuex from "vuex";
import auth from "@/store/modules/auth/auth";
import club from "@/store/modules/club/club";
import team from "@/store/modules/team/team";
import session from "@/store/modules/session/session";
import user from "@/store/modules/user/user";
import ui from "@/store/modules/ui/ui";

Vue.use(Vuex);
export default new Vuex.Store({
  strict: process.env.development,
  modules: {
    ui,
    auth,
    user,
    club,
    team,
    session
  }
});
