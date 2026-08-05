<script>
import EventFormService from "../../services/even-form.service";
import EventService from "../../services/event.service";
import Horizontal from "./nav-bar.vue";
import { MonthEnum } from "@/enum/enums.js";

export default {
  name: "UserProfile",
  components: {
    Horizontal,
  },
  data() {
    return {
      currentApplication: {},
      questions: [],
      months: Object.values(MonthEnum),
    };
  },
  async mounted() {
    this.currentApplication = await EventService.getApplication(
      this.$route.params.idApplication
    );
    const parsedData = JSON.parse(this.currentApplication.Questions);

    this.questions = JSON.parse(parsedData.questions);
    let ids = [];
    Object.keys(this.questions).forEach((key) => {
      ids.push(key);
    });
    ids.join(",");
    console.log(ids);
    console.log(this.questions);
    await EventFormService.getFieldsByIds(ids).then((response) => {
      for (let i = 0; i < response?.data.length; i++) {
        this.questions[response.data[i].title] =
          this.questions[response.data[i].id];
        delete this.questions[response.data[i].id];
        if (this.questions[response.data[i].title].length == 0) {
          delete this.questions[response.data[i].title];
        }
      }
    });
  },
  methods: {
    replaceDate(date) {
      try {
        date = date.slice(0, 10);
        date = date.split("-");
      } catch (e) {
        return "Invalid Date";
      }
      return `${date[2]} ${this.months[parseInt(date[1]) - 1]} ${date[0]}`;
    },
  },
};
</script>

<template>
  <Horizontal />
  <BRow class="mt-3 justify-content-center">
    <BCol sm="3">
      <BCard no-body>
        <BCardBody>
          <BRow>
            <BCol sm="3">
              <button>
                <img src="@/assets/images/svg/configuration-btn.svg" alt="" />
              </button>
            </BCol>
          </BRow>
          <BRow class="m-3 justify-content-center">
            <BCol sm="6">
              <img
                class="rounded-circle avatar-2xl"
                alt="200x200"
                src="@/assets/images/users/avatar-4.jpg"
                data-holder-rendered="true"
              />
            </BCol>
          </BRow>
          <BRow class="justify-content-center">
            <BCol sm="10" class="text-center mr-5">
              <ul>
                <li>
                  <h2 class="font-medium">
                    {{ this.currentApplication.FirstName }}
                    {{ this.currentApplication.LastName }}
                  </h2>
                </li>
                <li>
                  <h5 class="font-thin">
                    {{ this.currentApplication.Function }}
                  </h5>
                </li>
              </ul>
            </BCol>
          </BRow>
          <BRow class="m-3 justify-content-center">
            <BCol sm="10">
              <table
                class="align-middle table-nowrap table-striped-columns mb-0"
                v-if="this.currentApplication"
              >
                <tbody>
                  <tr class="align-middle">
                    <td>
                      <h5 class="font-size-14 mb-4">Mobile:</h5>
                    </td>
                    <td>
                      <p class="text-muted mb-4 ml-3">
                        {{ currentApplication.PhoneNumber }}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5 class="font-size-14 mb-4 mt-4">E-mail:</h5>
                    </td>
                    <td>
                      <p class="text-muted mb-4 mt-4 ml-3">
                        {{ this.currentApplication.Email || "email@gmail.com" }}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5 class="font-size-14 mb-4 mt-4">Location:</h5>
                    </td>
                    <td>
                      <p class="text-muted mb-4 mt-4 ml-3">
                        {{ this.currentApplication.Ville }}
                      </p>
                    </td>
                  </tr>
                  <tr class="align-middle">
                    <td>
                      <h5 class="font-size-14 mb-4 mt-4">Joining date:</h5>
                    </td>
                    <td>
                      <p class="text-muted mb-4 mt-4 ml-3">
                        {{
                          replaceDate(this.currentApplication.DateInscription)
                        }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </BCol>
          </BRow>

          <BRow class="mb-3">
            <BCol sm="12" class="text-center">
              <BButton
                variant="outline-danger"
                class="waves-effect waves-light"
              >
                <i class="ri-calendar-line mr-2"></i>
                Mon agenda
              </BButton>
            </BCol>
          </BRow>
        </BCardBody>
      </BCard>
    </BCol>

    <BCol sm="8">
      <BCard no-body>
        <BCardBody class="p-5">
          <h3 class="mb-2">
            {{ this.currentApplication.OrganisationName }}
          </h3>
          <p class="font-normal text-sm">
            {{ this.currentApplication.OrganisationDescription }}
          </p>

          <BRow class="mb-3">
            <BCol sm="3">
              <img
                src="@/assets/images/svg/website-icon.svg"
                class="d-inline-block mr-2"
              />
              <span>{{ this.currentApplication.OrganisationWebsite }}</span>
            </BCol>
            <BCol sm="3">
              <img
                src="@/assets/images/svg/location-icon.svg"
                class="d-inline-block mr-2"
              />
              <span>{{ this.currentApplication.Ville }}</span>
            </BCol>
            <BCol sm="3">
              <img
                src="@/assets/images/svg/company-icon.svg"
                class="d-inline-block mr-2"
              />
              <span>{{ this.currentApplication.Function }}</span>
            </BCol>
          </BRow>
          <div v-for="(question, index) in this.questions" v-bind:key="index">
            <p class="text-muted text-xl mt-1 mb-1">
              {{ index }}
            </p>
            <div
              class="chip-container d-flex flex-wrap gap-2 border-0"
              v-if="typeof question[0] != 'string'"
            >
              <span
                v-for="(option, index) in question"
                :key="index"
                class="badge rounded-pill py-2 px-3 bg-light text-dark mt-2"
              >
                {{ option.name }}
              </span>
            </div>
            <div class="ms-2" v-else>
              {{ question[0] }}
            </div>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>

<style></style>
