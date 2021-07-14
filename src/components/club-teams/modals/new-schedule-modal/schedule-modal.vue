<template>
  <a-modal
    v-model="isVisible"
    title="Club Scheduler"
    @cancel="close"
    @ok="handleForm"
  >
    <a-form :form="form" layout="vertical">
      <a-form-item label="Title">
        <a-input
          v-decorator="[
            'eventTitle',
            {
              rules: [
                {
                  required: true,
                  message: 'The title of this event is required'
                }
              ]
            }
          ]"
          placeholder="E.G Training Session"
        />
      </a-form-item>
      <a-form-item label="Location">
        <a-input
          v-decorator="[
            'eventLocation',
            {
              rules: [
                {
                  required: true,
                  message: 'The location of this event is required'
                }
              ]
            }
          ]"
          placeholder="KFA Soccer Pitch"
        />
      </a-form-item>
      <a-form-item label="Entry Cost">
        <a-input
          v-decorator="[
            'eventCost',
            {
              rules: [
                {
                  required: true,
                  message:
                    'Please enter the entry cost to this event, use 0 if none'
                }
              ]
            }
          ]"
          min="0"
          addon-after="Euros"
          type="number"
          step="0.1"
          placeholder="2.50"
        >
          <a-icon slot="prefix" type="euro" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item label="Session Duration">
        <a-input
          v-decorator="[
            'eventDuration',
            {
              rules: [
                {
                  required: true,
                  message: 'Please specify the duration of this session'
                }
              ]
            }
          ]"
          type="number"
          min="0"
          step="1"
          placeholder="30"
          addon-after="minutes"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="Start Date/Time">
        <a-date-picker
          v-decorator="[
            'eventSchedule',
            {
              rules: [
                {
                  required: true,
                  message:
                    'Please enter the schedule date and time for this event'
                }
              ]
            }
          ]"
          style="width:100%;"
          :disabled-date="disabledStartDate"
          :disabled-time="disabledStartDate"
          show-time
          format="DD/MM/YYYY HH:mm"
          placeholder="DD/MM/YYYY HH/MM"
        />
      </a-form-item>
      <a-form-item>
        <a-checkbox v-decorator="['eventRecurring']" @change="toggleRecurring">
          Recurring Event?
        </a-checkbox>
      </a-form-item>
      <a-form-item v-if="isRecurring">
        <a-select v-decorator="['eventRecurringType']" style="width:100%;">
          <a-select-option value="daily">Daily</a-select-option>
          <a-select-option value="monday">Every Monday</a-select-option>
          <a-select-option value="tuesday">Every Tuesday</a-select-option>
          <a-select-option value="wednesday">Every Wednesday</a-select-option>
          <a-select-option value="thursday">Every Thursday</a-select-option>
          <a-select-option value="friday">Every Friday</a-select-option>
          <a-select-option value="saturday">Every Saturday</a-select-option>
          <a-select-option value="sunday">Every Sunday</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from "moment";
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";
import notifications from "@/common/notifications/notification.service";
import { scheduleService } from "@/common/api/api.service";

export default {
  name: "ScheduleModal",
  mixins: [nTime, nCurrency],
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean
    },
    teamId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isRecurring: false,
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
    toggleRecurring() {
      this.isRecurring = !this.isRecurring;
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleFormSubmit({
            ...values,
            teamId: this.teamId
          });
        }
      });
    },
    handleFormSubmit(values) {
      scheduleService.put(values).then(resp => {
        if (resp.data.success) {
          notifications.success("Event scheduled succesfully");
          this.close();
        } else if (resp.data.code === 404) {
          notifications.warn("There was a problem locating this team");
          this.close();
        } else {
          notifications.warn("There was a problem scheduling this event");
        }
      });
    },
    disabledStartDate(startValue) {
      const endValue = moment().subtract(1, "d");
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() < endValue.valueOf();
    },
    moment,
    close() {
      this.form.resetFields();
      this.$emit("close");
    }
  }
};
</script>
