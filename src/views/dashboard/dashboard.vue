<template>
  <n-page>
    <div class="coach-welcome-modal">
      <a-modal v-model="visible" class="welcome-modal" width="800px">
        <a-carousel :after-change="onChange" arrows class="coach-slides">
          <div>
            <a-row type="flex" align="middle" class="gx-pt-5">
              <a-col :lg="14">
                <h1>WELCOME</h1>
                <h2>To SubsAPP.</h2>
                <p>You have successfully logged-in as a Coach.</p>
              </a-col>
              <a-col :lg="10">
                <img src="../../assets/images/coach-slide1.png" alt="slide1" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle" class="gx-pb-5">
              <a-col :lg="12">
                <h3>
                  Coach can check the Events and can manage his team Schedule
                </h3>
              </a-col>
              <a-col :lg="12">
                <img src="../../assets/images/coach-slide2.png" alt="slide2" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle" class="gx-pb-5">
              <a-col :lg="12">
                <h3>
                  Coach can
                </h3>
                <p class="gx-mb-0">Add and Search</p>
                <h3>
                  Members
                </h3>
              </a-col>
              <a-col :lg="12">
                <img src="../../assets/images/coach-slide3.png" alt="slide3" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle" class="gx-pt-5">
              <a-col :lg="14">
                <h2>Coach can</h2>
                <h4 class="gx-mb-0">
                  manage and
                </h4>
                <h3>create new team</h3>
              </a-col>
              <a-col :lg="10">
                <img src="../../assets/images/coach-slide4.png" alt="slide4" />
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row type="flex" align="middle" class="gx-pt-5">
              <a-col :lg="12">
                <h2>Coach</h2>
                <p class="gx-mb-0">
                  can check
                </p>
                <h2>the club list</h2>
              </a-col>
              <a-col :lg="12">
                <img src="../../assets/images/coach-slide5.png" alt="slide5" />
              </a-col>
            </a-row>
          </div>
          <template #prevArrow>
            <div class="custom-slick-arrow rrghh" style="left: 10px; zindex: 1">
              Previous
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              Next
            </div>
          </template>
        </a-carousel>
      </a-modal>
    </div>
    <div v-if="user.select_role === 'member'">
      <div class="member-welcome-modal">
        <a-modal v-model="visible" class="welcome-modal" width="800px">
          <a-carousel :after-change="onChange" arrows>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-5">
                <a-col :lg="14">
                  <h1>WELCOME</h1>
                  <h2>To SubsAPP.</h2>
                  <p>You have successfully logged-in as a Member.</p>
                </a-col>
                <a-col :lg="10">
                  <img src="../../assets/images/slide1.png" alt="slide1" />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-5">
                <a-col :lg="12">
                  <h3>Member can check the schedule</h3>
                </a-col>
                <a-col :lg="12">
                  <img src="../../assets/images/slide2.png" alt="slide2" />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-4">
                <a-col :lg="12">
                  <h4>
                    Member can join the new club and Accept/ reject any new club
                    invitation.
                  </h4>
                </a-col>
                <a-col :lg="12">
                  <img src="../../assets/images/slide3.png" alt="slide3" />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pb-5">
                <a-col :lg="12">
                  <h3>Subs APP helps the Member to check the Team Status</h3>
                </a-col>
                <a-col :lg="12">
                  <img src="../../assets/images/slider4.png" alt="slide4" />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle">
                <a-col :lg="12">
                  <p>
                    SubsAPP Sign Stripe for secured payment system. Member can
                    manage his billing details from this portal
                  </p>
                </a-col>
                <a-col :lg="12">
                  <img src="../../assets/images/slider5.png" alt="slide5" />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-5">
                <a-col :lg="12">
                  <h2>Enter your</h2>
                  <p>
                    card details and become a member
                  </p>
                </a-col>
                <a-col :lg="12">
                  <img src="../../assets/images/slider6.png" alt="slide6" />
                </a-col>
              </a-row>
            </div>
            <template #prevArrow>
              <div class="custom-slick-arrow " style=" zindex: 1">
                Previous
              </div>
            </template>
            <template #nextArrow>
              <div class="custom-slick-arrow">
                Next
              </div>
            </template>
          </a-carousel>
        </a-modal>
      </div>
      <div style="display: flex">
        <p style=" margin-right: 20px;">
          <span
            style="    padding: 6px;
    height: 10px;
    display: inline-block;
    width: 10px;
    border-radius: 50%;
    background: #559f3f;"
          ></span>
          Joined .
        </p>
        <p>
          <span
            style="    padding: 6px;
    height: 10px;
    display: inline-block;
    width: 10px;
    border-radius: 50%;
    background: #4b7bec;"
          ></span>
          Not Joined .
        </p>
      </div>
      <a-card title="Your Schedules" class="gx-card-full">
        <member-calendar />
      </a-card>
    </div>
    <div v-else>
      <a-card title="Events" class="gx-card-full">
        <ClubDashboard />
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
import { AUTH_USER } from "@/store/modules/auth/auth-actions";
import { mapGetters } from "vuex";
import MemberCalendar from "@/components/member-calendar/member-calendar";
import ClubDashboard from "@/components/club-admins/dashboard/club-dashboard";
import { clubService } from "@/common/api/api.service";

import moment from "moment";
export default {
  name: "Dashboard",
  components: {
    NPage,
    MemberCalendar,
    ClubDashboard
  },
  data() {
    return {
      visible: true,
      teams: [
        {
          teamID: 1,
          teamName: "Avonmore FC 95 Training Sub U18",
          totalMembers: 22,
          revenueThisWeek: 919
        },
        {
          teamID: 2,
          teamName: "Terenure College Rugby Football Club U21",
          totalMembers: 22,
          revenueThisWeek: 522
        }
      ],
      showDate: new Date(),
      items: [
        {
          id: 1,
          startDate: moment(),
          endDate: moment().add(1, "hours"),
          title: "heldfsdfsdfslo"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  },
  mounted() {
    this.fetchRoles();
  },
  methods: {
    onChange(a, b, c) {
      console.log(a, b, c);
    },
    showModal() {
      this.visible = true;
    },

    fetchRoles() {
      clubService.fetchRoles().then(resp => {
        if (resp.data.success) {
          let userData = JSON.parse(localStorage.getItem("authUserData"));
          userData.user_type = resp.data.result;
          window.localStorage.setItem("authUserData", JSON.stringify(userData));
          this.$store.commit("AUTH_STATE");
        }
      });
    },
    setShowDate(d) {
      console.log("hit");
      this.showDate = d;
    },
    getHeader(t) {
      console.log(t);
      return {
        value: "sdsdas"
      };
    }
  }
};
</script>
<style scoped>
.welcome-modal .ant-modal-body {
  padding: 0;
}

#show-cal {
  color: #2c3e50;
  height: 67vh;
  margin-left: auto;
  margin-right: auto;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 120px;
  height: 36px;
  font-size: 16px;
  color: #38d0f9;
  background-color: #fff;
  text-align: center;
  opacity: 1;
  line-height: 36px;
  border-radius: 20px;
  bottom: 0;
  top: 94%;
}

.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}

.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel >>> .slick-slide {
  overflow: hidden;
  line-height: 100px;
  padding: 50px 0;
}

.ant-carousel >>> .slick-slide h1 {
  color: #fff;
  letter-spacing: 0.05em;
  font-weight: 500;
  line-height: 80px;
  font-size: 64px;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
}

.ant-carousel >>> .slick-slide h2 {
  color: #fff;
  font-size: 54px;
  font-weight: 500;
  line-height: 60px;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
  letter-spacing: 0.05em;
}

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
  font-size: 42px;
  font-weight: 500;
  line-height: 50px;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
  letter-spacing: 0.05em;
}

.ant-carousel >>> .slick-slide h4 {
  color: #fff;
  font-size: 36px;
  font-weight: 500;
  line-height: 50px;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
  letter-spacing: 0.05em;
}

.ant-carousel >>> .slick-slide p {
  color: #fff;
  font-size: 30px;
  line-height: 40px;
  margin-top: 10px;
  letter-spacing: 0.1em;
  font-weight: 400;
  text-shadow: 0px 2px 6px rgb(0 0 0 / 25%);
}

.welcome-modal .ant-modal .ant-modal-content {
  padding: 20px;
}

.welcome-modal .ant-modal-body {
  padding: 0;
}
</style>
