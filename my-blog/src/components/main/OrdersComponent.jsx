import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PageTransition from './PageTransition';
import { getOrdersByUserId } from '../../services/OrderService';
import { getUserByUsername } from '../../services/UserService';
import OrderDetailsPopup from '../products/OrderDetailsPopup';

const OrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Try to get username from localStorage if currentUser is not available
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const username = currentUser?.username || storedUser?.username;

        if (!username) {
          console.log('No username found');
          setLoading(false);
          return;
        }
        
        // Get user details to get the ID
        const userResponse = await getUserByUsername(username);
        if (!userResponse.id) {
          console.log('No user ID found in response');
          setLoading(false);
          return;
        }

        // Fetch orders using the user ID
        const ordersResponse = await getOrdersByUserId(userResponse.id);
        setOrders(ordersResponse.content || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // Check if user is not logged in
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser && !storedUser) {
    return (
      <PageTransition>
        <div className="orders-container">
          <h2>Please log in to view your orders</h2>
        </div>
      </PageTransition>
    );
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="loading">Loading orders...</div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="orders-container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="orders-empty">
            <i className="fa-solid fa-box"></i>
            <h2>No orders yet</h2>
            <p>Your order history will appear here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div
                key={order.id}
                className="order-item"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className={`order-status status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p>Amount: ${order.amountMoney}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedOrder && (
          <OrderDetailsPopup
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default OrdersComponent;