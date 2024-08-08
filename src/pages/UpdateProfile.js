import { useAuth } from "./context/AuthContext";
import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container, Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import gymImage from './image/newlogo.png';

export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updateProfilePassword, updateProfileEmail } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [emailChanged, setEmailChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShowToast(false);

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setEmailChanged(emailRef.current.value !== currentUser.email);
        setPasswordChanged(passwordRef.current.value !== '');

        try {
            const promises = [];
            if (emailChanged) {
                (updateProfileEmail(emailRef.current.value));
            }

            if (passwordChanged) {
               (updateProfilePassword(passwordRef.current.value));
            }

          //  await Promise.all(promises);

            let message = '';
            if (emailChanged && passwordChanged) {
                message = 'Email and password updated successfully';
            } else if (emailChanged) {
                message = 'Email updated successfully';
            } else if (passwordChanged) {
                message = 'Password updated successfully';
            }

            setToastMessage(message);
            setShowToast(true);
            setTimeout(3000); // Redirect after 3 seconds to allow toast to be visible
        } catch {
            setToastMessage('Failed to update account');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="row my-5 justify-content-between">
            <div className="col mx-5">
                <img src={gymImage} alt="Gym" />
            </div>
            <Card className="h-50 w-50 col border-0" style={{ color: 'var(--text-color)' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email} />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">
                            Update
                        </Button>
                        <div className="w-100 text-center mt-2">
                            <Link to="/customer">Cancel!</Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Bootstrap Toast Container */}
            <ToastContainer position="top-end" className="p-3 text-dark">
                <Toast
               
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}
