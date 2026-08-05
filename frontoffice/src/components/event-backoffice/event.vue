<script>
import {BCol} from "bootstrap-vue-next";

export default {
  name: "EventCard",
  components: {BCol},
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <BRow class="align-items-center " >
    <BCol sm="2">
      <BRow class="align-items-center">
        <BCol sm = "2">
          <!-- Rounded Image -->
          <b-img class="rounded" alt="200x200" width="35" srcset="favicon.ico" data-holder-rendered="true"></b-img>
        </BCol>
        <BCol sm = "10">
          <div>
            <h5 class="card-title m-1" style="color: #666c72">{{event.name}}</h5>
            <p class="text-muted mb-0"><i class="mdi mdi-map-marker"></i> {{event.location}}</p>
          </div>
        </BCol>
      </BRow>
    </BCol>
    <BCol sm = "2" class="d-flex justify-content-end" >
      <i class="mdi mdi-account-group-outline me-1 " ></i>{{event.registrations}} Participants
    </BCol>
    <BCol sm = "2" class="d-flex justify-content-end">
      <i class="mdi mdi-calendar-check-outline me-1 "></i>{{event.meetings}} Meetings
    </BCol>
    <BCol sm = "2" class="d-flex justify-content-end">
      <span class="badge bg-success me-3">{{event.state}}</span>
    </BCol>
    <BCol sm = "4">
      <BRow class="justify-content-end align-items-center ">
        <BCol sm = "4">
          <BButton variant="light" class="waves-effect" style="background-color: #daf4f0">
            <BRow class="align-items-center">
            <BCol sm = "1">
              <i class="ri-settings-3-fill  fs-4" style="color: #0bb39c"></i>
            </BCol>
            <BCol sm = "9" >
            <span style="color: #0bb39c">Configurer</span>
            </BCol>
            </BRow>
          </BButton>
        </BCol>
        <BCol sm = "5">
          <BButton variant="light" class="waves-effect" style="background-color: #ffe1ea; height: inherit" >
            <BRow class="align-items-center">


              <i class="mdi mdi-exit-to-app fs-4 col-1" style="color: #d73a67"></i>
              <BCol sm = "9" >
                <span style="color: #d73a67 ; font-size: small">
              Site de l'événement
            </span>
              </BCol>
            </BRow>
          </BButton>
        </BCol>
      </BRow>
    </BCol>
  </BRow>


</template>

<style scoped>

</style>