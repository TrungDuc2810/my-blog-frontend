import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/AuthService";
import { toast } from "react-toastify";

const HeaderComponent = ({ onSearch, currentUser, setCurrentUser }) => {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const exploreDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(event.target)) {
        setShowExploreDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Cập nhật số lượng ban đầu
    updateCartCount();

    // Lắng nghe sự kiện cập nhật giỏ hàng
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const count = cart.length;
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/register');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      toast.success('Đăng xuất thành công!');
      
      // Force a complete page reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      setCurrentUser(null);
      toast.error('Có lỗi xảy ra khi đăng xuất');
      // Still redirect on error
      window.location.href = '/';
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleExploreDropdown = () => {
    setShowExploreDropdown(!showExploreDropdown);
  };

  return (
    <div className="blog__header">
      <div className="header-left">
        <Link to={"/"} className="link">
          <div className="header-logo">𝓒𝓾𝓭𝓭𝔂</div>
        </Link>
        <div className="header-search">
          <input
            className="header-search-input"
            type="text"
            placeholder="What are you looking for?"
            value={input}
            onChange={handleChange}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <div className="header-sidenav">
          <div className="header-sidenav-home">Home</div>
          <div className="header-sidenav-popular">Popular</div>
          <div className="header-sidenav-explore" ref={exploreDropdownRef}>
            <div onClick={toggleExploreDropdown} style={{ cursor: 'pointer' }}>
              Explore
              <i className={`fa-solid fa-chevron-${showExploreDropdown ? 'up' : 'down'}`}></i>
            </div>
            {showExploreDropdown && (
              <div className="header-explore-dropdown">
                <Link to="/products" className="explore-dropdown-item" onClick={() => setShowExploreDropdown(false)}>
                  <i className="fa-solid fa-shop"></i>
                  <span>Products</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="header-auth">
        {currentUser ? (
          <>
            <Link to="/cart" className="header-cart">
              <i className="fa-solid fa-shopping-cart"></i>
              <span className="cart-count">{cartCount}</span>
            </Link>
            <div className="header-user-profile" ref={dropdownRef}>
              <img 
                src="/default.png" 
                alt="User Avatar" 
                className="header-avatar"
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <div className="header-dropdown">
                  <div className="dropdown-item">
                    <i className="fa-regular fa-user"></i>
                    <span>Account Details</span>
                  </div>
                  <div className="dropdown-item">
                    <i className="fa-regular fa-bell"></i>
                    <span>Notifications</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item">
                    <i className="fa-solid fa-gear"></i>
                    <span>Settings</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sign Out</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/cart" className="header-cart">
              <i className="fa-solid fa-shopping-cart"></i>
              <span className="cart-count">{cartCount}</span>
            </Link>
            <div className="header-auth-signup" onClick={handleSignup}>Sign up</div>
            <div className="header-auth-login" onClick={handleLogin}>Log in</div>
          </>
        )}
      </div>
    </div>
  );
};

HeaderComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  setCurrentUser: PropTypes.func.isRequired
};

export default HeaderComponent;
