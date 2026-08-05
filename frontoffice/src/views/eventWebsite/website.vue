<script>
import NavBar from "@/views/eventWebsite/website-nav.vue";
import RightBar from "@/components/right-bar";
import EventWebsiteTabs from "./EventWebsiteTabs.vue"; 
import EventService from '@/services/event.service.js';
import WebsiteService from '@/services/website.service.js';
import { MonthEnum } from "@/enum/enums.js";

export default {
  name: "Horizontal",
  data() {
    return {
      event: null,
      loading: true,
      sectionsLoading: true,
      months: Object.values(MonthEnum),
      sections: [],
      activeTab: null,
    };
  },
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
    async fetchEvent(eventId) {
      try {
        const response = await EventService.getEventDetails(eventId);
        this.event = response.data;
        if (this.event && this.event.websiteTabs && this.event.websiteTabs.length > 0) {
          await this.fetchSectionsForTabs();
          if (this.event.websiteTabs.length > 0) {
            this.activeTab = this.event.websiteTabs[0].id;
          }
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchSectionsForTabs() {
      this.sectionsLoading = true;
      try {
        const allSections = [];
        for (const tab of this.event.websiteTabs) {
          const sectionRes = await WebsiteService.getSections(tab.id);
          allSections.push(...sectionRes.data.map(s => ({ ...s, tabId: tab.id })));
        }
        this.sections = allSections;
      }catch (error) {
        console.error("Error fetching sections:", error);
      }finally {
        this.sectionsLoading = false;
      }
    },
    
    handleTabChange(tabId) {
      console.log('Tab changed to:', tabId);
      this.activeTab = tabId;
    },
    replaceDate(date) {
            try{
                date = date.slice(0, 10);
                date = date.split("-");
            }
            catch(e){
                return "Invalid Date"
            }
            return `${date[2]} ${this.months[parseInt(date[1]) - 1]} ${date[0]}`;
        },
    handleRegister() {
        const eventId = this.$route.params.id;
        this.$router.push(`/event-register/${eventId}`);
      },
    handleShare() {
      console.log('Share requested');
    }
  },
  mounted() {
    const eventId = this.$route.params.id;
    if (eventId) {
      this.fetchEvent(eventId);
    } 
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
    EventWebsiteTabs
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
                <li class="nav-item">
                  <router-link to="/event-cards" class="nav-link">
                    <i class="ri-calculator-line"></i>
                    <span>Mes Meetings</span>
                  </router-link>
                </li>
              </ul>
            </BContainer>
          </div>
          <div class="vertical-overlay"></div>
        </div>
        <div class="main-content">
          <div class="page-content">
            <BContainer fluid class="pt-12  px-0">
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>  
              <!-- Website tabs section -->
              <div v-if="!loading && event && event.websiteTabs && event.websiteTabs.length > 0" >
                <EventWebsiteTabs 
                  :websiteTabs="event.websiteTabs"
                  :sections="sections"
                  @tab-changed="handleTabChange"
                >
                  <template v-for="tab in event.websiteTabs" :key="tab.id" v-slot:[tab.id]>
                    <div class="tab-content-container">
                      <h3>{{ tab.name }}</h3>
                    </div>
                  </template>
                </EventWebsiteTabs>
              </div>
            </BContainer>
              <!-- Event Banner Section -->
              <div v-if="!loading && event" class="event-banner-container mt-0 pt-0">
                <div class="event-banner pt-0" >
                    <img src="@/assets/images/website-banner.svg" alt="Banner" class="banner-image" />
                    <div class="overlay">
                        <div class="event-info">
                            <div class="custom-box">
                                <strong>{{ replaceDate(event.startDate) }} - {{ replaceDate(event.endDate) }}</strong>
                                <span>| Tunisie</span>
                            </div>
                            <h1 class="event-name">{{ event.name }}</h1>
                        </div>
                    </div>
                  <div class="event-buttons">
                    <button 
                      class="btn-register"
                      @click="handleRegister"
                    >
                      Register Now
                    </button> 
                    <button class="btn-share" @click="handleShare">
                        <img src="@/assets/images/share-button.svg" 
                        alt="Share icon" class="share-icon" />
                        Share
                    </button>
                  </div>
                </div>
                <img src="@/assets/images/website-banner.svg" alt="Decorative SVG" class="decorative-svg" />
              </div>
              <!-- Tab Content Sections -->
              <div v-if="!loading && !sectionsLoading" class="sections-container">
                <!-- Display existing sections for the active tab -->
                <div v-if="sections.length > 0" class="sections-wrapper">
                  <div
                    class="section-card"
                    v-for="section in sections.filter(s => s.tabId === activeTab)"
                    :key="section.id"
                  >
                    <div class="section-header" v-if="section.title">
                      <h3 class="section-title">{{ section.title }}</h3>
                    </div>

                    <div class="section-content">
                      <div v-if="section.description">
                        <p>{{ section.description }}</p>
                      </div>

                      <div class="image-container" v-if="section.images && section.images.length > 0">
                        <div class="gallery">
                          <img
                            v-for="(image, index) in section.images"
                            :key="index"
                            :src="image.url"
                            alt="Section image"
                            class="section-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

            <div class="empty-state" v-if="!sections.some(s => s.tabId === activeTab)">
              <p>Aucune section pour ce tab.</p>
            </div>
          </div>
        </div>
              <slot />
  
          </div>
        </div>
        <RightBar />
      </div>
    </div>
</template>

<style scoped>
.sections-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  margin-top: 0px;
  z-index: 2;
}
.sections-wrapper {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 0px;
}
.section-card {
  margin-bottom: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.section-card:last-child {
  margin-bottom: 40px;
}
.section-header {
  margin-bottom: 20px;
}
.custom-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  text-transform: uppercase;
}
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-top: 0;
}
.section-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.image-container {
  margin-top: 10px;
}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.section-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #666;
}
.section-divider {
  position: relative;
  text-align: center;
  margin: 30px 0;
}
.divider-text {
  background-color: white;
  padding: 0 15px;
  position: relative;
  z-index: 1;
  color: #666;
  font-weight: 600;
}
.section-divider:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid #e5e7eb;
  z-index: 0;
}
.decorative-svg {
  display: block;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  width: 1127px;
  height: 557px;
  top: -120px; 
  left: 14px;
  border-radius: 8px;
  
}
.custom-box {
  width: 250px;
  height: 24px;
  position: absolute;
  margin-top : 0;
  left: 144px;
  color: #FFFFFF;
}
.event-name {
  width: 860px;
  height: 144px;
  top: 30px;
  position: absolute;
  left: 160px;
  font-family: Noto Sans;
  font-weight: 400;
  font-size: 56px;
  line-height: 68px;
  letter-spacing: 0%;
  text-align: left; 
  color: #FFFFFF;
}
#layout-wrapper {
  width: 100%;
  overflow-x: hidden;
}
.main-content {
  width: 100%;
  overflow-x: hidden;
}
.website-tabs-section {
  margin: 0;
  padding: 0;
  background-color: #fff;
  width: 100%;
}
.tab-content-container {
  padding: 20px;
}
.event-banner-container {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
  margin-top: 0;
  padding-top: 0;
  overflow: hidden;
  margin-bottom: 0;
}


.event-banner {
  position: relative;
  width: 100%;
  min-height: 280px;
  background-size: cover;
  background-position: center;
  color: white;
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  
}
.banner-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
}
.container-fluid {
  padding-left: 0;
  padding-right: 0;
}
.overlay {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(55, 16, 19, 0.65);
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  align-items: center;
  color: white;
  text-align: center;
  padding: 1rem;
}
.event-info {
  z-index: 2;
  max-width: 800px;
  margin-top: 0px;
}
.event-dates {
  font-size: 18px;
  margin-bottom: 10px;
}

.event-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 30px;
}

.event-buttons {
  position: absolute;
  top: 50px; 
  right: 150px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 3;
}
.btn-register {
  width: 210.47999572753906px;
  height: 48px;
  top: 138px;
  left: 1069.52px;
  border-radius: 8px;
  border-width: 1px;
  background: #D0021C;
  border: 1px solid #D0021C;
  animation-duration: 0ms;
  font-size: 16px;
  font-weight: 600;
}
.btn-register:hover {
  background-color: #c00914;
}

.btn-share {
  width: 210.47999572753906px;
  height: 48px;
  top: 138px;
  left: 1069.52px;
  border-radius: 8px;
  border-width: 1px;
  background: #D0021C;
  border: 1px solid #D0021C;
  animation-duration: 0ms;
  font-size: 16px; 
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-share:hover {
  background-color: #c00914;
}
.share-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  left:50px
}
.event-details {
  background-color: white;
  padding: 20px;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>