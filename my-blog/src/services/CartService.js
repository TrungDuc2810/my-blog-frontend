import axios from "axios";
import { getUserByUsername } from "./UserService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

export const getCartItems = async (username) => {
  if (!username) return [];
  try {
    const user = await getUserByUsername(username);
    const response = await axios.get(
      `${BASE_URL}/api/cart-items/users/${user.id}`
    );
    return response.data.content || [];
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
};

export const addToCart = async (username, cartItem) => {
  try {
    const user = await getUserByUsername(username);

    // Check if product already exists in cart
    const existingItems = await getCartItems(username);
    const existingItem = existingItems.find(
      (item) => item.productId === cartItem.productId
    );

    if (existingItem) {
      // If product exists, update quantity
      return await updateCartItem(
        existingItem.id,
        existingItem.quantity + cartItem.quantity
      );
    } else {
      // If product doesn't exist, add new item with correct body format
      const response = await axios.post(`${BASE_URL}/api/cart-items`, {
        quantity: cartItem.quantity,
        productId: cartItem.productId,
        userId: user.id,
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error in addToCart:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      cartItem,
    });
    throw error;
  }
};

export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/cart-items/${cartItemId}`,
      {
        id: cartItemId,
        quantity: quantity,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateCartItem:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw error;
  }
};

export const deleteCartItem = async (cartItemId) => {
  try {
    return await axios.delete(`${BASE_URL}/api/cart-items/${cartItemId}`);
  } catch (error) {
    console.error("Error in deleteCartItem:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw error;
  }
};

export const clearCart = async (username) => {
  const items = await getCartItems(username);
  await Promise.all(items.map((item) => deleteCartItem(item.id)));
};

export const mergeLocalStorageCart = async (username) => {
  const localCart = localStorage.getItem("cart");
  if (!localCart) return [];

  const cartItems = JSON.parse(localCart);
  if (!cartItems.length) return [];

  try {
    // Add all items sequentially to ensure order
    const results = [];
    for (const item of cartItems) {
      const cartItem = {
        productId: item.id,
        quantity: item.quantity,
      };

      const result = await addToCart(username, cartItem);
      results.push(result);
    }

    // Only remove from localStorage after all items are added successfully
    localStorage.removeItem("cart");
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    // Return the newly added items
    return results;
  } catch (error) {
    console.error("Error merging carts:", {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      username: username,
      localItems: cartItems,
    });
    return [];
  }
};
