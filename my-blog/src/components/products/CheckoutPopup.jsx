import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createPayment } from "../../services/PaymentService";
import { createOrder } from "../../services/OrderService";
import { createOrderItem } from "../../services/OrderItemService";
import { getUserByUsername } from "../../services/UserService";
import { toast } from "react-toastify";
import { clearCart } from "../../services/CartService";

const CheckoutPopup = ({ cartItems, total, onClose }) => {
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (currentUser?.username) {
          const response = await getUserByUsername(currentUser.username);
          setUserDetails(response);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Could not load user details");
      }
    };
    fetchUserDetails();
  }, [currentUser]);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // 1. Tạo đơn hàng mới với cấu trúc OrderDto
      const orderData = {
        userId: userDetails.id,
        totalAmount: total, // Sẽ được chuyển thành amountMoney trong service
        status: "PENDING",
        createdAt: new Date().toISOString()
      };

      const createdOrder = await createOrder(orderData);

      // 2. Tạo các order items với cấu trúc OrderItemDto
      const orderItemPromises = cartItems.map(item => 
        createOrderItem({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discountPrice: item.price // Sử dụng giá hiện tại làm giá khuyến mãi vì đã được tính toán trong CartComponent
        })
      );

      await Promise.all(orderItemPromises);

      // 3. Tạo URL thanh toán VNPay
      const orderInfo = `Thanh toan don hang: ${createdOrder.id}`;
        const amount = Math.round(total * 10000);
      const vnpayUrl = await createPayment(amount, orderInfo);
      
      // 4. Xóa giỏ hàng sau khi tạo đơn hàng thành công
      await clearCart(currentUser.username);
      
      // 5. Chuyển hướng đến trang thanh toán VNPay
      window.location.href = vnpayUrl;

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Could not process checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content checkout-modal">
        <h2>Checkout</h2>
        
        <div className="checkout-section">
          <h3>Customer Information</h3>
          <div className="customer-info">
            <p><strong>Name:</strong> {userDetails?.name || 'Loading...'}</p>
            <p><strong>Email:</strong> {userDetails?.email || 'Loading...'}</p>
          </div>
        </div>

        <div className="checkout-section">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total:</strong>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="checkout-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            <label className="payment-method">
              <input
                type="radio"
                value="vnpay"
                checked={paymentMethod === "vnpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="/vnpay-logo.jpg" alt="VNPay" />
              <span>VNPay</span>
            </label>
          </div>
        </div>

        <div className="checkout-actions">
          <button 
            className="checkout-submit" 
            onClick={handleCheckout}
            disabled={loading || !userDetails}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
          <button className="checkout-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

CheckoutPopup.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CheckoutPopup;