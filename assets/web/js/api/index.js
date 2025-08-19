import {
  makeAdminAjaxRequest,
  makeMultipartRequest,
  makeRequest,
} from "./axios";

export const webApi = {
  async getConfigs(params) {
    return await makeRequest("/configs", params);
  },
  async savePhotos(formData) {
    return await makeMultipartRequest("/photos", formData, "POST");
  },
  async getSizes(formData) {
    return await makeMultipartRequest("/photo-sizes", formData);
  },
  async registerAccount(params) {
    return await makeRequest("/zippy-register", params, "POST");
  },
  async login(params) {
    return await makeRequest("/zippy-signin", params, "POST");
  },
  async addToCartAjax(params) {
    return await makeAdminAjaxRequest(params, "POST");
  },
  async getGoogleToken(params) {
    return await makeRequest("/google-drive-token", params, "GET");
  },
  async getPhotobookConfig(params) {
    return await makeRequest("/photobook", params);
  },
   async savePhotobookPhotos(formData) {
    return await makeMultipartRequest("/photobook-uploader", formData, "POST");
  },
};

export const photoIDApi = {
  async getProducts(params) {
    return await makeRequest('/photo-id', params);
  }
} 
