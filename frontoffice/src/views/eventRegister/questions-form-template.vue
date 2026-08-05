<script>
import "flatpickr/dist/flatpickr.css";
import "@vueform/multiselect/themes/default.css";
import { InputType } from "../../enum/enums";

export default {
  name: "QuestionsRegisterFormTemplate",
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
      default: () => ({}),
    },
  },
  emits: ["Suivant"],
  data() {
    return {
      previousRegistrationLocal: { Questions: {} },
      selectedChoices: [],
    };
  },
  computed: {
    InputType() {
      return InputType;
    },
  },
  methods: {
    canBeVisisble(fieldId, dependOnChoice) {
      if (typeof this.previousRegistrationLocal.Questions !== "object") {
        return false;
      }
      if (dependOnChoice) {
        const res = this.selectedChoices.includes(dependOnChoice.id);
        if (!res) {
          this.previousRegistrationLocal.Questions[fieldId] = null;
        }
          // added by moncef to bypass the dependOnChoice
        return res;
      }
      return true;
    },
    handleNextStep() {
      let canPass = true;
      for (const item of this.form) {
        if (item.required) {
          const answer = this.previousRegistrationLocal.Questions[item.id];
          if (
            answer === undefined ||
            answer === null ||
            answer === "" ||
            (Array.isArray(answer) && answer.length === 0)
          ) {
            canPass = false;
            break;
          }
        }
      }
      this.previousRegistrationLocal.Questions = JSON.stringify(
        this.previousRegistrationLocal.Questions
      );

      if (canPass) this.$emit("Suivant", this.previousRegistrationLocal);
    },
    updateQuestionResponse(item, response) {
      const questionId = item.id;
      if (!this.previousRegistrationLocal.Questions) {
        this.previousRegistrationLocal.Questions = {};
      }
      if (item.type === "Text") {
        this.previousRegistrationLocal.Questions[questionId] = response;
      } else if (item.type === "Multiple Choice" || item.type === "Checkbox") {
        if (!this.previousRegistrationLocal.Questions[questionId]) {
          this.previousRegistrationLocal.Questions[questionId] = [];
        }
        const index = this.previousRegistrationLocal.Questions[
          questionId
        ].findIndex((choice) => {
          return choice.id == response.id;
        });
        if (index === -1) {
          if (item.type === "Checkbox") {
            const previousChoice =
              this.previousRegistrationLocal.Questions[questionId][0];

            this.previousRegistrationLocal.Questions[questionId] = [response];
            this.selectedChoices = this.selectedChoices.filter(
              (choice) => choice !== previousChoice.id
            );
          } else {
            this.previousRegistrationLocal.Questions[questionId].push(response);
          }
          this.selectedChoices.push(response.id);
        } else {
          this.previousRegistrationLocal.Questions[questionId].splice(index, 1);
          this.selectedChoices = this.selectedChoices.filter(
            (choice) => choice !== response.id
          );
        }
      }
    },
    isChipSelected(item, option) {
      return this.selectedChoices.includes(option.id);
    },
  },
  mounted() {
    this.previousRegistrationLocal = { ...this.previousRegistration };
    console.log(this.previousRegistrationLocal.Questions);
    
    if (!this.previousRegistrationLocal.Questions) {
      this.previousRegistrationLocal.Questions = {};
    } else {
      try {
        let parsedData = JSON.parse(this.previousRegistrationLocal.Questions);

        if (typeof parsedData.questions === "string") {
          this.previousRegistrationLocal.Questions = JSON.parse(
            parsedData.questions
          );
        } else {
          this.previousRegistrationLocal.Questions = parsedData.questions;
        }

        for (let key in this.previousRegistrationLocal.Questions) {
          if (!this.form.find((item) => item.id == key)) {
            delete this.previousRegistrationLocal.Questions[key];
          }
        }

        this.selectedChoices = [];
        for (let key in this.previousRegistrationLocal.Questions) {
          const response = this.previousRegistrationLocal.Questions[key];
          if (Array.isArray(response)) {
            response.forEach((choice) => {
              if (choice.id) {
                this.selectedChoices.push(choice.id);
              }
            });
          }
        }
      } catch (e) {
        this.previousRegistrationLocal.Questions = {};
      }
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Basic Elements" pageTitle="Forms" />
    <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardBody>
            <div class="live-preview">
              <BRow class="gy-4">
                <BCol
                  v-for="(item, index) in form"
                  :key="index"
                  xxl="12"
                  md="12"
                >
                  <div
                    v-if="
                      item.type == InputType.TEXT &&
                      canBeVisisble(item.id, item.dependOnChoice)
                    "
                  >
                    <label :for="item.id" class="form-label">
                      {{ `${item.title}${item.required ? "*" : ""}` }}
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      :id="item.id"
                      :placeholder="item.placeholder"
                      :required="item.required"
                      :value="previousRegistrationLocal.Questions[item.id]"
                      @input="updateQuestionResponse(item, $event.target.value)"
                    />
                  </div>

                  <div
                    v-if="
                      (item.type == InputType.MULTISELECT ||
                        item.type == InputType.CHECKBOX) &&
                      canBeVisisble(item.id, item.dependOnChoice)
                    "
                  >
                    <label :for="item.id" class="form-label">
                      {{ `${item.title}${item.required ? "*" : ""}` }}
                    </label>

                    <div
                      class="chip-container d-flex flex-wrap gap-2 p-2 border-0"
                    >
                      <span
                        v-for="(option, index) in item.choices"
                        :key="index"
                        class="badge rounded-pill px-3 py-2 cursor-pointer"
                        :class="
                          isChipSelected(item, option)
                            ? 'bg-secondary text-white'
                            : 'bg-light text-dark'
                        "
                        @click="updateQuestionResponse(item, option)"
                      >
                        {{ option.name }}
                      </span>
                    </div>
                  </div>

                  <p
                    v-if="
                      item.required &&
                      (previousRegistrationLocal.Questions[item.id] ===
                        undefined ||
                        previousRegistrationLocal.Questions[item.id] === '' ||
                        (Array.isArray(
                          previousRegistrationLocal.Questions[item.id]
                        ) &&
                          previousRegistrationLocal.Questions[item.id]
                            .length === 0))
                    "
                    class="text-danger"
                  >
                    Ce champ est obligatoire
                  </p>
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
