<template>
  <a-modal
    :visible="visible"
    title="Club Admin Manager"
    @cancel="close"
    @ok="handleForm"
  >
    <a-form :form="form" layout="vertical" :class="{ 'gx-hide': dataLoading }">
      <div class="info">
        <a-form-item label="First Name">
          <a-input v-decorator="fields.first_name" />
        </a-form-item>
        <a-form-item label="Last Name">
          <a-input v-decorator="fields.last_name" />
        </a-form-item>
      </div>
      <a-form-item label="Email">
        <a-input v-decorator="fields.email" placeholder="Email"> </a-input>
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
      type: Boolean
    },
    adminId: {
      default: false,
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      dataLoading: false,
      fields: {
        first_name: [
          "first_name",
          {
            rules: [
              {
                required: true,
                message: "Your first name is required"
              }
            ]
          }
        ],
        last_name: [
          "last_name",
          {
            rules: [
              {
                required: true,
                message: "Your last name is required"
              }
            ]
          }
        ],
        email: [
          "work_email",
          {
            rules: [
              {
                required: true,
                validator: this.validateEmail
              }
            ]
          }
        ]
      }
    };
  },
  watch: {
    adminId: function() {
      this.fetchAdmin();
    }
  },
  mounted() {
    this.fetchAdmin();
  },
  methods: {
    fetchAdmin() {
      if (this.adminId && this.visible) {
        this.dataLoading = true;
        clubAdminsService.get(this.adminId).then(resp => {
          this.dataLoading = false;
          this.$nextTick(() => {
            this.form.getFieldDecorator("work_email");
            if (resp.data.success) {
              let data = resp.data.result;
              this.form.setFieldsValue({
                work_email: data.work_email,
                first_name: data.first_name,
                last_name: data.last_name
              });
            } else {
              notifications.warn(
                "We could not load this user, please try again or contact support."
              );
            }
          });
        });
      }
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit({
            ...values
          });
        }
      });
    },
    handleFormSubmit(values) {
      clubAdminsService
        .put({
          ...values,
          id: this.adminId
        })
        .then(resp => {
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
        });
    },
    validateEmail(rule, value, callback) {
      const form = this.form;
      // eslint-disable-next-line no-useless-escape
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
      if (!emailRegex.test(form.getFieldValue("work_email"))) {
        callback("Please enter a valid email");
      } else {
        callback();
      }
    },
    close() {
      this.form.resetFields();
      this.$emit("close");
    }
  }
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
</style>
