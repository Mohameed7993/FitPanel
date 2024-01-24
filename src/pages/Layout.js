// Layout.js

import { Outlet, Link } from "react-router-dom";
import React from 'react';

import '../Layout.css';




const Layout = () => {

  var video='./image/vbackground2.mp4';
  return (
    <>
<video autoPlay muted loop id="myVideo">
<source src={require(`${video}`)}  type="video/mp4" ></source>
</video>
      <nav>  
        <ul>
          <li>
            <Link to="/" className="menu-item">Home</Link>
          </li>

          <li>
            <Link to="/login" className="menu-item">Login</Link>
          </li>

          <li>
            <Link to="/New Member" className="menu-item">New Member</Link>
          </li>

          <li>
            <Link to="/blogs" className="menu-item">Blogs</Link>
          </li>
          <li>
            <Link to="/contact" className="menu-item">Contact</Link>
          </li>

          <li>
            <Link to="/about" className="menu-item">About</Link>
          </li>

        </ul>
      </nav>

      <Outlet />


  
    </>



  );
};

export default Layout;
