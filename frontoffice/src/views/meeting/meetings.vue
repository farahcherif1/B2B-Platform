<script>
import Filter from "./filter.vue";
import AddMeeting from "./add-meeting.vue";
import MeetingService from "../../services/meeting.service";
import { Status } from "../../enum/enums";
export default {
  name: "Meetings",
  data() {
    return {
      showFilter: false,
      showAddMeeting: false,
      Page: 1,
      total: 0,
      totalMeetings: 0,
      confirmedCount: 0,
      canceledCount: 0,
      pendingCount: 0,
      totalPages: 0,
      completedCount: 0,
      meetings: [],
      locations: [],
      sessions: [],
      Status: Status,
      filter: {
        eventId: this.$route.params.id,
        page: this.Page,
        limit: 3,
      },
      statusSelected: Status.ALL,
    };
  },
  methods: {
    async confirmMeeting(meeting) {
      meeting.status = Status.CONFIRMED;
      await MeetingService.updateMeeting(meeting);
      await this.getMeetings();
    },
    async handleFilter(newFilter) {
      this.filter.sessionId = newFilter.session?.id;
      this.filter.locationId = newFilter.salle?.id;
      this.filter.startDate = newFilter.date;
      this.filter.searchQuery = newFilter.searchQuery;
      this.filter.intervalId = newFilter.interval?.id;
      await this.getMeetings();
      this.totalMeetings = this.total;
      this.Page = 1;
      this.filter.page = 1;
    },
    async cancelMeeting(meeting) {
      meeting.status = Status.CANCELED;
      await MeetingService.updateMeeting(meeting);
      await this.getMeetings();
    },
    async allSelected() {
      this.statusSelected = Status.ALL;
      this.filter.status = null;
      await this.getMeetings();

      this.totalMeetings = this.total;
    },
    async confirmedSelected() {
      this.statusSelected = Status.CONFIRMED;
      this.filter.status = Status.CONFIRMED;
      this.filter.page = 1;
      await this.getMeetings();

      this.totalMeetings = this.confirmedCount;
    },
    async pendingSelected() {
      this.statusSelected = Status.PENDING;
      this.filter.status = Status.PENDING;
      this.filter.page = 1;

      await this.getMeetings();

      this.totalMeetings = this.pendingCount;
    },
    async canceledSelected() {
      this.Page = 1;
      this.statusSelected = Status.CANCELLED;
      this.filter.status = Status.CANCELLED;
      this.filter.page = 1;
      await this.getMeetings();

      this.totalMeetings = this.canceledCount;
    },
    async completedSelected() {
      this.statusSelected = Status.COMPLETED;
      this.filter.status = Status.COMPLETED;
      this.filter.page = 1;

      await this.getMeetings();

      this.totalMeetings = this.completedCount;
    },
    async getMeetings() {
      const response = await MeetingService.getMeetings(this.filter);
      if (response.status === 200) {
        this.meetings = response.data.data;
        this.Page = response.data.meta.page;
        this.total = response.data.meta.total;
        this.totalPages = response.data.meta.totalPages;
        this.confirmedCount = response.data.meta.confirmedCount;
        this.canceledCount = response.data.meta.canceledCount;

        this.pendingCount = response.data.meta.pendingCount;
        this.completedCount = response.data.meta.completedCount;
      } else {
        this.$bvToast.toast("Error fetching meetings", {
          title: "Error",
          variant: "danger",
          solid: true,
        });
      }
    },
    replaceTime(date) {
      date = new Date(date);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes} h`;
    },
    replaceDate(date) {
      date = new Date(date);
      const day = date.getUTCDate();
      const month = date.toLocaleString("en-US", {
        month: "long",
      });
      const year = date.getUTCFullYear();
      return `${day} ${month} ${year}`;
    },
  },
  async mounted() {
    await this.getMeetings();
    this.totalMeetings = this.total;

    this.locations = await MeetingService.getLocations(this.$route.params.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    this.sessions = await MeetingService.getSessions(this.$route.params.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  components: {
    Filter,
    AddMeeting,
  },
  watch: {
    Page() {
      this.filter.page = this.Page;
      this.getMeetings();
    },
  },
};
</script>

<template>
  <Filter
    :show="showFilter"
    :sessions="sessions"
    :locations="locations"
    @close-tab="showFilter = false"
    :numberFound="total"
    @apply-filter="handleFilter"
  />
  <AddMeeting
    :show="showAddMeeting"
    :sessions="sessions"
    :locations="locations"
    @close-tab="showAddMeeting = false"
    @add-meeting="
      async () => {
        await this.getMeetings();
      }
    "
  />
  <BCard no-body class="mt-4">
    <BCardBody class="p-4">
      <BRow
        class="d-flex justify-content-between border-b border-dotted border-gray-300 pb-4"
      >
        <BCol>
          <h4>Liste des meetings</h4>
        </BCol>
        <BCol class="text-end" sm="2">
          <BRow>
            <BCol md="12" lg="6">
              <BButton
                variant="primary"
                class="w-100"
                @click="showFilter = !showFilter"
              >
                <span class="text-md">Filter</span>
              </BButton>
            </BCol>
            <BCol md="12" lg="6">
              <BButton
                variant="success"
                class="w-100"
                @click="showAddMeeting = !showAddMeeting"
              >
                + Ajouter
              </BButton>
            </BCol>
          </BRow>
        </BCol>
      </BRow>
      <BRow class="mt-4 ms-4 pt-0">
        <BCol sm="6">
          <BRow>
            <BCol
              sm="3"
              class="py-4 border-b pt-0 text-center cursor-pointer"
              :class="{
                'border-b-2 border-[#0AB39C] text-[#0AB39C]':
                  statusSelected == Status.ALL,
              }"
              @click="allSelected"
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                class="d-inline"
              >
                <path
                  d="M14.0211 0.75C14.7449 0.75 15.3447 1.25625 15.3998 1.90625V2V9.5C15.3998 10.1562 14.8346 10.7 14.1245 10.75H14.0211H9.19577V12H10.5744V13.25H5.05974V12H6.43842V10.75H1.61305C0.889246 10.75 0.289522 10.2375 0.234375 9.59375V9.5V2C0.234375 1.3375 0.792739 0.8 1.50965 0.75H1.61305H14.0211ZM14.0211 2H1.61305V9.5H14.0211V2ZM7.8171 6.375C9.34053 6.375 10.5744 6.9375 10.5744 7.625V8.25H5.05974V7.625C5.05974 6.9375 6.29366 6.375 7.8171 6.375ZM7.8171 3.25C8.58226 3.25 9.19577 3.8125 9.19577 4.5C9.19577 5.1875 8.58226 5.75 7.8171 5.75C7.05193 5.75 6.43842 5.19375 6.43842 4.5C6.43842 3.80625 7.05882 3.25 7.8171 3.25Z"
                />
              </svg>

              <span class="mr-2 ml-2">Tous</span>
              <BBadge variant="danger" class="ms-1">{{ this.total }}</BBadge>
            </BCol>
            <BCol
              sm="3"
              class="py-4 border-b pt-0 cursor-pointer text-center"
              :class="{
                'border-b-2 border-[#0AB39C] text-[#0AB39C]':
                  statusSelected == Status.CONFIRMED,
              }"
              @click="confirmedSelected"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                class="d-inline"
              >
                <path
                  d="M5.65495 11.0479C4.91828 11.0479 4.21411 10.907 3.54245 10.6254C2.89967 10.3509 2.32731 9.96271 1.82536 9.46077C1.32342 8.95882 0.935226 8.38646 0.660781 7.74369C0.379115 7.07202 0.238281 6.36785 0.238281 5.63119C0.238281 4.89452 0.379115 4.19035 0.660781 3.51868C0.935226 2.87591 1.32342 2.30355 1.82536 1.8016C2.32731 1.29966 2.89967 0.911463 3.54245 0.637018C4.21411 0.355351 4.91828 0.214519 5.65495 0.214519C6.39161 0.214519 7.09578 0.355351 7.76745 0.637018C8.41023 0.911463 8.98259 1.29966 9.48453 1.8016C9.98648 2.30355 10.3747 2.87591 10.6491 3.51868C10.9308 4.19035 11.0716 4.89452 11.0716 5.63119C11.0716 6.36785 10.9308 7.07202 10.6491 7.74369C10.3747 8.38646 9.98648 8.95882 9.48453 9.46077C8.98259 9.96271 8.41023 10.3509 7.76745 10.6254C7.09578 10.907 6.39161 11.0479 5.65495 11.0479ZM5.65495 9.96452C6.44217 9.96452 7.17161 9.76591 7.84328 9.36868C8.49328 8.98591 9.00967 8.46952 9.39245 7.81952C9.78967 7.14785 9.98828 6.41841 9.98828 5.63119C9.98828 4.84396 9.78967 4.11452 9.39245 3.44285C9.00967 2.79285 8.49328 2.27646 7.84328 1.89369C7.17161 1.49646 6.44217 1.29785 5.65495 1.29785C4.86773 1.29785 4.13828 1.49646 3.46661 1.89369C2.81661 2.27646 2.30023 2.79285 1.91745 3.44285C1.52023 4.11452 1.32161 4.84396 1.32161 5.63119C1.32161 6.41841 1.52023 7.14785 1.91745 7.81952C2.30023 8.46952 2.81661 8.98591 3.46661 9.36868C4.13828 9.76591 4.86773 9.96452 5.65495 9.96452ZM5.11328 7.79785L2.81661 5.50118L3.58578 4.73202L5.11328 6.27035L8.17911 3.20452L8.94828 3.96285L5.11328 7.79785Z"
                />
              </svg>

              <span class="mr-2 ml-2">Acceptes</span>
              <BBadge variant="danger" class="ms-1">{{
                this.confirmedCount
              }}</BBadge>
            </BCol>
            <BCol
              sm="3"
              class="py-4 border-b pt-0 text-center cursor-pointer"
              :class="{
                'border-b-2 border-[#0AB39C] text-[#0AB39C]':
                  statusSelected == Status.PENDING,
              }"
              @click="pendingSelected"
            >
              <svg
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                class="d-inline"
              >
                <path
                  d="M8.42773 13.25H0.927734V9.5L3.42773 7L0.927734 4.5V0.75H8.42773V4.5L5.92773 7L8.42773 9.5M2.17773 4.1875L4.67773 6.6875L7.17773 4.1875V2H2.17773M4.67773 7.3125L2.17773 9.8125V12H7.17773V9.8125M5.92773 10.75H3.42773V10.25L4.67773 9L5.92773 10.25V10.75Z"
                />
              </svg>

              <span class="mr-2 ml-2">En attente </span>
              <BBadge variant="danger" class="ms-1">{{
                this.pendingCount
              }}</BBadge>
            </BCol>
            <BCol
              sm="3"
              class="py-4 border-b pt-0 text-center cursor-pointer"
              :class="{
                'border-b-2 border-[#0AB39C] text-[#0AB39C]':
                  statusSelected == Status.CANCELLED,
              }"
              @click="canceledSelected"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                class="d-inline"
              >
                <path
                  d="M6.16055 11.0479C5.42445 11.0479 4.72082 10.907 4.04967 10.6254C3.40739 10.3509 2.83547 9.96271 2.33391 9.46077C1.83235 8.95882 1.44446 8.38646 1.17022 7.74369C0.888772 7.07202 0.748047 6.36785 0.748047 5.63119C0.748047 4.89452 0.888772 4.19035 1.17022 3.51868C1.44446 2.87591 1.83235 2.30355 2.33391 1.8016C2.83547 1.29966 3.40739 0.911463 4.04967 0.637018C4.72082 0.355351 5.42445 0.214519 6.16055 0.214519C6.89665 0.214519 7.60028 0.355351 8.27143 0.637018C8.91371 0.911463 9.48563 1.29966 9.98719 1.8016C10.4887 2.30355 10.8766 2.87591 11.1509 3.51868C11.4323 4.19035 11.5731 4.89452 11.5731 5.63119C11.5731 6.36785 11.4323 7.07202 11.1509 7.74369C10.8766 8.38646 10.4887 8.95882 9.98719 9.46077C9.48563 9.96271 8.91371 10.3509 8.27143 10.6254C7.60028 10.907 6.89665 11.0479 6.16055 11.0479ZM6.16055 9.96452C6.94717 9.96452 7.67605 9.76591 8.3472 9.36868C8.9967 8.98591 9.51269 8.46952 9.89518 7.81952C10.2921 7.14785 10.4906 6.41841 10.4906 5.63119C10.4906 4.84396 10.2921 4.11452 9.89518 3.44285C9.51269 2.79285 8.9967 2.27646 8.3472 1.89369C7.67605 1.49646 6.94717 1.29785 6.16055 1.29785C5.37393 1.29785 4.64505 1.49646 3.9739 1.89369C3.3244 2.27646 2.80841 2.79285 2.42592 3.44285C2.02901 4.11452 1.83055 4.84396 1.83055 5.63119C1.83055 6.41841 2.02901 7.14785 2.42592 7.81952C2.80841 8.46952 3.3244 8.98591 3.9739 9.36868C4.64505 9.76591 5.37393 9.96452 6.16055 9.96452ZM6.16055 4.86202L7.68688 3.33452L8.45545 4.10368L6.92912 5.63119L8.45545 7.15868L7.68688 7.92785L6.16055 6.40035L4.63422 7.92785L3.86565 7.15868L5.39197 5.63119L3.86565 4.10368L4.63422 3.33452L6.16055 4.86202Z"
                />
              </svg>
              <span class="mr-2 ml-2">Cancelled</span>
              <BBadge variant="danger" class="ms-1">{{
                this.canceledCount
              }}</BBadge>
            </BCol>
          </BRow>
        </BCol>
        <BCol
          sm="6"
          class="py-4 pt-0 text-center border-b relative after:absolute after:bottom-0 after:right-0 after:w-1/4 after:content-['']"
          :class="{
            'after:border-b-2 after:border-[#0AB39C]':
              statusSelected == Status.COMPLETED,
          }"
        >
          <BRow class="d-flex justify-content-end">
            <BCol
              sm="3"
              class="pt-0 cursor-pointer"
              :class="{
                'text-[#0AB39C]': statusSelected == Status.COMPLETED,
              }"
              @click="completedSelected"
            >
              <svg
                width="13"
                height="14"
                viewBox="0 0 13 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="d-inline"
              >
                <path
                  d="M6.67773 0.75C5.85697 0.75 5.04425 0.911661 4.28596 1.22575C3.52768 1.53984 2.83868 2.00022 2.25832 2.58058C1.08621 3.75269 0.427734 5.3424 0.427734 7C0.427734 8.6576 1.08621 10.2473 2.25832 11.4194C2.83868 11.9998 3.52768 12.4602 4.28596 12.7742C5.04425 13.0883 5.85697 13.25 6.67773 13.25C8.33534 13.25 9.92505 12.5915 11.0972 11.4194C12.2693 10.2473 12.9277 8.6576 12.9277 7C12.9277 6.17924 12.7661 5.36651 12.452 4.60823C12.1379 3.84994 11.6775 3.16095 11.0972 2.58058C10.5168 2.00022 9.82779 1.53984 9.06951 1.22575C8.31122 0.911661 7.4985 0.75 6.67773 0.75Z"
                  fill="#0AB39C"
                />
              </svg>

              <span class="mr-2 ml-2">Faits</span>
              <BBadge variant="danger" class="ms-1">{{
                completedCount
              }}</BBadge>
            </BCol>
          </BRow>
        </BCol>
      </BRow>
      <BRow v-for="meeting in meetings" class="" :key="meeting.id">
        <BCard no-body class="mt-4 shadow-none rounded-lg border">
          <BCardBody class="p-4">
            <BRow>
              <BCol lg="5" md="12">
                <BRow
                  class="hstack flex-wrap gap-2 p-1 rounded-pill border w-fit mb-3"
                >
                  <BCol sm="2" class="min-w-fit">
                    <img
                      src="@/assets/images/users/avatar-2.jpg"
                      alt
                      class="rounded-circle avatar-sm d-inline"
                    />
                  </BCol>
                  <BCol>
                    <h6 class="d-inline w-fit mr-4 text-black font-semibold">
                      {{ meeting.Host.name }}
                    </h6>
                    <span class="badge rounded-pill bg-info-subtle text-info"
                      >HÔTE</span
                    >

                    <p class="w-fit">
                      {{ meeting.Host.applications[0].Function }}
                    </p>
                  </BCol>
                </BRow>
                <BRow
                  class="hstack flex-wrap gap-2 p-1 rounded-pill border w-fit"
                >
                  <BCol sm="2" class="min-w-fit">
                    <img
                      src="@/assets/images/users/avatar-2.jpg"
                      alt
                      class="rounded-circle avatar-sm d-inline"
                    />
                  </BCol>
                  <BCol>
                    <h6 class="d-inline w-fit mr-4 font-semibold text-black">
                      {{ meeting.Gest.name }}
                    </h6>

                    <p class="w-fit">
                      {{ meeting.Gest.applications[0]?.Function }}
                    </p>
                  </BCol>
                </BRow>
              </BCol>
              <BCol lg="3" md="12">
                <div class="d-flex flex-column align-items-start gap-3">
                  <div class="d-flex align-items-center">
                    <svg
                      width="15"
                      height="17"
                      viewBox="0 0 15 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-2"
                    >
                      <path
                        d="M13.3333 15.3335H1.66667V6.16683H13.3333M10.8333 0.333496V2.00016H4.16667V0.333496H2.5V2.00016H1.66667C0.741667 2.00016 0 2.74183 0 3.66683V15.3335C0 15.7755 0.175595 16.1994 0.488155 16.512C0.800716 16.8246 1.22464 17.0002 1.66667 17.0002H13.3333C13.7754 17.0002 14.1993 16.8246 14.5118 16.512C14.8244 16.1994 15 15.7755 15 15.3335V3.66683C15 2.74183 14.25 2.00016 13.3333 2.00016H12.5V0.333496"
                        fill="black"
                      />
                    </svg>
                    <span class="ms-2">{{
                      replaceDate(meeting.interval?.start)
                    }}</span>
                  </div>

                  <div class="d-flex align-items-center">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-2"
                    >
                      <path
                        d="M8.50032 15.1665C10.2684 15.1665 11.9641 14.4641 13.2144 13.2139C14.4646 11.9636 15.167 10.2679 15.167 8.49984C15.167 6.73173 14.4646 5.03603 13.2144 3.78579C11.9641 2.53555 10.2684 1.83317 8.50032 1.83317C6.73221 1.83317 5.03652 2.53555 3.78628 3.78579C2.53604 5.03603 1.83366 6.73173 1.83366 8.49984C1.83366 10.2679 2.53604 11.9636 3.78628 13.2139C5.03652 14.4641 6.73221 15.1665 8.50032 15.1665ZM8.50032 0.166504C9.59467 0.166504 10.6783 0.382052 11.6894 0.800841C12.7004 1.21963 13.6191 1.83346 14.3929 2.60728C15.1667 3.3811 15.7805 4.29976 16.1993 5.31081C16.6181 6.32185 16.8337 7.40549 16.8337 8.49984C16.8337 10.71 15.9557 12.8296 14.3929 14.3924C12.8301 15.9552 10.7105 16.8332 8.50032 16.8332C3.89199 16.8332 0.166992 13.0832 0.166992 8.49984C0.166992 6.2897 1.04497 4.17008 2.60777 2.60728C4.17057 1.04448 6.29019 0.166504 8.50032 0.166504ZM8.91699 4.33317V8.70817L12.667 10.9332L12.042 11.9582L7.66699 9.33317V4.33317H8.91699Z"
                        fill="black"
                      />
                    </svg>
                    <span class="ms-2"
                      >{{ replaceTime(meeting.interval?.start) }} -
                      {{ replaceTime(meeting.interval?.end) }}</span
                    >
                  </div>

                  <div class="d-flex align-items-center">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.66629 3.49992H10.1663L12.908 0.749917C12.9854 0.67181 13.0776 0.609814 13.1791 0.567507C13.2807 0.5252 13.3896 0.503418 13.4996 0.503418C13.6096 0.503418 13.7186 0.5252 13.8201 0.567507C13.9216 0.609814 14.0138 0.67181 14.0913 0.749917L16.2413 2.90825C16.3965 3.06439 16.4836 3.2756 16.4836 3.49575C16.4836 3.7159 16.3965 3.92711 16.2413 4.08325L14.333 5.99992H7.66629V7.66658C7.66629 7.8876 7.57849 8.09956 7.42221 8.25584C7.26593 8.41212 7.05397 8.49992 6.83295 8.49992C6.61194 8.49992 6.39998 8.41212 6.2437 8.25584C6.08742 8.09956 5.99962 7.8876 5.99962 7.66658V5.16658C5.99962 4.72456 6.17521 4.30063 6.48777 3.98807C6.80034 3.67551 7.22426 3.49992 7.66629 3.49992ZM2.66629 7.66658V10.9999L0.757952 12.9083C0.602743 13.0644 0.515625 13.2756 0.515625 13.4958C0.515625 13.7159 0.602743 13.9271 0.757952 14.0833L2.90795 16.2416C2.98542 16.3197 3.07759 16.3817 3.17914 16.424C3.28069 16.4663 3.38961 16.4881 3.49962 16.4881C3.60963 16.4881 3.71855 16.4663 3.8201 16.424C3.92165 16.3817 4.01382 16.3197 4.09129 16.2416L7.66629 12.6666H10.9996C11.2206 12.6666 11.4326 12.5788 11.5889 12.4225C11.7452 12.2662 11.833 12.0543 11.833 11.8333V10.9999H12.6663C12.8873 10.9999 13.0993 10.9121 13.2555 10.7558C13.4118 10.5996 13.4996 10.3876 13.4996 10.1666V9.33325H14.333C14.554 9.33325 14.7659 9.24545 14.9222 9.08917C15.0785 8.93289 15.1663 8.72093 15.1663 8.49992V7.66658H9.33295V8.49992C9.33295 8.94195 9.15736 9.36587 8.8448 9.67843C8.53224 9.99099 8.10831 10.1666 7.66629 10.1666H5.99962C5.55759 10.1666 5.13367 9.99099 4.82111 9.67843C4.50855 9.36587 4.33295 8.94195 4.33295 8.49992V5.99992L2.66629 7.66658Z"
                        fill="black"
                      />
                    </svg>
                    <span class="ms-2">{{ meeting.location.name }}</span>
                  </div>
                </div>
              </BCol>
              <BCol
                lg="4"
                md="12"
                class="d-flex align-items-center justify-content-end"
              >
                <div class="d-felx align-items-center mb-5">
                  <div
                    class="d-inline"
                    v-if="meeting.status == Status.CONFIRMED"
                  >
                    <svg
                      width="25"
                      height="14"
                      viewBox="0 0 25 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="d-inline"
                    >
                      <path
                        d="M0.910156 7.91008L6.50016 13.5001L7.91016 12.0801L2.33016 6.50008M22.7402 0.0800781L12.1602 10.6701L8.00016 6.50008L6.57016 7.91008L12.1602 13.5001L24.1602 1.50008M18.5002 1.50008L17.0902 0.0800781L10.7402 6.43008L12.1602 7.84008L18.5002 1.50008Z"
                        fill="#0AB39C"
                      />
                    </svg>
                    <span style="color: #0ab39c" class="ms-2 text-base"
                      >Confirmé</span
                    >
                  </div>
                  <div
                    class="d-inline"
                    v-if="meeting.status == Status.CANCELLED"
                  >
                    <svg
                      width="20"
                      height="19"
                      viewBox="0 0 20 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="d-inline mb-1"
                    >
                      <path
                        d="M9.99967 0.333496C15.0413 0.333496 19.1663 4.4585 19.1663 9.50016C19.1663 14.5418 15.0413 18.6668 9.99967 18.6668C4.95801 18.6668 0.833008 14.5418 0.833008 9.50016C0.833008 4.4585 4.95801 0.333496 9.99967 0.333496ZM9.99967 2.16683C8.25801 2.16683 6.69967 2.71683 5.50801 3.72516L15.7747 13.9918C16.6913 12.7085 17.333 11.1502 17.333 9.50016C17.333 5.46683 14.033 2.16683 9.99967 2.16683ZM14.4913 15.2752L4.22467 5.0085C3.21634 6.20016 2.66634 7.7585 2.66634 9.50016C2.66634 13.5335 5.96634 16.8335 9.99967 16.8335C11.7413 16.8335 13.2997 16.2835 14.4913 15.2752Z"
                        fill="#F06548"
                      />
                    </svg>

                    <span style="color: #f06548" class="ms-2 text-base"
                      >Annulé</span
                    >
                  </div>
                  <div class="d-inline" v-if="meeting.status == Status.PENDING">
                    <BButton
                      variant="success"
                      class="text-black"
                      @click="confirmMeeting(meeting)"
                    >
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="d-inline mb-1"
                      >
                        <path
                          d="M17.5 1.49984L5.5 13.4998L0 7.99984L1.41 6.58984L5.5 10.6698L16.09 0.0898438L17.5 1.49984Z"
                          fill="#004239"
                        />
                      </svg>

                      <span class="ms-2">Confirmer</span>
                    </BButton>
                  </div>

                  <i
                    class="ri-more-2-fill ms-2 text-base cursor-pointer"
                    style="color: #0ab39c"
                  ></i>
                </div>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BRow>
      <BRow class="mt-4">
        <BCol class="d-flex justify-content-end">
          <BPagination
            v-if="this.totalMeetings > 3"
            v-model="this.Page"
            pills
            :total-rows="this.totalMeetings"
            :per-page="3"
            prev-text="Previous"
            next-text="Next"
            hide-goto-end-buttons="true"
            class="pagination-separated d-flex-wrap m-2"
          />
        </BCol>
      </BRow>
    </BCardBody>
  </BCard>
</template>

<style></style>
