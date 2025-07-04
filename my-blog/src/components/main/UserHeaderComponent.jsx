import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/AuthService";
import { getCartItems } from "../../services/CartService";
import { toast } from "react-toastify";
import { searchPostsByTitle } from "../../services/PostService";

const UserHeaderComponent = ({ onSearch, currentUser, setCurrentUser }) => {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const updateCartCount = useCallback(async () => {
    try {
      let itemCount = 0;

      if (currentUser?.username) {
        // Nếu user đã đăng nhập, lấy số lượng items từ API
        const cartItems = await getCartItems(currentUser.username);
        itemCount = cartItems.length;
      } else {
        // Nếu chưa đăng nhập, lấy số lượng items từ localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          itemCount = cart.length;
        }
      }
      setCartCount(itemCount);
    } catch (error) {
      console.error("Error updating cart count:", error);
      setCartCount(0);
    }
  }, [currentUser]);

  const fetchSuggestions = async (keyword) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await searchPostsByTitle(keyword, 0, 5, "id", "asc");
      setSuggestions(res.data.content);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (postId) => {
    setShowSuggestions(false);
    setInput("");
    navigate(`/posts/${postId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".header-search")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [updateCartCount]);

  const handleChange = (e) => {
    setInput(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    setInput("");
    onSearch(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(input);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/register");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      toast.success("Đăng xuất thành công!");

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      setCurrentUser(null);
      toast.error("Có lỗi xảy ra khi đăng xuất");
      window.location.href = "/";
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (input.trim() && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={handleSearch}
          ></i>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              {suggestions.map((post) => (
                <div
                  key={post.id}
                  className="search-suggestion-item"
                  onClick={() => handleSuggestionClick(post.id)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                  {post.title}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="header-sidenav">
          <Link to={"/"} className="link">
            <div className="header-sidenav-home">Home</div>
          </Link>
          <div className="header-sidenav-popular">Popular</div>
          <div className="header-sidenav-explore">
            <div style={{ cursor: "pointer" }}>
              Explore
              <i className="fa-solid fa-chevron-down"></i>
            </div>
            <div className="header-explore-dropdown">
              <Link to="/products" className="explore-dropdown-item">
                <i className="fa-solid fa-shop"></i>
                <span>Products</span>
              </Link>
            </div>
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
                  <Link
                    to="/orders"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <i className="fa-solid fa-box"></i>
                    <span>Orders</span>
                  </Link>
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
            <div className="header-auth-signup" onClick={handleSignup}>
              Sign up
            </div>
            <div className="header-auth-login" onClick={handleLogin}>
              Log in
            </div>
          </>
        )}
      </div>
    </div>
  );
};

UserHeaderComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  setCurrentUser: PropTypes.func.isRequired,
};

export default UserHeaderComponent;
