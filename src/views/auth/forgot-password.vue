<template>
  <a-layout>
    <div class="gx-main-content-wrapper gx-custom-login-form">
      <div class="gx-login-container">
        <div class="gx-login-content">
          <div class="gx-login-header gx-text-center">
            <div class="login-brand gx-text-center">
              <img style="max-height: 80px" alt="SubsApp" src="@/assets/regular-logo.png" />
            </div>
            <h1 class="gx-login-title">Forgotten Password</h1>
            <p>Simply enter your email address below to reset it.</p>
          </div>
          <a-alert v-if="status === 'error'" class="gx-mb-3" type="error" :message="message" banner />
          <a-input v-model="email" type="email" placeholder="Email Address" class="gx-mb-3"></a-input>
          <a-button type="primary" block :loading="isLoading" @click="resetPassword">Reset</a-button>
          <div class="gx-text-center">
            <router-link to="/">Go back</router-link>
          </div>
        </div>
      </div>
    </div>
  </a-layout>
</template>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
}

.gx-custom-login-form {
  .gx-login-content {
    .ant-input {
      padding: 12px;
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 991px) {
  .gx-custom-login-form {
    .gx-login-content {
      & .ant-input {
        line-height: 2;
        padding: 16px 18px;

      }
    }

    & .ant-btn {
      padding: 16px 42px !important;
      line-height: 2;
    }
  }
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
    resetPassword: function () {
      this.isLoading = true;
      this.message = "";
      this.status = "";
      authService
        .passwordResetRequest({
          username: this.email,
          url: window.location.origin
        })
        .then(resp => {
          this.isLoading = false;
          if (resp.data.success) {
            notifications.success(
              "We have sent you an email to confirm your request."
            );
            this.$router.push("/login");
          } else {
            this.message = resp.data.message;
            this.status = "error";
          }
        })
        .catch(e => {
          this.isLoading = false;
        });
    }
  }
};
</script>
