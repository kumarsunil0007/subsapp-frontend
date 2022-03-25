<template>
  <n-page>
    <a-row>
      <a-col :lg="12" :md="24" :sm="24" :xs="24">
        <a-card title="My Profile Settings" class="gx-card-widget heading">
          <a-form :form="form" layout="vertical">
            <template v-if="profilePic">
              <img
                :src="profilePic"
                class="gx-mb-3"
                style="max-height: 120px; max-width: 100%;"
                @error="defaultImage"
              />
            </template>
            <a-form-item>
              <a-upload
                :file-list="fileList"
                :remove="handleRemove"
                :before-upload="beforeUpload"
                :show-upload-list="true"
              >
                <a-button> <a-icon type="upload" /> Select File </a-button>
              </a-upload>
              <a-button
                type="primary"
                :disabled="fileList.length === 0"
                style="margin-top: 16px"
                :loading="uploading"
                @click="handleUpload"
              >
                {{ uploading ? "Uploading" : "Start Upload" }}
              </a-button>
            </a-form-item>

             <a-form-item>
              <button @click="removeImage()">Remove image</button>
            </a-form-item>
            <a-form-item label="First Name">
              <a-input
                v-decorator="[
                  'first_name',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'First name is required'
                      }
                    ]
                  }
                ]"
                type="text"
              >
              </a-input>
            </a-form-item>
            <a-form-item label="Last Name">
              <a-input
                v-decorator="[
                  'last_name',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Last name is a required field'
                      }
                    ]
                  }
                ]"
                type="text"
              >
              </a-input>
            </a-form-item>

            <a-form-item label="Email">
              <a-input
                v-decorator="[
                  'work_email',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Your email is required'
                      }
                    ]
                  }
                ]"
                type="text"
              >
              </a-input>
            </a-form-item>
            <a-form-item label="Phone Number">
              <a-input v-decorator="['phone']" type="text"></a-input>
            </a-form-item>
            <a-form-item label="Date of Birth">
              <a-date-picker
                v-decorator="['dob']"
                style="width:100%"
                format="DD/MM/YYYY"
              />
            </a-form-item>

              <a-form-item label="Emergency Name">
              <a-input v-decorator="['emergency_name']" type="text"> </a-input>
            </a-form-item>
            <a-form-item label="Emergency Phone">
              <a-input v-decorator="['emergency_phone']" type="text"> </a-input>
            </a-form-item>

            <a-form-item label="Address 1">
              <a-input v-decorator="['address_1']" type="text"> </a-input>
            </a-form-item>
            <a-form-item label="Address 2">
              <a-input v-decorator="['address_2']" type="text"> </a-input>
            </a-form-item>

            <a-form-item label="Town">
              <a-input v-decorator="['town']" type="text"> </a-input>
            </a-form-item>
            <a-form-item label="Region">
              <a-input v-decorator="['region']" type="text"> </a-input>
            </a-form-item>
            <a-form-item label="Postcode">
              <a-input v-decorator="['post_code']" type="text"> </a-input>
            </a-form-item>

            <div class="ant-row ant-form-item">
              <div class="ant-form-item-label">
                <label for="region" title="Region" class="">Country</label>
              </div>
              <div class="ant-form-item-control-wrapper">
                <country-select
                  v-model="fields.country"
                  :country="fields.country"
                  top-country="IE"
                  class-name="ant-input"
                />
              </div>
            </div>
            <a-form-item class="gx-text-right">
              <a-button
                type="primary"
                html-type="submit"
                :loading="loading"
                @click="handleForm"
              >
                Save Details
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <!-- <a-col :lg="12" :md="24" :sm="24" :xs="24">
        <a-card title="Child Account (Under 16)" class="gx-card-widget">
          <div slot="extra">
            <a-button
              type="primary"
              size="small"
              @click="openSubAccountModal(null)"
            >
              New Sub Account
            </a-button>
          </div>
          <sub-accounts-table
            v-if="renderComponent"
            @manage="openSubAccountModal"
          />
        </a-card>
      </a-col> -->
    </a-row>
    <!-- <sub-accounts-manage-modal
      v-if="subManagerVisible"
      :user-id="selectedUserId"
      :visible="subManagerVisible"
      @close="closeSubAccountModal"
    /> -->
  </n-page>
</template>

<script>
import { mapGetters } from "vuex";
import NPage from "@/components/ui/n-page/n-page";
import notifications from "@/common/notifications/notification.service";
import MissingPng from "@/assets/missing-profile-photo.png";

import { AUTH_USER, AUTH_TOKEN } from "@/store/modules/auth/auth-actions";
import { memberService } from "@/common/api/api.service";
import moment from "moment";
//import SubAccountsTable from "@/components/sub-accounts/sub-accounts-table/sub-accounts-table";
//import SubAccountsManageModal from "@/components/sub-accounts/sub-accounts-manage-modal/sub-accounts-manage-modal";
export default {
  name: "MyProfile",
  components: {
    // SubAccountsManageModal,
    //SubAccountsTable,
    NPage
  },
  data() {
    return {
      renderComponent: true,
      subManagerVisible: false,
      selectedUserId: 0,
      dateValue: moment(),
      fields: {
        country: null
      },
      form: this.$form.createForm(this),
      action: process.env.VUE_APP_API_HOST,
      user_image: "",
      loading: false,
      uploading: false,
      fileList: []
    };
  },
  computed: {
    ...mapGetters({
      authUser: [AUTH_USER],
      userToken: [AUTH_TOKEN],
      user: "getUser",
      userProfileLoading: "userProfileLoading"
    }),
    profilePic: function() {
      if (this.user_image) {
        return this.user_image;
      } else {
        return "https://api.subsapp.com/missing.png";
      }
    }
  },
  watch: {
    // user: function(newData) {
    //   if (newData.user_id) {
    //     this.fields.country = newData.country || "IE";
    //     this.form.setFieldsValue({
    //       first_name: newData.first_name,
    //       last_name: newData.last_name,
    //       work_email: newData.work_email
    //     });
    //     if (newData && !newData.app) {
    //       this.form.setFieldsValue({
    //         phone: newData.phone,
    //         emergency_name: newData.emergency_name,
    //         emergency_phone: newData.emergency_phone,
    //         address_1: newData.address_1,
    //         address_2: newData.address_2,
    //         town: newData.town,
    //         post_code: newData.post_code,
    //         region: newData.region
    //       });
    //       if (newData.dob) {
    //         this.form.setFieldsValue({
    //           dob: moment(newData.dob, "YYYY-MM-DD")
    //         });
    //       }
    //     }
    //   }
    // }
  },
  mounted() {
    //this.$store.dispatch(GET_USER, this.authUser.user.user_id);
    this.fetchProfile();
  },
  methods: {
    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
    openSubAccountModal(user_id) {
      if (user_id) {
        this.selectedUserId = parseInt(user_id);
      }
      this.subManagerVisible = true;
    },
    closeSubAccountModal() {
      this.forceRerender();
      this.subManagerVisible = false;
      this.selectedUserId = 0;
    },
    uploadImage({ file }) {
      console.log(file);
      //this.fetchProfile();
    },
    defaultImage(e) {
      e.target.src = MissingPng;
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit(values);
        } else {
          console.log(err);
        }
      });
    },
    fetchProfile() {
      memberService.userProfile().then(resp => {
        if (resp.data.success) {
          this.form.setFieldsValue({
            first_name: resp.data.result.first_name,
            last_name: resp.data.result.last_name,
            work_email: resp.data.result.work_email,
            phone: resp.data.result.profile.phone,
            emergency_name: resp.data.result.profile.emergency_name,
            emergency_phone: resp.data.result.profile.emergency_phone,
            address_1: resp.data.result.profile.address_1,
            address_2: resp.data.result.profile.address_2,
            town: resp.data.result.profile.town,
            post_code: resp.data.result.profile.post_code,
            region: resp.data.result.profile.region,
            //dob: moment(resp.data.result.profile.dob, "YYYY-MM-DD")
          });
          this.fields.dob =  moment(resp.data.result.profile.dob, "YYYY-MM-DD");
          this.fields.country = resp.data.result.profile.country;
          this.user_image = resp.data.result.profile.image;

          let userData = JSON.parse(localStorage.getItem("auth-user"));
          userData.user.profile.image = resp.data.result.profile.image;
          userData.user.first_name = resp.data.result.first_name;
          userData.user.last_name = resp.data.result.last_name;
          userData.user.work_email = resp.data.result.work_email;
          userData.user.preferred_name = resp.data.result.preferred_name;
          window.localStorage.setItem("auth-user", JSON.stringify(userData));
          this.$store.commit("AUTH_STATE");
        }
      });
    },
    handleFormSubmit(values) {
      this.loading = true;
      memberService
        .updateProfile({
          ...values,
          country: this.fields.country,
          dob:this.fields.dob
        })
        .then(resp => {
          this.loading = false;
          if (resp.data.success) {
            this.fetchProfile();
            notifications.success("Great! Profile updated");
          } else {
            if (resp.data.message) {
              notifications.warn(resp.data.message);
            } else {
              notifications.warn(
                "We could not update your personal details, something went wrong."
              );
            }
          }
        })
        .catch(() => {
          this.loading = false;
          notifications.warn(
            "We could not update your personal details, something went wrong."
          );
        });
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append("logo", file);
      });
      this.uploading = true;
      memberService
        .uploadAvatar(formData)
        .then(resp => {
          this.uploading = false;
          if (resp.data.success === true) {
            notifications.success("upload successfully.");
            this.fileList = [];
            this.fetchProfile();
          } else {
            notifications.warn(resp.data.message);
          }
        })
        .catch(() => {
          this.uploading = false;
          notifications.warn("Server error");
        });
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    removeImage () {
      memberService
        .deleteAvatar()
        .then(resp => {
          if (resp.data.success === true) {
            notifications.success("Profile Image Remove Succesfully.");
            this.fileList = [];
            this.fetchProfile();
          } else {
            notifications.warn(resp.data.message);
          }
        })
        .catch(() => {

          notifications.warn("Server error");
        });
    },
  }
  
};
</script>