import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const BASE_REST_API_URL = `${BASE_URL}/api/categories`;

export const getAllCategories = () => axios.get(`${BASE_REST_API_URL}`);

export const getCategoryById = (categoryId) =>
  axios.get(`${BASE_REST_API_URL}/${categoryId}`);
