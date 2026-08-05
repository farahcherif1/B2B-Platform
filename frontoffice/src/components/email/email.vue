<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import EmailService from "../../services/email.service";
import TypeParticipantService from "../../services/type.service";
import { getTemplateNames, getTemplateContent } from "../../utils/emailTemplates";

const router = useRouter();
const route = useRoute();

const form = ref({
  participantTypes: [],
  subject: "",
  html: "",
  text: "",
  sendDate: null,
  sendTime: null,
});

const sending = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);
const typesLoading = ref(false);

const typeOptions = ref([]);

const selectedTemplate = ref("Template Basique");
const templateOptions = ref(getTemplateNames());

const datePicker = ref(null);
const timePicker = ref(null);
const quillEditor = ref(null);
let quill = null;

const handleTypeChange = (selectedTypes) => {
  form.value.participantTypes = selectedTypes;
};

const isFormValid = computed(() => {
  return (
    form.value.participantTypes.length > 0 &&
    form.value.subject.trim() !== "" &&
    quill &&
    quill.getText().trim().length > 1
  );
});

const prepareEmailData = () => {
  form.value.html = quill.root.innerHTML;
  form.value.text = quill.getText();

  const eventId = Number(route.params.id);
  let sendAt = null;
  if (form.value.sendDate && form.value.sendTime) {
    sendAt = new Date(form.value.sendDate);
    const [hour, minute] = form.value.sendTime.split(":");
    sendAt.setHours(parseInt(hour), parseInt(minute));
  }

  const participantTypes = form.value.participantTypes.map((typeId) => {
    const typeOption = typeOptions.value.find((option) => option.value === typeId);
    return {
      id: typeId,
      name: typeOption ? typeOption.label : `Type ${typeId}`,
    };
  });
  return {
    participantTypes,
    subject: form.value.subject,
    html: form.value.html,
    text: form.value.text,
    sendAt: sendAt,
    eventId: eventId,
  };
};

const resetForm = () => {
  form.value = {
    participantTypes: [],
    subject: "",
    html: "",
    text: "",
    sendDate: null,
    sendTime: null,
  };
  quill?.setContents([]);
};

const sendEmail = async () => {
  if (!isFormValid.value) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  sending.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    const emailData = prepareEmailData();
    const response = await EmailService.sendEmail(emailData);

    if (response && response.data) {
      successMessage.value = "Email sent successfully!";
      resetForm();
    } else {
      errorMessage.value = "Failed to send email. Please try again.";
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Failed to send email.";
    console.error(err);
  } finally {
    sending.value = false;
  }
};

const scheduleEmail = async () => {
  if (!isFormValid.value) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  if (!form.value.sendDate || !form.value.sendTime) {
    errorMessage.value = "Please select both date and time for scheduling.";
    return;
  }

  sending.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    const emailData = prepareEmailData();
    const response = await EmailService.sendEmail(emailData);

    if (response && response.data) {
      successMessage.value = "Email scheduled successfully!";
      resetForm();
    } else {
      errorMessage.value = "Failed to schedule email. Please try again.";
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Failed to schedule email.";
    console.error(err);
  } finally {
    sending.value = false;
  }
};

const goToHistory = () => {
  const eventId = Number(route.params.id);
  router.push(`/email-history/${eventId}`);
};

const loadParticipantTypes = async () => {
  if (!route.params.id) {
    errorMessage.value = "No event ID provided.";
    return;
  }

  typesLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await TypeParticipantService.findByEvent(route.params.id);
    if (response && response.data && Array.isArray(response.data)) {
      typeOptions.value = response.data.map((type) => ({
        value: type.id,
        label: type.name,
      }));

      if (typeOptions.value.length === 0) {
        errorMessage.value = "No participant types found for this event.";
      }
    } else {
      errorMessage.value = "Invalid response when loading participant types.";
    }
  } catch (error) {
    console.error("Failed to load participant types:", error);
    errorMessage.value = "Failed to load participant types.";
  } finally {
    typesLoading.value = false;
  }
};

const applyTemplate = (templateName) => {
  selectedTemplate.value = templateName;
  const templateContent = getTemplateContent(templateName);
  if (templateContent) {
    quill.root.innerHTML = templateContent;
  }
};

watch(
  () => route.params.id,
  (newId, oldId) => {
    console.log("Route ID changed from", oldId, "to", newId);
    if (newId && newId !== oldId) {
      loadParticipantTypes();
    }
  }
);

onMounted(() => {
  flatpickr(datePicker.value, {
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d M, Y",
    minDate: "today",
    allowInput: true,
    placeholder: "Select date",
    onChange: (selectedDates, dateStr) => {
      form.value.sendDate = dateStr;
    },
  });

  flatpickr(timePicker.value, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    allowInput: true,
    placeholder: "Select time",
    defaultHour: new Date().getHours(),
    defaultMinute: new Date().getMinutes(),
    onChange: (selectedDates, dateStr) => {
      form.value.sendTime = dateStr;
    },
  });

  quill = new Quill(quillEditor.value, {
    theme: "snow",
    placeholder: "Write something...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
        ["link", "image"],
      ],
    },
  });

  applyTemplate("Template Basique");

  if (route.params.id) {
    loadParticipantTypes();
  }
});
</script>

<template>
  <div class="header-row">
    <h1 class="title">Emailing</h1>
    <div class="button-padding">
      <button @click="goToHistory" class="history-button">
        <img :src="require('@/assets/historique.svg')" alt="History icon" class="icon" />
        Historique
      </button>
    </div>
  </div>

  <div class="form-row">
    <div class="field-group">
      <label>Envoyer aux types de participants :</label>
      <Multiselect
        v-model="form.participantTypes"
        :options="typeOptions"
        mode="multiple"
        :searchable="true"
        :create-option="false"
        label="label"
        valueProp="value"
        placeholder="Select Participant"
        class="multiselect-input"
        :loading="typesLoading"
        :disabled="typeOptions.length === 0"
        @open="loadParticipantTypes"
        :show-options="true"
        :close-on-select="false"
        track-by="value"
        :hideSelected="false"
        :canClear="true"
        @update:modelValue="handleTypeChange"
      >
        <template #tag="{ option, remove, disabled }">
          <div class="multiselect-tag" :class="{ 'is-disabled': disabled }">
            {{ option.label }}
            <span
              v-if="!disabled"
              class="multiselect-tag-remove"
              @click.stop="remove(option)"
            >
              <span class="multiselect-tag-remove-icon"></span>
            </span>
          </div>
        </template>
        <template #option="{ option }">
          <div class="multiselect-option">
            {{ option.label }}
          </div>
        </template>
        <template #singlelabel="{ value }">
          <div class="multiselect-single-label">
            {{ value.label }}
          </div>
        </template>
        <template #multiplelabel="{ values }">
          <div class="multiselect-multiple-label">
            {{ values.map((v) => v.label).join(", ") }}
          </div>
        </template>
      </Multiselect>
    </div>

    <div class="date-time-group">
      <div class="date-picker-wrapper">
        <input
          ref="datePicker"
          class="flatpickr-input date-picker"
          v-model="form.sendDate"
          placeholder="Select date"
        />
        <img src="@/assets/calender.svg" alt="calendar icon" class="calendar-icon" />
      </div>
      <div class="date-picker-wrapper">
        <input
          ref="timePicker"
          class="flatpickr-input time-picker"
          v-model="form.sendTime"
          placeholder="Select time"
        />
        <img :src="require('@/assets/heure.svg')" alt="time icon" class="heure-icon" />
      </div>
    </div>

    <div class="buttons-group">
      <button
        type="button"
        :disabled="!isFormValid || !form.sendDate || !form.sendTime"
        @click="scheduleEmail"
        class="schedule-button"
      >
        <img
          :src="require('@/assets/schedule.svg')"
          alt="schedule icon"
          class="schedule-icon"
        />
        Programmer l'envoi
      </button>

      <button
        type="submit"
        :disabled="!isFormValid"
        @click="sendEmail"
        class="send-button"
      >
        <img :src="require('@/assets/send.svg')" alt="send icon" class="send-icon" />
        Envoyer maintenant
      </button>
    </div>
  </div>

  <div class="editor-section">
    <div class="email-editor">
      <h2 class="title">Email Editor</h2>
    </div>
    <div class="template-section">
      <span class="template-label">Ecrire l'email ou choisissez une template</span>
      <div class="template-dropdown">
        <select
          v-model="selectedTemplate"
          @change="applyTemplate(selectedTemplate)"
          class="template-select"
        >
          <option v-for="template in templateOptions" :key="template">
            {{ template }}
          </option>
        </select>
        <div class="dropdown-icon">▼</div>
      </div>
    </div>
    <div class="mb-3">
      <input
        v-model="form.subject"
        type="text"
        class="form-control subject-input"
        placeholder="Subject"
        required
      />
    </div>

    <div class="editor-container">
      <div ref="quillEditor" class="quill-editor"></div>
    </div>
  </div>
</template>

<style scoped>
.multiselect-option {
  padding: 8px 12px;
  cursor: pointer;
}

.multiselect-option:hover {
  background-color: #f5f5f5;
}

.multiselect-single-label,
.multiselect-multiple-label {
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  display: inline-block;
  padding: 3px 0;
}
.multiselect-input {
  min-height: 38px;
}

.multiselect-tag {
  background-color: transparent; /* Changed from #8093A4 to transparent */
  color: #333; /* Changed text color from white to dark for better visibility */
  border: 1px solid #ccc; /* Added a border to make tags visible */
  padding: 3px 7px;
  border-radius: 4px;
  margin-right: 4px;
  margin-bottom: 4px;
  display: inline-flex;
  align-items: center;
}

.multiselect-tag-remove {
  margin-left: 6px;
  cursor: pointer;
}

.multiselect-tag-remove-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  position: relative;
}

.multiselect-tag-remove-icon:before,
.multiselect-tag-remove-icon:after {
  content: "";
  position: absolute;
  width: 1px;
  height: 12px;
  background-color: white;
  top: 0;
  left: 6px;
  transform: rotate(45deg);
}

.multiselect-tag-remove-icon:after {
  transform: rotate(-45deg);
}

.multiselect-dropdown {
  z-index: 100;
}

.multiselect-tags {
  flex-wrap: wrap;
  display: flex;
  padding: 4px;
}
/* Vue 3 / SFC deep selector */
:deep(.multiselect__option--selected),
:deep(.multiselect__option--selected:hover) {
  background-color: transparent !important;
  color: inherit !important;
}

.email-editor {
  width: 100%;
  height: 40px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 0.59px solid #e9ebec;
  background: #ffffff;
  margin-bottom: 10px;
}
.title {
  font-size: 20px;
  padding-left: 20px;
  font-weight: 500;
  color: #333;
  margin: 0;
}
.header-row {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  border: none;
}

.field-group {
  display: flex;
  align-items: center;
  flex: 1;
}

.date-time-group {
  display: flex;
  gap: 10px;
}

.buttons-group {
  display: flex;
  gap: 10px;
}

label {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  font-size: 14px;
  color: #555;
}

.multiselect-input {
  color: #212529;
  flex: 1;
  width: 200px;
}

.date-picker,
.time-picker {
  width: 150px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  box-sizing: border-box;
}

.date-picker-wrapper {
  position: relative;
  display: inline-block;
}

.calendar-icon,
.heure-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  height: 1rem;
  width: 1rem;
  pointer-events: none;
}

.history-button {
  background-color: #ffe1ea;
  color: #cd0f45;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.button-padding {
  padding-left: 20px;
  padding-right: 20px;
}

.history-button:hover {
  background-color: #fdd5d5;
}

.schedule-button {
  background: #0ab39c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 152;
  height: 37;
  top: 17px;
  left: 792px;
  border-radius: 4px;
  border-width: 1px;
}
.schedule-icon {
  width: 22;
  height: 22;
  top: 7px;
  left: 16px;
}

.schedule-button:hover:not(:disabled) {
  background-color: #0ab39c;
}
.send-icon {
  width: 21;
  height: 21;
  top: 7px;
  left: 16px;
}
.send-button {
  background: #8093a4;
  color: white;
  padding: 8px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 152;
  height: 37;
  top: 17px;
  left: 956px;
  border-radius: 4px;
  border-width: 1px;
  border: 1px solid #8093a4;
}

.send-button:hover:not(:disabled) {
  background: #8093a4;
}

.editor-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 500;
  height: 478;
  top: 270px;
  left: 293px;
  border-radius: 4px;

  box-shadow: 0px 1px 2px 0px #38414a26;
}

.subject-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.editor-container {
  margin-bottom: 20px;
}

.quill-editor {
  height: 300px;
  background-color: white;
  border-radius: 5px;
}

.ql-container.ql-snow {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.ql-toolbar.ql-snow {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success {
  color: #00b894;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #e8fff8;
  border-radius: 4px;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #fee8e8;
  border-radius: 4px;
}

.participant-stats {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}
.template-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ebec;
  margin-top: 5px;
}

.template-label {
  font-size: 14px;
  color: #666;
}

.template-dropdown {
  position: relative;
  width: 200px;
}

.template-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  appearance: none;
  cursor: pointer;
}

.dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 10px;
  color: #666;
}
</style>
