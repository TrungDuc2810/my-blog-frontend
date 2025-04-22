import { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { loginCallAPI, redirectToGoogleLogin } from '../../services/AuthService';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useOutletContext() || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { success, user } = await loginCallAPI(formData.usernameOrEmail, formData.password);
      
      if (success && user) {
        setCurrentUser(user);
        toast.success('Đăng nhập thành công!');
        navigate('/', { replace: true });
      } else {
        toast.error('Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 403) {
        toast.error('Sai tên đăng nhập hoặc mật khẩu');
      } else if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    redirectToGoogleLogin();
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Welcome back</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                className="form-input"
                placeholder=" "
                value={formData.usernameOrEmail}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <label htmlFor="usernameOrEmail" className="form-label">
                Username or email address
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <i 
                className={`password-toggle fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>

          <button 
            type="submit" 
            className="sign-in-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="divider-container">
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        <button 
          className="google-button" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="google-icon"
          />
          Continue with Google
        </button>

        <Link to="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;