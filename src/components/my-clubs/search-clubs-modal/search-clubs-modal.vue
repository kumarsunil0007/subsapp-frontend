<template>
  <a-modal v-model="isVisible" title="Find a club to join" @cancel="close">
    <a-row type="flex" :gutter="1">
      <a-col :xs="18">
        <a-input
          v-model="keyword"
          type="email"
          placeholder="Search for a club"
        ></a-input>
      </a-col>
      <a-col :xs="6">
        <a-button block type="primary" @click="searchClubs">Search</a-button>
      </a-col>
    </a-row>
    <div>
      <a-row v-for="club of clubs" :key="club.id" type="flex" :gutter="4">
        <a-col :span="6">
          {{ club.club_name }}
        </a-col>
        <a-col :span="12"> {{ club.address }}... </a-col>
        <a-col :span="6" class="gx-text-right">
          <a-button
            v-if="
              club.members &&
                club.members.length &&
                (club.members[0].pivot.status === 'decline' ||
                  club.members[0].pivot.status === 'archive')
            "
            block
            size="small"
            @click="requestToJoin(club.id)"
          >
            Request to Join
          </a-button>
          <a-button
            v-if="club.members && !club.members.length"
            type="danger"
            block
            size="small"
            @click="requestToJoin(club.id)"
          >
            <template>Request to Join</template>
          </a-button>

          <a-button
            v-if="
              club.members &&
                club.members.length &&
                (club.members[0].pivot.status === 'invite' ||
                  club.members[0].pivot.status === 'accept' ||
                  club.members[0].pivot.status === 'request')
            "
            type="danger"
            block
            size="small"
          >
            <template v-if="club.members[0].pivot.status === 'invite'"
              >Invitation Pending</template
            >
            <template v-if="club.members[0].pivot.status === 'request'"
              >Request Sent
            </template>
            <template v-if="club.members[0].pivot.status === 'accept'"
              >Already a Member</template
            >
          </a-button>
        </a-col>
      </a-row>
    </div>
    <div slot="footer"></div>
  </a-modal>
</template>

<script>
import notifications from "@/common/notifications/notification.service";
import { clubService } from "@/common/api/api.service";

export default {
  name: "SearchClubsModal",
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      keyword: "",
      clubs: []
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
    requestToJoin(clubId) {
      clubService
        .requestToJoin({
          clubId: clubId
        })
        .then(resp => {
          if (resp.data.success) {
            this.searchClubs();
            notifications.success(
              "We have notified the club, you should hear back soon."
            );
          } else {
            notifications.warn("Something went wrong with this request");
          }
        });
    },
    searchClubs() {
      clubService
        .searchClubs({
          keyword: this.keyword
        })
        .then(resp => {
          if (resp.data.success) {
            this.clubs = resp.data.result;
          }
        });
    },
    close() {
      (this.clubs = []), (this.keyword = ""), this.form.resetFields();
      this.$emit("close");
    }
  }
};
</script>
