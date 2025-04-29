import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

axios.defaults.withCredentials = true; // Đảm bảo axios gửi cookies cùng yêu cầu

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting post by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllPosts = (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_URL}/api/posts?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getPostsByCategoryId = (
  categoryId,
  pageNo,
  pageSize,
  sortBy,
  sortDir
) => {
  const url = `${BASE_URL}/api/posts/category/${categoryId}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const searchPostsByTitle = (
  title,
  pageNo,
  pageSize,
  sortBy,
  sortDir
) => {
  const url = `${BASE_URL}/api/posts/search?title=${title}&pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getTotalPosts = () => axios.get(`${BASE_URL}/api/posts/total`);

// Tạo bài viết, axios sẽ tự động thiết lập khi gửi form data
export const createPost = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/posts`, formData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cập nhật bài viết
export const updatePost = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/posts/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa bài viết
export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting post:",
      error.response?.data || error.message
    );
    throw error;
  }
};
