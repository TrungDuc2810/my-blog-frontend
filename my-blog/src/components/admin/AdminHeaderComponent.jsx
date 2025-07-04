// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation và useNavigate
import { logout } from "../../services/AuthService";

const AdminHeaderComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initMDB({ Dropdown, Collapse });
  }, []);

  const handleIconClick = (event, link) => {
    event.preventDefault();
    navigate(link);
  };

  const handleLogout = () => {
    logout();
    navigate("/api/admin/login"); // Chuyển hướng về trang login sau khi logout
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
        <div className="container-fluid p-0">
          <div className="row w-100 d-flex align-items-center">
            {/* Left Column */}
            <div className="col-4 d-flex align-items-center">
              <Link
                className="navbar-brand me-0 mt-2 mt-lg-0 ms-3"
                to="/api/admin"
              >
                <img
                  src="/logo.png"
                  height="auto"
                  width="30"
                  alt="My Blog Logo"
                  loading="lazy"
                />
              </Link>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/api/admin">
                    MY BLOG | ADMIN MANAGEMENT
                  </Link>
                </li>
              </ul>
            </div>

            {/* Center Column */}
            <div className="col-4 text-center icon-container">
              {/* Home Icon */}
              <div
                className={`icon-hover ${
                  location.pathname === "/api/admin/home" ? "active" : ""
                }`}
                onClick={(event) => handleIconClick(event, "/api/admin/home")}
              >
                <i className="fa-solid fa-house"></i>
              </div>

              {/* Posts Icon */}
              <div
                className={`icon-hover ${
                  location.pathname === "/api/admin/posts" ? "active" : ""
                }`}
                onClick={(event) => handleIconClick(event, "/api/admin/posts")}
              >
                <i className="fa-solid fa-newspaper"></i>
              </div>

              {/* Users Icon */}
              <div
                className={`icon-hover ${
                  location.pathname === "/api/admin/users" ? "active" : ""
                }`}
                onClick={(event) => handleIconClick(event, "/api/admin/users")}
              >
                <i className="fa-solid fa-users"></i>
              </div>

              {/* Media Icon */}
              <div
                className={`icon-hover ${
                  location.pathname === "/api/admin/media" ? "active" : ""
                }`}
                onClick={(event) => handleIconClick(event, "/api/admin/media")}
              >
                <i className="fa-solid fa-photo-film"></i>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-4 d-flex justify-content-end align-items-center position-relative">
              <div className="dropdown mt-1 me-2">
                <a
                  className="text-reset me-3 dropdown-toggle hidden-arrow"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-bell"></i>
                  <span className="badge rounded-pill badge-notification bg-danger">
                    99+
                  </span>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Someone posted a new post
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another news
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a
                  className="dropdown-toggle d-flex align-items-center hidden-arrow"
                  href="#"
                  id="navbarDropdownMenuAvatar"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="/default.png"
                    className="rounded-circle"
                    height="25"
                    alt="Black and White Portrait of a Man"
                    loading="lazy"
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuAvatar"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      My profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminHeaderComponent;
