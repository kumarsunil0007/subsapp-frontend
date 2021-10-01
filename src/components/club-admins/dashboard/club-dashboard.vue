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
      events-on-month-view="short"
      :disable-views="['years', 'year']"
      :events="events"
      :time-step="20"
    >
    </vue-cal>
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
export default {
  components: { VueCal },
  data() {
    return {
      dashboard_data: "",
      members: 0,
      teams: 0,
      events: [
        {
          start: "2021-10-01 14:00",
          end: "2021-10-01 15:30",
          title: "Training Session",
          location: "Kenmare Soccer Pitch",
          content: "You have joined",
          class: "leisure"
        },
        {
          start: "2021-10-01 16:00",
          end: "2021-10-01 17:00",
          title: "Indoor Rowing Session",
          location: "Kenmare Rowing Club",
          content: "You have joined",
          class: "health"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["AUTH_USER"])
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    fetchStats() {
      const data = {
        role: this.AUTH_USER.select_role
      };
      clubService.fetchStats({ params: data }).then(resp => {
        if (resp.data.success) {
          this.members = resp.data.members;
          this.teams = resp.data.teams;
        }
      });
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
</style>
