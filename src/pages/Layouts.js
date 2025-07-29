import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import logoImage from './image/fitpanel.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
      {/* Header for both small and large screens */}
      <header className="d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: 'var(--text-color)' }}>
        {/* Left: Logo */}
        <div className="d-flex align-items-center">
          <a className="navbar-brand" href="/">
            <img src={logoImage} alt="Logo" style={{ width: '110px', height: '90px' }} />
          </a>
        </div>

        {/* Spacer to push content to the right */}
        <div className="flex-grow-1"></div>

        {/* Right: About & Contact Buttons */}
        {!currentUser && (
          <div className="d-flex">
            <a href="/about" className="btn btn-light mx-2">
              About
            </a>
            <a href="/contact" className="btn btn-light">
              Contact
            </a>
          </div>
        )}
      </header>
    </>
  );
}
