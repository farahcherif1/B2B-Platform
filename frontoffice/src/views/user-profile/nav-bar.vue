<script>
import NavBar from "@/components/nav-bar-horizental";
import RightBar from "@/components/right-bar";

export default {
  name: "Horizontal",
  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onRoutechange(ele) {
      this.initActiveMenu(ele.path);
    },
    initActiveMenu(ele) {
      setTimeout(() => {
        if (document.querySelector("#navbar-nav")) {
          let a = document
            .querySelector("#navbar-nav")
            .querySelector('[href="' + ele + '"]');

          if (a) {
            a.classList.add("active");
            let parentCollapseDiv = a.closest(".collapse.menu-dropdown");
            if (parentCollapseDiv) {
              parentCollapseDiv.classList.add("show");
              parentCollapseDiv.parentElement.children[0].classList.add(
                "active"
              );
              parentCollapseDiv.parentElement.children[0].setAttribute(
                "aria-expanded",
                "true"
              );
              if (
                parentCollapseDiv.parentElement.closest(
                  ".collapse.menu-dropdown"
                )
              ) {
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
              }
            }
          }
        }
      }, 1000);
    },
  },
  mounted() {
    if (document.querySelectorAll(".navbar-nav .collapse")) {
      let collapses = document.querySelectorAll(".navbar-nav .collapse");
      collapses.forEach((collapse) => {
        // Hide sibling collapses on `show.bs.collapse`
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
              // Setup siblings array and get the first sibling
              let siblings = [];
              let sibling = elem.parentNode.firstChild;
              // Loop through each sibling and push to the array
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
  components: {
    NavBar,
    RightBar,
  },
};
</script>

<template>
  <div>
    <div id="layout-wrapper">
      <NavBar :ProfileUsage="true" />
      <!-- ========== App Menu ========== -->
      <div class="app-menu navbar-menu">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <!-- Dark Logo-->
          <router-link to="/" class="logo logo-dark">
            <span class="logo-sm"> </span>
            <span class="logo-lg"> </span>
          </router-link>
          <!-- Light Logo-->
          <router-link to="/" class="logo logo-light">
            <span class="logo-sm"> </span>
            <span class="logo-lg"> </span>
          </router-link>
          <BButton
            size="sm"
            class="p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i class="ri-record-circle-line"></i>
          </BButton>
        </div>
        <div id="scrollbar">
          <BContainer fluid class="d-flex justify-content-between">
            <ul class="navbar-nav h-100" id="navbar-nav">
              <li class="menu-title">
                <span data-key="t-menu"> menu</span>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link">
                  <i class="ri-dashboard-2-line"></i>
                  <span>Home</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/event-cards" class="nav-link">
                  <i class="ri-account-circle-line"></i>
                  <span>Participants</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/event-cards" class="nav-link">
                    <i class="ri-calendar-event-line"></i>
                    <span>Agenda</span>
                </router-link>
              </li>
            </ul>
            <ul class="navbar-nav h-100" id="navbar-nav">
              <li class="nav-item">
                <router-link to="/event-cards" class="nav-link">
                  <i class="ri-calendar-event-line"></i>
                  <span>Mon Agenda</span>
                </router-link>
              </li>

              <li>
                <router-link to="/event-cards" class="nav-link">
                  <i class=" ri-calculator-line"></i>
                  <span>Mes Meetings</span>
                </router-link>
              </li>
            </ul>
          </BContainer>
          <!-- Sidebar -->
        </div>
        <!-- Left Sidebar End -->
        <!-- Vertical Overlay-->
        <div class="vertical-overlay"></div>
      </div>
      <!-- ============================================================== -->
      <!-- Start Page Content here -->
      <!-- ============================================================== -->

      <div class="main-content">
        <div class="page-content">
          <!-- Start Content-->
          <BContainer fluid class="pt-8">
            <slot />
          </BContainer>
        </div>
      </div>
      <RightBar />
    </div>
  </div>
</template>
