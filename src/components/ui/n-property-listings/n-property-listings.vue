<template>
  <div class="property-listings">
    <n-property-listing-row v-for="listing of getListings" :listing="listing" />
  </div>
</template>

<script>
import NPropertyListingRow from "./n-property-listing-row/n-property-listing-row";
import { QUERY_LISTINGS } from "@/store/modules/session/session-actions";
import { mapGetters } from "vuex";

export default {
  name: "n-property-listings",
  components: { NPropertyListingRow },
  computed: {
    ...mapGetters({
      getListings: "listings/getListings"
    })
  },
  mounted() {
    this.$store.dispatch("listings/" + QUERY_LISTINGS, {});
  }
};
</script>

<style scoped></style>
