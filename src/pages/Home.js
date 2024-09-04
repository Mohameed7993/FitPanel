import React from 'react';
import { Link } from 'react-router-dom';
import gymImage from './image/newlogo.png'; // Import your image file
import { Container, Row, Col } from 'react-bootstrap';
import trainerImage from './image/2.png'; // Replace with actual image path
import customerImage from './image/1.png'; // Replace with actual image path

function Home() {
 

  return (<>
    <Container className="d-flex flex-column align-items-center justify-content-center "  style={{ borderBottom: '3px solid var(--text-color)' }}>
      <div className="row align-items-center">
        <div className="col-md-6 mb-3 mb-md-0">
          <img src={gymImage} alt="Gym" className="img-fluid" />
        </div>
        <div className="col-md-6 text-center text-md-start" style={{ color: 'var(--text-color)' }}>
          <h1 className="display-4 fw-bold ">WELCOME TO OUR FITNESS WORLD</h1>
          <p className="lead" >
            Your journey to a healthier lifestyle starts here.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div>
            <Link to="/login" className="btn btn-primary me-2">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
      </div>
    </Container>
    <Container className="my-5">
            {/* Trainer Section */}
            <Row className="align-items-center mb-5">
                <Col md={6}>
                    <img width={300} src={trainerImage} alt="Trainer" className="img-fluid" />
                </Col>
                <Col md={6}>
                    <h2>For Trainers</h2>
                    <p>
                        Our platform helps trainers manage their clients' details efficiently. 
                        You can add and organize food and training plans, track progress, and 
                        view client measurements and images all in one place. Say goodbye to 
                        the mess of WhatsApp and enjoy a more streamlined approach to managing 
                        your clients.
                    </p>
                </Col>
            </Row>

            {/* Customer Section */}
            <Row className="align-items-center mb-5 flex-md-row-reverse">
                <Col md={6}>
                    <img  width={300} src={customerImage} alt="Customer" className="img-fluid" />
                </Col>
                <Col md={6}>
                    <h2>For Customers</h2>
                    <p>
                        As a customer, you can easily upload your measurements and images, 
                        and keep track of your progress. Our platform allows you to access 
                        your training and food plans provided by your trainer in an organized 
                        and accessible manner. Enjoy a more structured and engaging fitness 
                        experience with Mo-Dumbels.
                    </p>
                </Col>
            </Row>
        </Container>
    </>
  );
}

export default Home;
