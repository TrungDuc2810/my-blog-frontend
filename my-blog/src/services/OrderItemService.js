import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/order-items`;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

export const createOrderItem = async (orderItemData) => {
  try {
    // Transform orderItemData to match OrderItemDto structure
    const transformedOrderItemData = {
      quantity: orderItemData.quantity,
      price: orderItemData.price,
      discountPrice: orderItemData.price, // Using same price as discount price if not provided
      productId: orderItemData.productId,
      orderId: orderItemData.orderId,
    };

    const response = await axios.post(API_URL, transformedOrderItemData);
    return response.data;
  } catch (error) {
    console.error("Error creating order item:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const updateOrderItem = async (orderItemId, orderItemData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${orderItemId}`,
      orderItemData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order item:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getAllOrderItems = async (
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
    console.error("Error fetching order items:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getOrderItem = async (orderItemId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderItemId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order item:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getOrderItemsByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order items by order ID:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const deleteOrderItem = async (orderItemId) => {
  try {
    const response = await axios.delete(`${API_URL}/${orderItemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order item:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
