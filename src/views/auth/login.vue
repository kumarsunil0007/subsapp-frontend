<template>
  <a-layout>
    <div class="gx-main-content-wrapper gx-custom-login-form">
      <div class="gx-login-container">
        <div class="gx-login-content">
          <div class="login-brand gx-text-center">
            <img style="max-height: 80px" alt="SubsApp" src="@/assets/regular-logo.png" />
          </div>
          <div class="gx-login-header gx-text-center">
            <h1 class="gx-login-title">Sign In To SubsApp</h1>
          </div>
          <a-alert v-if="status === 'error'" class="gx-mb-4" type="error" :message="message" banner />
          <a-form class="gx-login-form gx-form-row0" @submit.prevent="login">
            <a-form-item>
              <a-input ref="userNameInput" v-model="username" placeholder="Email">
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input ref="passwordInput" v-model="password" placeholder="Password" type="password">
                <a-icon slot="prefix" type="key" />
              </a-input>
            </a-form-item>
            <a-form-item class="gx-text-center">
              <a-button class="gx-mb-0" type="primary" html-type="submit" :loading="loginLoading">
                Login
              </a-button>
            </a-form-item>
          </a-form>
          <div class="gx-text-center">
            <router-link :to="{ path: '/auth/forgot-password' }" class="gx-login-form-forgot">
              Forgot Password
            </router-link>
          </div>
          <div class="form-divider"></div>
          <a-button class="register-button register-button--member"
            @click="$router.replace({ path: '/register-user' })">
            Become a Member
          </a-button>
          <a-button class="register-button register-button--club" @click="$router.replace({ path: '/register-club' })">
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
            if (store.state.auth.user.user.is_password_reset == 0 && store.state.auth.user.user.invitation_email == "1") {
              this.$router.replace("/update-password");
            }
            else {
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
<style>
.swal2-title {
  position: relative;
  max-width: 100%;
  margin: 20px !important;
  padding: 0.8em 1em 0;
  color: inherit;
  font-size: 20px !important;
  font-weight: 100;
}
</style>
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
    margin-bottom: 15px;
  }

  & .ant-btn.register-button {
    background: #4d65cd;
    color: white;
    // padding: 0.4rem 1.5rem !important;
  }
}

.gx-custom-login-form {
  padding: 0 !important;

  .gx-login-content {
    .ant-input-affix-wrapper {
      & .ant-input {
        // line-height: 2;
        padding: 12px 42px;
        // font-size: 18px;
      }
    }
  }

  & .ant-btn {
    padding: 14px 42px !important;
    line-height: 1;
    width: 100%;
  }
}

@media screen and (min-width: 0px) and (max-width: 991px) {
  .gx-custom-login-form {

    .gx-login-content {
      .ant-input-affix-wrapper {
        & .ant-input {
          line-height: 2;
          padding: 16px 42px;
          // font-size: 18px;
        }
      }
    }

    & .ant-btn {
      padding: 16px 42px !important;
      line-height: 2;
    }
    & .ant-btn.register-button {
      padding: 0.4rem 1.5rem !important;
    }
  }
}
</style>
