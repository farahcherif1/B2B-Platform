<template>
  <BRow class="mx-5">
    <BCol cols="12">
      <div class="d-flex justify-content-between align-items-center mt-5 mb-4">
        <h5 class="m-5 my-0">Explore</h5>
      </div>

      <div class="btn p-2 d-flex justify-content-end">
        <BButton
          @click="toggleFilter"
          variant="danger"
          class="col-1"
          style="background-color: #cd0f45"
        >
          Filter
        </BButton>
      </div>
      <div>
        <Filter
          :show="showFilter"
          @close-filter="showFilter = false"
          @update:eventWanted="handleEventWantedUpdate"
          v-model:value="value"
          v-model:numberFound="this.total"
          @update:resetFilter="this.nbPage = 1"
        />
      </div>

      <BRow>
        <BCol sm="1"></BCol>
        <BCol
          v-for="event in firstRowEvents"
          :key="event.id"
          xxl="3"
          lg="6"
          class="m-3"
        >
          <BCard
            no-body
            class="transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden"
            @click="handleCardClick(event)"
          >
            <img
              class="card-img-top img-fluid"
              src="@/assets/images/event-static-img.png"
            />
            <div class="absolute top-4 left-4">
              <span
                class="bg-gray-900/75 text-white px-3 py-1 rounded-full text-sm"
              >
                {{ event.type }}
              </span>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item font-semibold">{{ event.name }}</li>
              <li class="list-group-item font-normal" style="color: #878a99">
                {{ event.description }}
              </li>
              <li class="list-group-item font-normal">
                {{ replaceDate(event.startDate) }} -
                {{ replaceDate(event.endDate) }}
              </li>
            </ul>
          </BCard>
        </BCol>
      </BRow>
      <BRow>
        <BCol sm="1"></BCol>
        <BCol
          v-for="event in secondRowEvents"
          :key="event.id"
          xxl="3"
          lg="6"
          class="m-3"
        >
          <BCard
            no-body
            class="transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden"
            @click="handleCardClick(event)"
          >
            <img
              class="card-img-top img-fluid"
              src="@/assets/images/event-static-img.png"
            />
            <div class="absolute top-4 left-4">
              <span
                class="bg-gray-900/75 text-white px-3 py-1 rounded-full text-sm"
              >
                {{ event.type }}
              </span>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item font-semibold">{{ event.name }}</li>
              <li class="list-group-item font-normal" style="color: #878a99">
                {{ event.description }}
              </li>
              <li class="list-group-item font-normal">
                {{ replaceDate(event.startDate) }} -
                {{ replaceDate(event.endDate) }}
              </li>
            </ul>
          </BCard>
        </BCol>
      </BRow>
    </BCol>
  </BRow>
  <BRow>
    <BCol class="d-flex justify-content-end">
      <BPagination
        v-if="this.total > itemsPerPage"
        v-model="nbPage"
        pills
        :total-rows="this.total"
        :per-page="itemsPerPage"
        prev-text="Previous"
        next-text="Next"
        hide-goto-end-buttons="true"
        class="pagination-separated d-flex-wrap m-5 mt-0"
      />
    </BCol>
  </BRow>
</template>

<script>
import { BRow, BCol, BCard } from "bootstrap-vue-next";
import Filter from "../filter/filter.vue";
import EventService from "../../services/event.service";
import { MonthEnum } from "../../enum/enums";
export default {
  name: "EventCard",

  components: { Filter, BRow, BCol, BCard },
  data() {
    return {
      events: [],
      months: Object.values(MonthEnum),
      showFilter: false,
      nbPage: 1,
      itemsPerPage: 6,
      total: null,
      filterChanged: false,
      params: {
        page: this.nbPage,
        limit: this.itemsPerPage,
      },
    };
  },
  watch: {
    nbPage() {
      this.params.page = this.nbPage;
      this.fetchEvents(this.params);
    },
  },
  methods: {
    replaceDate(date) {
      date = date.slice(0, 10);
      date = date.split("-");
      return `${date[2]} ${this.months[parseInt(date[1]) - 1]} ${date[0]}`;
    },

    handleCardClick(event) {
      if (event.id) this.$router.push(`/event-details/${event.id}`);
    },
    async handleEventWantedUpdate(newFilter) {
      for (let key in newFilter) {
        this.params[key] = newFilter[key];
        if (Array.isArray(this.params[key]) && this.params[key].length > 0) {
          this.params[key] = this.params[key].join(",");
        }
      }
      this.params.page = this.nbPage;
      this.params.limit = this.itemsPerPage;
      await this.fetchEvents(this.params);
    },

    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async fetchEvents() {
      try {
        const response = await EventService.getEventsUnAuth(this.params);

        this.events = response.data.data;
        this.total = response.data.meta.total;
        this.nbPage = response.data.meta.page;
        if (this.total <= 6) {
          this.nbPage = 1;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  async mounted() {
    await this.fetchEvents();
  },
  computed: {
    firstRowEvents() {
      if (this.events) return this.events.slice(0, 3);
      return [];
    },
    secondRowEvents() {
      if (this.events) return this.events.slice(3, 6);
      return [];
    },
  },
};
</script>

<style scoped>
button,
input,
textarea,
h1,
h2,
h3,
div {
  font-family: "Inter", sans-serif !important;
}
.card-overlay {
  position: relative;
  overflow: hidden;
}

.card-overlay .card-img-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
}
.filter-overlay {
  position: absolute;
  top: 7vh;
  left: 65vh;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
* {
  font-family: "Poppins" sans-serif !important;
}
</style>
