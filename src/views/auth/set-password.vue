<template>
  <a-layout>
    <div class="gx-main-content-wrapper">
      <div class="gx-login-container">
        <div class="gx-login-content">
          <div class="gx-login-header gx-text-center">
            <h1 class="gx-login-title">Reset your password</h1>
            <p>Enter your new password</p>
          </div>
          <a-alert
            v-if="status === 'error'"
            class="gx-mb-3"
            type="error"
            :message="message"
            banner
          />
          <a-input
            v-model="password"
            type="password"
            placeholder="New Password"
            class="gx-mb-3"
          ></a-input>
          <a-input
            v-model="cpassword"
            type="password"
            placeholder="Confirm Password"
            class="gx-mb-3"
          ></a-input>
          <a-button
            type="primary"
            block
            :loading="isLoading"
            @click="resetPassword"
            >Reset Password</a-button
          >
          <div class="gx-text-center">
            <router-link to="/">Go back</router-link>
          </div>
        </div>
      </div>
    </div>
  </a-layout>
</template>

<style>
.login {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
}
</style>

<script>
import axios from "axios";
// import { authService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";

export default {
  name: "ForgotPassword",
  data() {
    return {
      image: Math.floor(Math.random() * 4) + 1,
      username: "",
      password: "",
      cpassword: "",
      isLoading: false,
      status: false
    };
  },
  methods: {
    
    checkHash: function() {
      axios
        .post("/auth/check_password_code/" + this.$route.params.hash)
        .then(resp => {
          if (resp.data.status === "success") {
            this.status = true;
          } else {
            this.status = false;
            this.$notify({
              group: "general",
              type: "warn",
              text: resp.data.message
            });
            this.$router.push("/login");
          }
        });
    },
    resetPassword: function() {
      this.message = "";
      this.status = "";
      if (this.password !== this.cpassword || this.password === "") {
        this.message = "Passwords do not match.";
        this.status = "error";
        return false;
      }
      let data = new FormData();
      data.append("password", this.password);
      this.isLoading = true;
      axios
        .post("/auth/check_password_code/" + this.$route.params.hash, data)
        .then(resp => {
          this.isLoading = false;
          if (resp.data.success) {
            notifications.success(resp.data.message);
            this.$router.push("/login");
          } else {
            notifications.warn(resp.data.message);
          }
        })
        .catch(error => {
          this.isLoading = false;
          if (error.response.status === 422) {
            let errors = Object.values(error.response.data.errors);
            errors = errors.flat();
            errors.forEach(opt => {
              notifications.warn(opt);
            });
          } else {
            notifications.warn("Something went wrong, please try again later");
          }
        });
    }
  }
};
</script>
