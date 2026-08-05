import apiClientAuth from "./API/authenticated";
import apiClientUnAuth from "./API/not-authenticated";
export default class AuthService {
  static resetPassword(email) {
    try {
      const response = apiClientUnAuth.post("/auth/forgot-password", {
        email: email,
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static login(data) {
    try {
      const response = apiClientUnAuth.post("/auth/login", data);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static createPassword(password, token) {
    try {
      const response = apiClientUnAuth.post(`/auth/reset-password/${token}`, {
        password: password,
      });

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async inviteOrganizer(data) {
    try {
      console.log(data);
      const response = await apiClientAuth.post(`auth/inviteOrganizer`, data);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static signinOrganizer(data) {
    try {
      const response = apiClientUnAuth.post("/auth/login/organizer", data);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static register(email, name, password) {
    try {
      const response = apiClientUnAuth.post("/auth/register", {
        email,
        name,
        password,
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
