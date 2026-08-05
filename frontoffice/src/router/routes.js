
export default [
  {
    path: "/",
    name: "home",
    meta: { title: "Cepex" },
    component: () => import("../views/home/index.vue")
  },
  {
    path: "/event-cards",
    name: "events",
    meta: { title: "Events", authRequired: true },
    component: () => import("../components/event/events.vue")
  },
  {
    path: "/signin-organizer",
    name: "signin-organizer",
    meta: { title: "Sign In Organizer" },
    component: () => import("../views/auth/signin-organizer.vue")
  },

  {
    path: "/term-conditions",
    name: "term-conditions",
    meta: { title: "Term Conditions" },
    component: () => import("../views/pages/terms-conditions.vue")
  },
  {
    path: "/event-details/:id",
    name: "DetailEvent",
    meta: { title: "AI Conference Page", authRequired: true },
    component: () => import("../components/event/event-detail.vue"),
    props: true
  },
  {
    path: "/login",
    name: "login",
    meta: { title: "Login" },
    component: () => import("../views/auth/login.vue")
  },
  {
    path: "/signup",
    name: "signup",
    meta: { title: "Sign Up" },
    component: () => import("../views/auth/signup.vue")
  },
  {
    path: "/reset-password",
    name: "reset-password",
    meta: { title: "reset Password" },
    component: () => import("../views/auth/reset-password.vue")
  },
  {
    path: "/create-password/:token",
    name: "create-password",
    meta: { title: "Create Password" },
    component: () => import("../views/auth/create-password.vue")
  },
  {
    path: "/dashboard-event/:id",
    meta: { title: "Dashboard Event", authRequired: true },
    component: () => import("../layouts/dashboardlayout.vue"),
    children: [
      {
        path: "",
        name: "dashboard-event",
        meta: { title: "Dashboard Event" },
        component: () => import("../views/dashboard/dashboard-event.vue")
      },
      {
        path: "form-event",
        name: "form-event",
        meta: { title: "form Event" },
        component: () =>
          import(
            "../components/event-configuration/configuration-form-event.vue"
          )
      },
      {
        path: "meetings",
        name: "Meetings",
        meta: { title: "Meetings", authRequired: true },
        component: () => import("../views/meeting/meetings.vue")
      },
      {
        path: "/emailing/:id",
        name: "Emailing",
        meta: { title: "Email", authRequired: true, organizerRequired: true },
        component: () => import("../components/email/email.vue")
      },
      {
        path: "/email-history/:id",
        name: "EmailHistory",
        meta: {
          title: "Email History",
          authRequired: true,
          organizerRequired: true
        },
        component: () => import("../components/email/emailHistory.vue")
      }
    ]
  },

  {
    path: "/event-list",
    name: "EventList",
    meta: { title: "Event List", authRequired: true, organizerRequired: true },
    component: () => import("../components/event-backoffice/event-list.vue")
  },
  {
    path: "/create-event",
    name: "Create Event",
    meta: { title: "Create Event", authRequired: true },
    component: () => import("../components/event-backoffice/create-event.vue")
  },
  {
    path: "/form-template",
    name: "EventRegisterFormTemplate",
    meta: { title: "Event Register Form Template", authRequired: true },
    component: () => import("../views/eventRegister/form-template.vue")
  },
  {
    path: "/select-form",
    name: "SelectForm",
    meta: { title: "Select Form", authRequired: true },
    component: () => import("../views/eventRegister/select-form.vue")
  },
  {
    path: "/event-register/:id",
    name: "EventRegister",
    meta: { title: "Event Register", authRequired: true },
    component: () => import("../views/eventRegister/event-register.vue")
  },
  {
    path: "/participation-list/:id",
    name: "ParticipationList",
    meta: { title: "Participation List", authRequired: true },
    component: () =>
      import("../views/participation-list/participation-list.vue")
  },
  {
    path: "/organizer-list/:id",
    name: "OrganizerList",
    meta: { title: "Organizer List", authRequired: true },
    component: () => import("../views/organizer-list/organizer-list.vue")
  },
  {
    path: "/profile/:idApplication",
    name: "Profile",
    meta: { title: "Profile", authRequired: true },
    component: () => import("../views/user-profile/user-profile.vue")
  },
  {
    path: "/edit-website/:id",
    name: "EditWebsite",
    meta: { title: "Edit Website", authRequired: true },
    component: () => import("../views/eventWebsite/website-builder.vue")
  },
  {
    path: "/website/:id",
    name: "Website",
    meta: { title: "Website", authRequired: true },
    component: () => import("../views/eventWebsite/website.vue")
  }
];
