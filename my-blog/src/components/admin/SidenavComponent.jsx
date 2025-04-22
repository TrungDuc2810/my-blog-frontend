// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const SidenavComponent = () => {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);

  // Function to toggle sidenav visibility
  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  // Get the current URL to set the active tab
  const location = useLocation();

  // Array of tab names and their corresponding href
  const tabs = [
    { name: "Home", href: "/api/home" },
    { name: "Posts", href: "/api/posts" },
    { name: "Users", href: "/api/users" },
    { name: "Media", href: "/api/media" },
    { name: "Profile", href: "/api/profile" },
    { name: "Settings", href: "/api/settings" },
  ];

  // Function to render each tab link dynamically
  const renderTab = (tab) => (
    <Link
      key={tab.name}
      className={`nav-link mb-2 fs-6 ${
        location.pathname === tab.href ? "active" : ""
      }`}
      id="v-tabs"
      to={tab.href}
    >
      {tab.name}
    </Link>
  );

  return (
    <>
      {/* Menu toggle button */}
      <div className="menu-toggle" onClick={toggleSidenav}>
        ☰
      </div>

      {/* Side navigation container */}
      <div className={`left-container ${isSidenavOpen ? "open" : ""}`}>
        <div className="row">
          <div className="col-12">
            <div
              className="nav flex-column nav-tabs text-center"
              role="tablist"
            >
              {/* Render each tab dynamically */}
              {tabs.map(renderTab)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidenavComponent;
