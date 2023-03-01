<!-- eslint-disable prettier/prettier -->
<template>
  <a-modal
    :visible="visible"
    :title="adminId ? 'Edit Coach' : 'Add Coach'"
    @cancel="close"
  >
    <template slot="footer">
      <a-button key="back" @click="close">Cancel</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleForm">
        Ok
      </a-button>
    </template>
    <a-form :form="form" layout="vertical" class="add-coach-form">
      <div class="info">
        <a-form-item label="First Name">
          <a-input v-decorator="fields.first_name" placeholder="First name" />
        </a-form-item>
        <a-form-item label="Last Name">
          <a-input v-decorator="fields.last_name" placeholder="Last name" />
        </a-form-item>
      </div>
      <a-form-item label="Email">
        <a-input v-decorator="fields.email" placeholder="Email"> </a-input>
      </a-form-item>
      <a-form-item label="Phone">
        <div class="custom-phone">
          <vue-phone-number-input
            v-model="phone"
            :default-country-code="phoneIso"
            color="#d9d9d9"
            valid-color="#d9d9d9"
            error-color="#f5222d"
            :error="true"
            :preferred-countries="preferredCountries"
            :all-letters-characters="true"
            @update="onCountrySelect"
          ></vue-phone-number-input>
          
        </div>
        <div class="has-error" v-if="!validPhone">
            <div class="ant-form-explain">{{ invalidPhoneMsg }}</div>
          </div>
      </a-form-item>
      <a-form-item label="Address">
        <a-input v-decorator="fields.address_1" placeholder="Address"> </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import notifications from "@/common/notifications/notification.service";
import { clubAdminsService } from "@/common/api/api.service";

export default {
  name: "ClubAdminEditModal",
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean,
    },
    adminId: {
      default: null,
      required: false,
      type: [Number, String],
    },
  },
  data() {
    return {
      phone: null,
      phoneIso: "IE",
      phoneCountryCode: "353",
      preferredCountries: ["IE", "US", "GB"],
      form: this.$form.createForm(this),
      dataLoading: false,
      loading: false,
      fields: {
        first_name: [
          "first_name",
          {
            rules: [
              {
                required: true,
                message: "Your first name is required.",
              },
            ],
          },
        ],
        last_name: [
          "last_name",
          {
            rules: [
              {
                required: true,
                message: "Your last name is required.",
              },
            ],
          },
        ],
        email: [
          "work_email",
          {
            rules: [
              {
                required: true,
                validator: this.validateEmail,
              },
            ],
          },
        ],
        phone: [
          "phone",
          {
            rules: [
              {
                required: true,
                message: "Your phone number is required.",
              },
            ],
          },
        ],
        address_1: [
          "address_1",
          {
            rules: [
              {
                required: true,
                message: "Your addreess is required.",
              },
            ],
          },
        ],
      },
      validPhone: true,
      invalidPhoneMsg: null,
    };
  },
  watch: {
    adminId: function () {
      this.fetchAdmin();
    },
  },
  mounted() {
    this.fetchAdmin();
  },
  methods: {
    onCountrySelect(value) {
      console.log("value => ", value);
      if (value != undefined) {
        this.phoneIso = value.countryCode;
        this.phoneCountryCode = value.countryCallingCode;
        this.validPhone = value.isValid;
        this.invalidPhoneMsg = "Invalid phone no.";
      }
    },
    fetchAdmin() {
      if (this.adminId && this.visible) {
        this.dataLoading = true;
        clubAdminsService
          .get(this.adminId)
          .then((resp) => {
            this.dataLoading = false;
            this.$nextTick(() => {
              this.form.getFieldDecorator("work_email");
              if (resp.data.success) {
                let data = resp.data.result;
                this.form.setFieldsValue({
                  work_email: data.work_email,
                  first_name: data.first_name,
                  last_name: data.last_name,
                  address_1: data.profile.address_1,
                  phone: data.profile.phone,
                });

                this.phone = data.profile.phone;
                this.phoneIso = data.profile.iso2 ? data.profile.iso2 : "IE";
                this.phoneCountryCode = data.profile.country_code
                  ? data.profile.country_code
                  : "353";
              } else {
                notifications.warn(
                  "We could not load this user, please try again or contact support."
                );
              }
            });
          })
          .catch((err) => {
            this.dataLoading = false;
            console.log(err);
            notifications.warn(
              "We could not load this user, please try again or contact support."
            );
          });
      }
    },
    handleForm() {
      if (!this.phone) {
        this.validPhone = false;
        this.invalidPhoneMsg = "Phone no. is required.";
      }
      this.form.validateFields((err, values) => {
        values.url = window.location.origin + "/#/login";
        if (!err && this.validPhone === true) {
          if (!this.adminId) {
            this.handleFormSubmit({
              ...values,
            });
          } else {
            this.handleFormUpdate({
              ...values,
            });
          }
        }
      });
    },
    handleFormSubmit(values) {
      this.loading = true;
      values.phone = this.phone;
      values.iso2 = this.phoneIso;
      values.country_code = this.phoneCountryCode;
      clubAdminsService
        .put({
          ...values,
          id: this.adminId,
        })
        .then((resp) => {
          this.loading = false;
          if (resp.data.success) {
            notifications.success("User Added Successfully");
            this.close();
          } else if (resp.data.code === 404) {
            notifications.warn("There was a problem loading this user");
            this.close();
          } else {
            if (resp.data.message) {
              notifications.warn(resp.data.message);
            } else {
              notifications.warn(
                "There was an error updating this user, please contact support"
              );
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleFormUpdate(values) {
      this.loading = true;
      clubAdminsService
        .update(this.adminId, {
          ...values,
        })
        .then((resp) => {
          this.loading = false;
          if (resp.data.success) {
            notifications.success("User Updated Successfully");
            this.close();
          } else if (resp.data.code === 404) {
            notifications.warn("There was a problem loading this user");
            this.close();
          } else {
            if (resp.data.message) {
              notifications.warn(resp.data.message);
            } else {
              notifications.warn(
                "There was an error updating this user, please contact support"
              );
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    validateEmail(rule, value, callback) {
      const form = this.form;
      // eslint-disable-next-line no-useless-escape
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
      if (!emailRegex.test(form.getFieldValue("work_email"))) {
        callback("Please enter a valid email.");
      } else {
        callback();
      }
    },
    close() {
      this.form.resetFields();
      this.$emit("close");
    },
  },
};
</script>
<style>
.info {
  display: flex;
}
.info .ant-row.ant-form-item {
  width: 100%;
  margin-right: 6px;
}
.ant-modal-footer button.ant-btn {
  width: 75px !important;
}
.ant-form-explain {
  font-size: 12px;
}
/* .add-coach-form .has-error .ant-form-explain {
  margin-left: 5px;
} */
</style>
