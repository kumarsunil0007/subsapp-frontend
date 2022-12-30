<template>
  <a-modal
    v-model="isVisible"
    class="add-member"
    title="Add Member"
    @cancel="close"
  >
    <a-row>
      <a-col :lg="24" :md="24" :sm="24" :xs="24">
        <a-form :form="form" @submit="addMember">
          <a-form-item>
            <a-row
              type="flex"
              align="middle"
              :gutter="1"
              style="margin-left:5px;"
            >
              <a-col :xs="2">
                <a-icon type="mail" />
              </a-col>

              <a-col :xs="22">
                <a-input
                  v-decorator="[
                    'work_email',
                    {
                      rules: [
                        { required: true, message: 'Email is required.' },
                        { type: 'email', message: 'Email is invalid.' }
                      ]
                    }
                  ]"
                  type="email"
                  placeholder="Enter email"
                ></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row
              type="flex"
              align="middle"
              :gutter="1"
              style="margin-left:5px;"
            >
              <a-col :xs="2">
                <a-icon type="user-add" />
              </a-col>
              <a-col :xs="22">
                <a-input
                  v-decorator="[
                    'first_name',
                    {
                      rules: [
                        { required: true, message: 'First name is required.' },
                        {
                          min: 3,
                          message:
                            'First name should contain at least 3 Characters.'
                        },
                        {
                          max: 20,
                          message: 'Sorry You are Exceeding the Limit.'
                        }
                      ]
                    }
                  ]"
                  type="text"
                  placeholder="Enter first name"
                ></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row
              type="flex"
              align="middle"
              :gutter="1"
              style="margin-left:5px;"
            >
              <a-col :xs="2">
                <a-icon type="user-add" />
              </a-col>
              <a-col :xs="22">
                <a-input
                  v-decorator="[
                    'last_name',
                    {
                      rules: [
                        { required: true, message: 'Last name is required.' },
                        {
                          min: 3,
                          message:
                            'Last name should contain at least 3 Characters.'
                        },
                        {
                          max: 20,
                          message: 'Sorry You are Exceeding the Limit.'
                        }
                      ]
                    }
                  ]"
                  type="text"
                  placeholder="Enter Last name"
                ></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row
              type="flex"
              align="middle"
              :gutter="1"
              style="margin-left:5px;"
            >
              <a-col :xs="2">
                <a-icon type="mobile" />
              </a-col>
              <a-col :xs="22">
                <a-input
                  v-decorator="[
                    'phone_no',
                    {
                      rules: [
                        { required: true, message: 'Phone is required.' },
                        {
                          max: 10,
                          message: 'Please use a 10 digit phone number.'
                        }
                      ]
                    }
                  ]"
                  type="number"
                  min="0"
                  addon-before="+353"
                  placeholder="Enter phone number"
                ></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row
              type="flex"
              align="middle"
              :gutter="1"
              style="margin-left:5px;"
            >
              <a-col :xs="2">
                <a-icon type="environment" />
              </a-col>
              <a-col :xs="22">
                <a-input
                  v-decorator="[
                    'address_1',
                    {
                      rules: [
                        { required: true, message: 'Address is required.' }
                      ]
                    }
                  ]"
                  type="text"
                  placeholder="Enter address"
                ></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row
              type="flex"
              align="middle"
              :gutter="1"
              style="margin-left:5px;"
            >
              <a-col :xs="2">
                <a-icon type="user" />
              </a-col>
              <a-col :xs="22">
                <a-input
                  v-decorator="['emergency_phone']"
                  type="text"
                  placeholder="Emergency phone"
                ></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row
              type="flex"
              align="middle"
              :gutter="1"
              style="margin-left:5px;"
            >
              <a-col :xs="2">
                <a-icon type="calendar" />
              </a-col>
              <a-col :xs="22">
                <a-date-picker
                  v-decorator="['dob']"
                  :disabled-date="disabledDate"
                  style="width:100%"
                  format="DD/MM/YYYY"
                  placeholder="Date of birth"
                />
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item>
            <a-row
              type="block"
              :gutter="1"
              class="gx-text-right"
              style="margin-top:0px;"
            >
              <a-button
                inline-block
                type="primary"
                html-type="submit"
                :loading="memberLoading"
                >Add Members</a-button
              >
            </a-row>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <div slot="footer"></div>
  </a-modal>
</template>

<script>
import notifications from "@/common/notifications/notification.service";
import { memberService } from "@/common/api/api.service";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "AddMemberModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyword: "",
      members: [],
      form: this.$form.createForm(this),
      memberLoading: false
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.visible;
      },
      set() {
        return false;
      }
    },
    ...mapGetters(["AUTH_USER"])
  },
  methods: {
    disabledDate(current) {
      
        return current && current >= moment().subtract(10, "years").endOf("day");
    },
    inviteMember(memberId) {
      memberService.inviteMember(memberId).then(resp => {
        if (resp.data.success) {
          this.searchEmails();
          notifications.success("An invite has been sent");
        } else {
          notifications.warn("We could not add this member");
        }
      });
    },
    addMember(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.memberLoading = true;
          values.role = this.AUTH_USER.select_role;
          values.url = window.location.origin + "/#/login";
          memberService
            .addMember2(values)
            .then(resp => {
              this.memberLoading = false;
              if (resp.data.success) {
                notifications.success("An invite has been sent");
                this.form.resetFields();
                this.$emit("close");
              } else {
                notifications.warn(resp.data.message);
                this.form.resetFields();
                this.$emit("close");
              }
            })
            .catch(error => {
              this.memberLoading = false;
              console.log(error);
            });
        }
      });
    },
    searchEmails() {
      memberService
        .searchMembers({
          keyword: this.keyword
        })
        .then(resp => {
          if (resp.data.success) {
            this.members = resp.data.result;
          }
        });
    },
    close() {
      this.form.resetFields();
      this.$emit("close");
    }
  }
};
</script>
<style>
.add-member .ant-modal-footer {
  display: none;
}
.ant-form-item-control-wrapper {
  width: 97%;
}
.has-error .ant-form-explain {
  margin-left: 50px;
}

</style>
