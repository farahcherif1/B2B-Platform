<template>
  <div class="website-tabs">
    <div class="tabs-container">
      <ul class="tabs-list">
        <li 
          v-for="tab in websiteTabs" 
          :key="tab.id" 
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          {{ tab.name }}
        </li>
      </ul>
    </div>
    <div class="tab-content">
      <div v-if="activeTab" class="tab-pane">
        <slot :name="activeTab"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventWebsiteTabs',
  props: {
    websiteTabs: {
      type: Array,
      required: true
    },
    sections: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: null
    }
  },
  created() {
    if (this.websiteTabs.length > 0) {
      this.activeTab = this.websiteTabs[0].id;
    }
  },
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId;
      this.$emit('tab-changed', tabId);
    }
  }
}
</script>

<style scoped>
.website-tabs {
  width: 100%;
  margin: 0;
  padding: 0;
}

.tabs-container {
  width: 100%;
  height: 80px;
  top: 0;
  position: relative;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.tabs-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  max-width: 100%;
}

.tabs-list li {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  font-weight: 800;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  padding: 0 15px;
}

.tabs-list li:hover {
  color: #dc3545;
}

.tabs-list li.active {
  color: #dc3545;
  border-bottom: 2px solid #dc3545;
}

.tab-content {
  padding: 0;
  width: 100%;
  margin: 0;
}

.tab-pane {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>