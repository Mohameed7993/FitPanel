// import React, { useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import gymImage from './image/fitpanel1.png';
// import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
// import { useAuth } from './context/AuthContext';

// function Home() {
//   const emailRef = useRef();
//   const passwordRef = useRef();
//   const { login, logout } = useAuth();
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       setError('');
//       setLoading(true);
//       await login(emailRef.current.value, passwordRef.current.value);

//       const userlogindetails = JSON.parse(localStorage.getItem('userLoginDetails'));

//       if (userlogindetails) {
//         if (userlogindetails.membershipStatus === 'activated') {
//           switch (userlogindetails.role) {
//             case 2:
//               navigate('/customer');
//               break;
//             case 10:
//               navigate('/master');
//               break;
//             case 8:
//               navigate('/trainer');
//               break;
//             default:
//               navigate('/');
//           }
//         } else {
//             setError('Your membership is not activated. Please contact support.');

//             // Show alert message
//             alert('Your membership is not activated. You will now be logged out.');

//             // Then logout the user
//             await logout();
//           }
//       } else {
//         setError('User not found');
//         await logout();
//       }
//     } catch (err) {
//       setError('Failed to log in');
//       await logout();
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <Container className="d-flex flex-column align-items-center justify-content-center py-5" style={{ borderBottom: '3px solid var(--text-color)' }}>
//         <Row className="align-items-center w-100">
//           {/* Image Section */}
//           <Col md={6} className="mb-4 mb-md-0 text-center">
//             <img src={gymImage} alt="Gym" className="img-fluid" />
//           </Col>

//           {/* Welcome + Login Form Section */}
//           <Col md={6} style={{ color: 'var(--text-color)' }}>
//             <h1 className="display-5 fw-bold text-center text-md-start">WELCOME TO FIT PANEL</h1>
//             <p className="lead text-center text-md-start">
//               Your journey to a healthier lifestyle starts here.
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//             </p>

//             {/* Login Form */}
//             {error && <Alert variant="danger">{error}</Alert>}
//             <Form onSubmit={handleSubmit}>
//               <Form.Group className="mb-4 w-50 " controlId="email">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control type="email" ref={emailRef} required placeholder="Enter your email" />
//               </Form.Group>

//               <Form.Group className="mb-4 w-50" controlId="password">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control type="password" ref={passwordRef} required placeholder="Enter your password" />
//               </Form.Group>

//               <div className="d-grid gap-2 flex flex-wrap justify-content-center">
//                 <Button variant="dark" type="submit" disabled={loading}>
//                   Log In
//                 </Button>
//               </div>
//             </Form>

//             <div className="text-center mt-3">
//               <Link to="/forgot-password">Forgot Password?</Link>
//             </div>
            
//           </Col>
//         </Row>
//       </Container>

//       {/* Trainer Section */}
//       <Container className="my-5">
//   <Row className="mb-4">
//     <Col>
//       <h2 className="text-center">What is this website for?</h2>
//       <p className="text-center">
//       FitPanel היא פלטפורמה שלמה למאמני כושר וללקוחותיהם. היא מאפשרת למאמנים לנהל תוכניות אימון ותזונה, לעקוב אחרי התקדמות הלקוחות, 
//        ולארגן את כל המדידות והתמונות במקום אחד. לקוחות יכולים גישה בקלות לתוכניות המותאמות אישית ולעדכונים ישירות מלוח המחוונים שלהם.
//       </p>
//     </Col>
//   </Row>

//   <Row className="justify-content-center">
//   <Col md={4} className="mb-4">
//     <div className="card h-100 text-center shadow hover-shadow" style={{ transition: 'box-shadow 0.3s' }}>
//       <div className="card-body" >
//         <h5 className="card-title">1 Month Subscription</h5>
//         <p className="card-text">Access all features for 1 month</p>
//         <h3>₪500</h3>
//         <a href="tel:0524269673" className="btn btn-dark mt-3">Call Me</a>
//       </div>
//     </div>
//   </Col>

//   <Col md={4} className="mb-4">
//     <div className="card h-100 text-center shadow hover-shadow" style={{ transition: 'box-shadow 0.3s' }}>
//       <div className="card-body">
//         <h5 className="card-title">3 Months Subscription</h5>
//         <p className="card-text">Save more with a 3-month plan</p>
//         <h3>₪1300</h3>
//         <a href="tel:0524269673" className="btn btn-dark mt-3">Call Me</a>
//       </div>
//     </div>
//   </Col>

//   <Col md={4} className="mb-4">
//     <div className="card h-100 text-center shadow hover-shadow" style={{ transition: 'box-shadow 0.3s' }}>
//       <div className="card-body">
//         <h5 className="card-title">6 Months Subscription</h5>
//         <p className="card-text">Best value for long-term commitment</p>
//         <h3>₪2800</h3>
//         <a href="tel:0524269673" className="btn btn-dark mt-3">Call Me</a>
//       </div>
//     </div>
//   </Col>
// </Row>
// </Container>

//     </>
//   );
// }

// export default Home;


import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gymImage from './image/fitpanel1.png';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';

function Home() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);

      const userlogindetails = JSON.parse(localStorage.getItem('userLoginDetails'));

      if (userlogindetails) {
        if (userlogindetails.membershipStatus === 'activated') {
          switch (userlogindetails.role) {
            case 2:
              navigate('/customer');
              break;
            case 10:
              navigate('/master');
              break;
            case 8:
              navigate('/trainer');
              break;
            default:
              navigate('/');
          }
        } else {
          setError('Your membership is not activated. Please contact support.');
          alert('Your membership is not activated. You will now be logged out.');
          await logout();
        }
      } else {
        setError('User not found');
        await logout();
      }
    } catch (err) {
      setError('Failed to log in');
      await logout();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Container fluid className="py-5 border-bottom" style={{ borderColor: 'var(--text-color)' }}>
        <Row className="align-items-center justify-content-center">
          {/* Image Section */}
          <Col xs={10} md={5} className="mb-4 mb-md-0 text-center">
            <img src={gymImage} alt="Gym" className="img-fluid" />
          </Col>

          {/* Welcome + Login Form Section */}
          <Col xs={11} md={5} style={{ color: 'var(--text-color)' }}>
            <h1 className="display-6 fw-bold text-center text-md-start">WELCOME TO FIT PANEL</h1>
            <p className="lead text-center text-md-start">
              Your journey to a healthier lifestyle starts here.
              אנחנו נלווה אותך בכל שלב – דרך תוכניות מותאמות אישית, מדידות, ועדכן שוטף מהמאמן שלך.
            </p>

            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 w-100" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required placeholder="Enter your email" />
              </Form.Group>

              <Form.Group className="mb-3 w-100" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required placeholder="Enter your password" />
              </Form.Group>

              <div className="d-grid">
                <Button variant="dark" type="submit" disabled={loading}>
                  Log In
                </Button>
              </div>
            </Form>

            <div className="text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Trainer Section */}
      <Container className="my-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">מה המטרה של האתר?</h2>
            <p className="text-center">
              FitPanel היא פלטפורמה מלאה למאמני כושר ולקוחות. ניהול תוכניות, מעקב אחרי מדדים, תקשורת נוחה – הכול במקום אחד.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {[{
            title: "1 Month Subscription",
            price: "₪500",
            text: "Access all features for 1 month"
          }, {
            title: "3 Months Subscription",
            price: "₪1300",
            text: "Save more with a 3-month plan"
          }, {
            title: "6 Months Subscription",
            price: "₪2800",
            text: "Best value for long-term commitment"
          }].map((plan, idx) => (
            <Col key={idx} xs={10} sm={8} md={4} className="mb-4">
              <div className="card h-100 text-center shadow" style={{ transition: 'box-shadow 0.3s' }}>
                <div className="card-body">
                  <h5 className="card-title">{plan.title}</h5>
                  <p className="card-text">{plan.text}</p>
                  <h3>{plan.price}</h3>
                  <a href="tel:0524269673" className="btn btn-dark mt-3">Call Me</a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Home;
