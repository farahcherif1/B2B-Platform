import apiClientAuth from "./API/authenticated";
import apiClientUnAuth from "./API/not-authenticated";
import axios from "axios";
export default class EventService {
  static async getEventsUnAuth(params) {
    try {
      const response = await apiClientUnAuth.get("/event", {
        params: {
          ...params,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async getTopics() {
    try {
      const response = await apiClientUnAuth.get("/topic");
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async getEventDetails(id) {
    try {
      const response = await apiClientUnAuth.get(`/event/${id}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async getLanguages() {
    try {
      const response = await apiClientUnAuth.get("/language");
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async createEvent(data) {
    try {
      const response = await apiClientAuth.post(`/event`, data);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async getEventsAuth(params) {
    try {
      const response = await apiClientAuth.get("/event", {
        params: {
          ...params,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getEventOrganizer(params) {
    try {
      const response = await apiClientAuth.get("/event/organizer", {
        params: {
          ...params,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getCountries() {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async registerEvent(id, data) {
    try {
      const response = await apiClientAuth.post(
        `application/submit/${id}`,
        data
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getUserSubscription(id) {
    try {
      const response = await apiClientAuth.get(
        `application/userApplications/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async updateUserSubscription(id, data, step) {
    let endPoint = "vide";
    switch (step) {
      case 0:
        endPoint = "PersonnalInfo";
        break;
      case 1:
        endPoint = "OrganisationInfo";
        break;
      case 2:
        endPoint = "Address";
        break;
      case 3:
        endPoint = "Questions";
        break;
    }

    try {
      if (endPoint == "Questions") {
        const response = await apiClientAuth.post(
          `application/${endPoint}/${id}`,
          { questions: data.Questions }
        );
        return response;
      }
      const response = await apiClientAuth.post(
        `application/${endPoint}/${id}`,
        data
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getEventApplications(id, filter = null) {
    try {
      const response = await apiClientAuth.get(
        `application/eventApplications/${id}`,
        {
          params: {
            ...filter,
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async exportParticipants(data) {
    try {
      const response = await apiClientAuth.post(
        `application/exportParticipants`,
        data,
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async exportOrganizers(data) {
    try {
      const response = await apiClientAuth.post(
        `application/exportOrganizers`,
        data,
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getOrganizers(id, filter = null) {
    try {
      const response = await apiClientAuth.get(`user/organizers/${id}`, {
        params: {
          ...filter,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteApplication(id) {
    try {
      const response = await apiClientAuth.delete(`application/${id}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteOrganizer(id) {
    try {
      const response = await apiClientAuth.delete(`user/deleteOrganizer/${id}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async importParticipants(id, file) {
    try {
      const response = await apiClientAuth.post(
        `application/importParticipants/${id}`,
        file,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getApplication(id){
    try{
      const response = await apiClientAuth.get(`application/${id}`);
      if(response)
        return response.data;
    }
    catch(error){
      console.error(error);
      return null;
    }
  }

}
