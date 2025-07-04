import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getOrderItemsByOrderId } from "../../services/OrderItemService";
import { getProductById } from "../../services/ProductService";

const OrderDetailsPopup = ({ order, onClose }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const items = await getOrderItemsByOrderId(order.id);
        // Lấy tên sản phẩm từ productId cho từng item
        const itemsWithProductName = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.productId);
            return {
              ...item,
              productName: product?.name,
            };
          })
        );
        setOrderItems(itemsWithProductName);
      } catch {
        setOrderItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderItems();
  }, [order.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content order-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Order #{order.id} Details</h2>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Total:</strong> ${order.amountMoney}
        </p>
        <hr />
        <h3>Items</h3>
        {loading ? (
          <div>Loading...</div>
        ) : orderItems.length === 0 ? (
          <div>No items found.</div>
        ) : (
          <div className="order-items-list">
            {orderItems.map((item) => (
              <div key={item.id} className="order-item">
                <span className="item-name">
                  {item.productName || item.name}
                </span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button className="order__details-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

OrderDetailsPopup.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderDetailsPopup;
