import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/categories";

export const getAllCategories = () => axios.get(`${BASE_REST_API_URL}`);

export const getCategoryById = (categoryId) => axios.get(`${BASE_REST_API_URL}/${categoryId}`);