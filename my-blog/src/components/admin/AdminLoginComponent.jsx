// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { loginCallAPI } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLoginForm(e) {
    e.preventDefault();
    try {
      const response = await loginCallAPI(username, password);
      if (response.success && response.user) {
        // Kiểm tra role của user
        const roles = response.user.roles || [];
        console.log("User roles:", roles.includes("ROLE_ADMIN"));
        if (roles.includes("ROLE_ADMIN")) {
          navigate("/api/admin/home");
        } else {
          toast.error("You don't have admin privileges");
          // Logout user nếu không có quyền admin
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">Admin Login Form</h2>
            </div>
            <div className="card-body">
              <form>
                <div className="row mb-3">
                  <label className="col-md-4 control-label pt-2">
                    Username or email
                  </label>
                  <div className="col-md-8">
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Enter username or email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label className="col-md-4 control-label pt-2">Password</label>
                  <div className="col-md-8">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group text-center">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => handleLoginForm(e)}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginComponent;
