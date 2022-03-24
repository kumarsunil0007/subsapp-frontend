import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import Router from "@/router"

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    // Vue.axios.defaults.baseURL = "https://subs.api.novnik.com/api";
    // if (process.env.VUE_APP_API_HOST) {
    Vue.axios.defaults.baseURL = "https://api.stripe.com/";
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
    ] = `Bearer sk_test_VbvVoI0XEzjpzgvvHogLGql2`;
  },

  query(resource, params) {
    ApiService.setHeader();
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource, slug = "") {
    ApiService.setHeader();
    return Vue.axios.get(`${resource}/${slug}`).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },
};


export const listPlans= {
    listPlans() {
    return ApiService.get("v1/plans?limit=3");
  },
};

export default ApiService;
