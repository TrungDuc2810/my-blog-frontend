import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getAllProducts = async (pageNo, pageSize, sortBy, sortDir) => {
  const response = await axios.get(
    `${BASE_URL}/api/products?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
  );
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${BASE_URL}/api/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(`${BASE_URL}/api/products`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(
    `${BASE_URL}/api/products/${id}`,
    productData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${BASE_URL}/api/products/${id}`);
  return response.data;
};
