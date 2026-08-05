import apiClientAuth from "./API/authenticated";

export default class EmailService {
  static async sendEmail(emailData) {
    try {
      const response = await apiClientAuth.post("/mailer/send", emailData);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getEmailHistoryByEvent(eventId) {
    try {
      const response = await apiClientAuth.get(`/mailer/history?eventId=${eventId}`);
      return response;
    } catch (error) {
      console.error("Error fetching email history for event:", error);
      return null;
    }
  }
  
}