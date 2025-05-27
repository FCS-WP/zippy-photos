import { makeRequest } from "./axios";
export const Api = {
  async checkKeyExits(params) {
    return await makeRequest("/check_option", params);
  },
  async getMenus(params) {
    return await makeRequest("/menus", params, "GET");
  },
  async createMenu(params) {
    return await makeRequest("/menus", params, "POST");
  },
  async updateMenu(params) {
    return await makeRequest("/menus", params, "PUT");
  },
  async deleteMenuItems(params) {
    return await makeRequest("/menus", params, "DELETE");
  },
  async searchProducts(params) {
    return await makeRequest("/search-products", params);
  },
  async getMenuProducts(params) {
    return await makeRequest("/products-menu", params);
  },
  async addProductsToMenu(params) {
    return await makeRequest("/products-menu", params, "POST");
  },
  async removeProductsFromMenu(params) {
    return await makeRequest("/products-menu", params, "DELETE");
  },
};
