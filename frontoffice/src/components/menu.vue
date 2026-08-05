<script>
import { layoutComputed } from "@/state/helpers";

export default {
  data() {
    return {
      settings: {
        minScrollbarLength: 60,
      },
      isConfigurationOpen: false,
    };
  },
  computed: {
    ...layoutComputed,
    layoutType: {
      get() {
        return this.$store ? this.$store.state.layout.layoutType : {} || {};
      },
    },
    eventId() {
      return this.$route.params.id;
    },
  },

  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    this.initActiveMenu();
    if (this.rmenu == "vertical" && this.layoutType == "twocolumn") {
      document.documentElement.setAttribute("data-layout", "vertical");
    }
    document.getElementById("overlay").addEventListener("click", () => {
      document.body.classList.remove("vertical-sidebar-enable");
    });

    window.addEventListener("resize", () => {
      if (this.layoutType == "twocolumn") {
        var windowSize = document.documentElement.clientWidth;
        if (windowSize < 767) {
          document.documentElement.setAttribute("data-layout", "vertical");
          this.rmenu = "vertical";
          localStorage.setItem("rmenu", "vertical");
        } else {
          document.documentElement.setAttribute("data-layout", "vertical");
          this.rmenu = "twocolumn";
          localStorage.setItem("rmenu", "twocolumn");
          setTimeout(() => {
            this.initActiveMenu();
          }, 50);
        }
      }
    });
    if (document.querySelectorAll(".navbar-nav .collapse")) {
      let collapses = document.querySelectorAll(".navbar-nav .collapse");

      collapses.forEach((collapse) => {
        collapse.addEventListener("show.bs.collapse", (e) => {
          e.stopPropagation();
          let closestCollapse = collapse.parentElement.closest(".collapse");
          if (closestCollapse) {
            let siblingCollapses =
              closestCollapse.querySelectorAll(".collapse");
            siblingCollapses.forEach((siblingCollapse) => {
              if (siblingCollapse.classList.contains("show")) {
                siblingCollapse.classList.remove("show");
                siblingCollapse.parentElement.firstChild.setAttribute(
                  "aria-expanded",
                  "false"
                );
              }
            });
          } else {
            let getSiblings = (elem) => {
              let siblings = [];
              let sibling = elem.parentNode.firstChild;
              while (sibling) {
                if (sibling.nodeType === 1 && sibling !== elem) {
                  siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
              }
              return siblings;
            };
            let siblings = getSiblings(collapse.parentElement);
            siblings.forEach((item) => {
              if (item.childNodes.length > 2) {
                item.firstElementChild.setAttribute("aria-expanded", "false");
                item.firstElementChild.classList.remove("active");
              }
              let ids = item.querySelectorAll("*[id]");
              ids.forEach((item1) => {
                item1.classList.remove("show");
                item1.parentElement.firstChild.setAttribute(
                  "aria-expanded",
                  "false"
                );
                item1.parentElement.firstChild.classList.remove("active");
                if (item1.childNodes.length > 2) {
                  let val = item1.querySelectorAll("ul li a");

                  val.forEach((subitem) => {
                    if (subitem.hasAttribute("aria-expanded"))
                      subitem.setAttribute("aria-expanded", "false");
                  });
                }
              });
            });
          }
        });

        collapse.addEventListener("hide.bs.collapse", (e) => {
          e.stopPropagation();
          let childCollapses = collapse.querySelectorAll(".collapse");
          childCollapses.forEach((childCollapse) => {
            let childCollapseInstance = childCollapse;
            childCollapseInstance.classList.remove("show");
            childCollapseInstance.parentElement.firstChild.setAttribute(
              "aria-expanded",
              "false"
            );
          });
        });
      });
    }
  },

  methods: {
    toggleConfiguration() {
      this.isConfigurationOpen = !this.isConfigurationOpen;
    },

    onRoutechange(ele) {
      this.initActiveMenu(ele.path);
      if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition =
          document.getElementsByClassName("mm-active")[0].offsetTop;
        if (currentPosition > 500)
          if (this.$refs.isSimplebar)
            this.$refs.isSimplebar.value.getScrollElement().scrollTop =
              currentPosition + 300;
      }
    },

    initActiveMenu() {
      const pathName = window.location.pathname;
      const ul = document.getElementById("navbar-nav");
      if (ul) {
        const items = Array.from(ul.querySelectorAll("a.nav-link"));
        let activeItems = items.filter((x) => x.classList.contains("active"));
        this.removeActivation(activeItems);
        let matchingMenuItem = items.find((x) => {
          return x.getAttribute("href") === pathName ;
        });
        if (matchingMenuItem) {
          this.activateParentDropdown(matchingMenuItem);
        } else {
          var id = pathName.replace("/", "");
          if (id) document.body.classList.add("twocolumn-panel");
          this.activateIconSidebarActive(pathName);
        }
      }
    },
    removeActivation(items) {
      items.forEach((item) => {
        if (item.classList.contains("menu-link")) {
          if (!item.classList.contains("active")) {
            item.setAttribute("aria-expanded", false);
          }
          if (item.nextElementSibling) {  // Add this check
          item.nextElementSibling.classList.remove("show");
        }
        }
        if (item.classList.contains("nav-link")) {
          if (item.nextElementSibling) {
            item?.nextElementSibling?.classList?.remove("show");
          }
          item.setAttribute("aria-expanded", false);
        }
        item.classList.remove("active");
      });
    },

    activateParentDropdown(item) {
      item.classList.add("active");
      let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
      if (parentCollapseDiv) {
        parentCollapseDiv.classList.add("show");
        parentCollapseDiv.parentElement.children[0].classList.add("active");
        parentCollapseDiv.parentElement.children[0].setAttribute(
          "aria-expanded",
          "true"
        );
        if (
          parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")
        ) {
          if (
            parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")
              .previousElementSibling
          ) {
            if (
              parentCollapseDiv.parentElement
                .closest(".collapse.menu-dropdown")
                .previousElementSibling.parentElement.closest(
                  ".collapse.menu-dropdown"
                )
            ) {
              const grandparent = parentCollapseDiv.parentElement
                .closest(".collapse.menu-dropdown")
                .previousElementSibling.parentElement.closest(
                  ".collapse.menu-dropdown"
                );
              this.activateIconSidebarActive(
                "#" + grandparent.getAttribute("id")
              );
              grandparent.classList.add("show");
            }
          }
          this.activateIconSidebarActive(
            "#" +
              parentCollapseDiv.parentElement
                .closest(".collapse.menu-dropdown")
                .getAttribute("id")
          );

          parentCollapseDiv.parentElement
            .closest(".collapse")
            .classList.add("show");
          if (
            parentCollapseDiv.parentElement.closest(".collapse")
              .previousElementSibling
          )
            parentCollapseDiv.parentElement
              .closest(".collapse")
              .previousElementSibling.classList.add("active");
          return false;
        }
        this.activateIconSidebarActive(
          "#" + parentCollapseDiv.getAttribute("id")
        );
        return false;
      }
      return false;
    },
    activateIconSidebarActive(id) {
      var menu = document.querySelector(
        "#two-column-menu .simplebar-content-wrapper a[href='" +
          id +
          "'].nav-icon"
      );
      if (menu !== null) {
        menu.classList.add("active");
      }
    },
  },
};
</script>

<template>
  <BContainer fluid>
    <div id="two-column-menu"></div>

    <template v-if="layoutType === 'vertical' || layoutType === 'semibox'">
      <ul class="navbar-nav h-100" id="navbar-nav">
        <li class="menu-title">
          <span data-key="t-menu" class="text-uppercase text-light"> Menu</span>
        </li>
        <li class="nav-item">
          <router-link class="nav-link menu-link bg-secondary" 
          :to="`/dashboard-event/${eventId}`"   
         >
            <i class="ri-dashboard-2-line text-white"></i>
            <span data-key="t-dashboards" class="text-white"> Dashboard</span>
          </router-link>
        </li>

        <!-- end Dashboard Menu -->
        <li class="nav-item">
          <BLink
            class="nav-link menu-link bg-secondary"
            data-bs-toggle="collapse"
            role="button"
            @click="toggleConfiguration"
          >
            <i class="ri-apps-2-line text-white"></i>
            <span data-key="t-configuration" class="text-white bg-secondary"
              >Configuration</span
            >
          </BLink>
          <div class="menu-dropdown bg-secondary" v-if="isConfigurationOpen">
            <ul class="nav nav-sm flex-column bg-secondary">
              <li class="nav-item bg-secondary">
                <router-link
                  to="/chat"
                  class="nav-link text-white bg-secondary"
                  data-key="t-chat"
                >
                  Modifier Evenement
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link text-white bg-secondary"
                  data-key="t-chat"
                  :to="`/dashboard-event/${eventId}/form-event`"
                >
                  Formulaire Participant
                </router-link>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <router-link class="nav-link menu-link bg-secondary" 
          :to="`/edit-website/${eventId}`"
          >
            <i class="ri-layout-3-line text-white"></i>
            <span data-key="t-dashboards" class="text-white">
              Edit Website</span
            >
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link menu-link bg-secondary" :to="`/dashboard-event/${eventId}/meetings`">
            <i class="ri-group-fill text-white"></i>
            <span data-key="t-dashboards" class="text-white"> Meeting</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link menu-link bg-secondary"
            :to="`/organizer-list/${eventId}`"
          >
            <i class="ri-account-circle-line text-white"></i>
            <span data-key="t-dashboards" class="text-white"> Organizers</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link menu-link bg-secondary" to="/dashboard">
            <i class="ri-calendar-line text-white"></i>
            <span data-key="t-dashboards" class="text-white"> Agenda</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link menu-link bg-secondary"
            :to="`/participation-list/${eventId}`"
          >
            <i class="ri-account-circle-line text-white"></i>
            <span data-key="t-dashboards" class="text-white">
              Participants</span
            >
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
          class="nav-link menu-link bg-secondary" 
          :to="`/emailing/${eventId}`"
          >
            <i class="ri-mail-line text-white"></i>
            <span data-key="t-dashboards" class="text-white"> Emailing</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link menu-link bg-secondary" to="/dashboard">
            <i class="ri-bank-card-2-line text-white"></i>
            <span data-key="t-dashboards" class="text-white"> Badges</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link menu-link bg-secondary" to="/dashboard">
            <i class="ri-upload-2-fill text-white"></i>
            <span data-key="t-dashboards" class="text-white"> Exports</span>
          </router-link>
        </li>
      </ul>
    </template>
  </BContainer>
</template>

<style>
.nav-link:hover i,
.nav-link:hover span,
.menu-link:hover i,
.menu-link:hover span {
  color: #3f3f3f !important;
}
</style>
