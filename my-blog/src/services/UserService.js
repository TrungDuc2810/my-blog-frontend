import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/users";

export const getAllUsers = (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getTotalUsers = () => axios.get(`${BASE_REST_API_URL}/total`);

export const deleteUserById = (id) =>
  axios.delete(`${BASE_REST_API_URL}/${id}`);
