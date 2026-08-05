<script>
import Vertical from "@/layouts/vertical.vue";
import EventService from "../../services/event.service";
import { MonthEnum } from "../../enum/enums";
import Swal from "sweetalert2";
import FicheParticipant from "../participation-list/fiche-participant.vue";
import AuthService from "../../services/auth.service";

export default {
  name: "OrganizerList",
  data() {
    return {
      showFiche: false,
      filter: {
        page: 1,
        limit: 6,
        searchQuery: null,
        createDate: null,
        curentparticipant: {},

        role: "All",
        Pays: "All",
      },
      data: [],
      Organizers: [],
      nbPage: 1,
      itemsPerPage: 6,
      total: null,
      months: Object.values(MonthEnum),
      curentparticipant: {},
      checkClicked: false,
      allChecked: false,
    };
  },
  components: {
    Vertical,
    FicheParticipant,
  },

  async mounted() {
    await EventService.getOrganizers(this.$route.params.id).then((response) => {
      this.Organizers = response.data?.data;
    });
  },

  computed: {
    displayedPosts() {
      return this.paginate(this.Organizers);
    },
  },
  watch: {
    posts() {
      this.setPages();
    },
  },
  created() {
    this.setPages();
  },
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },

  methods: {
    deleteOrganizer(organizer) {
      Swal.fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
      }).then((result) => {
        if (result.value) {
          EventService.deleteOrganizer(organizer.id).then(() => {
            Swal.fire("Supprimé!", "L'organisateur a été supprimé.", "success");
            this.Organizers = this.Organizers.filter(
              (item) => item.id !== organizer.id
            );
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            "Annulé",
            "L'organisateur n'a pas été supprimé :)",
            "error"
          );
        }
      });
    },
    inviteOrganizer() {
      Swal.fire({
        title: "Invitation d'organisateur",
        html: `
            <input type="email" id="swal-input1" class="swal2-input" placeholder="Email de l'utilisateur">
            <select multiple id="swal-select-roles" class="form-control mt-3">
              <option value="OWNER">Administrateur</option>
              <option value="moderator">Modérateur</option>
              <option value="editor">Éditeur</option>
            </select>
          `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Inviter",
        cancelButtonText: "Annuler",
        preConfirm: () => {
          const email = document.getElementById("swal-input1").value;
          const roles = Array.from(
            document.querySelectorAll("#swal-select-roles option:checked")
          ).map((option) => option.value);

          if (!email) {
            Swal.showValidationMessage("L'email est obligatoire");
            return false;
          }
          const data = {
            email: email,
            eventId: this.$route.params.id,
            roles: roles,
          };

          return AuthService.inviteOrganizer(data)
            .then((response) => ({ email, roles, response }))
            .catch((error) => {
              Swal.showValidationMessage(`Erreur: ${error.message}`);
            });
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Invitation envoyée!",
            html: `Email: ${result.value.email}<br>
                    Rôles: ${result.value.roles.join(", ")}`,
          });
        }
      });
    },

    async Filter() {
      await EventService.getOrganizers(this.$route.params.id, this.filter).then(
        (response) => {
          this.Organizers = response.data;
        }
      );
    },

    checkAll() {
      let checkboxes = document.querySelectorAll("input[type=checkbox]");
      if (checkboxes[0].checked) {
        for (let index = 1; index < checkboxes.length; index++) {
          checkboxes[index].checked = true;
        }
        this.allChecked = true;
      } else {
        for (let index = 1; index < checkboxes.length; index++) {
          checkboxes[index].checked = false;
        }
        this.allChecked = false;
      }
    },
    replaceDate(date) {
      if (!date) {
        return "";
      }
      date = date.slice(0, 10);
      date = date.split("-");
      return `${date[2]} ${this.months[parseInt(date[1]) - 1]} ${date[0]}`;
    },
    handelClick(participant) {
      if (!this.checkClicked) {
        this.curentparticipant = participant;
        this.showFiche = true;
      }
      this.checkClicked = false;
    },

    clickOnCheck() {
      this.checkClicked = true;
      let checkboxes = document.querySelectorAll("input[type=checkbox]");
      let checked = true;
      for (let index = 1; index < checkboxes.length; index++) {
        if (!checkboxes[index].checked) {
          checked = false;
          break;
        }
      }
      if (checked) {
        checkboxes[0].checked = true;
      } else {
        checkboxes[0].checked = false;
      }
    },

    setPages() {
      let numberOfPages = Math.ceil(this.Organizers.length / this.perPage);
      this.pages = [];
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(data) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return data.slice(from, to);
    },
    onSort(column) {
      this.direction = this.direction === "asc" ? "desc" : "asc";
      const sortedArray = [...this.Organizers];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === "asc" ? res : -res;
      });
      this.Organizers = sortedArray;
    },
  },
};
</script>

<template>
  <Vertical>
    <FicheParticipant
      :show="showFiche"
      @close="showFiche = false"
      :currentParticipant="curentparticipant"
    >
    </FicheParticipant>

    <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardBody>
            <BRow class="align-items-center">
              <BCol sm="6" class="align-items-center">
                <BRow class="align-items-center">
                  <BCol sm="4">
                    <h5 class="mb-0">Liste des organisateurs</h5>
                  </BCol>
                  <BCol sm="4">
                    <BButton
                      variant="outline-danger"
                      class="waves-effect waves-light d-flex align-items-center"
                      @click="inviteOrganizer"
                    >
                      <i
                        class="mdi mdi-account-plus-outline text-base mr-2"
                      ></i>

                      Invite
                    </BButton>
                  </BCol>
                </BRow>
              </BCol>
            </BRow>
            <BRow class="mt-3 justify-content-between">
              <BCol lg="5" sm="12">
                <div>
                  <input
                    type="text"
                    class="form-control"
                    id="search"
                    placeholder="Rechercher par ID, nom du participant, ..."
                    v-model="filter.searchQuery"
                  />
                </div>
              </BCol>
              <BCol lg="2">
                <div>
                  <input
                    type="date"
                    class="form-control"
                    id="Select date"
                    placeholder="select date"
                    v-model="filter.createDate"
                  />
                </div>
              </BCol>
              <BCol lg="2">
                <select
                  class="form-select mb-3"
                  aria-label=".form-select-lg example"
                  v-model="filter.role"
                >
                  <option value="All">All</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </BCol>
              <BCol lg="2">
                <select
                  class="form-select mb-3"
                  aria-label=".form-select-lg example"
                  v-model="filter.Pays"
                >
                  <option value="All">All</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </BCol>
              <BCol lg="1">
                <BButton
                  variant="success"
                  class="waves-effect waves-light w-full"
                  @click="Filter"
                >
                  <i class="ri-equalizer-fill me-2 align-bottom d-block"></i>

                  Filter
                </BButton>
              </BCol>
            </BRow>
            <BRow>
              <BCol sm="12">
                <BCard no-body>
                  <BCardBody>
                    <div class="table-responsive table-card">
                      <table
                        class="table table-hover table-borderless table-centered align-middle table-nowrap mb-0"
                      >
                        <thead class="table-light text-muted">
                          <tr>
                            <th scope="col" style="width: 46px">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="cardtableCheck"
                                  @click="checkAll"
                                  :checked="allChecked"
                                />
                                <label
                                  class="form-check-label"
                                  for="cardtableCheck"
                                ></label>
                              </div>
                            </th>
                            <th
                              class="sort"
                              data-sort="currency_name"
                              scope="col"
                              @click="onSort('id')"
                            >
                              ID
                            </th>
                            <th
                              class="sort"
                              data-sort="current_value"
                              scope="col"
                              @click="onSort('name')"
                            >
                              ORGANIZER
                            </th>
                            <th
                              class="sort"
                              data-sort="high"
                              scope="col"
                              @click="onSort('createdAt')"
                            >
                              CREATE DATE
                            </th>
                            <th
                              class="sort"
                              data-sort="low"
                              scope="col"
                              @click="onSort('Pays')"
                            >
                              PAYS
                            </th>
                            <th
                              class="sort"
                              data-sort="market_cap"
                              scope="col"
                              @click="onSort('Ville')"
                            >
                              ROLE
                            </th>
                            <th
                              class="sort"
                              data-sort="market_cap"
                              scope="col"
                              @click="onSort('country')"
                            >
                              ACTION
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(organizer, index) in this.Organizers"
                            :key="index"
                          >
                            <td>
                              <div class="form-check" @click="clickOnCheck">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="cardtableCheck01"
                                />
                                <label
                                  class="form-check-label"
                                  for="cardtableCheck01"
                                ></label>
                              </div>
                            </td>
                            <td>
                              <p class="fw-medium link-primary m-0">
                                #{{ organizer.id }}
                              </p>
                            </td>
                            <td>
                              <div class="d-flex align-items-center">
                                <div class="flex-shrink-0 me-2">
                                  <img
                                    src="@/assets/images/users/avatar-1.jpg"
                                    alt=""
                                    class="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div class="flex-grow-1">
                                  {{ organizer.name }}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span class="text-success">{{
                                replaceDate(organizer.createdAt)
                              }}</span>
                            </td>
                            <td>{{ organizer.Pays }}</td>
                            <td>
                              <BRow
                                v-for="(userRole, index) in organizer.userRoles"
                                :key="index"
                              >
                                <BCol sm="8">
                                  <BBadge
                                    variant="success-subtle"
                                    class="bg-success-subtle text-success"
                                    >{{ userRole.role.name }}</BBadge
                                  >
                                </BCol>
                              </BRow>
                            </td>

                            <td>
                              <i
                                @click="handelClick(organizer)"
                                class="ri-eye-fill me-2 align-bottom text-muted cursor-pointer"
                              ></i>
                              <i
                                @click="deleteOrganizer(organizer)"
                                class="ri-delete-bin-5-fill me-2 align-bottom text-muted cursor-pointer"
                              ></i>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
            <BRow>
              <BPagination
                v-if="this.total > itemsPerPage"
                v-model="nbPage"
                pills
                :total-rows="this.total"
                :per-page="itemsPerPage"
                prev-text="Previous"
                next-text="Next"
                hide-goto-end-buttons="true"
                class="pagination-separated d-flex-wrap m-5 mt-0"
              />
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Vertical>
</template>

<style></style>
