<script>
localStorage.setItem("rightbar_isopen", false);
import { layoutMethods, layoutComputed } from "@/state/helpers";

import SimpleBar from "simplebar-vue";
import UserService from "../../services/user.service";
import MeetingService from "../../services/meeting.service";

/**
 * Right sidebar component
 */

export default {
  name: "AddMeeting",
  components: {
    SimpleBar,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    numberFound: {
      type: Number,
      default: 0,
    },
    sessions: {
      type: Array,
      default: () => [],
    },
    locations: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["close-tab", "add-meeting"],
  data() {
    return {
      sessionSelected: null,
      locationSelected: null,
      hosts: [],
      guests: [],
      intervals: [],
      hostSearch: "",
      guestSearch: "",
      hostSelected: null,
      guestSelected: null,
      intervalSelected: null,
      errors: [],
      meeting: {
        hostId: null,
        guestId: null,
        sessionId: null,
        locationId: null,
        eventId: this.$route.params.id,
        intervalId: null,
      },
      formIncomplete: false,
    };
  },
  beforeCreate() {
    localStorage.setItem(
      "resetValue",
      JSON.stringify(this.$store.state.layout)
    );

    localStorage.setItem(
      "resetValue",
      JSON.stringify(this.$store.state.layout)
    );
  },

  methods: {
    Annuler() {
      this.hostSelected = null;
      this.guestSelected = null;
      this.sessionSelected = null;
      this.locationSelected = null;
      this.formIncomplete = false;
      this.hostSearch = "";
      this.guestSearch = "";
    },
    async Confirm() {
      this.errors = [];
      if (
        this.hostSelected == null ||
        this.guestSelected == null ||
        this.sessionSelected == null ||
        this.locationSelected == null ||
        this.intervalSelected == null
      ) {
        this.formIncomplete = true;
        return;
      }
      this.formIncomplete = false;
      this.meeting.hostId = this.hostSelected.id;
      this.meeting.guestId = this.guestSelected.id;
      this.meeting.sessionId = this.sessionSelected.id;
      this.meeting.locationId = this.locationSelected.id;
      this.meeting.intervalId = this.intervalSelected.id;
      const response = await MeetingService.createMeeting(this.meeting);
      console.log(response);
      if (response.status == 201) {
        this.$emit("add-meeting");
        this.$emit("close-tab");
      } else {
        this.errors.push(response.response.data.message);
      }
    },

    ...layoutMethods,

    resizeWindow() {
      var windowSize = document.documentElement.clientWidth;
      if (windowSize >= 1025) {
        if (
          document.documentElement.getAttribute("data-layout") === "vertical"
        ) {
          document.documentElement.setAttribute(
            "data-sidebar-size",
            this.$store.state.layout.sidebarSize
          );
        }
        if (
          document.documentElement.getAttribute("data-layout") === "semibox"
        ) {
          document.documentElement.setAttribute(
            "data-sidebar-size",
            this.$store.state.layout.sidebarSize
          );
        }
        if (
          document.documentElement.getAttribute("data-sidebar-visibility") ===
            "show" &&
          document.querySelector(".hamburger-icon")
        ) {
          document.querySelector(".hamburger-icon").classList.remove("open");
        }
      } else if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("twocolumn-panel");
        if (
          document.documentElement.getAttribute("data-layout") === "vertical"
        ) {
          document.documentElement.setAttribute("data-sidebar-size", "sm");
        }
        if (
          document.documentElement.getAttribute("data-layout") === "semibox"
        ) {
          document.documentElement.setAttribute("data-sidebar-size", "sm");
        }
        if (document.querySelector(".hamburger-icon")) {
          document.querySelector(".hamburger-icon").classList.add("open");
        }
      } else if (windowSize <= 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.body.classList.add("twocolumn-panel");
        if (
          document.documentElement.getAttribute("data-layout") !== "horizontal"
        ) {
          document.documentElement.setAttribute("data-sidebar-size", "lg");
        }
        if (document.querySelector(".hamburger-icon")) {
          document.querySelector(".hamburger-icon").classList.add("open");
        }
      }
    },

    resetLayout() {
      let reset = JSON.parse(localStorage.getItem("resetValue"));
      document.documentElement.setAttribute("data-sidebar-size", "lg");
      this.changeMode({ mode: reset.mode });
      this.changeSidebarColor({ sidebarColor: reset.sidebarColor });
      this.changeLayoutType({ layoutType: reset.layoutType });
      this.changeTopbar({ topbar: reset.topbar });
      this.changeLayoutWidth({ layoutWidth: reset.layoutWidth });
      this.changeSidebarSize({ sidebarSize: reset.sidebarSize });
      this.changeSidebarImage({ sidebarImage: reset.sidebarImage });
      this.changeSidebarColor({ sidebarColor: reset.sidebarColor });
      this.changePreloader({ preloader: reset.preloader });
      this.changeSidebarView({ sidebarView: reset.sidebarView });
      this.changeVisibility({ visibility: reset.visibility });
      this.changePosition({ position: reset.position });
    },

    gradiantColor() {
      this.changeSidebarColor({ sidebarColor: "gradient" });
    },

    onSideBarColorClick(color) {
      if (color !== "gradient") {
        this.showGradients = false;
      } else {
        this.showGradients = true;
        this.gradiantColor();
      }
    },
    async getUsers(searchQuery) {
      return await UserService.getUsersRegistred(
        this.$route.params.id,
        searchQuery
      )
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    replaceDate(startTime, endTime) {
      startTime = new Date(startTime);
      endTime = new Date(endTime);
      const day = startTime.getUTCDate();
      const month = startTime.toLocaleString("en-US", {
        month: "long",
      });
      const hoursStart = startTime.getHours().toString().padStart(2, "0");
      const minutesStart = startTime.getMinutes().toString().padStart(2, "0");
      const hoursEnd = endTime.getHours().toString().padStart(2, "0");
      const minutesEnd = endTime.getMinutes().toString().padStart(2, "0");
      return `Session ${day} ${month} - ${hoursStart}:${minutesStart} ➞ ${hoursEnd}:${minutesEnd}`;
    },
    replaceDateInterval(startDate, endTime) {
      startDate = new Date(startDate);
      endTime = new Date(endTime);
      const hoursStart = startDate.getHours().toString().padStart(2, "0");
      const minutesStart = startDate.getMinutes().toString().padStart(2, "0");
      const hoursEnd = endTime.getHours().toString().padStart(2, "0");
      const minutesEnd = endTime.getMinutes().toString().padStart(2, "0");
      return `${hoursStart}:${minutesStart} ➞ ${hoursEnd}:${minutesEnd}`;
    },
  },
  async mounted() {
    this.hosts = await this.getUsers();
    this.guests = this.hosts;

    let backtoTop = document.getElementById("back-to-top");

    if (backtoTop) {
      backtoTop = document.getElementById("back-to-top");
      window.onscroll = function () {
        if (
          document.body.scrollTop > 100 ||
          document.documentElement.scrollTop > 100
        ) {
          backtoTop.style.display = "block";
        } else {
          backtoTop.style.display = "none";
        }
      };
    }
    var setpreloader = document.getElementById("preloader");
    if (
      localStorage.getItem("data-preloader") &&
      localStorage.getItem("data-preloader") == "enable"
    ) {
      document.documentElement.setAttribute("data-preloader", "enable");
      if (setpreloader) {
        setTimeout(function () {
          setpreloader.style.opacity = "0";
          setpreloader.style.visibility = "hidden";
        }, 1000);
      }
    } else {
      document.documentElement.setAttribute("data-preloader", "disable");
      if (setpreloader) {
        setpreloader.style.opacity = "0";
        setpreloader.style.visibility = "hidden";
      }
    }
    if (document.getElementById("collapseBgGradient")) {
      Array.from(
        document.querySelectorAll("#collapseBgGradient .form-check input")
      ).forEach(function () {
        if (document.querySelector("[data-bs-target='#collapseBgGradient']")) {
          document
            .querySelector("[data-bs-target='#collapseBgGradient']")
            .addEventListener("click", function () {
              document.getElementById("sidebar-color-gradient").click();
            });
        }
      });
      Array.from(document.querySelectorAll("[name='data-sidebar']")).forEach(
        function (elem) {
          if (
            document.querySelector("[data-bs-target='#collapseBgGradient']")
          ) {
            if (
              document.querySelector(
                "#collapseBgGradient .form-check input:checked"
              )
            ) {
              document
                .querySelector("[data-bs-target='#collapseBgGradient']")
                .classList.add("active");
            } else {
              document
                .querySelector("[data-bs-target='#collapseBgGradient']")
                .classList.remove("active");
              document
                .getElementById("collapseBgGradient")
                .classList.remove("show");
            }

            elem.addEventListener("change", function () {
              if (
                document.querySelector(
                  "#collapseBgGradient .form-check input:checked"
                )
              ) {
                document
                  .querySelector("[data-bs-target='#collapseBgGradient']")
                  .classList.add("active");
              } else {
                document
                  .getElementById("collapseBgGradient")
                  .classList.remove("show");
                document
                  .querySelector("[data-bs-target='#collapseBgGradient']")
                  .classList.remove("active");
              }
            });
          }
        }
      );
    }
  },
  computed: {
    ...layoutComputed,
    layoutType: {
      get() {
        return this.$store ? this.$store.state.layout.layoutType : {} || {};
      },
      set(layout) {
        localStorage.setItem("rightbar_isopen", true);
        this.changeLayoutType({ layoutType: layout });
        document.querySelector(".hamburger-icon").classList.remove("open");
      },
    },
    preloader: {
      get() {
        return this.$store ? this.$store.state.layout.preloader : {} || {};
      },
      set(preloader) {
        return this.changePreloader({
          preloader: preloader,
        });
      },
    },
    mode: {
      get() {
        return this.$store ? this.$store.state.layout.mode : {} || {};
      },
      set(mode) {
        if (mode == "dark") {
          this.changeMode({ mode: mode });
          this.changeTopbar({ topbar: "light" });
        } else {
          this.changeMode({ mode: mode });
          this.changeTopbar({ topbar: "light" });
        }
      },
    },
    sidebarSize: {
      get() {
        return this.$store ? this.$store.state.layout.sidebarSize : {} || {};
      },
      set(type) {
        return this.changeSidebarSize({
          sidebarSize: type,
        });
      },
    },
    layoutWidth: {
      get() {
        return this.$store ? this.$store.state.layout.layoutWidth : {} || {};
      },
      set(width) {
        if (width == "boxed") {
          this.changeLayoutWidth({ layoutWidth: width });
          this.changeSidebarSize({ sidebarSize: "sm-hover" });
        } else {
          this.changeLayoutWidth({ layoutWidth: width });
          this.changeSidebarSize({ sidebarSize: "lg" });
        }
      },
    },
    position: {
      get() {
        return this.$store ? this.$store.state.layout.position : {} || {};
      },
      set(position) {
        return this.changePosition({
          position: position,
        });
      },
    },
    topbar: {
      get() {
        return this.$store ? this.$store.state.layout.topbar : {} || {};
      },
      set(topbar) {
        this.changeTopbar({
          topbar: topbar,
        });
      },
    },
    sidebarView: {
      get() {
        return this.$store ? this.$store.state.layout.sidebarView : {} || {};
      },
      set(sidebarView) {
        return this.changeSidebarView({
          sidebarView: sidebarView,
        });
      },
    },
    sidebarColor: {
      get() {
        return this.$store ? this.$store.state.layout.sidebarColor : {} || {};
      },
      set(sidebarColor) {
        console.log(
          "this.$store.state.layout.sidebarColor",
          this.$store.state.layout.sidebarColor
        );
        return this.changeSidebarColor({
          sidebarColor: sidebarColor,
        });
      },
    },
    sidebarImage: {
      get() {
        return this.$store ? this.$store.state.layout.sidebarImage : {} || {};
      },
      set(sidebarImage) {
        return this.changeSidebarImage({
          sidebarImage: sidebarImage,
        });
      },
    },

    visibility: {
      get() {
        return this.$store ? this.$store.state.layout.visibility : {} || {};
      },
      set(visibility) {
        if (visibility == "hidden") {
          document.querySelector(".hamburger-icon").classList.add("open");
        } else {
          document.querySelector(".hamburger-icon").classList.remove("open");
        }
        this.changeVisibility({
          visibility: visibility,
        });
      },
    },
  },

  watch: {
    async hostSearch(newVal) {
      if (newVal == "") {
        this.hosts = await this.getUsers();
      }
    },
    async guestSearch(newVal) {
      if (newVal == "") {
        this.guests = await this.getUsers();
      }
    },
    mode: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.documentElement.setAttribute("data-bs-theme", "dark");
              break;
            case "light":
              document.documentElement.setAttribute("data-bs-theme", "light");
              break;
          }
        }
      },
    },
    preloader: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "enable":
              document.documentElement.setAttribute("data-preloader", "enable");
              break;
            case "disable":
              document.documentElement.setAttribute(
                "data-preloader",
                "disable"
              );
              break;
          }
          localStorage.setItem("data-preloader", newVal);
        }
      },
    },
    layoutType: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "horizontal":
              document.documentElement.setAttribute(
                "data-layout",
                "horizontal"
              );
              break;
            case "vertical":
              document.documentElement.setAttribute("data-layout", "vertical");
              break;
            case "twocolumn":
              document.documentElement.setAttribute("data-layout", "twocolumn");
              break;
            case "semibox":
              document.documentElement.setAttribute("data-layout", "semibox");
              break;
          }
        }
      },
    },
    layoutWidth: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "fluid":
              document.documentElement.setAttribute(
                "data-layout-width",
                "fluid"
              );
              break;
            case "boxed":
              document.documentElement.setAttribute(
                "data-layout-width",
                "boxed"
              );
              break;
          }
        }
      },
    },
    position: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "fixed":
              document.documentElement.setAttribute(
                "data-layout-position",
                "fixed"
              );
              break;
            case "scrollable":
              document.documentElement.setAttribute(
                "data-layout-position",
                "scrollable"
              );
              break;
          }
        }
      },
    },
    topbar: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "light":
              document.documentElement.setAttribute("data-topbar", "light");
              break;
            case "dark":
              document.documentElement.setAttribute("data-topbar", "dark");
              break;
          }
        }
      },
    },
    sidebarSize: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "lg":
              document.documentElement.setAttribute("data-sidebar-size", "lg");
              break;
            case "sm":
              document.documentElement.setAttribute("data-sidebar-size", "sm");
              break;
            case "md":
              document.documentElement.setAttribute("data-sidebar-size", "md");
              break;
            case "sm-hover":
              document.documentElement.setAttribute(
                "data-sidebar-size",
                "sm-hover"
              );
              break;
          }
        }
      },
    },
    sidebarView: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "detached":
              document.documentElement.setAttribute(
                "data-layout-style",
                "detached"
              );
              break;
            case "default":
              document.documentElement.setAttribute(
                "data-layout-style",
                "default"
              );
              break;
          }
        }
      },
    },
    sidebarColor: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.documentElement.setAttribute("data-sidebar", "dark");
              break;
            case "light":
              document.documentElement.setAttribute("data-sidebar", "light");
              break;
            case "gradient":
              document.documentElement.setAttribute("data-sidebar", "gradient");
              break;
            case "gradient-2":
              document.documentElement.setAttribute(
                "data-sidebar",
                "gradient-2"
              );
              break;
            case "gradient-3":
              document.documentElement.setAttribute(
                "data-sidebar",
                "gradient-3"
              );
              break;
            case "gradient-4":
              document.documentElement.setAttribute(
                "data-sidebar",
                "gradient-4"
              );
              break;
          }
        }
      },
    },
    sidebarImage: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "img-1":
              document.documentElement.setAttribute(
                "data-sidebar-image",
                "img-1"
              );
              break;
            case "img-2":
              document.documentElement.setAttribute(
                "data-sidebar-image",
                "img-2"
              );
              break;
            case "img-3":
              document.documentElement.setAttribute(
                "data-sidebar-image",
                "img-3"
              );
              break;
            case "img-4":
              document.documentElement.setAttribute(
                "data-sidebar-image",
                "img-4"
              );
              break;
            case "none":
              document.documentElement.setAttribute(
                "data-sidebar-image",
                "none"
              );
              break;
          }
        }
      },
    },
    visibility: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "show":
              document.documentElement.setAttribute(
                "data-sidebar-visibility",
                "show"
              );
              break;
            case "hidden":
              document.documentElement.setAttribute(
                "data-sidebar-visibility",
                "hidden"
              );
              break;
          }
        }
      },
    },
  },
};
</script>

<template>
  <div>
    <div id="preloader">
      <div id="status">
        <div class="spinner-border text-primary avatar-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <BOffcanvas
      class="border-0"
      id="theme-settings-offcanvas"
      header-class="d-flex align-items-center custom-header bg-gradient p-3"
      body-class="p-0"
      footer-class="border-top p-3 text-center"
      placement="end"
      :model-value="show"
      @update:model-value="(val) => $emit('close-tab', val)"
    >
      <template #header>
        <div class="me-2">
          <h5 class="m-0 me-2 text-white">Ajouter un meeting</h5>
        </div>
        <BButton
          class="btn-close btn-close-white ms-auto"
          id="customizerclose-btn"
          @click="$emit('close-tab')"
        ></BButton>
      </template>

      <SimpleBar
        class="h-100 simple custom-simple-bar"
        :options="{ autoHide: false }"
      >
        <BCard no-body class="mt-1 shadow-none">
          <BCardBody class="rounded-lg">
            <h5 class="text-black ms-3">Hôte</h5>
            <div class="search-box">
              <input
                type="text"
                class="form-control"
                id="searchMemberList"
                placeholder="Rechercher participants ou organisateurs..."
                v-model="hostSearch"
              />
              <i
                class="ri-search-line search-icon cursor-pointer"
                @click="
                  async () => {
                    hosts = await getUsers(hostSearch);
                  }
                "
              ></i>
            </div>
            <BRow
              class="hstack flex-wrap gap-2 p-1 rounded-xl border m-3 cursor-pointer"
              v-for="(host, index) in hosts"
              :key="index"
              @click="
                hostSelected !== host
                  ? (hostSelected = host)
                  : (hostSelected = null)
              "
              :class="hostSelected == host ? 'bg-primary-subtle' : ''"
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
                  {{ host.name }}
                </h6>
                <span class="badge rounded-pill bg-info-subtle text-info"
                  >HÔTE</span
                >

                <p class="w-fit muted-text">{{ host.Function }}</p>
              </BCol>
              <BCol sm="2" class="min-w-fit">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="hosts = hosts.filter((item) => item !== host)"
                >
                  <path
                    d="M10 0.5C15.53 0.5 20 4.97 20 10.5C20 16.03 15.53 20.5 10 20.5C4.47 20.5 0 16.03 0 10.5C0 4.97 4.47 0.5 10 0.5ZM13.59 5.5L10 9.09L6.41 5.5L5 6.91L8.59 10.5L5 14.09L6.41 15.5L10 11.91L13.59 15.5L15 14.09L11.41 10.5L15 6.91L13.59 5.5Z"
                    fill="#495057"
                  />
                </svg>
              </BCol>
            </BRow>
            <h5 class="text-black ms-3">Autre participants</h5>
            <div class="search-box">
              <input
                type="text"
                class="form-control"
                id="searchMemberList"
                placeholder="Rechercher participants ou organisateurs..."
                v-model="guestSearch"
              />
              <i
                class="ri-search-line search-icon cursor-pointer"
                @click="
                  async () => {
                    guests = await getUsers(guestSearch);
                  }
                "
              ></i>
            </div>
            <BRow
              class="hstack flex-wrap gap-2 p-1 rounded-xl border m-3 cursor-pointer"
              v-for="(guest, index) in guests"
              :key="index"
              @click="
                guestSelected !== guest
                  ? (guestSelected = guest)
                  : (guestSelected = null)
              "
              :class="guestSelected == guest ? 'bg-primary-subtle' : ''"
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
                  {{ guest.name }}
                </h6>

                <p class="w-fit muted-text">{{ guest.Function }}</p>
              </BCol>
              <BCol sm="2" class="min-w-fit">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="guests = guests.filter((item) => item !== guest)"
                >
                  <path
                    d="M10 0.5C15.53 0.5 20 4.97 20 10.5C20 16.03 15.53 20.5 10 20.5C4.47 20.5 0 16.03 0 10.5C0 4.97 4.47 0.5 10 0.5ZM13.59 5.5L10 9.09L6.41 5.5L5 6.91L8.59 10.5L5 14.09L6.41 15.5L10 11.91L13.59 15.5L15 14.09L11.41 10.5L15 6.91L13.59 5.5Z"
                    fill="#495057"
                  />
                </svg>
              </BCol>
            </BRow>
            <BRow class="mt-3"
              ><label class="form-label text-sm">SESSION</label>
              <BCol sm="8">
                <BFormSelect
                  v-model="sessionSelected"
                  class="mb-3"
                  aria-label="Default select example"
                >
                  <BFormSelectOption :value="null"
                    >Select session</BFormSelectOption
                  >
                  <BFormSelectOption
                    :value="session"
                    v-for="(session, index) in sessions"
                    :key="index"
                    >{{
                      replaceDate(session.startTime, session.endTime)
                    }}</BFormSelectOption
                  >
                </BFormSelect>
              </BCol>
              <BCol sm="4">
                <BFormSelect
                  v-model="intervalSelected"
                  class="mb-3"
                  aria-label="Default select example"
                >
                  <BFormSelectOption :value="null"
                    >Select session</BFormSelectOption
                  >

                  <BFormSelectOption
                    :value="interval"
                    v-for="(interval, index) in sessionSelected?.intervals"
                    :key="index"
                    >{{
                      replaceDateInterval(interval.start, interval.end)
                    }}</BFormSelectOption
                  >
                </BFormSelect>
              </BCol>
            </BRow>
            <BRow class="mt-3"
              ><label class="form-label text-sm">SALLE</label>
              <div>
                <BFormSelect
                  v-model="locationSelected"
                  class="mb-3"
                  aria-label="Default select example"
                >
                  <BFormSelectOption :value="null"
                    >Select salle</BFormSelectOption
                  >
                  <BFormSelectOption
                    v-for="(location, index) in locations"
                    :key="index"
                    :value="location"
                  >
                    {{ location.name }}
                  </BFormSelectOption>
                </BFormSelect>
              </div>
            </BRow>
            <div class="invalid-feedback d-block" v-if="formIncomplete">
              Fill all the form
            </div>
            <div class="invalid-feedback d-block" v-if="this.errors.length">
              {{ this.errors[0] }}
            </div>
          </BCardBody></BCard
        >
      </SimpleBar>
      <template #footer>
        <BRow>
          <BCol cols="6">
            <BButton
              type="button"
              variant="light"
              class="w-100"
              id="reset-layout"
              @click="Annuler"
            >
              Annuler
            </BButton>
          </BCol>
          <BCol cols="6">
            <BButton variant="success" class="w-100" @click="Confirm">
              Confirmer
            </BButton>
          </BCol>
        </BRow>
      </template>
    </BOffcanvas>
  </div>
</template>

<style lang="scss">
.b-overlay-wrap {
  .b-overlay {
    z-index: 1005 !important;
  }
}
.custom-header {
  background-color: #8093a4;
}
.custom-simple-bar {
  .simplebar-content-wrapper {
    overflow-x: hidden !important;
  }

  .simplebar-content {
    min-width: auto !important;
    width: 100% !important;
  }
}
* {
  font-family: "Noto Sans", sans-serif !important;
}
.simplebar-placeholder {
  height: 0 !important;
}
</style>
