<template>
    <nav class="flex items-center justify-between bg-white shadow px-6" style="height: 71px;">
      <!-- Left: Logo -->
      <router-link to="/" class="flex items-center">
        <img src="@/assets/images/cepex-logo.svg" alt="Logo" class="h-16" />
      </router-link>
  
      <!-- Right: Profile Dropdown (Always Visible) -->
      <div class="flex items-center space-x-4">
        <div class="d-flex align-items-center">
          <BDropdown
            variant="link"
            class="ms-sm-3 header-item topbar-user"
            toggle-class="rounded-circle arrow-none"
            menu-class="dropdown-menu-end"
            :offset="{ alignmentAxis: -14, crossAxis: 0, mainAxis: 0 }"
          >
            <template #button-content>
              <span class="d-flex align-items-center">
                <img
                  class="rounded-circle header-profile-user"
                  src="@/assets/images/users/avatar-1.jpg"
                  alt="Header Avatar"
                />
                <span class="text-start ms-xl-2">
                  <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text text-black">
                    Edward Diana
                  </span>
                  <span class="d-none d-xl-block ms-1 fs-12 user-name-sub-text text-black">
                    Founder
                  </span>
                </span>
              </span>
            </template>
  
            <h6 class="dropdown-header">Welcome Anna!</h6>
            <router-link class="dropdown-item" to="/pages/profile">
              <i class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Profile</span>
            </router-link>
            <router-link class="dropdown-item" to="/chat">
              <i class="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Messages</span>
            </router-link>
            <router-link class="dropdown-item" to="/apps/tasks-kanban">
              <i class="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Taskboard</span>
            </router-link>
            <router-link class="dropdown-item" to="/pages/faqs">
              <i class="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Help</span>
            </router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" to="/pages/profile">
              <i class="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Balance : <b>$5971.67</b></span>
            </router-link>
            <router-link class="dropdown-item" to="/pages/profile-setting">
              <BBadge
                variant="success-subtle"
                class="bg-success-subtle text-success mt-1 float-end"
              >
                New
              </BBadge>
              <i class="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Settings</span>
            </router-link>
            <router-link class="dropdown-item" to="/auth/lockscreen-basic">
              <i class="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Lock screen</span>
            </router-link>
            <router-link class="dropdown-item" to="/logout">
              <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Logout</span>
            </router-link>
          </BDropdown>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    // props and methods are not even used now, can be removed
  };
  </script>
  
  <style scoped>
  /* Optional styles */
  </style>
  