<template>
  <n-page>
    <a-row>
      <a-col :lg="12" :md="24" :sm="24" :xs="24">
        <a-card title="Stripe Settings" class="gx-card-widget title-heading">
          <a-form :form="form" layout="vertical">
            <div class="user_info">
              <a-form-item label="Sandbox Private Key">
                <a-input
                  v-decorator="[
                    'stripe_sandbox_private_key',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'This field is a required field',
                        },
                      ],
                    },
                  ]"
                  type="text"
                >
                </a-input>
              </a-form-item>
              <a-form-item label="Sandbox Secret Key">
                <a-input
                  v-decorator="[
                    'stripe_sandbox_secret_key',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'This field is a required field',
                        },
                      ],
                    },
                  ]"
                  type="text"
                >
                </a-input>
              </a-form-item>
              <a-form-item label="Live Private Key">
                <a-input
                  v-decorator="[
                    'stripe_live_private_key',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'This field is a required field',
                        },
                      ],
                    },
                  ]"
                  type="text"
                >
                </a-input>
              </a-form-item>
              <a-form-item label="Live Secret Key">
                <a-input
                  v-decorator="[
                    'stripe_live_secret_key',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'This field is a required field',
                        },
                      ],
                    },
                  ]"
                  type="text"
                >
                </a-input>
              </a-form-item>
              <a-form-item label="Stripe Mode">
                <a-select
                  v-model="stripe_mode"
                  style="width: 150px; margin-bottom: 10px; margin-right: 10px"
                >
                  <a-select-option value="sandbox"> Sandbox </a-select-option>
                  <a-select-option value="live"> Live </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <a-form-item class="gx-text-right">
              <a-button type="primary" html-type="submit" @click="handleForm">
                Save Details
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import { mapGetters } from "vuex";
//import { GET_USER } from "@/store/modules/user/user-actions";
import NPage from "@/components/ui/n-page/n-page";
import { AUTH_USER, AUTH_TOKEN } from "@/store/modules/auth/auth-actions";
import { adminService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";

export default {
  name: "MyProfile",
  components: {
    NPage,
  },
  data() {
    return {
      settings: {},
      renderComponent: true,
      subManagerVisible: false,
      selectedUserId: 0,
      fields: {
        country: null,
      },
      form: this.$form.createForm(this),
      stripe_mode: 0,
    };
  },
  computed: {
    ...mapGetters({
      authUser: [AUTH_USER],
      userToken: [AUTH_TOKEN],
      user: "getUser",
      userProfileLoading: "userProfileLoading",
    }),
  },
  mounted() {
    // this.$store.dispatch(GET_USER, this.authUser.user.user_id);
    this.fetchSettings();
  },
  methods: {
    fetchSettings() {
      adminService.getSettings().then((resp) => {
        if (resp.data.success) {
          this.form.setFieldsValue({
            stripe_sandbox_private_key:
              resp.data.result.stripe_sandbox_private_key,
            stripe_sandbox_secret_key:
              resp.data.result.stripe_sandbox_secret_key,
            stripe_live_private_key: resp.data.result.stripe_live_private_key,
            stripe_live_secret_key: resp.data.result.stripe_live_secret_key,
          });
          this.stripe_mode = resp.data.result.stripe_mode == 0 ? 'sandbox' : 'live';
        }
      });
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit(values);
        } else {
          console.log(err);
        }
      });
    },
    handleFormSubmit(values) {
      adminService
        .updateSettings({
          ...values,
          stripe_mode: this.stripe_mode == "sandbox" ? 0 : 1,
        })
        .then((resp) => {
          if (resp.data.success) {
            this.fetchSettings;
            notifications.success("Great! Settings updated");
          } else {
            if (resp.data.message) {
              notifications.warn(resp.data.message);
            } else {
              notifications.warn(
                "We could not update settings, something went wrong."
              );
            }
          }
        });
    },
  },
};
</script>
<style scoped>
.user_info {
  display: flex;
  flex-wrap: wrap;
}
.user_info .ant-row.ant-form-item {
  width: 100%;
  margin-right: 6px;
}
.gx-card-widget .ant-card-head-title {
  padding: 0;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 600;
}
.ant-card-head-title {
  font-weight: 600;
  font-size: 15px !important;
}

</style>
