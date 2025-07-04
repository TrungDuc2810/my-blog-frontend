import axios from "axios";
import webSocketService from "./WebSocketService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

axios.defaults.withCredentials = true; // Đảm bảo axios gửi cookies cùng yêu cầu

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/posts/${postId}/comments`
    );
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
      `${BASE_URL}/api/posts/${postId}/comments`,
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

export const subscribeToComments = (postId, callback) => {
  return webSocketService.subscribe(`/topic/posts/${postId}/comments`, callback);
}

export const createCommentViaWebSocket = (postId, comment) => { 
  return webSocketService.send(`/app/posts/${postId}/comments/add`, comment);
}

export const updateCommentViaWebSocket = (postId, commentId, comment) => {
  return webSocketService.send(`/app/posts/${postId}/comments/${commentId }/update`, comment);
}

export const deleteCommentViaWebSocket = (postId, commentId) => {
  return webSocketService.send(`/app/posts/${postId}/comments/${commentId}/delete`, {});
}
