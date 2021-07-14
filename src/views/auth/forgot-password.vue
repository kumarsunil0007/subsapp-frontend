<template>
  <a-layout>
    <div class="gx-main-content-wrapper">
      <div class="gx-login-container">
        <div class="gx-login-content">
          <div class="gx-login-header gx-text-center">
            <h1 class="gx-login-title">Forgotten Password</h1>
            <p>Simply enter your email address below to reset it.</p>
          </div>
          <a-alert
            v-if="status === 'error'"
            class="gx-mb-3"
            type="error"
            :message="message"
            banner
          />
          <a-input
            v-model="email"
            type="email"
            placeholder="Email Address"
            class="gx-mb-3"
          ></a-input>
          <a-button
            type="primary"
            block
            :loading="isLoading"
            @click="resetPassword"
            >Reset</a-button
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
import { authService } from "@/common/api/api.service";
import notifications from "@/common/notifications/notification.service";

export default {
  name: "ForgotPassword",
  data() {
    return {
      image: Math.floor(Math.random() * 4) + 1,
      email: "",
      isLoading: false,
      status: ""
    };
  },
  methods: {
    resetPassword: function() {
      this.isLoading = true;
      this.message = '';
      this.status = '';
      authService
        .passwordResetRequest({
          username: this.email
        })
        .then(resp => {
          this.isLoading = false;
          if (resp.data.success) {
            notifications.success(
              "We have sent you an email to confirm your request."
            );
            this.$router.push("/login");
          } else {
            if (resp.data.status === "error") {
              this.message = resp.data.message;
              this.status = 'error';
            }
            notifications.warn(
              "We could not reset your password at this moment in time, please contact support."
            );
          }
        })
        .catch(e => {
          this.isLoading = false;
        });
    }
  }
};
</script>
