<script>
import { layoutMethods } from "@/state/helpers";

import i18n from "../i18n";

/**
 * Nav-bar Component
 */
export default {
  data() {
    return {
      lan: i18n.locale,
      text: null,
      flag: null,
      value: null,
      myVar: 1,
    };
  },
  props: {
    ProfileUsage: {
      type: Boolean,
      default: false,
    },
  },
  components: {},

  methods: {
    ...layoutMethods,
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("isOrganizer");
      this.$router.push("/");
      location.reload();
    },
    loggedIn() {
      return localStorage.getItem("token") != null;
    },

    toggleHamburgerMenu() {
      var windowSize = document.documentElement.clientWidth;
      let layoutType = document.documentElement.getAttribute("data-layout");

      document.documentElement.setAttribute("data-sidebar-visibility", "show");
      let visiblilityType = document.documentElement.getAttribute(
        "data-sidebar-visibility"
      );

      if (windowSize > 767)
        document.querySelector(".hamburger-icon").classList.toggle("open");

      if (
        document.documentElement.getAttribute("data-layout") === "horizontal"
      ) {
        document.body.classList.contains("menu")
          ? document.body.classList.remove("menu")
          : document.body.classList.add("menu");
      }

      if (
        visiblilityType === "show" &&
        (layoutType === "vertical" || layoutType === "semibox")
      ) {
        if (windowSize < 1025 && windowSize > 767) {
          document.body.classList.remove("vertical-sidebar-enable");
          document.documentElement.getAttribute("data-sidebar-size") == "sm"
            ? document.documentElement.setAttribute("data-sidebar-size", "")
            : document.documentElement.setAttribute("data-sidebar-size", "sm");
        } else if (windowSize > 1025) {
          document.body.classList.remove("vertical-sidebar-enable");
          document.documentElement.getAttribute("data-sidebar-size") == "lg"
            ? document.documentElement.setAttribute("data-sidebar-size", "sm")
            : document.documentElement.setAttribute("data-sidebar-size", "lg");
        } else if (windowSize <= 767) {
          document.body.classList.add("vertical-sidebar-enable");
          document.documentElement.setAttribute("data-sidebar-size", "lg");
        }
      }

      //Two column menu
      if (document.documentElement.getAttribute("data-layout") == "twocolumn") {
        document.body.classList.contains("twocolumn-panel")
          ? document.body.classList.remove("twocolumn-panel")
          : document.body.classList.add("twocolumn-panel");
      }
    },
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
  },

  mounted() {
    document.addEventListener("scroll", function () {
      var pageTopbar = document.getElementById("page-topbar");
      if (pageTopbar) {
        document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50
          ? pageTopbar.classList.add("topbar-shadow")
          : pageTopbar.classList.remove("topbar-shadow");
      }
    });
    if (document.getElementById("topnav-hamburger-icon"))
      document
        .getElementById("topnav-hamburger-icon")
        .addEventListener("click", this.toggleHamburgerMenu);
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex">
          <!-- LOGO -->
          <div class="navbar-brand-box horizontal-logo">
            <router-link to="/">
              <span>
                <img src="@/assets/images/cepex-logo.svg" alt="" class="h-16" />
              </span>
            </router-link>
          </div>

          <BButton
            variant="white"
            class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
            id="topnav-hamburger-icon"
          >
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </BButton>
        </div>
        
        <BDropdown variant="link" class="ms-sm-3 header-item topbar-user" toggle-class="rounded-circle arrow-none"
            menu-class="d-none" :offset="{ alignmentAxis: -14, crossAxis: 0, mainAxis: 0 }"
            v-if = "ProfileUsage"
            >
          <template #button-content>
                <span class="d-flex align-items-center">
                  <img class="rounded-circle header-profile-user" src="@/assets/images/users/avatar-1.jpg"
                    alt="Header Avatar">
                  <span class="text-start ms-xl-2">
                    <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text">Edward
                      Diana</span>
                    <span class="d-none d-xl-block ms-1 fs-12 user-name-sub-text">Founder</span>
                  </span>
                </span>
          </template>
        </BDropdown>
        <div class="d-flex align-items-center"
        v-else
        >
          <router-link to="/login" v-if = "!loggedIn()">
            <BButton
              variant="soft-secondary"
              size="md"
              class="material-shadow-none"
            >
              Login & Register
            </BButton>
          </router-link>
            <BButton
              variant="soft-secondary"
              size="md"
              class="material-shadow-none"
              @click="logout"
              v-else
            >
            Logout
            </BButton>
        </div>
      </div>
    </div>
  </header>
</template>
