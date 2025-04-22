// eslint-disable-next-line no-unused-vars
import React from 'react';
import SidenavComponent from './SidenavComponent';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';

// eslint-disable-next-line react/prop-types
const LayoutComponent = ({ children }) => {
  return (
    <div className="layout">
      <SidenavComponent />
      <div className="right-container">
        <HeaderComponent />
        {children}
        <FooterComponent />
      </div>
    </div>
  );
};

export default LayoutComponent;
