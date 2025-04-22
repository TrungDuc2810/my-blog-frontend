import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/posts";

axios.defaults.withCredentials = true; // Đảm bảo axios gửi cookies cùng yêu cầu

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting comments by post ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createComment = async (postId, formData) => {
  try {
    const response = await axios.post(
      `${BASE_REST_API_URL}/${postId}/comments`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};
