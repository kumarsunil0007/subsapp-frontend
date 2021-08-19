import Vue from "vue";
import App from "./App.vue";
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
import VueRouterBackButton from "vue-router-back-button";
import vueCountryRegionSelect from "vue-country-region-select";
import Notifications from "vue-notification";
import { Spin } from "ant-design-vue";
Vue.use(Notifications);

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

Vue.use(vueCountryRegionSelect);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
