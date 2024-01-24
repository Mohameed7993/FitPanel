// about.js

import React from 'react';
import '../About.css';  // Import the CSS file

const About = () => {
  var img1 ='./image/me1.jpeg';
  var img2 ='./image/me2.jpeg';
  var video='./image/vme1.mp4';

  return (
    <div className="about-container">
      <h2>About Me</h2>
     
      {/* Add your images and local video here */}
      <div className="media-container">
        <img src={require(`${img1}`)} alt="Image1" />
        <img src={require(`${img2}`)}  alt="Image2" />
        {/* Add more images as needed */}
        <video width="560" height="315" controls>
          <source src={require(`${video}`)}  type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default About;
