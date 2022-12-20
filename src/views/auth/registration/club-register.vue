<template>
  <a-layout>
    <a-button id="scroll-to-bottom" @click="goToBottom">
      <a-icon type="arrow-down" />
    </a-button>
    <div id="content" class="gx-custom-registration gx-main-content-wrapper">
      <div class="gx-login-container">
        <div class="gx-login-content">
          <div class="gx-login-header gx-text-center">
            <h1 class="gx-login-title">Register your club with SubsApp</h1>
          </div>
          <div v-if="validationMsg && validationMsg.length">
            <a-alert
              v-for="(item, index) in validationMsg"
              :key="index"
              type="error"
              :message="item"
              banner
            />
          </div>
          <a-form :form="form" class="gx-login-form gx-form-row0">
            <a-form-item label="Club Name" class="gx-m-0">
              <a-input
                v-decorator="fields.club_name"
                placeholder="The name of your club"
              />
            </a-form-item>
            <a-form-item label="First Name" class="gx-m-0">
              <a-input
                v-decorator="fields.first_name"
                placeholder="Your first name"
              />
            </a-form-item>
            <a-form-item label="Last Name" class="gx-m-0">
              <a-input
                v-decorator="fields.last_name"
                placeholder="Your last name"
              />
            </a-form-item>
            <a-form-item label="Email" class="gx-m-0">
              <a-input v-decorator="fields.email" placeholder="Email">
              </a-input>
            </a-form-item>
            <a-form-item label="Password" class="gx-m-0">
              <a-input
                v-decorator="fields.password"
                placeholder="Password"
                type="password"
              >
              </a-input>
            </a-form-item>
            <a-form-item label="Confirm Password">
              <a-input
                v-decorator="fields.c_password"
                placeholder="Confirm Password"
                type="password"
              >
              </a-input>
            </a-form-item>
            <a-form-item class="gx-text-center">
              <a-button
                type="primary"
                block
                html-type="submit"
                :loading="loginLoading"
                @click="handleForm"
              >
                Register
              </a-button>
            </a-form-item>
            <div class="gx-text-center">
              <router-link to="/"></router-link>
            </div>
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

export default {
  name: "ClubRegister",
  data() {
    return {
      loginLoading: false,
      message: null,
      validationMsg: [],
      confirmDirty: false,
      form: this.$form.createForm(this),
      fields: {
        club_name: [
          "club_name",
          {
            rules: [
              {
                required: true,
                message: "The club name is required",
              },
            ],
          },
        ],
        first_name: [
          "first_name",
          {
            rules: [
              {
                required: true,
                message: "Your first name is required",
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
                message: "Your last name is required",
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
      let pageBottom = document.querySelector("#page-bottom");
      pageBottom.scrollIntoView();
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        this.message = null;
        if (!err) {
          if (values.password === values.c_password) {
            this.handleFormSubmit({
              ...values,
              teamId: this.teamId,
            });
          } else {
            this.message = "Passwords do not match";
          }
        }
      });
    },
    handleFormSubmit(values) {
      this.loginLoading = true;
      this.validationMsg = [];
      authService
        .clubRegister(values)
        .then((resp) => {
          if (resp.data.success) {
            notifications.success("Registration complete. Welcome to SubsApp");
            this.$store
              .dispatch(AUTH_REQUEST, {
                username: values.work_email,
                password: values.password,
              })
              .then((resp) => {
                if (resp) {
                  this.$router.push("/dashboard");
                }
                this.loginLoading = false;
              })
              .catch(() => {
                this.$router.push("/login");
                this.loginLoading = false;
              });
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
        callback("Passwords do not match");
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
    validateEmail(rule, value, callback) {
      const form = this.form;
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
      if (!emailRegex.test(form.getFieldValue("work_email"))) {
        callback("Please enter a valid email");
      } else {
        callback();
      }
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

@media screen and (min-width: 0px) and (max-width: 991px) {
  #scroll-to-bottom {
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
    & .ant-form-item-label > label {
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
