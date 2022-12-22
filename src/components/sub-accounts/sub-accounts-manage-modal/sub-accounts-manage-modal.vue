<template>
  <a-modal
    v-model="show"
    :mask-closable="false"
    title="Create a new Account"
    @cancel="close"
  >
    <a-form :form="form" layout="vertical">
      <div class="user_info">
        <a-form-item label="First Name">
          <a-input
            v-decorator="[
              'first_name',
              {
                rules: [
                  {
                    required: true,
                    message: 'First name is required.'
                  }
                ]
              }
            ]"
            type="text"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="Last Name">
          <a-input
            v-decorator="[
              'last_name',
              {
                rules: [
                  {
                    required: true,
                    message: 'Last name is a required field.'
                  }
                ]
              }
            ]"
            type="text"
          >
          </a-input>
        </a-form-item>
      </div>
      <div class="user_info">
        <a-form-item label="Phone Number">
          <a-input v-decorator="['phone']" type="text"></a-input>
        </a-form-item>
        <a-form-item label="Date of Birth">
          <a-date-picker
            v-decorator="['dob']"
            style="width:100%"
            format="DD/MM/YYYY"
          />
        </a-form-item>
      </div>
      <div class="user_info">
        <a-form-item label="Emergency Name">
          <a-input v-decorator="['emergency_name']" type="text"> </a-input>
        </a-form-item>
        <a-form-item label="Emergency Phone">
          <a-input v-decorator="['emergency_phone']" type="text"> </a-input>
        </a-form-item>
      </div>
      <div class="user_info">
        <a-form-item label="Address 1">
          <a-input v-decorator="['address_1']" type="text"> </a-input>
        </a-form-item>
        <a-form-item label="Address 2">
          <a-input v-decorator="['address_2']" type="text"> </a-input>
        </a-form-item>
      </div>
      <div class="user_info">
        <a-form-item label="Town">
          <a-input v-decorator="['town']" type="text"> </a-input>
        </a-form-item>
        <a-form-item label="Region">
          <a-input v-decorator="['region']" type="text"> </a-input>
        </a-form-item>
        <a-form-item label="Postcode">
          <a-input v-decorator="['post_code']" type="text"> </a-input>
        </a-form-item>
      </div>
    </a-form>
    <div slot="footer" class="gx-text-right">
      <a-button
        type="primary"
        html-type="submit"
        :loading="isLoading"
        @click="handleForm"
      >
        Save Details
      </a-button>
    </div>
  </a-modal>
</template>

<script>
import notifications from "@/common/notifications/notification.service";
import { subAccountsService } from "@/common/api/api.service";
import moment from "moment";

export default {
  name: "SubAccountsManageModal",
  props: {
    userId: {
      default: 0,
      required: true,
      type: Number
    },
    visible: {
      default: false,
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: false,
      form: this.$form.createForm(this)
    };
  },
  computed: {
    show: {
      get: function() {
        if (this.visible) {
          return true;
        } else {
          return false;
        }
      },
      set: function() {
        this.close();
      }
    }
  },
  mounted() {
    if (this.userId) {
      this.fetchUser();
    }
  },
  methods: {
    fetchUser() {
      subAccountsService.get(this.userId).then(resp => {
        const userData = resp.data.result.user;
        const profileData = resp.data.result.profile;

        if (userData.user_id) {
          this.form.setFieldsValue({
            first_name: userData.first_name,
            last_name: userData.last_name,
            work_email: userData.work_email
          });
          if (profileData) {
            this.form.setFieldsValue({
              phone: profileData.phone,
              emergency_name: profileData.emergency_name,
              emergency_phone: profileData.emergency_phone,
              address_1: profileData.address_1,
              address_2: profileData.address_2,
              town: profileData.town,
              post_code: profileData.post_code,
              region: profileData.region
            });
            if (profileData.dob) {
              this.form.setFieldsValue({
                dob: moment(profileData.dob, "YYYY-MM-DD")
              });
            }
          }
        }
      });
    },
    handleForm() {
      this.isLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit({
            ...values
          });
        } else {
          this.isLoading = false;
        }
      });
    },
    handleFormSubmit(values) {
      if (this.userId) {
        subAccountsService
          .update(this.userId, values)
          .then(resp => {
            if (resp.data.success) {
              notifications.success("User updated successfully");
              this.close();
            } else {
              notifications.warn(resp.data.message);
            }
            this.isLoading = false;
          })
          .catch(err => {
            notifications.warn(
              "Something went wrong, we could not update this user"
            );
            this.isLoading = false;
          });
      } else {
        subAccountsService
          .put(values)
          .then(resp => {
            if (resp.data.success) {
              notifications.success("User created successfully");
              this.close();
            } else {
              notifications.warn(resp.data.message);
            }
            this.isLoading = false;
          })
          .catch(err => {
            console.log("Error", err);
            notifications.warn(
              "Something went wrong, we could not create this user"
            );
            this.isLoading = false;
          });
      }
    },
    close() {
      this.form.resetFields();
      this.$emit("close");
    }
  }
};
</script>
<style scoped>
.user_info {
  display: flex;
}
.user_info .ant-row.ant-form-item {
  width: 100%;
  margin-right: 6px;
}
</style>
