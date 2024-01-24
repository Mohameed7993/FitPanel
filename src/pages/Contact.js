// contacts.js

import React from 'react';
import '../Contacts.css';  // Import your CSS file

const Contacts = () => {
  return (
    <div className="contacts-container">
      <h2>Contact Me</h2>
      <div className="contact-cards">
        <div className="contact-card">
          <h3>Phone Number</h3>
          <p><a href="tel:+0524269676">0524269676</a></p>
        </div>
        <div className="contact-card">
          <h3>Email</h3>
          <p><a href="mailto:software.egbaria@gmail.com">software.egbaria@gmail.com</a></p>
        </div>
        <div className="contact-card">
          <h3>Personal Website</h3>
          <p><a href="http://mohameedegbaria.com" target="_blank" rel="noopener noreferrer">mohameedegbaria.com</a></p>
        </div>
        <div className="contact-card">
          <h3>WhatsApp</h3>
          <p><a href="https://wa.link/zkjjnk" target="_blank" rel="noopener noreferrer">#https://wa.link/zkjjnk</a></p>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
