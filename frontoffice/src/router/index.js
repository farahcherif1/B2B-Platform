import { createWebHistory, createRouter } from "vue-router";
import routes from "./routes";
import notAuthenticated from "../services/API/not-authenticated";


function isPublicRoute(publicPages, route) {
  for (let i = 0; i < publicPages.length; i++) {
    if (route === publicPages[i]) {
      return true;
    }
    if (publicPages[i] === "/") continue;
    if (route.startsWith(publicPages[i])) {
      return true;
    }
  }
  return false;
}

function isOrganizerRoute(organizerPages, route) {
  for (let i = 0; i < organizerPages.length; i++) {
    if (route === organizerPages[i]) {
      return true;
    }
    if (organizerPages[i] === "/") continue;
    if (route.startsWith(organizerPages[i])) {
      return true;
    }
  }
  return false;
}

function tokenExpired(token) {
  if(!token) return true;
   // eslint-disable-next-line
  const [_, payloadBase64] = token.split('.');
  const payload = JSON.parse(
    atob(
      payloadBase64
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    )
  );
  
  const exp = payload.exp;
  const now = Date.now();
  return now >= exp * 1000;

}

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const publicPages = [
    "/",
    "/login",
    "/signup",
    "/reset-password",
    "/signin-organizer",
    "/event-cards",
    "/event-details",
    "/term-conditions",
    "/create-password"
  ];
  const organizerPages = [
    "/event-list",
    "/create-event",
    "/participation-list",
  ];
  const authRequired = !isPublicRoute(publicPages,to.path);
  const organizerRequired = isOrganizerRoute(organizerPages,to.path);
  

  if (!authRequired) {
    next();
    return;
  }
  const loggeduser = localStorage.getItem("token");
  const isOrganizer = localStorage.getItem("isOrganizer");
  if (tokenExpired(loggeduser)) {
    if(isOrganizer)
      next("/signin-organizer");
    else
      next("/login");
    
  }
  if (organizerRequired && !isOrganizer) {
    next("/signin-organizer");
  }
  if (authRequired && !loggeduser) {
    next("/login");
  }
  next();
});

router.afterEach((to, from) => {
  notAuthenticated(to, from);
});



export default router;
