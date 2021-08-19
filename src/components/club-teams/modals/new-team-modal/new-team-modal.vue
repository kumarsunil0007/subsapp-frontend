<template>
  <a-modal v-model="isVisible" title="Create a new Team" @cancel="close">
    <template slot="footer">
      <a-button key="back" @click="close">
        Cancel
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleForm"
      >
        Create
      </a-button>
    </template>
    <a-form :form="form" layout="vertical">
      <a-form-item label="Team Name">
        <a-input
          v-decorator="[
            'teamName',
            {
              rules: [
                {
                  required: true,
                  message: 'The team name is required'
                }
              ]
            }
          ]"
          placeholder="E.G Under 17s Soccer"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import notifications from "@/common/notifications/notification.service";
import { teamService } from "@/common/api/api.service";
import { mapGetters } from "vuex";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
export default {
  name: "NewTeamModal",
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    }),
    isVisible: {
      get() {
        return this.visible;
      },
      set() {
        return false;
      }
    }
  },
  methods: {
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit({
            role: this.user.select_role,
            ...values
          });
        }
      });
    },
    handleFormSubmit(values) {
      this.loading = true;
      teamService
        .put(values)
        .then(resp => {
          this.loading = false;
          if (resp.data.success) {
            notifications.success("Team Created successfully");
            this.close();
          } else if (resp.data.code === 404) {
            notifications.warn("There was a problem creating this team");
            this.close();
          } else {
            notifications.warn("There was a problem creating this team");
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    close() {
      this.form.resetFields();
      this.$emit("close");
    }
  }
};
</script>
