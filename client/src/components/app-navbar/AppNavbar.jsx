import React from "react";
import "./AppNavbar.css";
import { FaHome } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const navigate = useNavigate();
  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="appnavbar-wrapper">
      <h5 onClick={() => navigate("/home-page")}>HAYAT MART</h5>
      <h6>Ai Face Recognition gallery</h6>
      <section className="appbar-right-side-icons">
        <p>
          <span
            style={{ backgroundColor: "#1f282f" }}
            className="appbar-home-icon"
            onClick={() => navigate("/home-page")}
          >
            <FaHome />
          </span>
        </p>
        <p>
          <button
            className="text-white hover:bg-gray-500 text-black px-3 py-2 rounded-md"
            onClick={handleSignout}
          >
            <FaSignOutAlt className="text-2xl" />
          </button>
        </p>
      </section>
    </div>
  );
};

export default AppNavbar;
