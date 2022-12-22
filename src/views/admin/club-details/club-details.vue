<template>
  <n-page>
    <a-row>
      <a-col :lg="12" :md="24" :sm="24" :xs="24">
        {{ clubLoadingStatus }}
        <a-card
          title="Club Settings"
          class=""
          :class="{ 'gx-card-full': clubLoadingStatus }"
        >
          <a-form
            :class="{ 'gx-hide': clubLoadingStatus }"
            :form="form"
            layout="vertical"
          >
            <template v-if="club.club_logo">
              <img
                :src="clubLogo"
                style="max-height: 120px; max-width: 100%;"
              />
            </template>
            <p class="gx-mt-3">
              We suggest using a 400x400px png or jpeg image for your logo
            </p>
            <a-form-item>
              <a-upload
                v-decorator="['upload']"
                accept="image/png,image/jpeg/image/jpg"
                name="logo"
                action="https://api.subsapp.com/api/club/upload-club-logo/"
                :headers="{ Authorization: userToken }"
                list-type="picture"
                :show-upload-list="false"
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
                  'work_email',
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
              <a-button type="primary" html-type="submit" @click="handleForm">
                Save Details
              </a-button>
            </a-form-item>
          </a-form>
          <n-section-loading
            v-if="clubLoadingStatus"
            title="Loading club details..."
          />
        </a-card>
      </a-col>
    </a-row>
  </n-page>
</template>

<script>
import { mapGetters } from "vuex";
import { AUTH_TOKEN } from "@/store/modules/auth/auth-actions";
import { GET_MY_CLUB } from "@/store/modules/club/club-actions";
import NPage from "@/components/ui/n-page/n-page";
import { clubService } from "@/common/api/api.service";
import NSectionLoading from "@/components/ui/n-section-loading/n-section-loading";

export default {
  name: "MyClub",
  components: { NSectionLoading, NPage },
  data() {
    return {
      form: this.$form.createForm(this)
    };
  },
  computed: {
    ...mapGetters({
      club: "getClub",
      userToken: [AUTH_TOKEN],
      clubLoadingStatus: "getClubLoadingStatus"
    }),
    clubLogo: function() {
      if (this.club.club_logo) {
        return "https://api.subsapp.com/uploads/" + this.club.club_logo;
      } else {
        return "https://api.subsapp.com/missing.png";
      }
    }
  },
  watch: {
    club: function(newData) {
      if (!this.clubLoadingStatus) {
        if (newData.id) {
          this.form.setFieldsValue({
            club_name: newData.club_name,
            work_email: newData.work_email,
            address: newData.address,
            contact_phone: newData.contact_phone,
            facebook: newData.facebook,
            twitter: newData.twitter,
            website: newData.website
          });
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch(GET_MY_CLUB);
  },
  methods: {
    uploadImage() {
      this.$store.dispatch(GET_MY_CLUB);
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit(values);
        }
      });
    },
    handleFormSubmit(values) {
      clubService.update(this.club.id, values).then(resp => {
        if (resp.data.success) {
          this.close();
        }
      });
    }
  }
};
</script>

<style scoped></style>
