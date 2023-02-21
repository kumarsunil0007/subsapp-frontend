<template>
  <n-page>
    <div v-if="user.select_role === 'member'">
      <div style="display: flex">
        <p style="margin-right: 20px">
          <span
            style="
              padding: 6px;
              background: #559f3f;
              height: 10px;
              display: inline-block;
              width: 10px;
              border-radius: 50%;
            "
          ></span>
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
    <div v-if="user.select_role === 'coach'">
      <div class="coach-welcome-modal">
        <a-modal v-model="visible" :mask-closable="false" class="welcome-modal">
          <a-carousel :after-change="onChange" arrows class="coach-slides">
            <div>
              <a-row type="flex" align="middle" class="gx-pt-5">
                <a-col :lg="14" :md="24">
                  <h1>WELCOME</h1>
                  <h2>To Subsapp.com</h2>
                  <p>You have successfully logged in as a Club.</p>
                </a-col>
                <a-col :lg="10" :md="24">
                  <img
                    src="../../assets/images/coach-slide1.png"
                    alt="slide1"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pb-5">
                <a-col :lg="12" :md="24">
                  <h3>
                    Coach can check the Events and can manage his team Schedule
                  </h3>
                </a-col>
                <a-col :lg="12" :md="24">
                  <img
                    src="../../assets/images/coach-slide2.png"
                    alt="slide2"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pb-5">
                <a-col :lg="12" :md="24">
                  <h3>Coach can</h3>
                  <p class="gx-mb-0">Add and Search</p>
                  <h3>Members</h3>
                </a-col>
                <a-col :lg="12" :md="24">
                  <img
                    src="../../assets/images/coach-slide3.png"
                    alt="slide3"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-5">
                <a-col :lg="14" :md="24">
                  <h2>Coach can</h2>
                  <h4 class="gx-mb-0">manage and</h4>
                  <h3>create new team</h3>
                </a-col>
                <a-col :lg="10" :md="24">
                  <img
                    src="../../assets/images/coach-slide4.png"
                    alt="slide4"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-5">
                <a-col :lg="12" :md="24">
                  <h2>Coach</h2>
                  <p class="gx-mb-0">can check</p>
                  <h2>the club list</h2>
                </a-col>
                <a-col :lg="12" :md="24">
                  <img
                    src="../../assets/images/coach-slide5.png"
                    alt="slide5"
                  />
                </a-col>
              </a-row>
            </div>
            <template v-if="displayCoachPreviousBtn" #prevArrow>
              <div class="custom-slick-arrow" style="z-index: 1; left: 8px">
                Previous
              </div>
            </template>
            <template v-if="displayCoachNextBtn" #nextArrow>
              <div class="custom-slick-arrow" style="right: 8px">Next</div>
            </template>
          </a-carousel>
          <div
            v-if="!displayCoachNextBtn"
            class="custom-slick-arrow click-btn custom-btn"
            @click="updateIsloggedIn"
          >
            Click here
          </div>
        </a-modal>
      </div>
    </div>
    <div v-if="user.select_role === 'club_admin'">
      <div class="coach-welcome-modal">
        <a-modal
          v-model="clubModalVisible"
          :mask-closable="false"
          class="welcome-modal"
        >
          <a-carousel :after-change="onClubChange" arrows class="coach-slides">
            <div>
              <a-row
                type="flex"
                align="middle"
                class="gx-pt-1 ant-row-flex ant-row-flex-middle"
              >
                <a-col :lg="14" :md="24">
                  <h1>WELCOME</h1>
                  <h2>To Subsapp.com</h2>
                  <p>You have successfully logged in as a Club admin.</p>
                </a-col>
                <a-col :lg="10" :md="24">
                  <img
                    src="../../assets/images/coach-slide1.png"
                    alt="slide1"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-1">
                <a-col :lg="12" :md="24">
                  <h2>Event</h2>
                  <p class="gx-mb-0">Find what's on, where and when.</p>
                </a-col>
                <a-col :lg="12" :md="24">
                  <img
                    src="../../assets/images/Club-slider2-Eventst.png"
                    alt="slide2"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-0">
                <a-col :lg="14" :md="24">
                  <h3>Members</h3>
                  <p class="gx-mb-0">
                    Details of club and team members at your fingertips, copy
                    and paste the email address to quickly add to teams etc .
                  </p>
                </a-col>
                <a-col :lg="10" :md="24">
                  <img
                    src="../../assets/images/coach-slide3.png"
                    alt="slide3"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-0">
                <a-col :lg="12" :md="24">
                  <h2>Team</h2>
                  <p class="gx-mb-0">
                    Find out your teams or request to be added .
                  </p>
                </a-col>
                <a-col :lg="12" :md="24">
                  <img
                    src="../../assets/images/coach-slider3teamimg.png"
                    alt="slide4"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-0">
                <a-col :lg="12" :md="24">
                  <h2>Coaches</h2>
                  <p class="gx-mb-0">
                    Team and club coach details are found here .
                  </p>
                </a-col>
                <a-col :lg="12" :md="24">
                  <img
                    src="../../assets/images/Club-slider5-coatches.png"
                    alt="slide5"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-0">
                <a-col :lg="12" :md="24">
                  <h3>Subscription</h3>
                  <p class="gx-mb-0">
                    Choose a plan that suits your club, 1 flat monthly fee with
                    no hidden charges. No contract .
                  </p>
                </a-col>
                <a-col :lg="12" :md="24" center>
                  <img
                    src="../../assets/images/Club-slider6-subscriptions-amico.png"
                    alt="slide6"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-0">
                <a-col :lg="12" :md="24">
                  <h2>Club Details</h2>
                  <p class="gx-mb-0">Add your clubs logo/photo and details.</p>
                </a-col>
                <a-col :lg="12" :md="24">
                  <img
                    src="../../assets/images/Club-slider7-clubDetails.png"
                    alt="slide7"
                  />
                </a-col>
              </a-row>
            </div>
            <div>
              <a-row type="flex" align="middle" class="gx-pt-0">
                <a-col :lg="12" :md="24">
                  <h2>My Profile</h2>
                  <p class="gx-mb-0">
                    Space for the big cheese of the club, contact details etc.
                  </p>
                </a-col>
                <a-col :lg="12" :md="24" :sm="15">
                  <img
                    src="../../assets/images/coatch-slider8-profile.png"
                    alt="slide8"
                  />
                </a-col>
              </a-row>
            </div>
            <template v-if="displayAdminPreviousBtn" #prevArrow>
              <div class="custom-slick-arrow desktop-slider-icon" style="z-index: 1; left: 8px;">
                  <span class="previous_text"> Previous </span>
                  <a-icon class="previous_icon" type="left" />
                </div>
            </template>
            <template v-if="displayAdminNextBtn" #nextArrow>
              <div class="custom-slick-arrow desktop-slider-icon" style="right: 8px">
                  <span class="next_text"> Next </span>
                  <a-icon class="next_icon" type="right" />
                </div>
            </template>
          </a-carousel>
          <div v-if="!displayAdminNextBtn" class="custom-slick-arrow click-btn custom-btn" @click="updateIsloggedIn">
              <span class="oK_button_text"> Ok </span>
              <a-icon class="close_button" type="close" />
            </div>
        </a-modal>
      </div>
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
import { clubService, authService } from "@/common/api/api.service";

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
      clubModalVisible: true,
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
      ],
      displayCoachPreviousBtn: false,
      displayCoachNextBtn: true,
      displayAdminNextBtn: true,
      displayAdminPreviousBtn: false
    };
  },
  computed: {
    ...mapGetters({
      user: AUTH_USER
    })
  },
  mounted() {
    this.fetchRoles();
    this.checkModalDisplay();
    this.checkModalDisplay();
  },
  methods: {
    onChange(index) {
      console.log(index);
      this.displayCoachPreviousBtn = index === 0 ? false : true;
      this.displayCoachNextBtn = index === 4 ? false : true;
    },
    onClubChange(Clubindex) {
      console.log(Clubindex);
      this.displayAdminPreviousBtn = Clubindex === 0 ? false : true;
      this.displayAdminNextBtn = Clubindex === 7 ? false : true;
    },

    checkModalDisplay() {
      let userData = JSON.parse(localStorage.getItem("authUserData"));
      console.log("userData => ", userData);
      this.visible =
        userData.is_logged_in || this.user.user.is_logged_in ? false : true;
      this.clubModalVisible =
        userData.is_logged_in || this.user.user.is_logged_in ? false : true;
    },
    updateIsloggedIn() {
      authService.updateUserLoggedIn().then(() => {
        let userData = JSON.parse(localStorage.getItem("authUserData"));
        userData.is_logged_in = 1;
        window.localStorage.setItem("authUserData", JSON.stringify(userData));
        this.visible = false;
        this.clubModalVisible = false;
      });
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
  opacity: 0.8;
}

.ant-carousel >>> .slick-slide {
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
  
  .ant-carousel .click-btn .custom-slick-arrow {
    cursor: pointer;
  }
  
  @media (max-width: 425px) {
    .previous_text {
      display: none;
    }
  
    .next_text {
      display: none;
    }
  
    .custom-slick-arrow.desktop-slider-icon.slick-arrow.slick-next {
      background: transparent;
      color: white;
      font-size: 23px !important;
    }
  
    .custom-slick-arrow.desktop-slider-icon.slick-arrow.slick-prev {
      background: transparent;
      color: white;
      font-size: 23px !important;
    }
  
    .custom-slick-arrow.click-btn.custom-btn {
      bottom: 95%;
      left: 86%;
    }
 
    .oK_button_text {
      display: none;
    }
  
    .custom-slick-arrow.click-btn.custom-btn {
      background: transparent;
      color: white;
    }
  
  }
  
  @media (min-width: 425px) {
    .previous_icon {
      display: none;
    }
  
    .next_icon {
      display: none;
    }
  
    .close_button {
      display: none;
    }
  }
</style>
