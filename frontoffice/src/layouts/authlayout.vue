<script>
export default {
  name: "AuthLayout",
};
</script>

<template>
  <div class="d-flex w-100">
    <div
      class="d-flex flex-grow-1 justify-content-center align-items-center bg-white"
    >
      <img src="@/assets/images/cepex-logo.png" height="450" />
    </div>
    <div
      class="container d-flex flex-grow-2 justify-content-center align-items-center bg-secondary w-100"
      style="height: 100vh"
    >
      <slot></slot>
    </div>
  </div>
</template>
