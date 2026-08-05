<script>
import { BRow } from "bootstrap-vue-next";

export default {
  name: "NavBar",
  components: { BRow },
};
</script>

<template>
  <BRow style="height: 8vh; background-color: white">
    <BCol sm="1" class="mt-1" style="margin-left: 5rem">
      <router-link to="/">
        <img
          src="../../assets/images/Cepex.svg"
          alt="logo"
          width="70"
          height="61"
        />
      </router-link>
    </BCol>
    <BCol sm="7"> </BCol>
  </BRow>

  <BRow
    style="height: 8vh; background-color: white; border-top: 1px solid #e5e5e5"
    class="align-items-center"
  >
    <BCol sm="1"> </BCol>
    <BCol sm="1">
      <router-link to="/" class="d-flex align-items-center">
        <img
          src="@/assets/images/Vector.svg"
          alt="logo"
          width="16"
          height="16"
        />
        <h5 class="m-0 ms-2">Home</h5>
      </router-link>
    </BCol>
    <BCol sm="1">
      <router-link to="/event-cards" class="d-flex align-items-start">
        <img
          src="@/assets/images/events-icon.svg"
          alt="logo"
          width="16"
          height="16"
        />
        <h5 class="m-0 ms-2">Evenements</h5>
      </router-link>
    </BCol>

    <BCol sm="1"> </BCol>
  </BRow>
</template>

<style scoped></style>
