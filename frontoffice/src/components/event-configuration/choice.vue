<template>
  <div>
    <label for="choix" class="form-label"> Choix </label>
    <div class="border p-2">
      <div
        v-for="(item, index) in localChoix"
        :key="index"
        class="d-flex align-items-center mb-2"
      >
        <i class="mdi mdi-equal me-2"></i>
        <span class="flex-grow-1">{{ item.name }}</span>

        <BLink
          class="text-primary d-inline-block edit-item-btn me-2"
          @click="startUpdate(item, index)"
        >
          <i class="ri-pencil-fill fs-16"></i>
        </BLink>

        <BLink
          class="text-danger d-inline-block remove-item-btn"
          @click="confirmDelete(item.id)"
        >
          <i class="ri-delete-bin-5-fill fs-16"></i>
        </BLink>
      </div>

      <div class="mt-2">
        <i
          class="mdi mdi-plus"
          @click="showNewChoiceInput = !showNewChoiceInput"
        ></i>
        <div v-if="showNewChoiceInput">
          <input
            type="text"
            class="form-control"
            v-model="choixValue"
            placeholder="Ajouter un choix..."
          />
          <BButton class="btn btn-primary mt-2" @click="addChoice(choixValue)"
            >Ajouter</BButton
          >
        </div>
      </div>

      <div v-if="isUpdating" class="mt-2">
        <input
          type="text"
          class="form-control"
          v-model="updatedChoiceValue"
          placeholder="Modifier le choix..."
        />
        <BButton class="btn btn-primary mt-2 me-2" @click="updateChoice"
          >Modifier</BButton
        >
        <BButton class="btn btn-secondary mt-2" @click="cancelUpdate"
          >Annuler</BButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { BButton, BLink } from "bootstrap-vue-next";
import EventFormService from "../../services/even-form.service";

export default {
  components: {
    BButton,
    BLink,
  },
  props: {
    choix: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localChoix: [...this.choix],
      showNewChoiceInput: false,
      choixValue: "",
      isUpdating: false,
      updatedChoiceValue: "",
      updatingIndex: null,
    };
  },
  watch: {
    choix: {
      immediate: true,
      handler(newVal) {
        this.localChoix = [...newVal];
      },
    },
  },
  methods: {
    addChoice(choice) {
      EventFormService.createChoice(choice).then((response) => {
        const newChoix = [...this.localChoix, response.data];
        this.$emit("update:choix", newChoix);
        this.showNewChoiceInput = false;
        this.choixValue = "";
      });
    },

    startUpdate(item, index) {
      this.isUpdating = true;
      this.updatedChoiceValue = item.name;
      this.updatingIndex = index;
    },

    updateChoice() {
      const updatedChoice = {
        ...this.localChoix[this.updatingIndex],
        name: this.updatedChoiceValue,
      };

      EventFormService.updateChoice(updatedChoice).then(() => {
        const newChoix = [...this.localChoix];
        newChoix.splice(this.updatingIndex, 1, updatedChoice);
        this.$emit("update:choix", newChoix);
        this.isUpdating = false;
        this.updatedChoiceValue = "";
        this.updatingIndex = null;
      });
    },

    // Cancel the update process
    cancelUpdate() {
      this.isUpdating = false;
      this.updatedChoiceValue = "";
      this.updatingIndex = null;
    },

    confirmDelete(choiceId) {
      if (confirm("Êtes-vous sûr de vouloir supprimer ce choix ?")) {
        EventFormService.deleteChoice(choiceId).then(() => {
          const newChoix = this.localChoix.filter(
            (item) => item.id !== choiceId
          );
          this.$emit("update:choix", newChoix);
        });
      }
    },
  },
};
</script>

<style scoped>
.edit-item-btn,
.remove-item-btn {
  cursor: pointer;
}
</style>
