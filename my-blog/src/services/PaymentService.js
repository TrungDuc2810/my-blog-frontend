import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

export const createPayment = async (amount, orderInfo) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/vnpay/create-payment`, {
      params: {
        amount: amount,
        orderInfo: orderInfo,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// export const handlePaymentCallback = async () => {
//   try {
//     const response = await axios.get(
//       `${API_URL}/vnpay/callback-payment`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error handling payment callback:", {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message,
//     });
//     throw error;
//   }
// };
