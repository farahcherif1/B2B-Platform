<script>
import "@vueform/multiselect/themes/default.css";
import Lottie from "@/components/widgets/lottie.vue";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";
import "flatpickr/dist/flatpickr.css";
import addField from "./add-field.vue";
import addParticipantType from "./add-participantType.vue";
import EventFormService from "../../services/even-form.service";
import UpdateField from "./update-field.vue";
export default {
  data() {
    return {
      showAddField: false,
      showParticiapntsType: false,
      status: null,
      page: 1,
      perPage: 8,
      pages: [],
      statuscategory: "All",
      application: [],
      defaultOptions: { animationData: animationData },
      defaultOptions1: { animationData: animationData1 },
      deleteModal: false,
      fieldId: null,
      showUpdateField: false,
      selectedFieldId: null
    };
  },
  mounted() {
    const eventID = this.$route.params.id;
    EventFormService.getFields(eventID)
      .then(response => {
        this.application = response.data;
      })
      .catch(error => {
        if (error.status == 403) {
          this.$router.push({ path: "/signin-organizer" });
        }
      });
  },
  computed: {
    displayedPosts() {
      return this.paginate(this.application);
    },
    resultQuery() {
      return this.displayedPosts;
    }
  },
  watch: {
    application() {
      this.setPages();
    }
  },
  created() {
    this.setPages();
  },
  methods: {
    setPages() {
      let numberOfPages = Math.ceil(this.application.length / this.perPage);
      this.pages = [];
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(application) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return application.slice(from, to);
    },
    editField(fieldId) {
      this.selectedFieldId = fieldId;
      this.showUpdateField = true;
    },
    handleFieldUpdated(updatedField) {
      const index = this.application.findIndex(
        field => field.id === updatedField.id
      );
      if (index !== -1) {
        this.application.splice(index, 1, updatedField);
      }
    },

    onSort(column) {
      this.direction = this.direction === "asc" ? "desc" : "asc";
      const sortedArray = [...this.application];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === "asc" ? res : -res;
      });
      this.application = sortedArray;
    },

    deleteData() {
      EventFormService.deleteField(this.fieldId)
        .then(() => {
          this.application = this.application.filter(
            item => item.id !== this.fieldId
          );
        })
        .catch(error => {
          console.log(error);
        });
      this.deleteModal = false;
    },

    confirmDelete(fieldId) {
      this.fieldId = fieldId;
      this.deleteModal = true;
    }
  },
  components: {
    lottie: Lottie,
    addField,
    addParticipantType,
    updateField: UpdateField
  }
};
</script>

<template>
  <add-field v-model="showAddField" :eventId="$route.params.id" />
  <add-participantType v-model="showParticiapntsType" />
  <update-field
    v-model="showUpdateField"
    :eventId="$route.params.id"
    :fieldId="selectedFieldId"
    @field-updated="handleFieldUpdated"
  />
  <BRow>
    <BCol lg="12">
      <BCard no-body id="applicationList">
        <BCardHeader class="border-0 mb-3">
          <div class="d-md-flex align-items-center">
            <h5 class="card-title mb-3 mb-md-0 flex-grow-1">
              Questions personnalises
            </h5>
            <div class="flex-shrink-0">
              <div class="d-flex gap-1 flex-wrap">
                <BButton
                  class="bg-white text-secondary border-secondary border-1"
                  variant="light"
                  @click="showParticiapntsType = true"
                >
                  Types paticipants
                </BButton>

                <div class="vr mx-2 border-secondary border-1"></div>
                <BButton
                  type="button"
                  class="add-btn"
                  variant="success"
                  id="create-btn"
                  @click="showAddField = true"
                >
                  <i class="ri-add-line align-bottom me-1"></i>
                  Ajouter
                </BButton>
              </div>
            </div>
          </div>
        </BCardHeader>

        <BCardBody class="pt-0">
          <div>
            <div class="table-responsive table-card mb-1">
              <table class="table table-nowrap align-middle" id="jobListTable">
                <thead class="text-muted table-light">
                  <tr class="text-uppercase">
                    <th class="sort" data-sort="title" @click="onSort('title')">
                      Titre
                    </th>
                    <th
                      class="sort"
                      data-sort="questionType"
                      @click="onSort('questionType')"
                    >
                      type question
                    </th>
                    <th
                      class="sort"
                      data-sort="participantType"
                      @click="onSort('participantType')"
                    >
                      type participant
                    </th>
                    <th
                      class="sort"
                      data-sort="required"
                      @click="onSort('required')"
                    >
                      obligatoire
                    </th>

                    <th class="sort" data-sort="city" @click="onSort('action')">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="list form-check-all"
                  v-for="(data, index) of resultQuery"
                  :key="index"
                >
                  <tr
                    v-if="
                      statuscategory == 'All' || statuscategory == data.status
                    "
                  >
                    <td class="company">
                      {{ data.title }}
                    </td>
                    <td class="designation">{{ data.type }}</td>
                    <td class="date">
                      {{
                        data.participantsType?.map(pt => pt.name).join(" + ")
                      }}
                    </td>
                    <td class="contacts">
                      {{ data.required ? "Oui" : "Non" }}
                    </td>

                    <td>
                      <ul class="list-inline hstack gap-2 mb-0">
                        <li
                          class="list-inline-item"
                          data-bs-toggle="tooltip"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          @click="editField(data.id)"
                          title="View"
                        >
                          <BLink
                            class="text-primary d-inline-block edit-item-btn"
                          >
                            <i class="ri-eye-fill fs-16"></i>
                          </BLink>
                        </li>
                        <li
                          class="list-inline-item edit"
                          data-bs-toggle="tooltip"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          title="Edit"
                          @click="editField(data.id)"
                        >
                          <BLink
                            class="text-primary d-inline-block edit-item-btn"
                          >
                            <i class="ri-pencil-fill fs-16"></i>
                          </BLink>
                        </li>
                        <li
                          class="list-inline-item"
                          data-bs-toggle="tooltip"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          title="Remove"
                        >
                          <BLink
                            class="text-danger d-inline-block remove-item-btn"
                            @click="confirmDelete(data.id)"
                          >
                            <i class="ri-delete-bin-5-fill fs-16"></i>
                          </BLink>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="noresult" v-if="resultQuery.length < 1">
                <div class="text-center">
                  <lottie
                    class="avatar-xl"
                    colors="primary:#121331,secondary:#08a88a"
                    :options="defaultOptions"
                    :height="75"
                    :width="75"
                  />
                  <h5 class="mt-2">Sorry! No Result Found</h5>
                </div>
              </div>
            </div>
            <div
              class="d-flex justify-content-end"
              v-if="resultQuery.length >= 1"
            >
              <div class="pagination-wrap hstack gap-2">
                <BLink
                  class="page-item pagination-prev text-secondary"
                  href="#"
                  :disabled="page <= 1"
                  @click="page--"
                >
                  Previous
                </BLink>
                <ul class="pagination listjs-pagination mb-0">
                  <li
                    :class="{
                      active: pageNumber == page,
                      disabled: pageNumber == '...'
                    }"
                    v-for="(pageNumber, index) in pages"
                    :key="index"
                    @click="page = pageNumber"
                  >
                    <BLink
                      class="page text-secondary"
                      :class="{
                        'bg-secondary border-secondary text-white':
                          pageNumber == page
                      }"
                      href="#"
                      >{{ pageNumber }}</BLink
                    >
                  </li>
                </ul>
                <BLink
                  class="page-item pagination-next text-secondary"
                  href="#"
                  :disabled="page >= pages.length"
                  @click="page++"
                >
                  Next
                </BLink>
              </div>
            </div>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>

  <BModal
    v-model="deleteModal"
    body-class="p-5 text-center"
    modal-class="flip"
    hide-footer
    no-close-on-backdrop
    centered
  >
    <div class="text-center">
      <div class="text-danger">
        <lottie
          class="avatar-xl"
          colors="primary:#405189,secondary:#f06548"
          :options="defaultOptions1"
          :height="75"
          :width="75"
        />
      </div>
      <div class="mt-4">
        <h3 class="mb-2">You are about to delete a order ?</h3>
        <p class="text-muted fs-lg mx-3 mb-0">
          Deleting your order will remove all of your information from our
          database.
        </p>
      </div>
    </div>
    <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
      <BButton
        type="button"
        variant="light"
        class="w-sm btn-hover"
        @click="deleteModal = false"
        >Close</BButton
      >
      <BButton
        type="button"
        variant="danger"
        class="w-sm btn-hover"
        id="delete-record"
        @click="deleteData"
        >Yes,Delete It!</BButton
      >
    </div>
  </BModal>
</template>
