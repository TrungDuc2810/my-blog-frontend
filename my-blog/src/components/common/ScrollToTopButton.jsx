import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const ScrollToTopButton = ({ showBelow = 300 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > showBelow);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showBelow]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return show ? (
    <button
      onClick={handleClick}
      className="scroll-to-top-btn"
      aria-label="Scroll to top"
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  ) : null;
};

export default ScrollToTopButton;