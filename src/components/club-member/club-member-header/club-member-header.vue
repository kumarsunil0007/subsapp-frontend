<template>
  <div
    v-if="member"
    class="teams-box teams-box-custom primary-gradient-bg member-header"
  >
    <div class="gx-profile-banner gx-blue-cyan-gradient">
      <div class="gx-profile-container">
        <div class="gx-profile-banner-top">
          <div class="gx-profile-banner-top-left">
            <div class="gx-profile-banner-avatar-info">
              <h2 class="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">
                {{ member.first_name }} {{ member.last_name }}
              </h2>
              <p class="gx-mb-0 gx-fs-lg member-header--has-payment">
                <img src="@/assets/custom-icons/shield.svg" />
                <span>Payment Source Verified</span>
              </p>
            </div>
          </div>
          <div class="gx-profile-banner-top-right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClubMemberHeader",
  props: {
    member: {
      required: true,
      type: Object
    }
  }
};
</script>

<style scoped lang="scss">
.member-header {
  padding: 0;
  &--has-payment {
    color: #daecec;
    & > img {
      width: 24px;
      margin-right: 6px;
    }
    & > span {
      position: relative;
    }
  }
}
</style>
