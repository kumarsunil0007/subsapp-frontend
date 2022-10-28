<template>
  <div v-if="member" class="member-details">
    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/id-card.png" />
      </a-col>
      <a-col>
        <label>Name</label>
        <p>{{ member.preferred_name }}</p>
      </a-col>
    </a-row>
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
        <p>{{ member.dob }}</p>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/mobile-app.png" />
      </a-col>
      <a-col>
        <label>Phone</label>
        <p>{{ member.phone }}</p>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col>
        <img src="@/assets/custom-icons/address.png" />
      </a-col>
      <a-col>
        <label>Address</label>
        <p>
          <span v-if="member.address_1">{{ member.address_1 }}</span>
          <span v-if="member.address_2">, {{ member.address_2 }}</span>
          <span v-if="member.town">, {{ member.town }}</span>
          <span v-if="member.region">, {{ member.region }}</span>
          <span v-if="member.postcode">, {{ member.postcode }}</span>
        </p>
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
