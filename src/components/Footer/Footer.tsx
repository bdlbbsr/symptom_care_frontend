import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";

function Footer() {
  const { user, logout } = useAuth();

  return (
    <footer className="footer" role="contentinfo">
      <h1 className="logoTxt">Symptom Care</h1>

      <nav className="footerNav" aria-label="Footer navigation">
      <NavLink
  to="/"
  className="navLinkStl cartIcon"
  aria-label="Home"
  role="link"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className="bi bi-house-door-fill"
    viewBox="0 0 16 16"
    aria-labelledby="homeIconTitle"
  >
    <title id="homeIconTitle">Home</title>
    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
  </svg>
</NavLink>


        <NavLink
          to="/doctors"
          className="navLinkStl cartIcon"
          aria-label="Doctors" role="link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-doctor"
            viewBox="0 0 256 256"
            aria-labelledby="doctorIconTitle"
          >
            <title id="doctorIconTitle">Doctors</title>
            <g><g><g><path fill="currentColor" d="M119.5,10.7c-16,2.7-30.1,12.8-37.8,27.1c-7.7,14.5-8,33.2-0.6,47.9c11.6,23.3,39.1,34.6,63.6,26.3c15.5-5.3,27.7-17.5,32.8-32.8c5.3-15.8,3.1-32.1-6.2-46.3C169,29.3,161,21.3,157.4,19C146,11.5,132.4,8.5,119.5,10.7z"/><path fill="currentColor" d="M120.8,134.4c-8.4,0.4-22.6,1.9-25.3,2.8c-0.8,0.2-0.8,1.6-0.8,19.4v19.1l1.6,0.8c6.6,3.2,9.6,11.5,6.7,18.3c-1.5,3.4-5.3,6.8-8.7,7.8c-5.4,1.6-11.2,0-14.8-4.2c-2.3-2.6-3.3-5.5-3.3-9.5c0-5.2,3.1-10.1,7.7-12.3l1.5-0.7v-18c0-13.1-0.1-18.1-0.5-18.1c-1.4,0-10.9,3.6-15.7,5.8c-23.4,11.3-37,31-39.4,57.4c-0.3,3.1-0.5,12-0.4,20.2c0.1,13.9,0.2,14.7,1.2,16.4c1.2,2.2,3.4,4.4,5.7,5.6C37.9,246,41,246,128,246h90.1l1.9-1c2.2-1.2,4.4-3.4,5.6-5.7c0.8-1.5,0.9-3.1,1-16.2c0.2-24.6-1.3-33.9-7.8-47c-6.5-13.1-17.4-23.5-32-30.5c-4.8-2.3-14.3-5.8-15.7-5.8c-0.4,0-0.5,3.1-0.4,11.2l0.1,11.2l2.5,0.6c9.1,2.3,16,9.6,19,20.1c2.1,7.5,1.7,19.1-1.1,26.6c-0.7,1.8-1,3.4-0.8,4.6c0.3,2.7-0.3,4.8-1.9,6.7c-3.2,3.7-8.2,3.9-11.6,0.7c-1.9-1.8-2.6-3.4-2.6-5.9c0-3.8,2.4-7.1,5.8-7.9c2.1-0.5,2.4-0.9,3.3-4.5c1.1-4.1,1.2-12.8,0.2-16.5c-2.4-9.6-7.8-14.6-16.4-15.1c-8.1-0.5-13.5,2.5-17,9.5c-2.7,5.4-3.6,13.9-2.1,20.7c1,4.5,1.5,5.8,2.7,5.8c1.8,0,4.6,2,5.7,4.1c3.8,7.2-3.8,14.9-11,11.1c-3.1-1.7-4.9-5.4-4.2-8.8c0.2-1.1,0-2.3-0.7-4.1c-2-4.9-2.6-9.7-2.4-17.1c0.3-7.7,0.9-10.5,3.7-16.2c3.2-6.8,9.7-12.1,16.7-13.7l2.4-0.6l0.1-12.3c0.1-10.5,0-12.4-0.6-12.6c-1.2-0.5-10-1.7-15.6-2.1C138.9,134.5,126.1,134.2,120.8,134.4z"/></g></g></g>
          </svg>
        </NavLink>

        <NavLink
          to="/about"
          className="navLinkStl cartIcon"
          aria-label="About" role="link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-info-square-fill"
            viewBox="0 0 16 16"
            aria-labelledby="aboutIconTitle"
          >
            <title id="aboutIconTitle">About</title>
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
          </svg>
        </NavLink>

        <NavLink
          to="/contact"
          className="navLinkStl cartIcon"
          aria-label="Contact" role="link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-envelope-fill"
            viewBox="0 0 16 16"
            aria-labelledby="contactIconTitle"
          >
            <title id="contactIconTitle">Contact</title>
            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
          </svg>
        </NavLink>

        <NavLink to="/login" className="navLinkStl cartIcon" aria-label="Login" role="link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
            aria-labelledby="loginIconTitle"
          >
            <title id="loginIconTitle">Login</title>
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg>
        </NavLink>
        {user && (
          <button onClick={() => logout()} className="btn-back" aria-label="Logout" role="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#999"
              className="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
               aria-labelledby="logoutIconTitle"
            >
              <title id="logoutIconTitle">Logout</title>
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
          </button>
        )}
       
      </nav>
    </footer>
  );
}

export default Footer;
