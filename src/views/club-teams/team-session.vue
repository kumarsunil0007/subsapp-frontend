<template>
  <n-page>
    <div class="gx-profile-banner gx-blue-cyan-gradient">
      <div class="gx-profile-container">
        <div class="gx-profile-banner-top">
          <div class="gx-profile-banner-top-left">
            <div class="gx-profile-banner-avatar-info">
              <h2 class="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">
                {{ session.team && session.team.team_name }}
              </h2>
              <p class="gx-mb-0 gx-fs-lg">
                {{ session.location }} @ {{ nTime(session.start) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="session.id" class="flex justify-center">
      <a-row :gutter="16">
        <a-col :lg="12" :xs="24">
          <a-card
            class="
              gx-card-widget
              gx-card-full
              gx-card-tabs
              gx-card-tabs-right
              gx-card-profile
              ant-card-bordered
            "
            title="Member Attendance"
          >
            <session-member-attendance-table
              :team-id="session.team_id"
              :session-id="session.id"
              :session-start="session.start"
              :session-data="session"
            />
          </a-card>
        </a-col>
        <a-col :lg="12" :xs="24">
          <a-row :gutters="12">
            <a-col :lg="8" :xs="24">
              <a-card
                class="
                  gx-card-widget
                  gx-card-widget
                  gx-card-full
                  gx-p-3
                  gx-bg-cyan
                  gx-text-white
                  ant-card-bordered
                "
              >
                <div class="">
                  <div class="gx-mr-2 gx-mr-xxl-3">
                    <a-icon type="euro" class="gx-fs-icon-lg" />
                  </div>
                  <div class="gx-media-body">
                    <h1
                      class="
                        gx-fs-xxl gx-font-weight-semi-bold gx-mb-1 gx-text-white
                      "
                    >
                      €{{ parseFloat(getTotalInvoiceValue).toFixed(2) }}
                    </h1>
                    <p class="gx-mb-0 gx-fs-sm">Est. Revenue</p>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :lg="8" :xs="24">
              <a-card
                class="
                  gx-card-widget
                  gx-card-widget
                  gx-card-full
                  gx-p-3
                  gx-bg-teal
                  gx-text-white
                  ant-card-bordered
                "
              >
                <div class="">
                  <div class="gx-mr-2 gx-mr-xxl-3">
                    <a-icon type="like" class="gx-fs-icon-lg" />
                  </div>
                  <div class="gx-media-body">
                    <h1
                      class="
                        gx-fs-xxl gx-font-weight-semi-bold gx-mb-1 gx-text-white
                      "
                    >
                      {{ getMembersAttending }}
                    </h1>
                    <p class="gx-mb-0 gx-fs-sm">Members Attending</p>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :lg="8" :xs="24">
              <a-card
                class="
                  gx-card-widget
                  gx-card-widget
                  gx-card-full
                  gx-p-3
                  gx-bg-orange
                  gx-text-white
                  ant-card-bordered
                "
              >
                <div class="">
                  <div class="gx-mr-2 gx-mr-xxl-3">
                    <a-icon type="dislike" class="gx-fs-icon-lg" />
                  </div>
                  <div class="gx-media-body">
                    <h1
                      class="
                        gx-fs-xxl gx-font-weight-semi-bold gx-mb-1 gx-text-white
                      "
                    >
                      {{ getMembersNotAttending }}
                    </h1>
                    <p class="gx-mb-0 gx-fs-sm">Not attending</p>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
              <a-card title="Billing" class="gx-card-widget">
                <div class="gx-table-responsive">
                  <club-session-invoice-table
                    :session-id="session.id"
                  ></club-session-invoice-table>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </n-page>
</template>

<script>
import { mapGetters } from "vuex";
import { scheduleService } from "@/common/api/api.service";
import NPage from "@/components/ui/n-page/n-page";
import nTime from "@/mixins/time";
import SessionMemberAttendanceTable from "@/components/club-teams/team-schedule/session-member-attendance-table";
import ClubSessionInvoiceTable from "@/components/club-session/club-session-invoice-table/club-session-invoice-table";
export default {
  name: "ClubMyTeams",
  components: {
    ClubSessionInvoiceTable,
    SessionMemberAttendanceTable,
    NPage,
    nTime
  },
  data() {
    return {
      session: {
        id: 0,
        team_id: 0
      }
    };
  },
  computed: {
    ...mapGetters([
      "getMembersAttending",
      "getMembersNotAttending",
      "getTotalInvoiceValue"
    ])
  },
  created() {
    this.getSchedule();
  },
  methods: {
    async getSchedule() {
      if (this.$route.params.sessionId) {
        await scheduleService.get(this.$route.params.sessionId).then(resp => {
          if (resp.data.success) {
            resp.data.result.id = parseInt(resp.data.result.id);
            resp.data.result.team_id = parseInt(resp.data.result.team_id);
            this.session = resp.data.result;
          }
        });
      }
    }
  }
};
</script>
