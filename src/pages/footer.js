import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-black bg-opacity-50 text-white text-center py-3" style={{ width: "100%" }}>
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="mb-2 mb-md-0">&copy; Mo-Dumbels 2024</p>
                    <p className="mb-2 mb-md-0">All rights reserved for Moahmeed Egbaria</p>
                    <div className="d-flex gap-3">
                        <a href="https://www.facebook.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-white">
                            <FontAwesomeIcon icon={faFacebook} size="lg" />
                        </a>
                        <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-white">
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </a>
                        <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-white">
                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                        </a>
                        <a href="https://yourportfoliowebsite.com" target="_blank" rel="noopener noreferrer" className="text-white">
                            <FontAwesomeIcon icon={faLinkedin} size="lg" /> {/* Consider a different icon for your portfolio */}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
