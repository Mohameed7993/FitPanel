import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import logoImage from './image/Mo ‘s.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ThemeToggle from './ThemeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faSignInAlt, faInfoCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Layouts() {
  const { currentUser, logout } = useAuth();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleOffcanvasToggle = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  return (
    <>
      {/* Offcanvas for small screens */}
      
      <Offcanvas show={showOffcanvas} onHide={handleOffcanvasToggle} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={logoImage} alt="Logo" style={{ width: '90px', height: 'auto' }} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="navbar-nav">
            {!currentUser && (
              <>
                <li className="nav-item">
                  <a className="nav-link" style={{ color: 'black' }} href="/">
                    <FontAwesomeIcon icon={faHome} /> בית
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" style={{ color: 'black' }} href="/login">
                    <FontAwesomeIcon icon={faSignInAlt} /> כניסה
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" style={{ color: 'black' }} href="/about">
                    <FontAwesomeIcon icon={faInfoCircle} /> אודות
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" style={{ color: 'black' }} href="/contact">
                    <FontAwesomeIcon icon={faEnvelope} /> צור קשר
                  </a>
                </li>
              </>
            )}
          </ul>
          <ThemeToggle />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Header for both small and large screens */}
      <header className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: 'var(--primary-color)' }}>
        {/* Logo and Toggle Button */}
        <div className="d-flex align-items-center">
          <a className="navbar-brand" href="#">
            <img src={logoImage} alt="Logo" style={{ width: '90px', height: 'auto' }} />
            {/* <button onClick={logout}>aaaa</button> */}

          </a>
          {!currentUser&&( <button
            className="navbar-toggler d-lg-none ms-3"
            type="button"
            onClick={handleOffcanvasToggle}
            aria-controls="offcanvasNavbar"
            aria-expanded={showOffcanvas}
            aria-label="Toggle navigation"
          >
            <FontAwesomeIcon icon={faBars}  />
          </button>)}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle className="d-none d-lg-block" />

        {/* Regular Navbar for larger screens */}
        <nav className="navbar navbar-expand-lg d-none d-lg-block">
          <div className="container-fluid">
            <div className="collapse navbar-collapse justify-content-end" id="navbarColor01">
              <ul className="navbar-nav">
                {!currentUser && (
                  <>
                    <li className="nav-item">
                      <a className="nav-link" style={{ color: 'black' }} href="/">
                        <FontAwesomeIcon icon={faHome} /> Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" style={{ color: 'black' }} href="/login">
                        <FontAwesomeIcon icon={faSignInAlt} /> Login
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" style={{ color: 'black' }} href="/about">
                        <FontAwesomeIcon icon={faInfoCircle} /> About
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" style={{ color: 'black' }} href="/contact">
                        <FontAwesomeIcon icon={faEnvelope} /> Contact
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
