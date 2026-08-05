<script>
localStorage.setItem("rightbar_isopen", false);
import { layoutMethods, layoutComputed } from "@/state/helpers";

import SimpleBar from "simplebar-vue";

/**
 * Right sidebar component
 */

export default {
  name: "Filter",

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
  emits: ["close-tab", "apply-filter"],
  data() {
    return {
      filter: {
        searchQuery: "",
        date: null,
        salle: null,
        session: null,
        interval: null,
      },
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
    console.log("store", this.$store.state.layout);
  },

  methods: {
    replaceDateInterval(startDate, endTime) {
      startDate = new Date(startDate);
      endTime = new Date(endTime);
      const hoursStart = startDate.getHours().toString().padStart(2, "0");
      const minutesStart = startDate.getMinutes().toString().padStart(2, "0");
      const hoursEnd = endTime.getHours().toString().padStart(2, "0");
      const minutesEnd = endTime.getMinutes().toString().padStart(2, "0");
      return `${hoursStart}:${minutesStart} ➞ ${hoursEnd}:${minutesEnd}`;
    },
    resetFilter() {
      Object.keys(this.filter).forEach((key) => {
        if (Array.isArray(this.filter[key])) {
          this.filter[key] = [];
        } else {
          this.filter[key] = null;
        }
      });
      this.$emit("apply-filter", this.filter);
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
  },
  async mounted() {
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
          <h5 class="m-0 me-2 text-white">Filter</h5>
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
        <div class="container">
          <BCard no-body class="mt-1 shadow-none p-3">
            <BCardBody class="p-4 border rounded-lg">
              <BRow>
                <BCol cols="7" class="d-flex align-items-center">
                  <h6
                    class="fw-semibold text-uppercase mt-2"
                    v-if="numberFound == 0"
                  >
                    No Result
                  </h6>

                  <h6
                    class="fw-semibold text-uppercase mt-2"
                    v-if="numberFound == 1"
                  >
                    {{ numberFound }} Result
                  </h6>

                  <h6
                    class="fw-semibold text-uppercase mt-2"
                    v-if="numberFound > 1"
                  >
                    {{ numberFound }} Results
                  </h6>
                </BCol>

                <BCol cols="3" class="m-0 p-0 w-auto">
                  <BButton
                    variant="danger"
                    style="background-color: #cd0f45"
                    @click="resetFilter"
                  >
                    Reset
                  </BButton>
                </BCol>
                <BCol cols="1">
                  <BButton
                    variant="danger"
                    class=""
                    style="background-color: #cd0f45"
                    @click="this.$emit('apply-filter', this.filter)"
                  >
                    Apply
                  </BButton>
                </BCol>
              </BRow>
              <BRow
                ><div class="mt-3">
                  <label for="name" class="form-label text-sm">NAME</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Add Text Here"
                    v-model="this.filter.searchQuery"
                  />
                </div>
              </BRow>
              <BRow
                ><div class="mt-3">
                  <label for="date" class="form-label text-sm">DATE</label>
                  <input
                    type="date"
                    class="form-control"
                    id="date"
                    placeholder="Selectionner une date"
                    v-model="this.filter.date"
                  />
                </div>
              </BRow>
              <BRow class="mt-3"
                ><label class="form-label text-sm">SESSION</label>
                <BCol sm="8">
                  <BFormSelect
                    v-model="this.filter.session"
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
                    v-model="this.filter.interval"
                    class="mb-3"
                    aria-label="Default select example"
                  >
                    <BFormSelectOption :value="null"
                      >Select session</BFormSelectOption
                    >

                    <BFormSelectOption
                      :value="interval"
                      v-for="(interval, index) in this.filter.session
                        ?.intervals"
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
                    v-model="this.filter.salle"
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
              </BRow></BCardBody
            ></BCard
          >
        </div>
      </SimpleBar>
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
