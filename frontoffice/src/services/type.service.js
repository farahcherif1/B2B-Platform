import apiClientAuth from "./API/authenticated";

export default class TypeParticipantService {
  static async findAll() { 
    try {
      const response = await apiClientAuth.get("/type-participant");
      return response;
    } catch (error) {
      console.error("Error fetching participant types:", error);
      return null;
    }
  }

  static async findByEvent(eventId) {
    try {
      const response = await apiClientAuth.get(`/type-participant/event/${eventId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching participant types for event ${eventId}:`, error);
      return null;
    }
  }
}
