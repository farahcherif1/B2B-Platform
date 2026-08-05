<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import EmailService from "../../services/email.service";

const router = useRouter();
const route = useRoute();
const emailHistory = ref([]);
const loading = ref(true);
const error = ref(null);
const eventId = ref(route.params.id || null);

const searchQuery = ref("");
const dateFilter = ref("");
const statusFilter = ref("");
const sortColumn = ref("createdAt");
const sortDirection = ref("desc");
const selectedEmails = ref([]);
const selectAll = ref(false);

const showEmailDetails = ref(false);
const selectedEmail = ref({});

const fetchEmailHistory = async () => {
  loading.value = true;
  error.value = null;

  loading.value = true;
  error.value = null;

  try {
    const response = await EmailService.getEmailHistoryByEvent(eventId.value);
    emailHistory.value = response.data;
  } catch (err) {
    error.value = "Failed to load email history.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goBackToEmailing = () => {
  if (eventId.value) {
    router.push(`/emailing/${eventId.value}`);
  } else {
    router.push("/dashboard");
  }
};
const formatParticipantTypes = participantTypes => {
  if (
    !participantTypes ||
    !Array.isArray(participantTypes) ||
    participantTypes.length === 0
  ) {
    return "All participants";
  }

  return participantTypes
    .map(type => {
      if (type && typeof type === "object" && type.name) {
        return type.name;
      } else if (typeof type === "string") {
        return type;
      } else if (type && type.id) {
        return `Type ${type.id}`;
      }
      return "Unnamed participant type";
    })
    .join(", ");
};

const formatRecipients = recipients => {
  if (!recipients) return "";

  try {
    const recipientsArray =
      typeof recipients === "string" ? JSON.parse(recipients) : recipients;

    if (Array.isArray(recipientsArray)) {
      return recipientsArray.map(r => r.address || r).join(", ");
    }
    return recipients.toString();
  } catch (e) {
    return recipients.toString();
  }
};

const formatDate = dateString => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString();
};

const sortBy = column => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
};

const applyFilters = () => {};

const viewEmail = email => {
  selectedEmail.value = email;
  showEmailDetails.value = true;
};

const resendEmail = async email => {
  if (confirm("Are you sure you want to resend this email?")) {
    try {
      await EmailService.resendEmail(email.id);
      fetchEmailHistory();
    } catch (err) {
      error.value = "Failed to resend email.";
      console.error(err);
    }
  }
};

const closeModal = () => {
  showEmailDetails.value = false;
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedEmails.value = emailHistory.value.map(email => email.id);
  } else {
    selectedEmails.value = [];
  }
};

const filteredEmails = computed(() => {
  let filtered = [...emailHistory.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      email =>
        email.subject.toLowerCase().includes(query) ||
        formatRecipients(email.recipients).toLowerCase().includes(query) ||
        (email.participantTypes &&
          formatParticipantTypes(email.participantTypes)
            .toLowerCase()
            .includes(query))
    );
  }

  if (dateFilter.value) {
    const filterDate = new Date(dateFilter.value).setHours(0, 0, 0, 0);
    filtered = filtered.filter(email => {
      const emailDate = new Date(email.createdAt).setHours(0, 0, 0, 0);
      return emailDate === filterDate;
    });
  }

  if (statusFilter.value) {
    filtered = filtered.filter(email => email.status === statusFilter.value);
  }

  filtered.sort((a, b) => {
    let valA, valB;

    if (sortColumn.value === "participantTypes") {
      valA = formatParticipantTypes(a.participantTypes);
      valB = formatParticipantTypes(b.participantTypes);
    } else if (sortColumn.value === "recipients") {
      valA = formatRecipients(a.recipients);
      valB = formatRecipients(b.recipients);
    } else {
      valA = a[sortColumn.value];
      valB = b[sortColumn.value];
    }

    if (sortDirection.value === "asc") {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  return filtered;
});

watch(
  () => route.params.id,
  newId => {
    if (newId) {
      eventId.value = newId;
      fetchEmailHistory();
    }
  }
);

onMounted(fetchEmailHistory);
</script>

<template>
  <div class="history-container">
    <div class="header-row">
      <h1 class="title">Liste des emails</h1>
      <button @click="goBackToEmailing" class="back-button">
        <i class="ri-arrow-left-line"></i> Retour
      </button>
    </div>

    <div class="filters-row">
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher par sujet, type de participant..."
          class="search-input"
        />
      </div>

      <div class="date-picker">
        <input type="date" v-model="dateFilter" class="date-input" />
      </div>

      <div class="dropdown-filter">
        <select v-model="statusFilter" class="filter-select">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <button @click="applyFilters" class="filter-button">
        <i class="ri-filter-line"></i>
        Filter
      </button>
    </div>

    <div v-if="loading" class="loading-indicator">Loading...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="checkbox-column">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
              />
            </th>
            <th @click="sortBy('id')" class="sortable-column">
              ID
              <span class="sort-icon">⇅</span>
            </th>
            <th @click="sortBy('participantTypes')" class="sortable-column">
              RECIPIENT TYPES
              <span class="sort-icon">⇅</span>
            </th>
            <th @click="sortBy('subject')" class="sortable-column">
              SUBJECT
              <span class="sort-icon">⇅</span>
            </th>
            <th @click="sortBy('status')" class="sortable-column">
              STATUS
              <span class="sort-icon">⇅</span>
            </th>
            <th @click="sortBy('createdAt')" class="sortable-column">
              SENT DATE
              <span class="sort-icon">⇅</span>
            </th>
            <th class="action-column">ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="email in filteredEmails" :key="email.id">
            <td>
              <input
                type="checkbox"
                v-model="selectedEmails"
                :value="email.id"
              />
            </td>
            <td>{{ email.id }}</td>
            <td>
              <span
                v-if="email.participantTypes && email.participantTypes.length"
              >
                {{ formatParticipantTypes(email.participantTypes) }}
              </span>
              <span v-else>
                {{ formatRecipients(email.recipients) }}
              </span>
            </td>
            <td>{{ email.subject }}</td>
            <td>
              <span class="status-badge" :class="email.status">
                {{ email.status }}
              </span>
            </td>
            <td>{{ formatDate(email.createdAt) }}</td>
            <td class="action-column">
              <button class="view-button" @click="viewEmail(email)">
                <i class="ri-eye-line"></i>
              </button>
              <button class="resend-button" @click="resendEmail(email)">
                <i class="ri-send-plane-line"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showEmailDetails" class="email-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedEmail.subject }}</h2>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <strong>Recipient Types:</strong>
            <span
              v-if="
                selectedEmail.participantTypes &&
                selectedEmail.participantTypes.length
              "
            >
              {{ formatParticipantTypes(selectedEmail.participantTypes) }}
            </span>
            <span v-else>
              {{ formatRecipients(selectedEmail.recipients) }}
            </span>
          </div>
          <div class="detail-row">
            <strong>Recipients:</strong>
            {{ formatRecipients(selectedEmail.recipients) }}
          </div>
          <div class="detail-row">
            <strong>Status:</strong> {{ selectedEmail.status }}
          </div>
          <div class="detail-row">
            <strong>Sent Date:</strong>
            {{ formatDate(selectedEmail.createdAt) }}
          </div>
          <div class="email-content" v-html="selectedEmail.html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 24px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  color: #4a4a4a;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f4f4f4;
  color: #4a4a4a;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-button:hover {
  background-color: #e9e9e9;
}

.filters-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.date-input,
.filter-select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #00b8a9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  cursor: pointer;
  font-weight: 500;
}

.history-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 24px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  color: #4a4a4a;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f4f4f4;
  color: #4a4a4a;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-button:hover {
  background-color: #e9e9e9;
}

.filters-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.date-input,
.filter-select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #00b8a9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  cursor: pointer;
  font-weight: 500;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f9f9f9;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #ddd;
}

.sortable-column {
  cursor: pointer;
  position: relative;
}

.sort-icon {
  position: absolute;
  right: 16px;
  color: #aaa;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #fff8e1;
  color: #ffa000;
}

.status-badge.scheduled {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-badge.sent {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-badge.failed {
  background-color: #ffebee;
  color: #d32f2f;
}

.action-column {
  display: flex;
  gap: 8px;
}

.view-button,
.resend-button {
  background: none;
  border: none;
}
.status-badge.scheduled {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-badge.sent {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-badge.failed {
  background-color: #ffebee;
  color: #d32f2f;
}

.action-column {
  display: flex;
  gap: 8px;
}

.view-button,
.resend-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 16px;
}

.view-button:hover {
  color: #1976d2;
}

.resend-button:hover {
  color: #388e3c;
}

.email-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
}
.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 24px;
}

.detail-row {
  margin-bottom: 16px;
}

.email-content {
  margin-top: 24px;
  border-top: 1px solid #eee;
  padding-top: 16px;
  color: #666;
}

.modal-body {
  padding: 24px;
}

.detail-row {
  margin-bottom: 16px;
}

.email-content {
  margin-top: 24px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}
</style>
