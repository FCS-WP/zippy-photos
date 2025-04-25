import { makeMultipartRequest, makeRequest } from "./axios";

export const webApi = {
  async getConfigs(params) {
    return await makeRequest("/configs", params);
  },
  async savePhotos(formData) {
    return await makeMultipartRequest("/photos", formData, 'POST');
  },
  async getSizes(formData) {
    return await makeMultipartRequest("/photo-sizes", formData);
  },
  async registerAccount(params) {
    return await makeRequest('/zippy-register', params, 'POST');
  },
  async login(params) {
    return await makeRequest('/zippy-signin', params, 'POST');
  },
};
