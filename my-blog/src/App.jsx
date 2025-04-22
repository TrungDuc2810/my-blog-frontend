import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/main/ScrollToTop';
import AdminHomeComponent from './components/admin/AdminHomeComponent';
import ListPostComponent from './components/admin/ListPostComponent';
import ListUserComponent from './components/admin/ListUserComponent';
import MediaComponent from './components/admin/MediaComponent';
import ProfileComponent from './components/admin/ProfileComponent';
import SettingsComponent from './components/admin/SettingsComponent';
import LayoutComponent from './components/admin/LayoutComponent';
import './RichTextEditor.css'

import UserHomeComponent from './components/main/HomeComponent';
import PostDetailComponent from './components/main/PostDetailComponent';
import LoginForm from './components/main/LoginForm';
import RegisterForm from './components/main/RegisterForm';
import ProductListComponent from './components/products/ProductListComponent';
import ProductDetailComponent from './components/products/ProductDetailComponent';
import './components/products/Products.css';
import HeaderComponent from './components/main/HeaderComponent';
import FooterComponent from './components/main/FooterComponent';
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import CartComponent from './components/products/CartComponent';

// Protected Route for both admin and user routes
import PropTypes from 'prop-types';

// Protected Route component - logic sẽ được xử lý bởi backend thông qua JWT
function ProtectedRoute({ children }) {
  return children;
}

// Admin Route component - logic sẽ được xử lý bởi backend thông qua JWT và roles
function AuthenticatedRoute({ children }) {
  return children;
}

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const adminRoutes = [
  { path: '/api/home', element: <AdminHomeComponent /> },
  { path: '/api/posts', element: <ListPostComponent /> },
  { path: '/api/users', element: <ListUserComponent /> },
  { path: '/api/media', element: <MediaComponent /> },
  { path: '/api/profile', element: <ProfileComponent /> },
  { path: '/api/settings', element: <SettingsComponent /> },
];

function AnimatedRoutes() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser, setCurrentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <ScrollToTop />
      {!isAuthPage && (
        <HeaderComponent 
          onSearch={setSearchTerm} 
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes with shared context */}
          <Route element={<Outlet context={{ searchTerm, currentUser, setCurrentUser }} />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<UserHomeComponent />} />
            <Route path="/posts/:postId" element={<PostDetailComponent />} />
            <Route path="/products" element={<ProductListComponent />} />
            <Route path="/products/:id" element={<ProductDetailComponent />} />
            <Route path="/cart" element={<CartComponent />} />
          </Route>

          {/* Protected admin routes */}
          {adminRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <AuthenticatedRoute>
                  <LayoutComponent>{route.element}</LayoutComponent>
                </AuthenticatedRoute>
              }
            />
          ))}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {!isAuthPage && <FooterComponent />}
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
