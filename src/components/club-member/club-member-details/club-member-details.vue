<template>
  <div v-if="member && member.profile" class="member-details">
    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/email.png" />
      </a-col>
      <a-col>
        <label>Email</label>
        <p>{{ member.work_email }}</p>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/calendar.png" />
      </a-col>
      <a-col>
        <label>Date of Birth</label>
        <p>{{ nFormat(member.profile.dob) }}</p>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/mobile-app.png" />
      </a-col>
      <a-col>
        <label>Phone</label>
        <p>{{ member.profile.phone }}</p>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/address.png" />
      </a-col>
      <a-col>
        <label>Address</label>
        <p>
          <span v-if="member.profile.address_1">{{
            member.profile.address_1
          }}</span>
          <span v-if="member.profile.address_2"
            >, {{ member.profile.address_2 }}</span
          >
          <span v-if="member.profile.town">, {{ member.profile.town }}</span>
          <span v-if="member.profile.region"
            >, {{ member.profile.region }}</span
          >
          <span v-if="member.profile.postcode"
            >, {{ member.profile.postcode }}</span
          >
        </p>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/customer.png" />
      </a-col>
      <a-col>
        <label>Emergency Contact</label>
        <p>{{ member.profile.emergency_name }}</p>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/phone-call.png" />
      </a-col>
      <a-col>
        <label>Emergency Number</label>
        <p>{{ member.profile.emergency_phone }}</p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import nTime from "@/mixins/time";
export default {
  name: "ClubMemberDetails",
  mixins: [nTime],
  props: {
    member: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss">
.member-details {
  & img {
    width: 36px;
  }
  & .ant-row {
    margin-bottom: 12px;
    border-bottom: 1px solid #e5e9ec;
  }
  & .ant-row p {
    font-weight: lighter;
  }
}
</style>
