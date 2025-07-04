// eslint-disable-next-line no-unused-vars
import React from 'react';
import SidenavComponent from './SidenavComponent';
import AdminHeaderComponent from './AdminHeaderComponent';
import AdminFooterComponent from './AdminFooterComponent';

// eslint-disable-next-line react/prop-types
const AdminLayoutComponent = ({ children }) => {
  return (
    <div className="layout">
      <SidenavComponent />
      <div className="right-container">
        <AdminHeaderComponent />
        {children}
        <AdminFooterComponent />
      </div>
    </div>
  );
};

export default AdminLayoutComponent;
