// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../Home.css'; // Import your custom CSS file
import gymImage from './image/Mo Dumbels C.png'; // Import your image file

function Home() {
  return (
    <div className="gym-home-container">
      <div className="background-image"></div>
      <div className="gym-home-content">
      <img className="imagehome" src={gymImage} alt="Gym" />

        <h1 className="gym-home-title">WELCOME TO OUR FITNESS WORLD</h1>
        <p className="gym-home-description">
          Your journey to a healthier lifestyle starts here.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          
        </p>
        <Link to="/login" className="gym-home-button">Login</Link>
        <Link to="/New Member" className="gym-home-button">Sign Up</Link>
      </div>
    
    </div>
  );
}

export default Home;
