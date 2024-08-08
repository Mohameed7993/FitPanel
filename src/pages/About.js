import React from 'react';
import img1 from './image/me1.jpeg'; // Import your image file
import img2 from './image/me2.jpeg'; // Import your image file
import video from './image/vme1.mp4'; // Import your video file
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
const About = () => {
  return (
    
    <div className="container py-5">
      <div className="row mt-4">
        <div className="col " style={{ color: 'var(--text-color)' }}>
          <h2 >About Me</h2>
          <p>My name is Mohamed. I'm a web developer and a personal trainer with over 3 years of experience. I'm highly motivated and passionate about helping others achieve their fitness goals. Fitness is not just a profession for me, but a way of life.</p>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card">
            <img src={img1} className="card-img-top" alt="Image1" />
            <div className="card-body">
              <p className="card-text">A moment from my training sessions.</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card">
            <img src={img2} className="card-img-top" alt="Image2" />
            <div className="card-body">
              <p className="card-text">Another snapshot of my fitness journey.</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <video className="card-img-top" controls>
              <source src={video} type="video/mp4" />
            </video>
            <div className="card-body">
              <p className="card-text">Check out my training video.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default About;
