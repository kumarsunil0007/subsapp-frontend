<template>
    <a-layout>
      <div class="gx-main-content-wrapper">
        <div class="gx-login-container">
          <div class="gx-login-content">
            <div class="gx-login-header gx-text-center">
              <h1 class="gx-login-title">Verify Email Account</h1>
              <p>Kindly click on the following button to verify</p>
            </div>
            <a-alert
              v-if="status === 'error'"
              class="gx-mb-3"
              type="error"
              :message="message"
              banner
            />
            <a-button
              type="primary"
              block
              :loading="isLoading"
              @click="emailVerify"
              >Verify Email</a-button
            >
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
  import notifications from "@/common/notifications/notification.service";
  
  export default {
    name: "EmailVerification",
    data() {
      return {
        image: Math.floor(Math.random() * 4) + 1,
        isLoading: false,
        status: false
      };
    },
    methods: {
      
    
        emailVerify: function() {
        this.message = "";
        this.status = "";
        this.isLoading = true;
        axios
          .get("/email/verify/" + this.$route.params.id + '/' + this.$route.params.hash)
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
  