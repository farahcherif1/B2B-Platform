<script>
import EventCard from "./event.vue";
import EventService from "../../services/event.service";
export default {
  name: "EventList",
  components: {
    EventCard,
  },
  data() {
    return {
      events: [],
      nbPage: 1,
      itemsPerPage: 7,
      total: null,
    };
  },
  computed: {
    paginatedEvents() {
      return this.events;
    },
  },
  watch: {
    nbPage() {
      this.fetchEvents();
    },
  },
  methods: {
    async fetchEvents(
      params = { page: this.nbPage, limit: this.itemsPerPage }
    ) {
      try {
        const response = await EventService.getEventOrganizer(params);
        this.events = await response.data.data;
        this.total = await response.data.meta.total;
      } catch (error) {
        console.error(error);
      }
    },

    goToCreate() {
      this.$router.push({ name: "Create Event" });
    },
    nextPage() {
      this.nbPage++;
    },
    prevPage() {
      this.nbPage--;
    },
    goToDashboard(eventId) {
      this.$router.push(`/dashboard-event/${eventId}`);
    },
  },
  async mounted() {
    await this.fetchEvents();
  },
};
</script>

<template>
  <div class="m-5">
    <BRow class="align-items-center">
      <h4>LISTE EVENEMENTS</h4>
    </BRow>
    <BRow class="align-items-center">
      <BCol sm="3">
        <BButton
          @click="goToCreate"
          variant="success"
          id="popover-button-variant"
          tabindex="0"
          >+ Ajouter Evenement</BButton
        >
      </BCol>
      <BCol sm="4"> </BCol>
      <BCol sm="3">
        <form class="app-search d-none d-md-block">
          <div class="position-relative">
            <input
              type="text"
              class="form-control"
              placeholder="Search for candidate name"
              autocomplete="off"
              id="search-options"
              value=""
              style="background-color: white"
            />
          </div>
          <div class="dropdown-menu dropdown-menu-lg" id="search-dropdown">
            <div data-simplebar="" style="max-height: 320px">
              <div class="simplebar-wrapper" style="margin: 0px">
                <div class="simplebar-height-auto-observer-wrapper">
                  <div class="simplebar-height-auto-observer"></div>
                </div>
                <div class="simplebar-mask">
                  <div class="simplebar-offset" style="right: 0px; bottom: 0px">
                    <div
                      class="simplebar-content-wrapper"
                      tabindex="0"
                      role="region"
                      aria-label="scrollable content"
                      style="height: auto; overflow: hidden"
                    >
                      <div class="simplebar-content" style="padding: 0px">
                        <div class="dropdown-header">
                          <h6
                            class="text-overflow text-muted mb-0 text-uppercase"
                          >
                            Recent Searches
                          </h6>
                        </div>
                        <div class="dropdown-item bg-transparent text-wrap">
                          <a
                            href="/"
                            class="btn btn-soft-secondary btn-sm rounded-pill"
                            >how to setup <i class="mdi mdi-magnify ms-1"> </i>
                          </a>
                          <a
                            href="/"
                            class="btn btn-soft-secondary btn-sm rounded-pill"
                            >buttons
                            <i class="mdi mdi-magnify ms-1"></i>
                          </a>
                        </div>
                        <div class="dropdown-header mt-2">
                          <h6
                            class="text-overflow text-muted mb-1 text-uppercase"
                          >
                            Pages
                          </h6>
                        </div>
                        <a
                          class="dropdown-item notify-item"
                          href="javascript:void(0);"
                          ><i
                            class="ri-bubble-chart-line align-middle fs-18 text-muted me-2"
                          ></i
                          ><span>Analytics Dashboard</span></a
                        ><a
                          class="dropdown-item notify-item"
                          href="javascript:void(0);"
                          ><i
                            class="ri-lifebuoy-line align-middle fs-18 text-muted me-2"
                          ></i
                          ><span>Help Center</span></a
                        ><a
                          class="dropdown-item notify-item"
                          href="javascript:void(0);"
                          ><i
                            class="ri-user-settings-line align-middle fs-18 text-muted me-2"
                          ></i
                          ><span>My account settings</span></a
                        >
                        <div class="dropdown-header mt-2">
                          <h6
                            class="text-overflow text-muted mb-2 text-uppercase"
                          >
                            Members
                          </h6>
                        </div>
                        <div class="notification-list">
                          <a
                            class="d-flex dropdown-item notify-item py-2"
                            href="javascript:void(0);"
                            ><img
                              src="/img/avatar-2.e8a71f01.jpg"
                              class="me-3 rounded-circle avatar-xs"
                              alt="user-pic"
                            />
                            <div class="flex-grow-1">
                              <h6 class="m-0">Angela Bernier</h6>
                              <span class="fs-11 mb-0 text-muted">Manager</span>
                            </div></a
                          ><a
                            class="d-flex dropdown-item notify-item py-2"
                            href="javascript:void(0);"
                            ><img
                              src="/img/avatar-3.1856ddc8.jpg"
                              class="me-3 rounded-circle avatar-xs"
                              alt="user-pic"
                            />
                            <div class="flex-grow-1">
                              <h6 class="m-0">David Grasso</h6>
                              <span class="fs-11 mb-0 text-muted"
                                >Web Designer</span
                              >
                            </div></a
                          ><a
                            class="d-flex dropdown-item notify-item py-2"
                            href="javascript:void(0);"
                            ><img
                              src="/img/avatar-5.593df666.jpg"
                              class="me-3 rounded-circle avatar-xs"
                              alt="user-pic"
                            />
                            <div class="flex-grow-1">
                              <h6 class="m-0">Mike Bunch</h6>
                              <span class="fs-11 mb-0 text-muted"
                                >React Developer</span
                              >
                            </div></a
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="simplebar-placeholder"
                  style="width: 0px; height: 0px"
                ></div>
              </div>
              <div
                class="simplebar-track simplebar-horizontal"
                style="visibility: hidden"
              >
                <div
                  class="simplebar-scrollbar"
                  style="width: 0px; display: none"
                ></div>
              </div>
              <div
                class="simplebar-track simplebar-vertical"
                style="visibility: hidden"
              >
                <div
                  class="simplebar-scrollbar"
                  style="height: 0px; display: none"
                ></div>
              </div>
            </div>
            <div class="text-center pt-3 pb-1">
              <a href="/pages/search-results" class="btn btn-primary btn-sm"
                >View All Results <i class="ri-arrow-right-line ms-1"></i
              ></a>
            </div>
          </div>
        </form>
      </BCol>
      <BCol sm="2">
        <select class="form-select" aria-label="Default select example">
          <option selected>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </BCol>
    </BRow>
    <div
      v-for="event in paginatedEvents"
      :key="event.id"
      class="rounded p-3 m-3"
      style="background-color: white"
    >
      <BRow>
        <BCol>
          <EventCard :event="event" @click="goToDashboard(event.id)" />
        </BCol>
      </BRow>
    </div>
  </div>
  <BRow>
    <BCol class="d-flex justify-content-end">
      <BPagination
        v-model="nbPage"
        pills
        :total-rows="this.total"
        :per-page="itemsPerPage"
        prev-text="Previous"
        next-text="Next"
        hide-goto-end-buttons="true"
        class="pagination-separated d-flex-wrap m-5 mt-0"
      >
      </BPagination>
    </BCol>
  </BRow>
</template>

<style scoped></style>
