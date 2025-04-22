import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCallAPI } from '../../services/AuthService';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.username.trim()) {
      toast.error('Please enter a username');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { success } = await registerCallAPI({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (success) {
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 409) {
        toast.error('Username or email already exists');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Invalid registration data');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Create an account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <label htmlFor="name" className="form-label">
                Full name
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                placeholder=" "
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <label htmlFor="username" className="form-label">
                Username
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <label htmlFor="email" className="form-label">
                Email address
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
                onClick={() => togglePasswordVisibility('password')}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <label htmlFor="confirmPassword" className="form-label">
                Confirm password
              </label>
              <i 
                className={`password-toggle fa-solid ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                onClick={() => togglePasswordVisibility('confirm')}
              ></i>
            </div>
          </div>

          <button 
            type="submit" 
            className="sign-in-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <Link to="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;