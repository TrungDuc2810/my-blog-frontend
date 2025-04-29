import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const BASE_REST_API_URL = `${BASE_URL}/api/users`;

export const getUserByUsername = async (username) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user ID:", error);
    throw error;
  }
};

export const getAllUsers = (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getTotalUsers = () => axios.get(`${BASE_REST_API_URL}/total`);

export const deleteUserById = (id) =>
  axios.delete(`${BASE_REST_API_URL}/${id}`);
