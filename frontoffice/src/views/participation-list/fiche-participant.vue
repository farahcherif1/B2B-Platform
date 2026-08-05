<script>
localStorage.setItem("fich_isopen", false);
import simpleBar from "simplebar-vue";
/**
 * Right sidebar component
 */

export default {

  data() {
    return {
      showGradients: false,
      resetLayoutMode: {},
      showLocal : false,
      participant : {
        FirstName : "John",
        LastName : "Doe",
        Function : "CEO",
        PhoneNumber : "+1 235 235 555",
        user : {
          email : "aa"
        }
      }
    };
  },
  name : 'FicheParticipant',
  props: {
    layout: {
      type: String,
      default: () => {},
    },
    show: {
      type: Boolean,
      default: false,
    },
    currentParticipant : {
      type : Object,
      default : () => {}
    }

  },
  emits: ["close"],



  methods: {

    handelClose(){
      this.showLocal = false;
      this.$emit('close');
    },





  },

  computed: {

  },

  watch: {
    show (){
      this.showLocal = this.show;
    },
    currentParticipant (){
      this.participant = this.currentParticipant;
    },
    
  },
  components: { simpleBar },
};
</script>

<template>
    
  <div>
    <div id="preloader">
      <div id="status">
        <div class="spinner-border text-primary avatar-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <BButton
      variant="danger"
      @click="topFunction"
      class="btn-icon"
      id="back-to-top"
    >
      <i class="ri-arrow-up-line"></i>
    </BButton>

    <BOffcanvas
      class="border-0"
      id="theme-settings-offcanvas"
      header-class="d-flex align-items-center  p-3 custom-header"
      body-class="p-0"
      footer-class="border-top p-3 text-center"
      placement="end"
      @hide="handelClose"
      :model-value="showLocal"
    >
      <template #header >
          <div class="me-2">
          <h5 class="m-0 me-2 text-white">Fiche participant</h5>
        </div>
        <BButton
          class="btn-close btn-close-white ms-auto"
          id="customizerclose-btn"
          @click="handelClose"
        ></BButton>

      </template>
      <simpleBar class="h-100">
        <BCard>
            <BCardBody>
                <BRow >
                    <BCol lg = "12">
                        <BCard no-body class="shadow-none border border-indigo-600 custom-round" >
                            <BCardBody >
                                <BRow class="g-4 align-items-center justify-content-between">
                                    <BCol cols="3">
                                    <div class="avatar-lg">
                                        <img src="@/assets/images/users/avatar-1.jpg" alt="user-img" class="img-thumbnail rounded-circle" />
                                    </div>
                                    </BCol>
                                    <BCol cols = "8">
                                        <BRow>
                                            <BCol>
                                                <h5 class="font-size-15 mb-1">{{ participant?.FirstName }} {{ participant?.LastName }} {{ participant?.name }}</h5>
                                            </BCol>
                                        </BRow>
                                        <BRow>
                                            <BCol>
                                                <p class="text-muted
                                                mb-0">{{ participant?.Function }}</p>
                                            </BCol>
                                        </BRow>
                                        <BRow>
                                            <BCol>
                                                <p class="
                                                mb-0">vienna, austria KOLIBRI Uncrewed Aerial Operations FlexCo</p>
                                            </BCol>
                                        </BRow>


                                    </BCol>
                                    

                                </BRow>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>

                <BRow>
                  <BCol>
                    <BCard no-body class="shadow-none border border-indigo-600 custom-round" >
                      <BCardBody>
                        <BRow>
                          <BCol cols = "6">
                            <div class="mt-2">
                              <i class=" ri-mail-line"></i>
                              {{ participant?.user?.email }} {{ participant?.email }}
                            </div>
                            <div class="mt-2">
                              <i class=" ri-phone-fill"></i>
                              {{ participant?.PhoneNumber }}
                            </div>


                          </BCol>
                          <BCol cols = "6" class="d-flex align-items-center justify-content-end">
                            <h4>                 <BBadge variant="secondary-subtle" class="bg-secondary-subtle text-secondary">Secondary</BBadge>
                            </h4>
                          </BCol>
                        </BRow>
                       
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow>
                <BRow>
                  <BCol>
                    <BCard no-body class="shadow-none border border-indigo-600 custom-round" >
                      <BCardBody>
                        <BRow>
                          <h6>Informations de l'organisation</h6>
                        </BRow>
                        <BRow>
                          <BCol>
                            <p class="text-muted mb-0">{{ participant?.OrganisationDescription }}</p>
                          </BCol>
                        </BRow>
                        <BRow >
                          <BCol>
                            <p class="mb-3">organisation speciliste </p>
                          </BCol>
                        </BRow>
                        <BRow>
                          <BCol cols = "4">
                            <p class="text-muted mb-0">Type</p>
                          </BCol>
                          <BCol cols = "5">
                            <p class="text-muted mb-0">Emplacement</p>
                          </BCol>
                        </BRow>
                        <BRow>
                          <BCol cols = "4">
                            <p class=" mb-3">{{ participant?.OrganisationType }}</p>
                          </BCol>
                          <BCol cols = "5">
                            <p class="mb-3">{{ participant?.Adresse }}</p>
                          </BCol>
                        </BRow>
                        <BRow>
                          <BCol>
                            {{ participant?.OrganisationWebsite || "No website" }}
                          </BCol>
                        </BRow>
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow>
                <h5>Sessions</h5>
                <BRow>
                  <BCol>

                    <BCard no-body class="shadow-none border border-indigo-600 custom-round" >
                      <BCardBody>
                        <BRow>
                          <BCol cols = "6">
                            <div class="mt-2">
                              <i class=" ri-mail-line"></i>
                              email@gmail.com
                            </div>
                            <div class="mt-2">
                              <i class=" ri-phone-fill"></i>
                              +1 235 235 555
                            </div>


                          </BCol>
                          <BCol cols = "6" class="d-flex align-items-center justify-content-end">
                            <h4>                 <BBadge variant="secondary-subtle" class="bg-secondary-subtle text-secondary">Secondary</BBadge>
                            </h4>
                          </BCol>
                        </BRow>
                       
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow>
                <BRow>
                  <BCol>
                    <BCard no-body class="shadow-none border border-indigo-600 custom-round" >
                      <BCardBody>
                        <BRow>
                          <BCol cols = "6">
                            <div class="mt-2">
                              <i class=" ri-mail-line"></i>
                              email@gmail.com
                            </div>
                            <div class="mt-2">
                              <i class=" ri-phone-fill"></i>
                              +1 235 235 555
                            </div>


                          </BCol>
                          <BCol cols = "6" class="d-flex align-items-center justify-content-end">
                            <h4>                 <BBadge variant="secondary-subtle" class="bg-secondary-subtle text-secondary">Secondary</BBadge>
                            </h4>
                          </BCol>
                        </BRow>
                       
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow>
            </BCardBody>
        </BCard>
        
      
      </simpleBar>
      
      
    </BOffcanvas>
  </div>
</template>

<style lang="scss">
.b-overlay-wrap {
  .b-overlay {
    z-index: 1005 !important;
  }
}
.custom-round {
  border-radius: 1.25rem;
}
.custom-header {
  background-color: #8093A4;
}
</style>
