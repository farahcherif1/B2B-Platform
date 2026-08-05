<script>
import FileUploads from "../../components/file-uploads.vue";
import "flatpickr/dist/flatpickr.css";
import "@vueform/multiselect/themes/default.css";
import { InputType } from "../../enum/enums";
import EventFormService from "../../services/even-form.service";
import Multiselect from "@vueform/multiselect";

export default {
  name: "EventRegisterFormTemplate",
  props: {
    form: {
      type: Array,
      required: true,
      default: () => [],
    },
    typeParticipant: {
      type: Boolean,
      default: false,
    },
    previousRegistration: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["Suivant"],
  components: {
    FileUploads,
    Multiselect,
  },
  data() {
    return {
      previousRegistrationLocal: {},
      participantType: [],
      errors: [],
    };
  },
  computed: {
    InputType() {
      return InputType;
    },
  },
  watch: {
    previousRegistrationLocal: {
      handler(val) {
        this.$emit("update:previousRegistration", val);
      },
      deep: true,
    },
  },
  methods: {
    async convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    async handleFileUpload(file, key) {
      this.previousRegistrationLocal[key] = await this.convertFileToBase64(
        file
      );
    },
    handleNextStep() {
      this.errors = [];

      for (let i = 0; i < this.form.length; i++) {
        if (
          this.form[i].required &&
          !this.previousRegistrationLocal[this.form[i].value]
        ) {
          this.errors[this.form[i].value] = "Ce champ est obligatoire";
        }
      }
      if (Object.keys(this.errors).length > 0) {
        console.log(this.errors);
        return;
      }

      this.$emit("Suivant", this.previousRegistrationLocal);
    },
    toggleChipSelection(item, option) {
      const key = item.value;

      if (!this.previousRegistrationLocal[key]) {
        this.previousRegistrationLocal[key] = [];
      }

      const index = this.previousRegistrationLocal[key].indexOf(option);
      if (index === -1) {
        this.previousRegistrationLocal[key].push(option);
      } else {
        this.previousRegistrationLocal[key].splice(index, 1);
      }
    },

    isChipSelected(item, option) {
      const key = item.value;
      return (
        this.previousRegistrationLocal[key] &&
        this.previousRegistrationLocal[key].includes(option)
      );
    },
  },
  mounted() {
    this.previousRegistrationLocal = { ...this.previousRegistration };

    this.previousRegistrationLocal["ParticipationType"] =
      this.previousRegistrationLocal["ParticipationType"]?.id;

    const eventId = this.$route.params.id;
    EventFormService.getParticipantsTypes(eventId).then((response) => {
      this.participantType = response.data;
    });
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Basic Elements" pageTitle="Forms" />
    <BRow v-if="typeParticipant">
      <BCol lg="12">
        <BCard no-body>
          <BCardBody>
            <div>
              <label for="type-participant" class="form-label"
                >Type Participant</label
              >

              <Multiselect
                v-model="previousRegistrationLocal['ParticipationType']"
                :options="participantType"
                label="name"
                valueProp="id"
                mode="single"
                :searchable="false"
                :placeholder="'Type Participant'"
              />
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardBody>
            <div class="live-preview">
              <BRow class="gy-4">
                <BCol
                  xxl="12"
                  md="12"
                  v-for="(item, index) in form"
                  :key="index"
                >
                  <div v-if="item.type == InputType.TEXT">
                    <label :for="item.name" class="form-label"
                      >{{ item.title }}
                      <span class="text-danger" v-if="item.required"> * </span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      :id="item.name"
                      v-model="previousRegistrationLocal[item.value]"
                      :placeholder="item.placeholder"
                      :required="item.required"
                    />
                  </div>
                  <div v-if="item.type == InputType.NUMBER">
                    <label :for="item.name" class="form-label"
                      >{{ item.title }}
                      <span class="text-danger" v-if="item.required"> * </span>
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      :id="item.name"
                      v-model="previousRegistrationLocal[item.value]"
                      :placeholder="item.placeholder"
                      :required="item.required"
                    />
                  </div>
                  <div v-if="item.type == InputType.TEXTAREA">
                    <label :for="item.name" class="form-label">{{
                      item.title
                    }}</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      :id="item.name"
                      v-model="this.previousRegistrationLocal[item.value]"
                      :placeholder="item.placeholder"
                      :required="item.required"
                    ></textarea>
                  </div>
                  <div v-if="item.type == InputType.SELECT">
                    <label :for="item.name" class="form-label"
                      >{{ item.title }}
                      <span class="text-danger" v-if="item.required"> * </span>
                    </label>
                    <select
                      class="form-select mb-3"
                      aria-label="Default select example"
                      :required="item.required"
                      v-model="previousRegistrationLocal[item.value]"
                    >
                      <option disabled value="">Open this select menu</option>
                      <option
                        v-for="(option, ind) in item.options"
                        :key="ind"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </div>
                  <div v-if="item.type == InputType.FILEUPLOAD">
                    <label class="form-label">
                      {{ item.title }}
                      <span class="text-danger" v-if="item.required"> * </span>
                    </label>
                    <FileUploads
                      v-if="item.title == 'Photo de Profil'"
                      :text="'Cliquez ici pour une photo de profile'"
                      :imgUrl="this.previousRegistration[item.value]"
                      @change="handleFileUpload($event, item.value)"
                    />
                    <FileUploads
                      :text="'Cliquez ici pour une logo de l’organisation'"
                      :imgUrl="this.previousRegistration[item.value]"
                      @change="handleFileUpload($event, item.value)"
                      v-else
                    />
                  </div>
                  <div v-if="item.type == InputType.MULTISELECT">
                    <label class="form-label" for="muliselect">
                      {{ item.title }}
                      <span class="text-danger" v-if="item.required"> * </span>
                    </label>
                    <!-- <p class="text-muted">{{ item.description }}</p> -->
                    <Multiselect
                      v-model="previousRegistrationLocal[item.value]"
                      id="muliselect"
                      mode="tags"
                      :close-on-select="false"
                      :searchable="true"
                      :create-option="true"
                      :options="item.choices"
                    />
                  </div>
                  <div class="invalid-feedback d-block">
                    {{ this.errors[item.value] }}
                  </div>
                </BCol>
                <div class="text-end">
                  <button class="btn btn-primary" @click="handleNextStep">
                    Suivant
                  </button>
                </div>
              </BRow>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<style></style>
