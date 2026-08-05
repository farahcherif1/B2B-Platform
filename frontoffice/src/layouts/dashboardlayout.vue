<template>
  <Vertical>
    <router-view />
  </Vertical>
</template>

<script>
import Vertical from "@/layouts/vertical.vue";

export default {
  components: {
    Vertical,
  },
};
</script>
