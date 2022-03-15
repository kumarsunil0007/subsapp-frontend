<template>
  <div>
    <vue-cal
      xsmall
      style="height: 600px"
      :time-from="1 * 60"
      :time-to="24 * 60"
      :time-cell-height="40"
      default-view="month"
      active-view="month"
      events-on-month-view="full"
      :disable-views="['years', 'year', 'day']"
      :events="events"
      :time-step="20"
      today-button
      :on-event-click="onEventClick"
      @view-change="logEvents($event)"
    >
    </vue-cal>
    <a-modal v-model="showDialog">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="showDialog = false">
          Close
        </a-button>
      </template>
      <h2>{{ selectedEvent.title }}</h2>
      <a-divider />
      <strong>{{ nFormat(selectedEvent.startDate) }}</strong>
      <strong>Event details:</strong>
      <ul>
        <li>Location: {{ selectedEvent.location }}</li>
        <li>Event starts at: {{ selectedEvent.startTime }}</li>
        <li>Event ends at: {{ selectedEvent.endTime }}</li>
      </ul>
      <h4 class="joined-member-heading"><strong>Joined Members</strong></h4>
      <ul class="joined-members">
        <li
          v-for="member in selectedEvent.members"
          :key="member.id"
          style="color: blue;cursor:pointer;text-decoration: line"
        >
          <div @click.prevent="$router.push('/club/member/' + member.id)">
            <h5>{{ member.preferred_name }}</h5>
          </div>
          <div>
            <a-button
              @click.prevent="
                $router.push(
                  '/teams/' +
                    selectedEvent.team_id +
                    '/session/' +
                    selectedEvent.id
                )
              "
            >
              manage
            </a-button>
          </div>
        </li>
      </ul>
    </a-modal>


    <a-modal v-model="showDialog123">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="showDialog123 = false">
          Close
        </a-button>
      </template>
      <h2>Select Option</h2>
      <a-divider />
      <div id="app">
        <select class="form-control" @change="changeJobTitle($event)" ref="selectedEl">
          <option :value="undefined" selected disabled>Choose</option>
          <option v-for="jobTitle in jobTitles"  class="details_scheduler" ref='dropdownObj' :value="jobTitle.id" :key="jobTitle.id">{{ jobTitle.name }}</option>
        </select>
        <!-- <p><span>Selected job title: {{ selectedJobTitle  }}</span></p> -->
</div>
    </a-modal>
    <!-- <a-row type="flex">
    <a-col :xs="24" :sm="24" :md="8">
      <a-card>
        <a-row>
          <a-col :xs="16" :sm="16" :md="16">
            <a-statistic
              title="Active Members"
              :value="members"
              :value-style="{ color: '#262626' }"
              style="margin-right: 50px"
            >
            </a-statistic>
          </a-col>
          <a-col :xs="8" :sm="8" :md="8">
            <template>
              <a-icon type="user" />
            </template>
          </a-col>
          <div class="text-dashboard">
            Grow your club by inviting new members or just manage your existing
            members.
          </div>
        </a-row>
      </a-card>
    </a-col>
    <a-col :xs="24" :sm="24" :md="8">
      <a-card>
        <a-row>
          <a-col :xs="16" :sm="16" :md="16">
            <a-statistic
              title="Teams"
              :value="teams"
              :value-style="{ color: '#262626' }"
              style="margin-right: 50px"
            >
            </a-statistic>
          </a-col>
          <a-col :xs="8" :sm="8" :md="8">
            <template>
              <a-icon type="team" />
            </template>
          </a-col>
          <div class="text-dashboard">
            Schedule new training session, add and remove team members and
            manage.
          </div>
        </a-row>
      </a-card>
    </a-col>
    <a-col :xs="24" :sm="24" :md="8">
      <a-card>
        <a-row>
          <a-col :xs="16" :sm="16" :md="16">
            <a-statistic
              title="Billing"
              :value-style="{ color: '#ffffff' }"
              style="margin-right: 50px"
            >
            </a-statistic>
          </a-col>
          <a-col :xs="8" :sm="8" :md="8">
            <template>
              <a-icon type="money-collect" />
            </template>
          </a-col>
          <div class="text-dashboard">
            View a breakdown of your clubs billing history. Track pending
            payments and view individual transaction invoices.
          </div>
        </a-row>
      </a-card>
    </a-col>
  </a-row> -->
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { clubService } from "@/common/api/api.service";
import { mapGetters } from "vuex";
import moment from "moment";
let st,ed,team_id;
export default {
  components: { VueCal },
  data() {
    return {
      dashboard_data: "",
      members: 0,
      teams: 0,
      showDialog: false,
      showDialog123: false,
      selectedEvent: {},
      events: [],
      jobTitles: [
            { name: "Details", id: 1 },
            { name: "Scheduler", id: 2 },
            
        ],
      selected:undefined, 
    };

    
  },
  computed: {
    ...mapGetters(["AUTH_USER"])
  },
  mounted() {
    let st = moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    let ed = moment()
      .endOf("month")
      .format("YYYY-MM-DD");
    this.clubDashboad(st, ed);
  },
  methods: {
    clubDashboad(st, ed) {
      // if (typeof st === "undefined") {
      //       var st = moment()
      //           .startOf("month")
      //           .format("YYYY-MM-DD");
            
      //   }

      // if (typeof ed === "undefined") {
      //   var ed = moment()
      //         .endOf("month")
      //         .format("YYYY-MM-DD");   
      //   }

      
      // if(st=="undefinded"){
      //       let st = moment()
      //               .startOf("month")
      //               .format("YYYY-MM-DD");
      // }
      // if(ed="undefinded"){
      //    let st = moment()
      //               .startOf("month")
      //               .format("YYYY-MM-DD");
      // }
      const data = {
        role: this.AUTH_USER.select_role,
        startDate: st,
        endDate: ed
      };
      clubService
        .clubDashboad({ params: data })
        .then(resp => {
          this.events = [];
          if (resp.data.success) {
            const result = resp.data.result;
           // console.log(JSON.stringify(resp.data.result));
            let events = [];
            for (let event of result) {
              events.push({
                start: moment(event.start).format("YYYY-MM-DD HH:mm"),
                end: moment(event.start)
                  .add(event.length, "minutes")
                  .format("YYYY-MM-DD HH:mm"),
                title: event.title,
                location: event.location,
                content: event.users.length + " " + "members",
                class: event.AttendanceID ? "health" : "leisure",
                members: event.users,
                team_id: event.team_id,
                id: event.id
              });
            }
            this.events = events;
          }
        })
        .catch(() => {
          this.events = [];
        });
    },
    onEventClick(event, e) {
      team_id = event.team_id;
      this.selectedEvent = event;
      this.showDialog123 = true;
      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation();
    },
    logEvents(e) {
      this.clubDashboad(
        moment(e.startDate).format("YYYY-MM-DD"),
        moment(e.endDate).format("YYYY-MM-DD")
      );
    },
    changeJobTitle (event1) {
      this.selectedJobTitle = event1.target.options[event1.target.options.selectedIndex].text
      //alert(this.selectedJobTitle);
      if(this.selectedJobTitle=="Details"){
     //    $(".details_scheduler").empty(); 

        let st = moment()
              .startOf("month")
              .format("YYYY-MM-DD");
        let ed = moment()
          .endOf("month")
          .format("YYYY-MM-DD");
          this.clubDashboad(st, ed);
          this.showDialog123 = false;
          this.showDialog = true;
      }
      if(this.selectedJobTitle=="Scheduler"){
        this.showDialog123 = false;
        this.$router.push('/teams/' +
                    team_id );
      
      }
    }
  }
};
</script>

<style>
/* .ant-card {
  z-index: 1;
  margin-bottom: 32px;
  box-shadow: -1px 6px 11px 1px #d6d4d4;
  border-bottom: 5px solid #028fd6;
}
.ant-statistic-title {
  margin-bottom: 4px;
  color: #595959;
  font-size: 18px;
}
i {
  font-size: 32px;
  align-items: center;
  display: flex;
  justify-content: center;
}
.text-dashboard {
  margin: 11px;
  color: goldenrod;
}
.ant-card-body {
  padding: 18px;
  padding-bottom: 4px;
  zoom: 1;
}
.ant-card-body {
  padding: 18px;
  padding-bottom: 8px !important;
  zoom: 1;
} */
.vuecal__menu,
/* .vuecal__cell-events-count {
  background-color: #4b7bec;
} */
.vuecal__menu {
  background: #4b7bec;
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

.vuecal__event.leisure {
  margin: 4px;
  border-radius: 4px;
  color: white;
  background: #4b7bec !important;
}

.vuecal__event.health {
  margin: 4px;
  border-radius: 4px;
  color: white;
  background: #559f3f !important;
}

.vuecal__event-content {
  font-style: italic;
}
ul.joined-members {
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 8px;
}
ul.joined-members li {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
}
ul.joined-members li h5 {
  color: #f18805;
}
.joined-members button {
  margin-bottom: 0;
}
.joined-member-heading {
  margin-bottom: 10px;
  color: #545454;
}
</style>
