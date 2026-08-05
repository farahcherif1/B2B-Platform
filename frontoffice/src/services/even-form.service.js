import { data } from "autoprefixer";
import apiClientAuth from "./API/authenticated";

export default class EventFormService {
  static async getFields(eventId) {
    const response = await apiClientAuth.get(`/form-section/event/${eventId}`);
    return response;
  }

  static async getAllChoicesOfFormSection(eventId) {
    const response = await apiClientAuth.get(
      `/form-section/event/${eventId}/choices`
    );
    return response;
  }

  static async addFieldToformSection(eventId, FieldId) {
    try {
      const response = await apiClientAuth.post(
        `/form-section/${eventId}/${FieldId}`
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getDependencieById(dependencyId) {
    try {
      const response = await apiClientAuth.get(
        `/field-dependencies/${dependencyId}`
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async updateField(field) {
    console.log("updated field ", field);
    try {
      const response = await apiClientAuth.put(`/field`, field);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getQuestions(eventId) {
    try {

      const response = await apiClientAuth.get(
        `/form-section/event/${eventId}/fields`
      );

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getChoicefromDependency(dependencyId) {
    try {
      const response = await apiClientAuth.get(
        `field-dependencies/${dependencyId}/choice`
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getQuestionsByParticipantsType(eventId, participationTypeId) {
    
    try {
      const response = await apiClientAuth.get(
        `/form-section/event/${eventId}/fields/${participationTypeId}`
      );
      console.log(data);
      
      for (const field of response.data) {
        if (field.dependencies.length > 0) {
          field.dependOnChoice = await this.getChoicefromDependency(
            field.dependencies[0].id
          );
          field.dependOnChoice = field.dependOnChoice.data;
        } else {
          field.dependOnChoice = null;
        }
      }
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteField(fieldId) {
    try {
      const response = await apiClientAuth.delete(`/field/${fieldId}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getFieldById(fieldId) {
    try {
      const response = await apiClientAuth.get(`/field/${fieldId}`);

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async getChoices() {
    try {
      const response = await apiClientAuth.get("/choice");
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async createChoice(choice) {
    try {
      const response = await apiClientAuth.post("/choice", {
        name: choice,
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async updateChoice(choice) {
    try {
      const { id, name } = choice;
      const response = await apiClientAuth.put(`/choice/${id}`, {
        name: name,
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteChoice(choiceId) {
    try {
      const response = await apiClientAuth.delete(`/choice/${choiceId}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async createField(field) {
    try {
      const response = await apiClientAuth.post("/field", field);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getParticipantsTypes(eventId) {
    try {
      const response = await apiClientAuth.get(
        `/type-participant/event/${eventId}`
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async addParticipantType(eventId, data) {
    try {
      const response = await apiClientAuth.post(`/type-participant`, {
        eventId,
        name: data.name,
        relatedParticipantIds: data.relatedParticipants || [],
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static async updateParticipantType(data) {

    try {
      const response = await apiClientAuth.patch(
        `/type-participant/${data.id}`,
        {
          name: data.name,
          relatedParticipantIds: data.relatedParticipants || [],
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteParticipantType(id) {
    try {
      const response = await apiClientAuth.delete(`/type-participant/${id}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getFieldsByIds(ids) {
    try {
      const response = await apiClientAuth.get(`/field/fielsByIds/${ids}`);

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
