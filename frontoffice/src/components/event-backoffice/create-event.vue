<script>
import EventBasicInformations from "./event-basic-informations.vue";
import {BRow} from "bootstrap-vue-next";

export default {
  name : "CreateEvent",
  components: {
    BRow,
    EventBasicInformations,
  },
  data(){

  },
  methods : {
    updateEvent(value){
      this.event = value;
    },
    confirmEvent(){
    }

  }

}
</script>

<template>
<div style="background-color: #f3f3f9;height: 97vh">

  <BRow style="height: 10%">
    <h5 class="px-5 py-4 ">
      FORMULAIER D'AJOUT D'EVENEMENT
    </h5>
  </BRow>
  <BRow style="height: 80%">
    <BCol sm = "2">

    </BCol>

    <BCol sm = "7" style="background-color: white; margin-left: 6vh;display: flex; flex-direction: column;" class="rounded">
      <h5 class="p-4 pb-0">Informations a propos de l'evenement</h5>
      <hr>
      <div style="padding: 5vh">
        <event-basic-informations :event-from-parent="event" @update:eventFromParent="updateEvent"
        ></event-basic-informations>
      </div>

    </BCol>

  </BRow>


</div>

</template>

<style scoped>

</style>