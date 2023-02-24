<template>
  <n-page>
    <!-- <sub-accounts-manage-modal
      v-if="subManagerVisible"
      :user-id="selectedUserId"
      :visible="subManagerVisible"
      @close="closeSubAccountModal"
    /> -->
    <a-form :form="form" layout="vertical">
      <a-row style="flex-direction: row">
        <a-col
          :xl="6"
          :lg="10"
          :md="10"
          :sm="10"
          :xs="24"
          class="gx-text-center"
        >
          <a-card class="gx-card-widget heading">
            <h2 class="gx-text-left">Edit Profile Picture</h2>
            <div class="profile-pic-upload">
              <a-row>
                <a-col :lg="24">
                  <div style="position: relative" class="profile-upload-parent">
                    <template v-if="profilePic">
                      <div class="profile-img">
                        <img
                          :src="profilePic"
                          class="gx-mb-3"
                          @error="defaultImage"
                        />
                      </div>
                    </template>
                    <button v-if="user_image" class="edit-profile-btn">
                      <!-- <a-icon type="delete" @click="removeImage()" /> -->
                      <a-popconfirm
                        placement="bottom"
                        title="Are you sure to delete this image?"
                        ok-text="Yes"
                        cancel-text="No"
                        class="delete-popup"
                        @confirm="confirm"
                        @cancel="cancel"
                      >
                        <a href="#"><a-icon type="delete"/></a>
                      </a-popconfirm>
                    </button>
                  </div>
                </a-col>
                <a-col :lg="24" class="gx-mt-4">
                  <a-upload
                    :file-list="fileList"
                    :remove="handleRemove"
                    :before-upload="beforeUpload"
                    :show-upload-list="true"
                    :multiple="false"
                  >
                    <a-button class="gx-mb-0">
                      <a-icon type="upload" /> Select File
                    </a-button>
                  </a-upload>
                  <a-button
                    type="primary"
                    :disabled="fileList.length === 0"
                    style="margin-top: 16px"
                    :loading="uploading"
                    @click="handleUpload"
                  >
                    {{ uploading ? "Uploading" : "Start Upload" }}
                  </a-button></a-col
                >
              </a-row>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="18" :lg="14" :md="14" :sm="14" :xs="24">
          <a-card class="gx-card-widget heading information-card">
            <a-row style="flex-direction: row">
              <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                <h2>Personal Information</h2>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="First Name">
                  <a-input
                    v-decorator="[
                      'first_name',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'First name is required.'
                          }
                        ]
                      }
                    ]"
                    type="text"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Last Name">
                  <a-input
                    v-decorator="[
                      'last_name',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Last name is a required field.'
                          }
                        ]
                      }
                    ]"
                    type="text"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Email">
                  <a-input
                    v-decorator="[
                      'work_email',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Your email is required.'
                          }
                        ]
                      }
                    ]"
                    type="text"
                  >
                  </a-input> </a-form-item
              ></a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Phone Number">
                  <div class="custom-phone">
                  <VueCountryCode
                    class="country-dropdown"
                    :enabled-country-code="true"
                    :default-country="iso2 ? iso2 : 'IE'"
                    :show-name-input="true"
                    @onSelect="onCountrySelect"
                  />
                  <a-input v-decorator="['phone',
                      {
                        rules: [
                          {
                            min: 10,
                            message: 'Minimum 10 digits are allowed.'
                          },
                          {
                            max: 10,
                            message: 'Maximum 10 digits are allowed.'
                          }
                        ]
                      }]" type="text"></a-input></div> </a-form-item
              >
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Date of Birth">
                  <a-date-picker
                    v-decorator="['dob']"
                    style="width: 100%"
                    format="DD/MM/YYYY"
                  /> </a-form-item
              ></a-col>
              <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                <hr />
              </a-col>
              <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                <h2>Other Information</h2>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Emergency Name">
                  <a-input v-decorator="['emergency_name']" type="text">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Emergency Phone">
                  <a-input v-decorator="['emergency_phone']" type="text">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Address 1">
                  <a-input v-decorator="['address_1']" type="text"> </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Address 2">
                  <a-input v-decorator="['address_2']" type="text"> </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Town">
                  <a-input v-decorator="['town']" type="text"> </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Region">
                  <a-input v-decorator="['region']" type="text"> </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Postcode">
                  <a-input v-decorator="['post_code']" type="text"> </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
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
              </a-col>
              <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                <hr />
              </a-col>
              <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                <h2>Update Password</h2>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Current Password">
                  <a-input v-model="current_password" type="password">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="New Password">
                  <a-input v-model="new_password" type="password"> </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item label="Confirm Password">
                  <a-input v-model="confirm_password" type="password"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-form-item class="gx-text-left gx-mt-4">
                  <a-button
                    type="primary"
                    html-type="submit"
                    :loading="loading"
                    @click="handleForm"
                  >
                    Save Details
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card></a-col
        >
      </a-row>
    </a-form>
  </n-page>
</template>

<script>
import { mapGetters } from "vuex";
import NPage from "@/components/ui/n-page/n-page";
import notifications from "@/common/notifications/notification.service";
import VueCountryCode from "vue-country-code-select";
import MissingPng from "@/assets/missing-profile-photo.png";
import { AUTH_USER, AUTH_TOKEN } from "@/store/modules/auth/auth-actions";
import { memberService } from "@/common/api/api.service";
import moment from "moment";
export default {
  name: "MyProfile",
  components: {
    VueCountryCode,
    NPage
  },
  data() {
    return {
      visible: false,
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
      fileList: [],
      country_code: null,
      iso2: null,
      confirm_password: null,
      current_password: null,
      new_password: null
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
  beforeMount() {
    //this.$store.dispatch(GET_USER, this.authUser.user.user_id);
    this.fetchProfile();
  },
  methods: {
    onCountrySelect(value) {
      console.log("value => ", value);
      if (value != undefined) {
        this.country_code = value.dialCode;
        this.iso2 = value.iso2;
      }
    },
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
            dob: resp.data.result.profile.dob
          });
          this.confirm_password = null;
          this.current_password = null;
          this.new_password = null;
          this.country_code = resp.data.result.profile.country_code;
          this.iso2 = resp.data.result.profile.iso2;
          this.fields.country = resp.data.result.profile.country;
          this.user_image = resp.data.result.profile.image;
          let userData = JSON.parse(localStorage.getItem("authUserData"));
          userData.user.profile.image = resp.data.result.profile.image;
          userData.user.first_name = resp.data.result.first_name;
          userData.user.last_name = resp.data.result.last_name;
          userData.user.work_email = resp.data.result.work_email;
          userData.user.preferred_name = resp.data.result.preferred_name;
          window.localStorage.setItem("authUserData", JSON.stringify(userData));
          this.$store.commit("AUTH_STATE");
          console.log("this.iso2 => ",this.iso2)
        }
      });
    },
    confirm() {
      memberService
        .deleteAvatar()
        .then(resp => {
          if (resp.data.success === true) {
            notifications.success("Profile picture removed succesfully.");
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
    cancel(e) {
      console.log(e);
    },
    handleFormSubmit(values) {
      this.loading = true;
      values.country_code = this.country_code;
      values.iso2 = this.iso2;
      values.confirm_password = this.confirm_password;
      values.current_password = this.current_password;
      values.new_password = this.new_password;
      memberService
        .updateProfile({
          ...values,
          country: this.fields.country
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
        formData.append("image", file);
      });
      this.uploading = true;
      memberService
        .uploadAvatar(formData)
        .then(resp => {
          this.uploading = false;
          if (resp.data.success === true) {
            notifications.success("Profile picture uploaded successfully.");
            this.fileList = [];
            this.fetchProfile();
          } else {
            notifications.warn(resp.data.message);
          }
        })
        .catch(err => {
          this.uploading = false;
          this.fileList = [];
          notifications.warn(
            err.response.data.errors.image[0]
              ? err.response.data.errors.image[0]
              : "Server error"
          );
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
    removeImage() {
      memberService
        .deleteAvatar()
        .then(resp => {
          if (resp.data.success === true) {
            notifications.success("Profile picture removed succesfully.");
            this.fileList = [];
            this.fetchProfile();
          } else {
            notifications.warn(resp.data.message);
          }
        })
        .catch(() => {
          notifications.warn("Server error");
        });
    }
  }
};
</script>
