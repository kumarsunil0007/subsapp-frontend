<template>
  <n-page>
    <div>
      <a-card :title="schedules" class="gx-card-full">
        <vue-cal
          xsmall
          style="height: 600px"
          :time-from="1 * 60"
          :time-to="24 * 60"
          :time-cell-height="40"
          default-view="week"
          :events="events"
          :time-step="20"
          :on-event-click="onEventClick"
          :disable-views="['years']"
          :selected-date="selectedDate"
        >
        </vue-cal>
        <a-modal v-model="showDialog">
          <h2>{{ selectedEvent.title }}</h2>
          <a-divider />
          <strong>{{ nFormat(selectedEvent.startDate) }}</strong>
          <strong>Event details:</strong>
          <ul>
            <li>Location: {{ selectedEvent.location }}</li>
            <li>Event starts at: {{ selectedEvent.startTime }}</li>
            <li>Event ends at: {{ selectedEvent.endTime }}</li>
          </ul>
        </a-modal>
      </a-card>
    </div>
  </n-page>
</template>

<style lang="scss">
.teams-box {
  &--name {
    font-weight: 100;
  }
  &--title {
    font-size: 22px;
    color: #f5f5f5;
    margin-bottom: 2px;
  }
}
</style>

<script>
//import NBox from "@/components/ui/n-box/n-box";
import NPage from "@/components/ui/n-page/n-page";
import VueCal from "vue-cal";
import nTime from "@/mixins/time";
import "vue-cal/dist/vuecal.css";
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
import { memberService } from "@/common/api/api.service";
import moment from "moment";

export default {
  name: "Dashboard",
  components: { NPage, VueCal },
  data() {
    return {
      showDialog: false,
      selectedEvent: {},
      schedules: "",
      events: [
        {
          start: "2021-09-14 14:00",
          end: "2021-09-14 15:30",
          title: "Training Session",
          location: "Kenmare Soccer Pitch",
          class: "leisure"
        },
        {
          start: "2021-09-15 11:00",
          end: "2021-09-15 11:15",
          title: "Indoor Rowing Session",
          location: "Kenmare Rowing Club",
          class: "leisure"
        }
      ],
      selectedDate: ""
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  },
  mounted() {
    this.fetchSchedule();
  },
  methods: {
    fetchSchedule() {
      const id = this.$route.params.id;
      memberService.getTeamSchedules(id).then(resp => {
        let events = [];
        if (resp.data.success) {
          this.schedules = resp.data.result.length
            ? resp.data.result[0].team_name
            : "Your Schedules";
          for (let event of resp.data.result) {
            if (!this.selectedDate) {
              let now = moment();
              if (moment(event.start).isAfter(now)) {
                this.selectedDate = moment(event.start).format(
                  "YYYY-MM-DD HH:mm"
                );
              }
            }
            events.push({
              start: moment(event.start).format("YYYY-MM-DD HH:mm"),
              end: moment(event.start)
                .add(event.length, "minutes")
                .format("YYYY-MM-DD HH:mm"),
              title: event.title,
              location: event.location,
              class: "leisure"
            });
          }
          this.events = events;
        }
      });
    },
    onEventClick(event, e) {
      this.selectedEvent = event;
      this.showDialog = true;
      e.stopPropagation();
    }
  }
};
</script>
<style>
/* Green-theme. */
.vuecal__menu,
.vuecal__cell-events-count {
  background-color: #4b7bec;
}
.vuecal__menu li {
  border-bottom-color: #fff;
  color: #fff;
}
.vuecal__menu li.active {
  background-color: rgba(255, 255, 255, 0.15);
}
.vuecal__title {
  background-color: #e4f5ef;
}
.vuecal__cell.today,
.vuecal__cell.current {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal:not(.vuecal--day-view) .vuecal__cell.selected {
  background-color: rgba(235, 255, 245, 0.4);
}
.vuecal__cell.selected:before {
  border-color: rgba(66, 185, 131, 0.5);
}

.vuecal__event {
  cursor: pointer;
}
.vuecal__time-cell .hours.line:before {
  border-color: #42b983;
}
.vuecal__event-title {
  font-size: 14px;
  font-weight: bold;
  margin: 4px 0 8px;
}

.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vuecal__event {
  margin: 4px;
  border-radius: 4px;
  color: white;
  background: #4b7bec;
}

.vuecal__event-content {
  font-style: italic;
}
</style>
