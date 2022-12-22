<template>
  <n-page>
    <a-row>
      <a-col :lg="12" :md="24" :sm="24" :xs="24">
        <a-card title="Club Settings" class="">
          <a-form :form="form" layout="vertical">
            <template v-if="club.club_logo">
              <img
                :src="clubLogo"
                style="max-height: 120px; max-width: 100%;"
                @error="defaultImage"
              />
            </template>
            <p class="gx-mt-3">
              We suggest using a 400x400px png or jpeg image for your logo
            </p>
            <a-form-item>
              <a-upload
                v-decorator="['upload']"
                accept="image/png,image/jpeg,/image/jpg"
                name="logo"
                :data="enjectRole"
                :action="`${action}/club/upload-club-logo`"
                :headers="{ Authorization: 'Bearer ' + userToken }"
                list-type="picture"
                @change="uploadImage"
              >
                <a-button> <a-icon type="upload" /> Change your Logo </a-button>
              </a-upload>
            </a-form-item>
            <a-form-item label="Club Name">
              <a-input
                v-decorator="[
                  'club_name',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter the name of your club.'
                      }
                    ]
                  }
                ]"
                type="text"
              >
              </a-input>
            </a-form-item>
            <a-form-item label="Club Email">
              <a-input
                v-decorator="[
                  'email',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Club email is required.'
                      }
                    ]
                  }
                ]"
                type="text"
              >
              </a-input>
            </a-form-item>
            <a-form-item label="Contact Number">
              <a-input v-decorator="['contact_phone']" type="text"> </a-input>
            </a-form-item>
            <a-form-item label="Main Address">
              <a-input v-decorator="['address']" type="textarea"> </a-input>
            </a-form-item>
            <a-form-item label="Facebook URL">
              <a-input
                v-decorator="['facebook']"
                type="text"
                placeholder="https://facebook.com"
              >
              </a-input>
            </a-form-item>
            <a-form-item label="Twitter URL">
              <a-input
                v-decorator="['twitter']"
                type="text"
                placeholder="https://twitter.com"
              >
              </a-input>
            </a-form-item>
            <a-form-item label="Website URL">
              <a-input
                v-decorator="['website']"
                type="text"
                placeholder="https://mywebsite.com"
              >
              </a-input>
            </a-form-item>
            <a-form-item class="gx-text-right">
              <a-button
                type="primary"
                html-type="submit"
                :loading="spinning"
                @click="handleForm"
              >
                Save Details
              </a-button>
            </a-form-item>
          </a-form>
          <!-- <n-section-loading
            v-if="clubLoadingStatus"
            title="Loading club details..."
          /> -->
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import { mapGetters } from "vuex";
import { AUTH_TOKEN, AUTH_USER } from "@/store/modules/auth/auth-actions";
import { GET_MY_CLUB } from "@/store/modules/club/club-actions";
import NPage from "@/components/ui/n-page/n-page";
import { clubService } from "@/common/api/api.service";
import NSectionLoading from "@/components/ui/n-section-loading/n-section-loading";
import notifications from "@/common/notifications/notification.service";
import MissingPng from "@/assets/missing-profile-photo.png";
export default {
  name: "MyClub",
  components: { NSectionLoading, NPage },
  data() {
    return {
      form: this.$form.createForm(this),
      action: process.env.VUE_APP_LIVE_API_HOST,
      spinning: false
    };
  },
  computed: {
    ...mapGetters({
      club: "getClub",
      user: [AUTH_USER],
      userToken: [AUTH_TOKEN],
      clubLoadingStatus: "getClubLoadingStatus"
    }),
    enjectRole() {
      let data = {
        role: this.user.select_role
      };
      return data;
    },
    clubLogo: function() {
      if (this.club.club_logo) {
        return this.club.club_logo;
      } else {
        return MissingPng;
      }
    }
  },
  watch: {
    club: function(newData) {
      this.form.setFieldsValue({
        club_name: newData.club_name,
        email: newData.email,
        address: newData.address,
        contact_phone: newData.contact_number,
        facebook: newData.facebook,
        twitter: newData.twitter,
        website: newData.website
      });
    }
  },
  mounted() {
    this.ClubInfo();
  },
  methods: {
    uploadImage() {
      this.ClubInfo();
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.role = this.user.select_role;
          this.handleFormSubmit(values);
        }
      });
    },
    handleFormSubmit(values) {
      this.spinning = true;
      clubService
        .update(this.club.id, values)
        .then(resp => {
          this.spinning = false;
          if (resp.data.success) {
            this.ClubInfo();
            notifications.success("Club updated successfully");
          } else {
            notifications.warn(resp.data.message);
          }
        })
        .catch(() => {
          notifications.warn("Something went wrong, please try again later");
          this.spinning = false;
        });
    },
    defaultImage(e) {
      e.target.src = MissingPng;
    },
    ClubInfo() {
      const data = {
        role: this.user.select_role
      };
      this.$store.dispatch(GET_MY_CLUB, data);
    }
  }
};
</script>

<style scoped></style>
