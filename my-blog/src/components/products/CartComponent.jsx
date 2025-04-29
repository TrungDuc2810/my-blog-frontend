import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { getCartItems, updateCartItem, deleteCartItem, mergeLocalStorageCart } from "../../services/CartService";
import { getProductById } from "../../services/ProductService";
import CheckoutPopup from "./CheckoutPopup";

const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadCartItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const loadCartItems = async () => {
    if (currentUser?.username) {
      try {
        // Merge cart first and wait for it to complete
        await mergeLocalStorageCart(currentUser.username);
        
        // Now get all cart items
        const items = await getCartItems(currentUser.username);

        // Fetch product details for each cart item
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.productId);
            const price = product.discountPrice > 0 ? product.discountPrice : product.price;
            return {
              id: item.id, // cart item id
              productId: item.productId, // product id
              name: product.name,
              price: price,
              image: product.productThumbnail?.filePath,
              quantity: item.quantity
            };
          })
        );
        
        setCartItems(itemsWithDetails);
      } catch (error) {
        console.error('Error loading cart items:', error);
        toast.error('Lỗi khi tải giỏ hàng');
      }
    } else {
      // If not logged in, load from localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    if (currentUser?.username) {
      try {
        const cartItem = cartItems.find(item => item.id === productId);
        await updateCartItem(cartItem.id, newQuantity);
        await loadCartItems(); // Reload cart from database
      } catch {
        toast.error("Lỗi khi cập nhật số lượng");
        return;
      }
    } else {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (currentUser?.username) {
      try {
        const cartItem = cartItems.find(item => item.id === productId);
        await deleteCartItem(cartItem.id);
        await loadCartItems(); // Reload cart from database
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      } catch {
        toast.error("Lỗi khi xóa sản phẩm");
        return;
      }
    } else {
      const updatedItems = cartItems.filter((item) => item.id !== productId);
      setCartItems(updatedItems);
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    }
    window.dispatchEvent(new Event("cartUpdated"));
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
    setShowCheckout(true);
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
    <>
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

      {showCheckout && (
        <CheckoutPopup
          cartItems={cartItems}
          total={calculateTotal()}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
};

export default CartComponent;