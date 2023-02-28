import Vue from "vue";
import App from "./App.vue";
import VueCookies from "vue-cookies";
require("dotenv").config();
import router from "./router";
import store from "./store/index";
import "./registerServiceWorker";
import api from "@/common/api/api.service";

import {
  Button,
  Layout,
  Row,
  TimePicker,
  Checkbox,
  DatePicker,
  Col,
  Carousel,
  Upload,
  Breadcrumb,
  Table,
  Menu,
  Tooltip,
  Modal,
  Form,
  Input,
  Collapse,
  Icon,
  Alert,
  Drawer,
  Card,
  Select,
  Dropdown,
  Statistic,
  Tag,
  Divider,
  Popconfirm,
  Radio
} from "ant-design-vue";
import "./styles/wieldy.less";
import "./assets/style";
import "./assets/css/global.scss";
import VueRouterBackButton from "vue-router-back-button";
import vueCountryRegionSelect from "vue-country-region-select";
// import VueCountryCode from "vue-country-code-select";
import VuePhoneNumberInput from 'vue-phone-number-input';
import "vue-phone-number-input/dist/vue-phone-number-input.css";
// import VueCountryIntl from 'vue-country-intl';
// import VueTelInput from 'vue-tel-input';
// import 'vue-tel-input/dist/vue-tel-input.css';
// import css
// import 'vue-country-intl/lib/vue-country-intl.css'
import Notifications from "vue-notification";
import { Spin } from "ant-design-vue";
import VueSweetalert2 from "vue-sweetalert2";

import "sweetalert2/dist/sweetalert2.min.css";
Vue.use(VueSweetalert2);
Vue.use(Notifications);
Vue.use(VueCookies);
Vue.use(VueRouterBackButton, { router });

api.init();

Vue.use(Icon);
Vue.use(Dropdown);
Vue.use(Collapse);
Vue.use(Drawer);
Vue.use(TimePicker);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(Tooltip);
Vue.use(Modal);
Vue.use(Checkbox);
Vue.use(Card);
Vue.use(Upload);
Vue.use(Button);
Vue.use(Breadcrumb);
Vue.use(Table);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Carousel);
Vue.use(Alert);
Vue.use(Form);
Vue.use(Input);
Vue.use(Tag);
Vue.use(Carousel);
Vue.use(Row);
Vue.use(Col);
Vue.use(Spin);
Vue.use(Statistic);
Vue.use(Divider);
Vue.use(Popconfirm);
Vue.use(Radio);

Vue.config.productionTip = false;
Vue.component('vue-phone-number-input', VuePhoneNumberInput);
Vue.use(vueCountryRegionSelect);
// Vue.use(VueCountryCode);
// Vue.use(VuePhoneNumberInput);

// Vue.component('vue-country-intl', VueCountryIntl);
// Vue.use(VueTelInput);
//Vue.prototype.$datetime;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
