<script>

import EventCard from "../event/event-card.vue";
import Horizontal from "@/layouts/horizontal.vue";

export default {
  name: "Events",
  components: {EventCard, Horizontal}
}
</script>

<template>
  <Horizontal/>
<EventCard></EventCard>
</template>

<style scoped>
</style>