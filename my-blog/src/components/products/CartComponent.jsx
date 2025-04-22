import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load cart items from localStorage when component mounts
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Sử dụng giá đã được lưu trong giỏ hàng (có thể là giá gốc hoặc giá khuyến mãi)
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      return;
    }
    // Implement checkout logic here
    toast.info("Tính năng thanh toán đang được phát triển");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <i className="fa-solid fa-cart-shopping cart-empty-icon"></i>
        <h2>Empty Cart</h2>
        <p>Please add products to your cart</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Cart Items</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">
                {item.price.toLocaleString("vi-VN")}$
              </p>
            </div>
            <div className="cart-item-quantity">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="quantity-btn"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            <p className="cart-item-total">{(item.price * item.quantity).toFixed(2)}$</p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>{calculateTotal().toFixed(2)}$</span>
        </div>

        <div className="checkout-btn-container">
          <button onClick={handleCheckout} className="checkout-btn">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
