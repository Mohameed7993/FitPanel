import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace this with a real API call to your backend/email service
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setFormStatus('error');
    }
  };

  return (
    <div className="container py-5 " style={{ color: 'var(--text-color)', textAlign: 'center' }}>
      <h2 className="mb-4">צור קשר</h2>

      <div className="card shadow-lg mx-auto mb-5 text-white" style={{ maxWidth: '500px', backgroundColor: 'var(--text-color)', borderRadius: '20px' }}>
        <div className="card-body py-4 ">
          <h4 className="card-title mb-3 text-white">מוחמד אגבאריה</h4>
          <p className="card-text mb-4 text-white">לכל שאלה, בקשה או שיתוף פעולה – אני כאן!</p>

          <div className="d-flex flex-wrap justify-content-center gap-4">
            <a href="tel:+972524269676" className="btn btn-outline-light rounded-circle shadow" aria-label="Phone" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faPhone} />
            </a>
            <a href="mailto:software.egbaria@gmail.com" className="btn btn-outline-light rounded-circle shadow" aria-label="Email" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a href="https://wa.me/972524269676" className="btn btn-outline-light rounded-circle shadow" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a href="https://mohameedegbaria.com" className="btn btn-outline-light rounded-circle shadow" aria-label="Website" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGlobe} />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contacts;
