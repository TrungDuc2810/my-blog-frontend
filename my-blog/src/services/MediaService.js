import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const BASE_REST_API_URL = `${BASE_URL}/api/media`;

export const getAllMedia = () => axios.get(BASE_REST_API_URL);

export const getTotalMedia = () => axios.get(`${BASE_REST_API_URL}/total`);

export const getMediaByPostId = (postId) =>
  axios.get(`${BASE_REST_API_URL}/post/${postId}`);
