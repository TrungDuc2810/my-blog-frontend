// eslint-disable-next-line no-unused-vars
import React from "react";
import { Ripple, initMDB } from "mdb-ui-kit";

initMDB({ Ripple });

const AdminFooterComponent = () => {
  // Dữ liệu liên kết mạng xã hội
  const socialLinks = [
    { icon: "facebook-f", href: "#!" },
    { icon: "twitter", href: "#!" },
    { icon: "google", href: "#!" },
    { icon: "instagram", href: "#!" },
    { icon: "linkedin", href: "#!" },
    { icon: "github", href: "#!" },
  ];

  // Hàm để render mỗi liên kết mạng xã hội
  const renderSocialLink = (link) => (
    <a
      key={link.icon}
      data-mdb-ripple-init
      className="btn btn-link btn-floating btn-lg text-body m-1"
      href={link.href}
      role="button"
      data-mdb-ripple-color="dark"
    >
      <i className={`fab fa-${link.icon} fa-1.5x`}></i>
    </a>
  );

  return (
    <div>
      <footer className="text-center footer">
        <section>{socialLinks.map(renderSocialLink)}</section>
      </footer>
    </div>
  );
};

export default AdminFooterComponent;
