import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/media";

export const getAllMedia = () => axios.get(BASE_REST_API_URL);

export const getTotalMedia = () => axios.get(`${BASE_REST_API_URL}/total`);

export const getMediaByPostId = (postId) =>
  axios.get(`${BASE_REST_API_URL}/post/${postId}`);
