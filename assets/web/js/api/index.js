import { makeMultipartRequest, makeRequest } from "./axios";

export const webApi = {
  async getConfigs(params) {
    return await makeRequest("/configs", params);
  },
  async savePhotos(formData) {
    return await makeMultipartRequest("/photos", formData, 'POST');
  },
};
