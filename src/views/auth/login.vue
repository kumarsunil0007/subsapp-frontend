<template>
  <a-layout>
    <div class="gx-main-content-wrapper gx-custom-login-form">
      <div class="gx-login-container">
        <div class="gx-login-content">
          <div class="gx-login-header gx-text-center">
            <h1 class="gx-login-title">Sign In To SubsApp</h1>
          </div>
          <div class="login-brand">
            <img
              style="max-height: 80px;"
              alt="SubsApp"
              src="@/assets/regular-logo.png"
            />
          </div>
          <a-alert
            v-if="status === 'error'"
            class="gx-mb-4"
            type="error"
            :message="message"
            banner
          />
          <a-form class="gx-login-form gx-form-row0" @submit.prevent="login">
            <a-form-item>
              <a-input
                ref="userNameInput"
                v-model="username"
                placeholder="Email"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                ref="passwordInput"
                v-model="password"
                placeholder="Password"
                type="password"
              >
                <a-icon slot="prefix" type="key" />
              </a-input>
            </a-form-item>
            <a-form-item class="gx-text-center">
              <a-button
                class="gx-mb-0"
                type="primary"
                html-type="submit"
                :loading="loginLoading"
              >
                LOGIN
              </a-button>
            </a-form-item>
          </a-form>
          <div class="gx-text-center">
            <router-link
              :to="{ path: '/auth/forgot-password' }"
              class="gx-login-form-forgot"
            >
              Forgot Password
            </router-link>
          </div>
          <div class="form-divider"></div>
          <a-button
            class="register-button register-button--member"
            @click="$router.replace({ path: '/register-user' })"
          >
            Become a Member
          </a-button>
          <a-button
            class="register-button register-button--club"
            @click="$router.replace({ path: '/register-club' })"
          >
            Register a Club
          </a-button>
        </div>
      </div>
    </div>
  </a-layout>
</template>

<script>
import {
  AUTH_MESSAGE,
  AUTH_REQUEST,
  AUTH_STATUS
} from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
import store from "@/store/index";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loginLoading: false
    };
  },
  computed: {
    ...mapGetters({
      status: AUTH_STATUS,
      message: AUTH_MESSAGE
    })
  },
  methods: {
    login() {
      this.loginLoading = true;
      this.$store
        .dispatch(AUTH_REQUEST, {
          username: this.username,
          password: this.password
        })
        .then(resp => {
          if (resp) {
            const role = store.state.auth.user.select_role;
             
            //  var  no_of_cards = store.state.auth.user.no_of_cards;
             
             if (role === "admin") {
               this.$router.replace("/admin");
             }
            else{
              this.$router.replace("/dashboard");
            }
          
          }
          this.loginLoading = false;
        })
        .catch(() => {
          this.loginLoading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.form-divider {
  position: relative;
  clear: both;
  height: 0;
  margin: 2.5rem 0;
  border-top: 1px dashed #e5e8eb;
  &:after {
    position: absolute;
    top: -14px;
    left: 50%;
    margin-left: -10px;
    padding: 0 5px;
    content: "OR";
    color: #949494;
    background: #fff;
  }
}

.gx-custom-login-form {
  & .gx-login-header {
    margin-bottom: 6px;
  }
  & .login-brand {
    text-align: center;
    margin-bottom: 12px;
  }
  & .ant-btn.register-button {
    background: #4d65cd;
    color: white;
    padding: 0.4rem 1.5rem !important;
  }
}
.gx-custom-login-form {
  padding: 0 !important;
  & .ant-input {
    line-height: 2;
    padding: 12px 42px !important;
    font-size: 18px;
  }
  & .ant-btn {
    padding: 16px 42px !important;
    line-height: 2;
    width: 100%;
  }
}
</style>
