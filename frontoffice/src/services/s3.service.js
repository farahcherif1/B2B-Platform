import apiClientAuth from "./API/authenticated";

export default class S3Service {
  static async uploadFile(files) {
    try {
      const response = await apiClientAuth.post("/s3/uploadfiles", files);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getFile(fileName) {
    try {
      const response = await apiClientAuth.get(`/s3/downloadfile/${fileName}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteFile(fileName) {
    try {
      const response = await apiClientAuth.delete(`/s3/del/${fileName}`);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}