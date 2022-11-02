<template>
  <a-modal
    v-model="isVisible"
    title="Club Scheduler"
    @cancel="close"
    @ok="handleForm"
  >
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
        Ok
      </a-button>
    </template>
    <a-form :form="form" layout="vertical">
      <a-form-item label="Title">
        <a-input
          v-decorator="[
            'title',
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
            'location',
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
      <a-row>
        <a-col>
          <a-form-item label="Entry Cost">
            <a-input
              v-decorator="[
                'cost',
                {
                  rules: [
                    {
                      required: true,
                      message:
                        'Please enter the entry cost to this event, use 0 if none'
                    },
                    {
                      validator: validateCost
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
        </a-col>
        <a-col>
          <a-form-item label="Session Duration">
            <a-input
              v-decorator="[
                'length',
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
        </a-col>
      </a-row>

      <a-form-item label="Start Date/Time">
        <a-date-picker
          v-decorator="[
            'start',
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
          locale="DD/MM/YYYY HH:mm"
          :disabled-time="disabledStartDate"
          :show-time="{ format: 'HH:mm' }"
          :show-second="false"
          format="DD/MM/YYYY HH:mm"
          placeholder="DD/MM/YYYY HH/MM"
          :default-value="dateTime()"
          @change="changeDate"
        />
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[
            'is_recurring',
            {
              valuePropName: 'checked',
              initialValue: false
            }
          ]"
          @change="toggleRecurring"
        >
          Recurring Event?
        </a-checkbox>
      </a-form-item>
      <a-form-item v-if="isRecurring" label="Recurring Event End Date">
        <a-date-picker
          v-decorator="[
            'recurring_end_date',
            {
              rules: [
                {
                  required: true,
                  message: 'Please select the recurring event end date'
                },
                {
                  validator: validateRecurringDate
                }
              ]
            }
          ]"
          style="width:100%;"
          :disabled-date="disabledStartDate"
          :disabled-time="disabledStartDate"
          format="DD/MM/YYYY"
          placeholder="DD/MM/YYYY"
        />
      </a-form-item>
      <a-form-item v-if="isRecurring" label="Recurring Day">
        <a-select
          v-decorator="[
            'recurring_type',
            {
              rules: [
                {
                  required: true,
                  message: 'Please select event recurring type'
                }
              ]
            }
          ]"
          style="width:100%;"
          placeholder="Please select event recurring type"
        >
          <a-select-option value="monday">Every Monday</a-select-option>
          <a-select-option value="tuesday">Every Tuesday</a-select-option>
          <a-select-option value="wednesday">Every Wednesday</a-select-option>
          <a-select-option value="thursday">Every Thursday</a-select-option>
          <a-select-option value="friday">Every Friday</a-select-option>
          <a-select-option value="saturday">Every Saturday</a-select-option>
          <a-select-option value="sunday">Every Sunday</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="isRecurring" label="Payment Method">
        <a-select
          v-decorator="[
            'payment_recurring',
            {
              rules: [
                {
                  required: true,
                  message: 'Please select the payment'
                }
              ]
            }
          ]"
          style="width:100%;"
          placeholder="Please select the payment method"
        >
          <a-select-option :value="0">One Time payment</a-select-option>
          <a-select-option :value="1">Recurring Payment</a-select-option>
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
      setDate: "",
      form: this.$form.createForm(this),
      loading: false
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
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    },
    dateTime() {
      var dateTime = localStorage.getItem("storeGetDateTime");
      return dateTime;
    },
    changeDate(e) {
      this.setDate = e.format("YYYY-MM-D HH:mm");
    },
    toggleRecurring() {
      this.isRecurring = !this.isRecurring;
    },
    validateCost(rule, value, callback) {
      if (value < 0) {
        callback("Please enter the entry cost to this event, use 0 if none");
      } else {
        callback();
      }
    },
    validateRecurringDate(rule, value, callback) {
      if (this.setDate) {
        if (value.isBefore(moment(this.setDate))) {
          callback("Recurring end date must greater than event start date");
        } else {
          callback();
        }
      } else {
        callback("Recurring end date must greater than event start date");
      }
    },
    handleForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.start = this.setDate;
          values.cost = parseFloat(values.cost).toFixed(2);
          this.handleFormSubmit({
            ...values,
            team_id: this.teamId
          });
        }
      });
    },
    handleFormSubmit(values) {
      this.loading = true;
      scheduleService
        .put(values)
        .then(resp => {
          this.loading = false;
          if (resp.data.success) {
            notifications.success("Event scheduled succesfully");
            this.close();
          } else if (resp.data.code === 404) {
            notifications.warn("There was a problem locating this team");
            this.close();
          } else {
            notifications.warn("There was a problem scheduling this event");
          }
        })
        .catch(() => {
          this.loading = false;
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
      this.isRecurring = false;
      this.$emit("close");
    }
  }
};
</script>
