import { useAuth } from "./context/AuthContext";
import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import gymImage from './image/newlogo.png';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser,logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      // Perform login
      await login(emailRef.current.value, passwordRef.current.value);

      // Retrieve user details from localStorage
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
            case 9:
              navigate('/manager');
              break;
            case 8:
              navigate('/trainer');
              break;
            default:
              navigate('/admin');
              break;
          }
        } else {
          setError("Account Suspended!");
          await logout();

        }
      } else {
        setError("Failed to fetch user details");
        await logout();

      }
    } catch (error) {
      Alert("Failed to log in");
      await logout();

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!currentUser && (
        <Container className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '100vh' }}>
          <div className="row w-100">
            <div className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0">
              <img src={gymImage} alt="Gym" className="img-fluid" />
            </div>
            <Card className="w-100 w-md-75 mx-auto" style={{ maxWidth: '500px', backgroundColor: 'transparent', border: 'none' }}>
              <Card.Body>
                <h2 className="text-center mb-4" style={{ color: 'var(--text-color)' }}>Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} style={{ color: 'var(--text-color)' }}>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>

                  <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>

                  <div className="text-center">
                    <Button disabled={loading} className="my-2" style={{ color: 'var(--text-color)' }} type="submit">
                      Log In
                    </Button>
                  </div>
                </Form>
                <div className="w-100 text-center mt-3">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <div className="w-100 text-center mt-2" style={{ color: 'var(--text-color)' }}>
                  Need an account? <Link to="/signup">Sign Up</Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
      )}
    </>
  );
}
