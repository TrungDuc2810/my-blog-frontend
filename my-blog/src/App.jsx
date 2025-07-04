import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/main/ScrollToTop";
import AdminHomeComponent from "./components/admin/AdminHomeComponent";
import ListPostComponent from "./components/admin/ListPostComponent";
import ListUserComponent from "./components/admin/ListUserComponent";
import MediaComponent from "./components/admin/MediaComponent";
import ProfileComponent from "./components/admin/ProfileComponent";
import SettingsComponent from "./components/admin/SettingsComponent";
import AdminLayoutComponent from "./components/admin/AdminLayoutComponent";
import "./RichTextEditor.css";

import UserHomeComponent from "./components/main/UserHomeComponent";
import PostDetailComponent from "./components/main/PostDetailComponent";
import LoginForm from "./components/main/LoginForm";
import RegisterForm from "./components/main/RegisterForm";
import ProductListComponent from "./components/products/ProductListComponent";
import ProductDetailComponent from "./components/products/ProductDetailComponent";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import CartComponent from "./components/products/CartComponent";
import OrdersComponent from "./components/main/OrdersComponent";
import UserLayoutComponent from "./components/main/UserLayoutComponent";
import AdminLoginComponent from "./components/admin/AdminLoginComponent";

// Protected Route for both admin and user routes
import PropTypes from "prop-types";

// Protected Route component - logic sẽ được xử lý bởi backend thông qua JWT
function ProtectedRoute({ children }) {
  return children;
}

// Admin Route component - logic sẽ được xử lý bởi backend thông qua JWT và roles
function AuthenticatedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/api/admin/login" replace />;
  }

  return children;
}

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const adminRoutes = [
  { path: "/api/admin/login", element: <AdminLoginComponent /> }, // Thêm route này
  { path: "/api/admin/home", element: <AdminHomeComponent /> },
  { path: "/api/admin/posts", element: <ListPostComponent /> },
  { path: "/api/admin/users", element: <ListUserComponent /> },
  { path: "/api/admin/media", element: <MediaComponent /> },
  { path: "/api/admin/profile", element: <ProfileComponent /> },
  { path: "/api/admin/settings", element: <SettingsComponent /> },
];

function AnimatedRoutes() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser, setCurrentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes with shared context */}
          <Route
            element={
              <UserLayoutComponent
                onSearch={setSearchTerm}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              >
                <Outlet context={{ searchTerm, currentUser, setCurrentUser }} />
              </UserLayoutComponent>
            }
          >
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<UserHomeComponent />} />
            <Route path="/posts/:postId" element={<PostDetailComponent />} />
            <Route path="/products" element={<ProductListComponent />} />
            <Route path="/products/:id" element={<ProductDetailComponent />} />
            <Route path="/cart" element={<CartComponent />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersComponent />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected admin routes */}
          {adminRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.path === "/api/admin/login" ? (
                  route.element
                ) : (
                  <AuthenticatedRoute>
                    <AdminLayoutComponent>{route.element}</AdminLayoutComponent>
                  </AuthenticatedRoute>
                )
              }
            />
          ))}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ToastContainer />
        <AnimatedRoutes />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
