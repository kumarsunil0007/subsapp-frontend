<template>
  <a-layout>
    <a-button id="scroll-to-bottom" @click="goToBottom">
      <a-icon type="arrow-down" />
    </a-button>

    <div id="content" class="gx-custom-registration gx-main-content-wrapper">
      <div class="gx-login-container">
        <div class="gx-login-content">
          <div class="login-brand gx-text-center">
            <img
              style="max-height: 80px"
              alt="SubsApp"
              src="@/assets/regular-logo.png"
            />
          </div>
          <div class="gx-login-header gx-text-center">
            <h1 class="gx-login-title">Update Password</h1>
          </div>
          <div v-if="validationMsg && validationMsg.length">
            <a-alert v-for="(item, index) in validationMsg" :key="index" type="error" :message="item" banner />
          </div>
          <a-form :form="form" class="gx-login-form gx-form-row0">
            <a-form-item label="Password" class="gx-m-0">
              <a-input v-decorator="fields.password" placeholder="Password" type="password">
              </a-input>
            </a-form-item>
            <a-form-item label="Confirm Password">
              <a-input v-decorator="fields.c_password" placeholder="Confirm Password" type="password">
              </a-input>
            </a-form-item>
            <a-form-item class="gx-text-center">
              <a-button type="primary" block html-type="submit" :loading="loginLoading" @click="handleForm">
                Update
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <div id="page-bottom"></div>
  </a-layout>
</template>

<script>
import { authService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";
import { AUTH_REQUEST } from "@/store/modules/auth/auth-actions";
import store from "@/store/index";

export default {
  name: "UpdatePassword",
  data() {
    return {
      message: null,
      confirmDirty: false,
      loginLoading: false,
      form: this.$form.createForm(this),
      validationMsg: [],
      fields: {
        password: [
          "password",
          {
            rules: [
              {
                required: true,
                message: "Please input your password!",
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          },
        ],
        c_password: [
          "c_password",
          {
            rules: [
              {
                required: true,
                message: "Please confirm your password!",
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    goToBottom() {
      // let scrollToBottom = document.querySelector("#scroll-to-bottom");
      let pageBottom = document.querySelector("#page-bottom");
      pageBottom.scrollIntoView();
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        this.message = null;
        if (!err) {
          if (values.password === values.c_password) {
            this.handleFormSubmit(values.password);
          } else {
            this.message = "Passwords do not match.";
          }
        }
      });
    },
    handleFormSubmit(password) {
      this.loginLoading = true;
      this.validationMsg = [];
      console.log("password => ", password)
      console.log("store.state.auth => ", store.state.auth)
      const params = {
        email: store.state.auth.user.user.work_email,
        password: password
      }
      authService
        .updatePassword(params)
        .then((resp) => {
          if (resp.data.success) {
            notifications.success("Password updated.");
            const no_of_cards = store.state.auth.user.no_of_cards;
            const invitation_email =
              store.state.auth.user.user.invitation_email;
            const role = store.state.auth.user.select_role;
            if (role === "admin") {
              this.$router.replace("/admin");
            } else if (
              role === "club_admin" &&
              window.localStorage.getItem("isSubscribed") == "false"
            ) {
              this.$router.replace("/subscription");
            } else if (
              role === "member" &&
              no_of_cards == "0" &&
              invitation_email == "1"
            ) {
              this.$router.replace("/my-billing");
            } else {
              this.$router.replace("/dashboard");
            }
          } else {
            this.loginLoading = false;
            if (resp.data.message) {
              notifications.warn(resp.data.message);
            } else {
              notifications.warn(
                "Something went wrong, please contact support"
              );
            }
          }
        })
        .catch((error) => {
          this.loginLoading = false;
          if (error.response.status === 422) {
            let errors = Object.values(error.response.data.errors);
            this.validationMsg = errors.flat();
            console.log(this.validationMsg);
          } else {
            notifications.warn("Something went wrong, please try again later");
          }
        });
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Passwords do not match.");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["c_password"], { force: true });
      }
      callback();
    },
  },
};
</script>

<style lang="scss">
#scroll-to-bottom {
  position: fixed;
  bottom: 20px;
  right: 0px;
  z-index: 1;
  display: none;
  background: #f18805;
  color: #fff;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  text-align: center;
  padding: 0;
  line-height: 42px;

  i {
    font-size: 18px;
  }
}

// #content {
//   // min-height: 100vh;
//   background-color: coral;
// }

@media screen and (min-width: 0px) and (max-width: 991px) {

  #scroll-to-bottom,
  #scroll-to-top {
    display: block;
  }

  .gx-custom-registration {
    padding: 30px 10px 10px;

    & .ant-input {
      line-height: 2;
      padding: 12px 18px !important;
      font-size: 18px;
      margin-bottom: 18px;
    }

    & .ant-form-item-label {
      margin-bottom: 8px;
    }

    & .ant-form-item-label>label {
      font-size: 18px;
    }

    & .ant-btn {
      padding: 16px 42px !important;
      line-height: 2;
      width: 100%;
    }
  }
}
</style>
