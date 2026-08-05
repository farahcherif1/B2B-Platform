<script>
import { BRow } from "bootstrap-vue-next";
import EventService from "@/services/event.service";

export default {
  name: "EventBasicInformations",
  components: { BRow },
  props: {
    eventFromParent: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timezones: [],
      selectedTimezone: "",
      paid: true,
      languages: [],
      topics: [],
      event: {
        name: null,
        path: null,
        topics: null,
        startDate: null,
        endDate: null,
        timezone: null,
        languages: null,
        registrations: 0,
        meetings: 0,
        state: "En cours",
        location: "Tunis",
        paid: true,
        price: 0,
        type: "",
      },
      error: {
        DateError: "",
        PriceError: "",
      },
    };
  },
  created() {
    this.timezones = Intl.supportedValuesOf("timeZone");
  },
  async mounted() {
    await this.getLanguages();
    await this.getTopics();
  },
  methods: {
    async confirmEvent() {
      const form = this.$refs.formEl;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      this.error = {};
      if (this.event.startDate > this.event.endDate) {
        this.error.DateError =
          "La date de fin doit être supérieure à la date de début";
      }
      if (this.event.price < 0) {
        this.error.PriceError = "Le prix doit être positif";
      }
      if (this.event.description.length === 0) {
        this.error.DescriptionError = "La description est obligatoire";
      }
      if (Object.keys(this.error).length > 0) {
        console.log(this.error);
        return;
      }
      try {
        //FIX
        const response = await EventService.createEvent(this.event);
        if (response) this.$router.push("/event-list");
      } catch (error) {
        console.error(error);
      }
    },
    async getLanguages() {
      try {
        const response = await EventService.getLanguages();
        response.data.forEach((language) => {
          this.languages.push(language.name);
        });
      } catch (error) {
        console.error(error);
      }
    },
    async getTopics() {
      try {
        const response = await EventService.getTopics();
        response.data.forEach((topic) => {
          this.topics.push(topic.name);
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <div>
    <form ref="formEl" @submit.prevent="confirmEvent">
      <BRow class="mb-2">
        <BCol>
          <label for="Nom" class="form-label">Nom d'Evenement</label>
          <input
            type="text"
            class="form-control"
            id="address1"
            placeholder="exemple"
            v-model="event.name"
            required
          />
        </BCol>
      </BRow>
      <BRow class="mb-2">
        <BCol>
          <label for="url-path" class="form-label">Event URL path</label>
          <p>Votre événement sera hébergé sur https://cepex.com/e/my-event</p>
          <input
            type="text"
            class="form-control"
            id="address2"
            placeholder="my-event"
            v-model="event.path"
            required
          />
        </BCol>
      </BRow>
      <BRow class="mb-2">
        <BCol>
          <label for="description " class="form-label">Description</label>
          <textarea
            class="form-control resize-none"
            id="description"
            rows="3"
            v-model="event.description"
            required
          ></textarea>
        </BCol>
        <div class="invalid-feedback">{{ this.error.DescriptionError }}</div>
      </BRow>
      <BRow class="mb-2">
        <BCol>
          <label for="topic" class="form-label">Topic</label>
          <select
            class="form-select mb-2"
            aria-label="Default select example"
            v-model="event.topics"
            required
          >
            <option v-for="topic in topics" :key="topic" :value="topic">
              {{ topic }}
            </option>
          </select>
        </BCol>
      </BRow>

      <BRow>
        <BCol>
          <label for="language" class="form-label">Language</label>
          <select
            class="form-select mb-2"
            aria-label="Default select example"
            v-model="event.languages"
            required
          >
            <option
              v-for="language in languages"
              :key="language"
              :value="language"
            >
              {{ language }}
            </option>
          </select>
        </BCol>
      </BRow>
      <BRow class="mb-2">
        <BCol sm="5">
          <label for="start-date" class="form-label"
            >L'événement commence le</label
          >
          <input
            type="date"
            class="form-control"
            id="start-date"
            v-model="event.startDate"
            required
          />
        </BCol>
        <BCol sm="2"></BCol>
        <BCol sm="5">
          <label for="end-date" class="form-label"
            >L'événement se termine le</label
          >
          <input
            type="date"
            class="form-control"
            id="end-date"
            v-model="event.endDate"
            required
          />
        </BCol>
        <div class="invalid-feedback">{{ this.error.DateError }}</div>
      </BRow>
      <BRow>
        <BCol>
          <label for="timezone" class="form-label">Timezone</label>
          <select
            class="form-select mb-2"
            aria-label="Default select example"
            id="timezone"
            v-model="event.timezone"
            required
          >
            <option
              v-for="timezone in timezones"
              :key="timezone"
              :value="timezone"
            >
              {{ timezone }}
            </option>
          </select>
        </BCol>
      </BRow>
      <BRow class="align-items-center">
        <BCol sm="12">
          <label class="form-label m-3 mx-0"> Prix </label>
        </BCol>
        <BCol sm="3">
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="prix"
              id="gratuit"
              @click="
                this.event.paid = false;
                this.event.price = 0;
                paid = false;
              "
            />
            <label class="form-check-label" for="gratuit"> Gratuit </label>
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="prix"
              id="payant"
              @click="
                this.event.paid = true;
                paid = true;
              "
              checked
            />
            <label class="form-check-label" for="payant"> Payant </label>
          </div>
        </BCol>
        <BCol sm="6">
          <div>
            <input
              type="number"
              class="form-control"
              id="price"
              placeholder="Preciser le prix"
              :disabled="!paid"
              v-model="event.price"
              value="0 : disabled"
            />
          </div>
        </BCol>
      </BRow>
      <BRow class="align-items-center my-3">
        <BCol sm="12">
          <label class="form-label m-3 mx-0"> Type d'Evenement</label>
        </BCol>
        <BCol sm="3">
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="radio"
              name="type"
              id="En ligne"
              @click="this.event.type = 'En ligne'"
            />
            <label class="form-check-label whitespace-pre" for="En ligne">
              En ligne
            </label>
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="type"
              id="Presentiel"
              @click="this.event.type = 'Presentiel'"
            />
            <label class="form-check-label" for="Presentiel">
              Presentiel
            </label>
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="type"
              id="Hybride"
              @click="this.event.type = 'Hybride'"
            />
            <label class="form-check-label" for="Hybride"> Hybride </label>
          </div>
        </BCol>
      </BRow>
      <div style="" class="d-flex align-items-end justify-content-end">
        <BButton
          variant="danger"
          type="submit"
          style="background-color: #cd0f45"
          class="w-lg waves-effect waves-light m-5"
        >
          Confirmer
        </BButton>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
