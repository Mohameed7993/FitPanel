import React from 'react';
import img2 from './image/contact.jpeg'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Contacts = () => {
  return (
    <div className="container" style={{ textAlign: 'center', color: 'var(--text-color)', padding: '20px' }}>
      <h2 className="mb-4">Contact Me</h2>
      <div className="card mx-auto" style={{ maxWidth: '600px', padding: '20px', backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}>
        <img className="card-img-top" src={img2} alt="Card image" style={{ width: '100%', height: 'auto' }} />
        <div className="card-body">
          <div className="card" style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}>
            <h4 className="card-title" style={{ color: 'var(--text-color)' }}>Moahmeed Egbaria</h4>
            <p className="card-text" style={{ color: 'var(--text-color)' }}>For more details:</p>
            <div className="d-flex flex-wrap justify-content-center gap-3" style={{ padding: '20px' }}>
              <a href="tel:+972524269676" aria-label="Phone" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)' }}>
                <FontAwesomeIcon icon={faPhone} size="2x" />
              </a>
              <a href="mailto:software.egbaria@gmail.com" aria-label="Email" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)' }}>
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
              </a>
              <a href="https://wa.me/972524269676" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)' }}>
                <FontAwesomeIcon icon={faWhatsapp} size="2x" />
              </a>
              <a href="http://mohameedegbaria.com" aria-label="Website" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)' }}>
                <FontAwesomeIcon icon={faGlobe} size="2x" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
