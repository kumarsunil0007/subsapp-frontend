<template>
  <a-modal
    v-model="isVisible"
    title="Create a new Team"
    @cancel="close"
    @ok="handleForm"
  >
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
      form: this.$form.createForm(this)
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
    }
  },
  methods: {
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit({
            ...values
          });
        }
      });
    },
    handleFormSubmit(values) {
      teamService.put(values).then(resp => {
        if (resp.data.success) {
          notifications.success("Team Created successfully");
          this.close();
        } else if (resp.data.code === 404) {
          notifications.warn("There was a problem creating this team");
          this.close();
        } else {
          notifications.warn("There was a problem creating this team");
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
