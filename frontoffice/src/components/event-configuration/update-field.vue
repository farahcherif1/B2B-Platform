<script>
import { BButton, BOffcanvas } from "bootstrap-vue-next";
import Simplebar from "simplebar-vue";
import { Field, Form } from "vee-validate";
import EventFormService from "../../services/even-form.service";
import Multiselect from "@vueform/multiselect";
import choice from "./choice.vue";

export default {
  data() {
    return {
      choix: [],
      showNewChoiceInput: false,
      choixValue: "",
      required: false,
      dependent: false,
      title: "",
      participantType: [],
      selectedParticipantType: [],
      questions: [],
      showedQuestions: [],
      selectedQuestion: null,
      field: null,
      multipleChoicesSelected: false,
      selectedQuestionType: "Text",
      questionChoices: [],
      selectedChoice: null,
    };
  },
  components: {
    Form,
    BOffcanvas,
    Simplebar,
    BButton,
    Field,
    Multiselect,
    choice,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    eventId: {
      type: Number,
      required: true,
    },
    fieldId: {
      type: Number,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    showOffcanvas: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  watch: {
    fieldId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadFieldData(newVal);
          this.showedQuestions = this.questions.filter(
            (item) => item.id !== newVal
          );
        }
      },
    },
    selectedQuestionType(value) {
      const type = value.toLowerCase();
      if (type === "multiple choice" || type === "checkbox") {
        this.multipleChoicesSelected = true;
      } else {
        this.multipleChoicesSelected = false;
      }
      this.field.type = value;
    },
    selectedQuestion(value) {
      const id = value;

      this.questionChoices =
        this.questions.find((item) => item.id === id)?.choices || [];
    },
  },
  mounted() {
    EventFormService.getQuestions(this.eventId)
      .then((response) => {
        this.questions = response.data || [];
      })
      .catch((error) => {
        console.log(error);
      });
    EventFormService.getParticipantsTypes(this.eventId).then((response) => {
      this.participantType = response.data;
    });
    if (this.fieldId) {
      this.loadFieldData(this.fieldId);
    }
  },
  methods: {
    async loadFieldData(fieldId) {
      await EventFormService.getFieldById(fieldId).then((response) => {
        this.field = response.data;
        console.log(this.field);
        this.required = this.field.required;
        this.dependent = this.field.dependencies.length > 0;
        this.selectedParticipantType = this.field.participantsType.map(
          (item) => item.id
        );
        this.choix = this.field.choices || [];
      });
      this.selectedQuestionType = this.field.type;
      if (this.field.dependencies.length > 0) {
        await EventFormService.getDependencieById(
          this.field.dependencies[0].id
        ).then((response) => {
          this.selectedQuestion = response.data.dependentQuestion?.id;
          this.selectedChoice = response.data.choice?.id;
        });
      }
    },
    addChoice(choice) {
      EventFormService.createChoice(choice).then((response) => {
        this.choix.push(response.data);
        this.showNewChoiceInput = false;
        this.choixValue = "";
      });
    },
    submitForm(value) {
      const ids = this.choix.map((item) => item.id);
      const field = {
        id: this.field.id,
        title: value.title,
        type: value.questionType,
        description: value.description,
        required: this.required,
        choiceIds: ids,
        participantsTypeId: this.selectedParticipantType,
      };

      field.dependencies =
        this.selectedChoice && this.selectedQuestion && this.dependent
          ? [
              {
                choiceId: this.selectedChoice,
                dependentQuestionId: this.selectedQuestion,
              },
            ]
          : [];
      if (!this.dependent) {
        field.dependencies = [];
      }
      EventFormService.updateField(field).then((response) => {
        if (response.data && response.data.id) {
          this.showOffcanvas = false;
          this.$emit("field-updated", response.data);
        }
      });
    },
  },
};
</script>
<template>
  <BOffcanvas
    @update:modelValue="$emit('update:modelValue', $event)"
    class="border-0"
    :model-value="showOffcanvas"
    id="theme-settings-offcanvas"
    body-class="p-0"
    header-class="bg-secondary"
    footer-class="p-0"
    placement="end"
  >
    <template #header>
      <div class="me-2">
        <h5 class="m-0 me-2 text-white">Modifier une question</h5>
      </div>
      <BButton
        class="btn-close btn-close-white ms-auto"
        id="customizerclose-btn"
        @click="showOffcanvas = false"
      ></BButton>
    </template>
    <Simplebar
      class="h-100 simple custom-simple-var"
      :options="{ autoHide: false }"
    >
      <div class="p-4">
        <Form
          @submit="submitForm"
          v-if="field"
          :initial-values="{
            title: field.title,
            description: field.description,
            questionType: field.type,
          }"
          :key="field.id"
        >
          <div class="mb-3">
            <div class="d-flex justify-content-between">
              <label for="title" class="form-label mb-0">Titre</label>
              <div>
                <label for="required" class="form-label mr-2"
                  >Obligatoire</label
                >
                <input
                  name="required"
                  type="checkbox"
                  class="form-check-input bg-secondary border-0"
                  id="required"
                  v-model="required"
                />
              </div>
            </div>

            <Field
              name="title"
              type="text"
              class="form-control"
              id="title"
              placeholder="Taper ici le titre..."
            />
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <Field
              name="description"
              as="textarea"
              class="form-control"
              id="description"
              rows="3"
              placeholder="Taper ici la description..."
            />
          </div>
          <div class="mb-3">
            <label for="questionType" class="form-label">Type question</label>
            <Field
              name="questionType"
              class="form-select"
              id="questionType"
              as="select"
              v-model="selectedQuestionType"
            >
              <option value="Text">Text</option>
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="Checkbox">Checkbox</option>
            </Field>
          </div>
          <!-- Render choices component if multiple choices are selected -->
          <choice v-if="multipleChoicesSelected" v-model:choix="choix" />
          <div class="mb-3">
            <label for="participantType" class="form-label">
              Types participants concerne
            </label>
            <Multiselect
              v-model="selectedParticipantType"
              :options="participantType"
              label="name"
              valueProp="id"
              mode="tags"
              placeholder="Selectionner les types de participants"
            />
          </div>
          <div class="mb-3">
            <input
              name="dependent"
              type="checkbox"
              class="form-check-input bg-secondary border-0 mr-2"
              id="dependent"
              v-model="dependent"
            />
            <label for="dependent" class="form-label"
              >Dépend d'autre question</label
            >
          </div>
          <div class="mb-3" v-if="dependent">
            <label for="dependent" class="form-label">Question</label>
            <Field
              class="form-select"
              id="dependentQuestion"
              as="select"
              name="dependentQuestion"
              v-model="selectedQuestion"
            >
              <option
                v-for="question in showedQuestions"
                :key="question.id"
                :value="question.id"
              >
                {{ question.title }}
              </option>
            </Field>
          </div>
          <div class="mb-3" v-if="dependent">
            <label for="choices" class="form-label">Possible choices</label>
            <Field
              name="choices"
              as="select"
              class="form-select"
              id="choices"
              v-model="selectedChoice"
            >
              <option
                v-for="choice in questionChoices"
                :key="choice.id"
                :value="choice.id"
              >
                {{ choice.name }}
              </option>
            </Field>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <BButton
              class="w-100 me-2 text-black border-0"
              @click="showOffcanvas = false"
              style="background-color: #f3f6f9"
            >
              Annuler
            </BButton>
            <BButton type="submit" variant="secondary" class="w-100">
              Confirmer
            </BButton>
          </div>
        </Form>
      </div>
    </Simplebar>
  </BOffcanvas>
</template>
