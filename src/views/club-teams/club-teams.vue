<template>
  <n-page>
    <div class="flex justify-center">
      <a-row :gutter="16">
        <a-col v-for="team of teams" :key="team.teamID" class="teams-box">
          <router-link tag="div" :to="'/teams/' + team.teamID">
            <n-box>
              <div slot="body">
                <div class="teams-box--name">
                  {{ team.teamName }}
                </div>
                <a-row
                  class="team-details"
                  :gutter="32"
                  align="middle"
                  justify="center"
                  type="flex"
                >
                  <a-col class="gx-text-center">
                    <h6 class="teams-box--title">{{ team.totalMembers }}</h6>
                    <p>Members</p>
                  </a-col>
                  <a-col class="gx-text-center">
                    <h6 class="teams-box--title">
                      €{{ team.revenueThisWeek }}
                    </h6>
                    <p>This Weeks Revenue</p>
                  </a-col>
                </a-row>
              </div>
            </n-box>
          </router-link>
        </a-col>
      </a-row>
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
import NBox from "@/components/ui/n-box/n-box";
import NPage from "@/components/ui/n-page/n-page";
export default {
  name: "ClubTeams",
  components: { NPage, NBox },
  data() {
    return {
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
      ]
    };
  }
};
</script>
