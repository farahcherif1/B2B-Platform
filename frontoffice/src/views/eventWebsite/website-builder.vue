<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './nav-bar.vue';
import WebsiteService from '@/services/website.service.js';
import S3Service from '@/services/s3.service';

const route = useRoute();
const eventId = route.params.id;

const activeTab = ref(0);
const tabs = ref([]);
const sections = ref([]);
const sectionTypes = ref([]);
const isLoading = ref(false);
const apiError = ref(null);

const showTabModal = ref(false);
const newTabName = ref('');

// Edit section form variables
const editForm = ref({
  sectionType: '',
  title: '',
  description: '',
  uploadedImages: [],
  sectionId: null,
  isEditing: false
});

// New section form variables ("Nouvelle partie")
const newForm = ref({
  sectionType: '',
  title: '',
  description: '',
  uploadedImages: []
});

const fetchWebsiteData = async () => {
  isLoading.value = true;
  try {
    const tabRes = await WebsiteService.getWebsiteTabs(eventId);
    tabs.value = tabRes.data;

    const typeRes = await WebsiteService.getAllSectionTypes();
    sectionTypes.value = typeRes.data.map(type => ({
      label: type.name,
      value: type,
    }));

    await fetchSectionsForTabs();
  } catch (err) {
    console.error(err);
    apiError.value = 'Erreur lors du chargement des données';
  } finally {
    isLoading.value = false;
  }
};

const fetchSectionsForTabs = async () => {
  const allSections = [];
  for (const tab of tabs.value) {
    const sectionRes = await WebsiteService.getSections(tab.id);
    allSections.push(...sectionRes.data.map(s => ({ ...s, tabId: tab.id })));
  }
  sections.value = allSections;
};

const switchTab = (index) => {
  activeTab.value = index;
  resetEditForm();
  resetNewForm();
};

const openAddTabModal = () => {
  newTabName.value = '';
  showTabModal.value = true;
};

const confirmAddTab = async () => {
  if (!newTabName.value.trim()) {
    alert('Nom du tab requis');
    return;
  }
  try {
    const newTabRes = await WebsiteService.createWebsiteTab(eventId, { name: newTabName.value });
    tabs.value.push(newTabRes.data);
    activeTab.value = tabs.value.length - 1;
    showTabModal.value = false;
  } catch (err) {
    console.error('Erreur lors de la création du tab', err);
  }
};

const resetEditForm = () => {
  editForm.value = {
    sectionType: '',
    title: '',
    description: '',
    uploadedImages: [],
    sectionId: null,
    isEditing: false
  };
};

const resetNewForm = () => {
  newForm.value = {
    sectionType: '',
    title: '',
    description: '',
    uploadedImages: []
  };
};

const editSection = (section) => {
  const sectionType = sectionTypes.value.find(type => type.value.id === section.sectionTypeId);

  editForm.value = {
    sectionType: sectionType ? sectionType.value : '',
    title: section.title || '',
    description: section.description || '',
    uploadedImages: section.images?.map(img => img.url) || [],
    sectionId: section.id,
    isEditing: true
  };

  document.querySelector('.section-form-container').scrollIntoView({ behavior: 'smooth' });
};

const saveEditForm = async () => {
  if (!editForm.value.sectionType || !editForm.value.title.trim()) {
    alert('Veuillez remplir les champs requis');
    return;
  }

  const currentTab = tabs.value[activeTab.value];
  if (!currentTab) return;

  try {
    const sectionPayload = {
      title: editForm.value.title,
      description: editForm.value.description,
      imageUrls: editForm.value.uploadedImages,
      sectionTypeId: editForm.value.sectionType.id,
    };

    if (editForm.value.isEditing && editForm.value.sectionId) {
      const sectionToUpdate = sections.value.find(s => s.id === editForm.value.sectionId);
      if (sectionToUpdate) {
        const updatedSection = await WebsiteService.updateSection(sectionToUpdate.tabId, editForm.value.sectionId, sectionPayload);
        const index = sections.value.findIndex(s => s.id === editForm.value.sectionId);
        if (index !== -1) {
          sections.value[index] = { ...updatedSection.data, tabId: sectionToUpdate.tabId };
        }
      }
    } else {
      const newSectionRes = await WebsiteService.createSection(currentTab.id, sectionPayload);
      sections.value.push({ ...newSectionRes.data, tabId: currentTab.id });
    }

    resetEditForm();
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de la section", err);
  }
};

const saveNewForm = async () => {
  if (!newForm.value.sectionType || !newForm.value.title.trim()) {
    alert('Veuillez remplir les champs requis');
    return;
  }

  const currentTab = tabs.value[activeTab.value];
  if (!currentTab) return;

  try {
    const sectionPayload = {
      title: newForm.value.title,
      description: newForm.value.description,
      imageUrls: newForm.value.uploadedImages,
      sectionTypeId: newForm.value.sectionType.id,
    };

    const newSectionRes = await WebsiteService.createSection(currentTab.id, sectionPayload);
    sections.value.push({ ...newSectionRes.data, tabId: currentTab.id });

    resetNewForm();
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de la nouvelle section", err);
  }
};

const deleteSection = async (section) => {
  if (confirm('Supprimer cette section ?')) {
    try {
      await WebsiteService.deleteSection(section.tabId, section.id);
      sections.value = sections.value.filter(s => s.id !== section.id);
      if (editForm.value.sectionId === section.id) {
        resetEditForm();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la section', err);
    }
  }
};

const uploadImages = async (files, form) => {
  if (!files || files.length === 0) return;

  const formData = new FormData();
  
  // Append all files to the FormData
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  try {
    const res = await S3Service.uploadFile(formData);
    console.log("Upload response:", res.data);
    if (res && res.data) {
      // If res.data is an array, use it directly, otherwise create an array with the single URL
      const newUrls = Array.isArray(res.data) ? res.data : [res.data];
      form.uploadedImages = [...form.uploadedImages, ...newUrls];
    } else {
      alert("Erreur lors de l'upload des images.");
    }
  } catch (err) {
    console.error("Erreur lors de l'upload :", err);
    alert("Upload échoué");
  }
};

const handleEditFormFileUpload = (event) => {
  uploadImages(event.target.files, editForm.value);
};

const handleNewFormFileUpload = (event) => {
  uploadImages(event.target.files, newForm.value);
};

const removeImage = async (index, form) => {
  const imageUrl = form.uploadedImages[index];
  const fileName = imageUrl.split('/').pop(); // Extract filename from URL

  const confirmed = confirm("Supprimer cette image ?");
  if (!confirmed) return;

  try {
    const res = await S3Service.deleteFile(fileName);
    if (res && res.status === 200) {
      form.uploadedImages.splice(index, 1);
    } else {
      alert("Échec de la suppression de l'image.");
    }
  } catch (err) {
    console.error("Erreur de suppression :", err);
    alert("Erreur lors de la suppression de l'image.");
  }
};

onMounted(() => {
  fetchWebsiteData();
});
</script>

<template>
  <div class="page-container">
    <NavBar />

    <div class="main-content">
      <div class="header-container">
        <h1 class="page-title">CRÉATION DE SITE WEB DE L'ÉVÈNEMENT</h1>
        <button class="register-button">Enregistrer</button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <p>Chargement des données...</p>
      </div>

      <div v-if="apiError" class="error-notification">
        <p>{{ apiError }}</p>
        <button class="retry-button" @click="fetchWebsiteData">Réessayer</button>
      </div>

      <div class="content-wrapper">
        <!-- Tabs Navigation -->
        <div class="navigation-tabs">
          <button
            v-for="(tab, index) in tabs"
            :key="tab.id"
            class="tab"
            :class="{ active: activeTab === index }"
            @click="switchTab(index)"
          >
            {{ tab.name }}
          </button>
          <button class="add-tab" @click="openAddTabModal">
            Ajouter tab +
          </button>
        </div>
        
        <!-- Edit/Create Section Form -->
        <div class="section-form-container">
          <h3>{{ editForm.isEditing ? 'Modifier section' : 'Modifier section' }}</h3>

          <div class="form-group">
            <label for="section-type">Type</label>
            <select id="section-type" v-model="editForm.sectionType" class="form-select">
              <option value="" disabled>Choisir...</option>
              <option v-for="type in sectionTypes" :key="type.value.id" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="section-title">Titre</label>
            <input id="section-title" type="text" v-model="editForm.title" class="form-input" placeholder="Titre...">
          </div>

          <div class="form-group" v-if="editForm.sectionType && editForm.sectionType.name.includes('description')">
            <label for="section-description">Description</label>
            <textarea id="section-description" v-model="editForm.description" class="form-textarea" placeholder="Description..."></textarea>
          </div>

          <div class="form-group" v-if="editForm.sectionType && editForm.sectionType.name.includes('image')">
            <label for="section-image">Images</label>
            <div class="file-input-container">
              <input type="file" multiple @change="handleEditFormFileUpload" accept="image/*" class="form-input" />
            </div>

            <div v-if="editForm.uploadedImages.length > 0" class="uploaded-images">
              <div v-for="(image, idx) in editForm.uploadedImages" :key="idx" class="image-thumbnail">
                <img :src="image" alt="uploaded image">
                <button type="button" class="remove-image-btn" @click="removeImage(idx, editForm)">×</button>
              </div>
            </div>
          </div>

          <div class="button-group">
            <button v-if="editForm.isEditing" @click="resetEditForm" class="cancel-button">Annuler</button>
            <button @click="saveEditForm" class="submit-button">{{ editForm.isEditing ? 'Mettre à jour' : 'Enregistrer' }}</button>
          </div>
        </div>

        <!-- Current Tab Sections -->
        <div class="sections-container" v-if="tabs.length > 0">
          <!-- Display existing sections for the active tab -->
          <div
            class="section-card"
            v-for="section in sections.filter(s => s.tabId === tabs[activeTab]?.id)"
            :key="section.id"
          >
            <div class="section-header" v-if="section.title">
              <p class="custom-text">Titre</p>
              <h3 class="section-title">{{ section.title }}</h3>
            </div>

            <div class="section-content">
              <div v-if="section.description">
                <p class="custom-text">Description</p>
                <p>{{ section.description }}</p>
              </div>

              <div class="image-container" v-if="section.images && section.images.length > 0">
                <p class="custom-text">Images</p>
                <div class="gallery">
                  <img
                    v-for="(image, index) in section.images"
                    :key="index"
                    :src="image.url"
                    alt="Section image"
                    class="section-image"
                  />
                </div>
              </div>
            </div>

            <div class="section-actions">
              <button class="edit-button" @click="editSection(section)">Editer</button>
              <button class="delete-button" @click="deleteSection(section)">Supprimer</button>
            </div>
          </div>


          <div class="empty-state" v-if="!sections.some(s => s.tabId === tabs[activeTab]?.id)">
            <p>Aucune section pour ce tab.</p>
          </div>

          <div class="section-divider">
            <span class="divider-text">Nouvelle partie</span>
          </div>

          <!-- New Section Form (Nouvelle partie) -->
          <div class="new-section-form-container">
            <div class="form-group">
              <label for="new-section-type">Type</label>
              <select id="new-section-type" v-model="newForm.sectionType" class="form-select">
                <option value="" disabled selected>Choisir...</option>
                <option v-for="type in sectionTypes" :key="type.value.id" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="new-section-title">Titre</label>
              <input id="new-section-title" type="text" v-model="newForm.title" placeholder="Saisissez le titre" class="form-input" />
            </div>
            
            <div class="form-group" v-if="newForm.sectionType && newForm.sectionType.name.includes('description')">
              <label for="new-section-description">Description</label>
              <textarea id="new-section-description" v-model="newForm.description" placeholder="Saisissez la description" class="form-textarea"></textarea>
            </div>
            
            <div class="form-group" v-if="newForm.sectionType && newForm.sectionType.name.includes('image')">
              <label for="new-section-image">Images</label>
              <div class="file-input-container">
                <input type="file" multiple @change="handleNewFormFileUpload" accept="image/*" class="form-input" />
              </div>
              
              <div class="uploaded-images" v-if="newForm.uploadedImages.length > 0">
                <div class="image-thumbnail" v-for="(image, idx) in newForm.uploadedImages" :key="idx">
                  <img :src="image" alt="Uploaded image" />
                  <button type="button" class="remove-image-btn" @click="removeImage(idx, newForm)">×</button>
                </div>
              </div>
            </div>
            
            <div class="button-group">
              <button class="submit-button" @click="saveNewForm">Enregistrer</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Tab Modal -->
      <div class="modal-overlay" v-if="showTabModal">
        <div class="modal modal-right">
          <div class="modal-header">
            <h2>Ajouter un nouveau tab</h2>
            <button class="close-button" @click="showTabModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <input type="text" v-model="newTabName" placeholder="Nom du tab" class="form-input" />
          </div>
          <div class="modal-footer">
            <button class="cancel-button" @click="showTabModal = false">Annuler</button>
            <button class="confirm-button" @click="confirmAddTab">Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-thumbnail {
  position: relative;
  width: 150px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
  margin-bottom: 10px;
}

.image-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image-btn:hover {
  background: rgba(255, 0, 0, 0.7);
  color: white;
}
.custom-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%; /* This is equivalent to 16px since 100% of 16px = 16px */
  letter-spacing: 0px;
  vertical-align: middle;
  color: #000000;

}

.page-container {
  background-color: #f5f5f8;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Header container */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.page-title {
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: bold;
}

.register-button {
  background-color: #d30a3d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

/* Content wrapper */
.content-wrapper {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

/* Tabs navigation */
.navigation-tabs {
  display: flex;
  overflow-x: auto;
  background-color: #fff;
  border-bottom: 1px solid #e9ebec;
}

.tab {
  padding: 15px 25px;
  border: none;
  background: none;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  
  
}

.tab.active {
  background-color: #d30a3d;
  color: white;
  font-weight: bold;
}

.add-tab {
  padding: 15px 25px;
  border: none;
  font-weight: 500;
  color: #FFFFFF;
  cursor: pointer;
  white-space: nowrap;
  border-color: #F0E7E7;
  background: #08093A44;

  
}

/* Sections container */
.sections-container {
  padding: 20px;
}

.section-card {
  border: 1px solid #e9ebec;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: #fff;
}

.section-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e9ebec;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.section-content {
  padding: 15px 20px;
}

.section-content p {
  margin: 0 0 15px;
  line-height: 1.5;
}

.image-container {
  margin-top: 10px;
}

.section-image {
  width: 153.16000366210938px;
  height: 102.04000091552734px;
  top: -40.95px;
  border-radius: 4px;

}

.section-actions {
  padding: 10px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e9ebec;
}

.edit-button, .delete-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.edit-button {
  background-color: #f0f0f0;
  color: #333;
}

.delete-button {
  background-color: #ffe1ea;
  color: #d30a3d;
}

/* Empty state */
.empty-state {
  padding: 30px;
  text-align: center;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 20px;
}

/* Section divider */
.section-divider {
  position: relative;
  text-align: center;
  margin: 30px 0 20px;
}

.divider-text {
  position: relative;
  display: inline-block;
  background-color: white;
  padding: 0 15px;
  color: #d30a3d;
  font-weight: bold;
  font-size: 16px;
  z-index: 1;
}

.section-divider:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid #e9ebec;
  z-index: 0;
}

/* Section form */
.section-form-container, .new-section-form-container {
  background-color: white;
  border: 1px solid #e9ebec;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-title {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.file-input-container {
  display: flex;
}

.file-input-container .form-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  flex: 1;
}

.file-button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-left: none;
  padding: 0 15px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-thumbnail {
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.image-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button, .submit-button {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

.submit-button {
  background-color: #d30a3d;
  color: white;
}

/* Modal */
/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-start; /* Changed to flex-end to position on the right */
  align-items: center;
  z-index: 1000;
}
/* Add this new class for right-aligned modal */
.modal-right {
  margin-right: auto; /* Push to the right side */
  margin-left: 1040px; /* Add some spacing from the right edge */
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e9ebec;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e9ebec;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.confirm-button {
  background-color: #d30a3d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* Loading state */
.loading-state {
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* Error notification */
.error-notification {
  padding: 15px;
  background-color: #ffeaea;
  border-left: 4px solid #d30a3d;
  margin-bottom: 20px;
  border-radius: 4px;
}

.retry-button {
  background-color: transparent;
  color: #d30a3d;
  border: 1px solid #d30a3d;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
}
</style>