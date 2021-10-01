<template>
  <div class="gx-media gx-featured-item">
    <div class="gx-featured-thumb">
      <img
        class="gx-rounded-lg gx-width-175"
        :src="getRemoteImage()"
        alt="..."
      />
      <div
        class="ant-tag gx-rounded-xs gx-bg-orange gx-border-orange gx-text-white"
      >
        Featured
      </div>
    </div>
    <div class="gx-media-body gx-featured-content">
      <div class="gx-featured-content-left">
        <div
          class="ant-tag ant-tag-has-color gx-rounded-xs"
          style="background-color: rgb(6, 187, 138);"
        >
          FOR SALE
        </div>
        <h3 class="gx-mb-2">
          {{ listing.full_address }}
        </h3>
        <p v-if="listing.features" class="gx-text-grey gx-mb-1">
          {{ listing.features[0] }}
        </p>
        <div class="ant-row-flex">
          <p v-if="listing.beds" class="gx-mr-3 gx-mb-1">
            <span class="gx-text-grey">Bedrooms:</span> {{ listing.beds }}
          </p>
          <p v-if="listing.bathrooms" class="gx-mr-3 gx-mb-1">
            <span class="gx-text-grey">Baths:</span> {{ listing.bathrooms }}
          </p>
          <p v-if="listing.area" class="gx-mr-3 gx-mb-1">
            <span class="gx-text-grey">Area:</span> {{ listing.area }} m<sup
              >2</sup
            >
          </p>
        </div>
        <div class="ant-row-flex">
          <p class="gx-text-grey gx-mb-1">
            <i
              class="icon icon-user gx-fs-xs gx-mr-2 gx-d-inline-flex gx-vertical-align-middle"
            ></i
            >John Nash
          </p>
          <p class="gx-text-grey gx-ml-4 gx-mb-1">
            <i
              class="icon icon-datepicker gx-fs-xs gx-mr-2 gx-d-inline-flex gx-vertical-align-middle"
            ></i
            >2 days ago
          </p>
        </div>
      </div>
      <div class="gx-featured-content-right">
        <div>
          <h2 class="gx-text-primary gx-mb-1 gx-font-weight-medium">
            {{ listing.current_price }}
          </h2>
          <p v-if="getPricePerArea() > 0" class="gx-text-grey gx-fs-sm">
            €{{ getPricePerArea() }}/m<sup>2</sup>
          </p>
        </div>
        <a-button-group>
          <a-button icon="close" type="danger"></a-button>
          <a-button icon="check" class="gx-btn-success"></a-button>
          <router-link :to="'/properties/view/' + listing._id"
            ><a-button type="primary">View</a-button></router-link
          >
        </a-button-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NPropertyListingRow",
  props: {
    listing: {
      type: Object,
      required: true
    }
  },
  methods: {
    getPricePerArea() {
      if (this.listing.area && this.listing.current_price) {
        let flatPrice = parseFloat(
          this.listing.current_price
            .match(/\d+/g)
            .toString()
            .replace(",", "")
        );
        let area = parseFloat(this.listing.area);
        let areaValue = flatPrice / area;
        return areaValue.toFixed(2);
      } else return 0;
    },
    getRemoteImage() {
      if (this.listing.images && this.listing.images.length > 0) {
        return this.listing.images[0];
      }
    }
  }
};
</script>

<style scoped></style>
