<template>
  <div>
    <vue-cal
      xsmall
      style="height: 500px"
      :time-from="5 * 60"
      :time-to="22 * 60"
      :time-cell-height="60"
      default-view="day"
      :events="events"
      :time-step="30"
      :on-event-click="onEventClick"
    >
      :disable-views="['years', 'year', 'month']" >
    </vue-cal>
    <a-modal v-model="showDialog">
      <h2>{{ selectedEvent.title }}</h2>
      <a-divider />
      <strong>{{ nFormat(selectedEvent.startDate) }}</strong>
      <p v-html="selectedEvent.content" />
      <strong>Event details:</strong>
      <ul>
        <li>Location: {{ selectedEvent.location }}</li>
        <li>Event starts at: {{ selectedEvent.startTime }}</li>
        <li>Event ends at: {{ selectedEvent.endTime }}</li>
      </ul>
    </a-modal>
  </div>
</template>
<script>
// In your VueJS component.
import VueCal from "vue-cal";
import nTime from "@/mixins/time";
import "vue-cal/dist/vuecal.css";
import moment from "moment";
import { memberService } from "@/common/api/api.service";

export default {
  name: "MemberCalendar",
  components: { VueCal },
  mixins: [nTime],
  data: () => ({
    showDialog: false,
    selectedEvent: {},
    events: [
      {
        start: "2019-04-03 14:00",
        end: "2019-04-03 15:30",
        title: "Training Session",
        location: "Kenmare Soccer Pitch",
        class: "leisure"
      },
      {
        start: "2019-04-03 11:00",
        end: "2019-04-03 12:45",
        title: "Indoor Rowing Session",
        location: "Kenmare Rowing Club",
        class: "leisure"
      }
    ]
  }),
  mounted() {
    this.fetchSchedule();
  },
  methods: {
    fetchSchedule() {
      memberService.getSchedule().then(resp => {
        let events = [];
        if (resp.data.success) {
          for (let event of resp.data.result) {
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

      // Prevent navigating to narrower view (default vue-cal behavior).
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
