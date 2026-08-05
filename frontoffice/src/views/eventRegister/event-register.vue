<template>
  <Horizontal>
    <PageHeader title="Event Register" pageTitle="Events" />
    <div class="grid grid-cols-[1fr_2fr] gap-6 mt-6">
      <selectForm
        class="w-full h-fit"
        :completedSteps="completedSteps"
        @changeStep="currentStep = $event - 1"
      />

      <formTemplate
        class="max-w-4xl"
        v-if="this.previousRegistration != null && currentStep < 3"
        :form="steps[currentStep]"
        :typeParticipant="currentStep == 0"
        v-model:previousRegistration="previousRegistration"
        @Suivant="handleNextStep"
        @FileUpload="file = $event"
      />

      <questionsFormTemplate
        class="max-w-4xl"
        v-if="currentStep === 3"
        :previousRegistration="previousRegistration"
        :form="steps[currentStep]"
        @Suivant="handleNextStep"
      />
    </div>
  </Horizontal>
</template>

<script>
import Horizontal from "@/layouts/horizontal.vue";
import selectForm from "./select-form.vue";
import formTemplate from "./form-template.vue";
import questionsFormTemplate from "./questions-form-template.vue";
import EventService from "../../services/event.service";
import { InputType } from "../../enum/enums";
import EventFormService from "../../services/even-form.service";
import { layoutMethods, layoutComputed } from "@/state/helpers";
// import S3Service from "../../services/s3.service";
localStorage.setItem("rightbar_isopen", false);

export default {
  components: {
    selectForm,
    formTemplate,
    Horizontal,
    questionsFormTemplate,
  },
  name: "EventRegister",

  methods: {
    ...layoutMethods,
    resetLayout() {
      let reset = JSON.parse(localStorage.getItem("resetValue"));
      document.documentElement.setAttribute("data-sidebar-size", "lg");
      this.changeMode({ mode: reset.mode });
      this.changeSidebarColor({ sidebarColor: reset.sidebarColor });
      this.changeLayoutType({ layoutType: reset.layoutType });
      this.changeTopbar({ topbar: reset.topbar });
      this.changeLayoutWidth({ layoutWidth: reset.layoutWidth });
      this.changeSidebarSize({ sidebarSize: reset.sidebarSize });
      this.changeSidebarImage({ sidebarImage: reset.sidebarImage });
      this.changeSidebarColor({ sidebarColor: reset.sidebarColor });
      this.changePreloader({ preloader: reset.preloader });
      this.changeSidebarView({ sidebarView: reset.sidebarView });
      this.changeVisibility({ visibility: reset.visibility });
      this.changePosition({ position: reset.position });
    },
    async handleNextStep(event) {
      await EventService.updateUserSubscription(
        this.$route.params.id,
        event,
        this.currentStep
      );

      if (this.currentStep < this.steps.length)
        this.completedSteps.push(this.currentStep + 1);
      this.currentStep++;
      if (this.currentStep >= this.steps.length) {
        const response = await EventService.registerEvent(
          this.$route.params.id,
          event
        );
        const id = JSON.parse(response.config.data)["id"];
        this.$router.push("/profile/" + id);
      }
    },
    async fetchPreviousRegistration() {
      this.previousRegistration = await EventService.getUserSubscription(
        this.$route.params.id
      );
      if (this.previousRegistration == null) {
        this.previousRegistration = {};
      } else {
        if (this.previousRegistration.OrganisationProduct) {
          this.previousRegistration.OrganisationProduct =
            this.previousRegistration.OrganisationProduct.split(",");
        }
      }
    },

    async getQuestions() {
      const questions = await EventFormService.getQuestionsByParticipantsType(
        this.$route.params.id,
        this.previousRegistration["ParticipationType"]
      );
      console.log("questions", questions);
      if (this.steps.length == 4) {
        this.steps[3] = questions.data;
      } else this.steps.push(questions.data);
    },
  },
  async mounted() {
    this.layoutType = "horizontal";
    await this.fetchPreviousRegistration();
    console.log("this.previousRegistration", this.previousRegistration);
  },
  computed: {
    ...layoutComputed,
    layoutType: {
      get() {
        return this.$store ? this.$store.state.layout.layoutType : {} || {};
      },
      set(layout) {
        localStorage.setItem("rightbar_isopen", true);
        this.changeLayoutType({ layoutType: layout });
        document.querySelector(".hamburger-icon").classList.remove("open");
      },
    },
  },
  watch: {
    async currentStep(newVal, oldVal) {
      if (newVal == 3 && oldVal != 2) await this.getQuestions();
      if (newVal == 2) await this.getQuestions();
    },

    layoutType: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "horizontal":
              document.documentElement.setAttribute(
                "data-layout",
                "horizontal"
              );
              break;
            case "vertical":
              document.documentElement.setAttribute("data-layout", "vertical");
              break;
            case "twocolumn":
              document.documentElement.setAttribute("data-layout", "twocolumn");
              break;
            case "semibox":
              document.documentElement.setAttribute("data-layout", "semibox");
              break;
          }
        }
      },
    },
  },
  data() {
    return {
      file: null,
      previousRegistration: null,
      steps: [
        [
          {
            type: InputType.TEXT,
            title: "Prenom",
            name: "name",
            value: "FirstName",
            placeholder: "Votre prénom",
            required: true,
          },
          {
            type: InputType.TEXT,
            title: "Nom de Famille",
            name: "last_name",
            value: "LastName",
            placeholder: "Votre nom de famille",
            required: true,
          },
          {
            type: InputType.TEXT,
            title: "Fonction",
            name: "fonction",
            value: "Function",
            placeholder: "Votre fonction",
            required: false,
          },
          {
            type: InputType.NUMBER,
            title: "Telephone Mobile",
            name: "phone_number",
            value: "PhoneNumber",
            placeholder: "Votre numéro de téléphone",
            required: false,
          },
          {
            type: InputType.FILEUPLOAD,
            title: "Photo de Profil",
            name: "profile_picture",
            value: "ProfilePicture",
            placeholder: "Cliquez ici pour une photo de profil",
            required: false,
          },
        ],
        [
          {
            type: InputType.TEXT,
            title: "Nom de l’organisation",
            name: "nom_organisation",
            value: "OrganisationName",
            placeholder: "Entrez le nom de l’organisation",
            required: true,
          },
          {
            type: InputType.SELECT,
            title: "Type de l’organisation",
            name: "type_organisation",
            value: "OrganisationType",
            options: ["Option 1", "Option 2", "Option 3"],
            placeholder: "Sélectionnez un type",
            required: true,
          },
          {
            type: InputType.NUMBER,
            title: "Numéro de téléphone",
            name: "telephone",
            value: "OrganisationPhoneNumber",
            placeholder: "Entrez votre numéro de téléphone",
            required: false,
          },
          {
            type: InputType.TEXT,
            title: "Site web",
            name: "site_web",
            value: "OrganisationWebsite",
            placeholder: "http://",
            required: false,
          },
          {
            type: InputType.TEXTAREA,
            title: "Description de l’organisation",
            name: "description",
            value: "OrganisationDescription",
            placeholder: "Décrivez votre organisation.",
            required: true,
          },
          {
            type: InputType.FILEUPLOAD,
            title: "Logo de l’organisation",
            name: "logo",
            value: "OrganisationLogo",
            placeholder: "Cliquez ici pour télécharger un logo",
            required: false,
          },
          {
            type: InputType.MULTISELECT,
            title: "Produits",
            name: "produits",
            value: "OrganisationProduct",
            choices: ["produit 1", "produit 2", "produit 3"],
            placeholder: "Sélectionnez des produits",
            required: false,
          },
          {
            type: InputType.TEXT,
            title: "LinkedIn",
            name: "linkedin",
            value: "Linkedin",
            placeholder: "http://",
            required: false,
          },
          {
            type: InputType.TEXT,
            title: "Facebook",
            name: "facebook",
            value: "Facebook",
            placeholder: "http://",
            required: false,
          },
          {
            type: InputType.TEXT,
            title: "x",
            name: "twitter",
            value: "X",
            placeholder: "http://",
            required: false,
          },
          {
            type: InputType.TEXT,
            title: "Instagram",
            name: "instagram",
            value: "Instagram",
            placeholder: "http://",
            required: false,
          },
        ],
        [
          {
            type: InputType.SELECT,
            title: "Pays",
            name: "pays",
            value: "pays",
            placeholder: "Tunisia",
            options: ["Tunisia", "France", "USA"],
            required: true,
          },
          {
            type: InputType.TEXT,
            title: "Département",
            name: "departement",
            value: "Departement",
            placeholder: "Entrez le département",
            required: false,
          },
          {
            type: InputType.TEXT,
            title: "Ville",
            name: "ville",
            value: "Ville",
            placeholder: "Entrez la ville",
            required: true,
          },
          {
            type: InputType.TEXT,
            title: "Code Postal",
            name: "code_postal",
            value: "CodePostal",
            placeholder: "Entrez le code postal",
            required: false,
          },
          {
            type: InputType.TEXT,
            title: "Adresse",
            name: "adresse",
            value: "Adresse",
            placeholder: "Entrez l'adresse",
            required: false,
          },
        ],
      ],
      completedSteps: [],
      currentStep: 0,
    };
  },
};
</script>
