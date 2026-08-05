import apiClientAuth from "./API/authenticated";

export default class WebsiteService {
  // WEBSITE TABS
  static async getWebsiteTabs(eventId) {
    try {
      const response = await apiClientAuth.get(`/website-tabs/event/${eventId}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getWebsiteTab(eventId, tabId) {
    try {
      const response = await apiClientAuth.get(`/website-tabs/event/${eventId}/${tabId}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async createWebsiteTab(eventId, newTabData) {
    try {
      const response = await apiClientAuth.post(`/website-tabs/event/${eventId}`, newTabData);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async updateWebsiteTab(eventId, tabId, updatedData) {
    try {
      const response = await apiClientAuth.patch(`/website-tabs/event/${eventId}/${tabId}`, updatedData);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteWebsiteTab(eventId, tabId) {
    try {
      const response = await apiClientAuth.delete(`/website-tabs/event/${eventId}/${tabId}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // SECTIONS (under tabId only)
  static async getSections(tabId) {
    try {
      const response = await apiClientAuth.get(`/sections/${tabId}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getSection(tabId, sectionId) {
    try {
      const response = await apiClientAuth.get(`/sections/${tabId}/${sectionId}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async createSection(tabId, newSectionData) {
    try {
      const response = await apiClientAuth.post(`/sections/${tabId}`, newSectionData);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async updateSection(tabId, sectionId, updatedData) {
    try {
      const response = await apiClientAuth.patch(`/sections/${tabId}/${sectionId}`, updatedData);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteSection(tabId, sectionId) {
    try {
      const response = await apiClientAuth.delete(`/sections/${tabId}/${sectionId}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
   //  Get all section types
  static async getAllSectionTypes() {
    try {
      const response = await apiClientAuth.get(`/section-types`);
      return response;
    }
    catch (error) {
      console.error(error);
      return null;
    }
  }
    

  //  Get a section type by ID
  static async getSectionTypeById(id) {
    try {
      const response = await apiClientAuth.get(`/section-types/${id}`);
      return response;
    }
    catch (error) {
      console.error(error);
      return null;
    }
    
  }
}
