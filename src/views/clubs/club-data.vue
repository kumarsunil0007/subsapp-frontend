<template>
  <n-page>
    <a-row>
      <a-col :lg="12" :md="24" :sm="24" :xs="24">
        <a-card title="Club Details" class="">
          <a-form :form="form" layout="vertical">
            <a-form-item label="Club Name">
              <input :value="clubData.club_name" disabled />
            </a-form-item>
            <a-form-item label="Club Email">
              <input :value="clubData.email" disabled />
            </a-form-item>
            <a-form-item label="Contact Number">
              <input :value="clubData.contact_number" disabled />
            </a-form-item>
            <a-form-item label="Main Address">
              <input :value="clubData.address" disabled />
            </a-form-item>
            <a-form-item label="Facebook URL">
              <input :value="clubData.facebook" disabled />
            </a-form-item>
            <a-form-item label="Twitter URL">
              <input :value="clubData.twitter" disabled />
            </a-form-item>
            <a-form-item label="Website URL">
              <input :value="clubData.website" disabled />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import NPage from "@/components/ui/n-page/n-page";
import { clubService } from "@/common/api/api.service";
export default {
  name: "MyClub",
  components: { NPage },
  data() {
    return {
      form: this.$form.createForm(this),
      action: process.env.VUE_APP_API_HOST,
      spinning: false,
      clubId: null,
      clubData: {},
    };
  },
  computed: {},
  mounted() {
    this.clubId = this.$route.params.id;
    this.ClubInfo();
  },
  methods: {
    ClubInfo() {
      clubService.get(this.clubId).then((resp) => {
        if (resp.data.success) {
          this.clubData = resp.data.result;
          console.log("this.clubs => ", this.clubs);
        }
        this.teamsLoading = false;
      });
    },
  },
};
</script>

<style scoped></style>
