import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/orders`;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

export const createOrder = async (orderData) => {
  try {
    // Transform orderData to match OrderDto structure
    const transformedOrderData = {
      userId: orderData.userId,
      amountMoney: orderData.totalAmount,
      createdAt: new Date().toISOString(),
      status: orderData.status,
    };

    const response = await axios.post(API_URL, transformedOrderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getAllOrders = async (
  pageNo = 0,
  pageSize = 10,
  sortBy = "id",
  sortDir = "asc"
) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        pageNo,
        pageSize,
        sortBy,
        sortDir,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getOrdersByUserId = async (
  userId,
  pageNo = 0,
  pageSize = 10,
  sortBy = "id",
  sortDir = "asc"
) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      params: {
        pageNo,
        pageSize,
        sortBy,
        sortDir,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
