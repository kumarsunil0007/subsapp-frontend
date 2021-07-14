<template> </template>

<script>
import { AUTH_LOGOUT } from "@/store/modules/auth/auth-actions";

export default {
  name: "Logout",
  mounted() {
    this.$store.dispatch(AUTH_LOGOUT);
    this.$router.push("/login");
  },
};
</script>
