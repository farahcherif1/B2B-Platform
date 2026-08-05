<script>
import { BButton, BOffcanvas, BLink } from "bootstrap-vue-next";
import Simplebar from "simplebar-vue";
import EventFormService from "../../services/even-form.service";
import Multiselect from "@vueform/multiselect";

export default {
  components: {
    BOffcanvas,
    Simplebar,
    BButton,
    BLink,
    Multiselect,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      table: [],
      adding: false,
      editingIndex: null, // Tracks which row is being edited
      editedItem: {
        id: null,
        name: "",
        relatedParticipants: [],
      },
      newParticipantType: {
        name: "",
        relatedParticipants: [],
      },
    };
  },
  computed: {
    showOffcanvas: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
    participantsOptions() {
      return this.table.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    },
  },
  mounted() {
    EventFormService.getParticipantsTypes(this.$route.params.id).then(
      (response) => {
        this.table = response.data;
      }
    );
  },
  methods: {
    startEditing(index) {
      this.editingIndex = index;
      this.editedItem = { ...this.table[index] };
    },
    saveEdit(index) {
      this.table[index] = { ...this.editedItem };
      this.editingIndex = null;

      EventFormService.updateParticipantType(this.editedItem).then(
        (response) => {
          this.table = this.table.map((item) => {
            if (item.id === response.data.id) {
              return response.data;
            }
            return item;
          });
        }
      );
    },
    cancelEdit() {
      this.editingIndex = null;
    },
    addTypeOfParticipant() {
      EventFormService.addParticipantType(
        this.$route.params.id,
        this.newParticipantType
      ).then((response) => {
        this.table.push(response.data);
        this.newParticipantType = {
          name: "",
          relatedParticipants: [],
        };
        this.adding = false;
      });
    },
    deleteItem(id) {
      EventFormService.deleteParticipantType(id).then(() => {
        this.table = this.table.filter((item) => item.id !== id);
      });
    },
  },
};
</script>
<template>
  <BOffcanvas
    @update:modelValue="$emit('update:modelValue', $event)"
    style="width: 30%"
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
        <h5 class="m-0 me-2 text-white">Gestion des types</h5>
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
      <div class="table-responsive table-card m-2 mt-4">
        <table class="table table-nowrap align-middle">
          <thead class="text-muted table-might">
            <tr class="text-uppercase">
              <th class="sort">id</th>
              <th class="sort w-25">type</th>
              <th class="sort">peut interagir avec</th>
              <th class="sort">action</th>
            </tr>
          </thead>
          <tbody class="list">
            <tr v-for="(item, index) in table" :key="index">
              <td>{{ item.id }}</td>
              <td>
                <input
                  v-if="editingIndex === index"
                  type="text"
                  class="form-control"
                  v-model="editedItem.name"
                />
                <span v-else>{{ item.name }}</span>
              </td>
              <td>
                <Multiselect
                  v-if="editingIndex === index"
                  v-model="editedItem.relatedParticipants"
                  :options="participantsOptions"
                  mode="tags"
                  label="label"
                  valueProp="value"
                  placeholder="Peut interagir avec.."
                />
                <div v-else class="d-flex truncate-text">
                  {{
                    item.relatedParticipants
                      .map((interact) => interact.name)
                      .join(" + ")
                  }}
                </div>
              </td>
              <td>
                <div class="d-flex">
                  <li
                    v-if="editingIndex !== index"
                    class="list-inline-item edit"
                    @click="startEditing(index)"
                  >
                    <BLink class="d-inline-block edit-item-btn">
                      <i class="ri-pencil-fill fs-16"></i>
                    </BLink>
                  </li>
                  <li
                    v-if="editingIndex !== index"
                    class="list-inline-item edit"
                    @click="deleteItem(item.id)"
                  >
                    <BLink class="text-primary d-inline-block edit-item-btn">
                      <i class="ri-delete-bin-5-fill fs-16"></i>
                    </BLink>
                  </li>

                  <li
                    v-if="editingIndex === index"
                    class="list-inline-item edit"
                  >
                    <BLink
                      class="text-success d-inline-block"
                      @click="saveEdit(index)"
                    >
                      <i class="ri-check-fill fs-16"></i>
                    </BLink>
                  </li>
                  <li v-if="editingIndex === index" class="list-inline-item">
                    <BLink
                      class="text-danger d-inline-block"
                      @click="cancelEdit"
                    >
                      <i class="ri-close-fill fs-16"></i>
                    </BLink>
                  </li>
                </div>
              </td>
            </tr>

            <tr v-if="adding">
              <td></td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  v-model="newParticipantType.name"
                  placeholder="Nom du type"
                />
              </td>
              <td>
                <Multiselect
                  v-model="newParticipantType.relatedParticipants"
                  :options="participantsOptions"
                  mode="tags"
                  label="label"
                  valueProp="value"
                  placeholder="Peut interagir avec.."
                />
              </td>
              <td>
                <div class="d-flex">
                  <li
                    class="list-inline-item edit"
                    @click="addTypeOfParticipant"
                  >
                    <BLink class="text-success d-inline-block">
                      <i class="ri-checkbox-circle-fill fs-16"></i>
                    </BLink>
                  </li>
                  <li class="list-inline-item" @click="adding = false">
                    <BLink class="text-red d-inline-block">
                      <i class="ri-close-circle-fill fs-16"></i>
                    </BLink>
                  </li>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-content-end p-4">
          <BButton
            class="btn"
            @click="adding = true"
            style="
              background-color: #daf4f0;
              color: #0ab39c;
              border: 1px solid #0ab39c;
            "
          >
            <i class="ri-add-circle-fill fs-16 mr-3"></i> Ajouter
          </BButton>
        </div>
      </div>
    </Simplebar>
  </BOffcanvas>
</template>
