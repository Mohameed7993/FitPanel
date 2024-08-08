import React, { useRef, useState } from "react";
import { Form, Button, Card, Container, Row, Col, Toast, ToastContainer } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { getFirestore, setDoc, doc, Timestamp, updateDoc, increment } from "firebase/firestore";

export default function AddNewMember() {
    const db = getFirestore();
    const emailRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const userIdRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup, userlogindetails,logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");

    console.log(userlogindetails.IDstudio);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setToastMessage("Passwords do not match");
            setToastVariant("danger");
            setShowToast(true);
            return;
        }

        try {
            setLoading(true);
            //const { user } =
             await signup(emailRef.current.value, passwordRef.current.value);

            // Save user data to Firestore
            await saveDataToFirestore(userIdRef.current.value, emailRef.current.value, firstNameRef.current.value, lastNameRef.current.value, userlogindetails.IDstudio);

            // Increment GymMember count in the manager's gym's Firestore document
            await updateGymMemberCount(userlogindetails.IDstudio);

            setToastMessage("Adding new member was successful!");
            setToastVariant("success");
            setShowToast(true);
        } catch (error) {
            setToastMessage(`Failed to create account: ${error.message}`);
            setToastVariant("danger");
            setShowToast(true);
        }

        setLoading(false);
    }

    const saveDataToFirestore = async (id, email, firstName, lastName, IDstudio) => {
        try {
            await setDoc(doc(db, "Users", id), {
                FirstName: firstName,
                UserId: id,
                LastName: lastName,
                EmailAddress: email,
                Participating_from: Timestamp.now(),
                role: 1,
                membershipStatus: 'activated',
                IDstudio: IDstudio
            });
            console.log("Document written to Database");
        } catch (error) {
            console.error("Error writing document: ", error);
            setToastMessage("Failed to write document to Database");
            setToastVariant("danger");
            setShowToast(true);
        }
    };

    const updateGymMemberCount = async (gymId) => {
        try {
            const gymRef = doc(db, "GymStudios", gymId);
            await updateDoc(gymRef, {
                gymMembers: increment(1) // Increment GymMember count by 1
            });
            console.log("GymMember count updated for gym: ", gymId);
        } catch (error) {
            console.error("Error updating GymMember count: ", error);
            setToastMessage("Error updating GymMember count");
            setToastVariant("danger");
            setShowToast(true);
        }
    };

    return (
        <>
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} bg={toastVariant} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Container>
                <Card className="w-75 border-0" style={{ backgroundColor: 'transparent' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Adding New Member</h2>
                        <Form onSubmit={handleSubmit} className="text-black">
                            <Row>
                                <Col>
                                    <Form.Group id="firstname">
                                        <Form.Label>First name:</Form.Label>
                                        <Form.Control type="text" ref={firstNameRef} required />
                                    </Form.Group>
                                    <Form.Group id="lastname">
                                        <Form.Label>Last name:</Form.Label>
                                        <Form.Control type="text" ref={lastNameRef} required />
                                    </Form.Group>
                                    <Form.Group id="userid">
                                        <Form.Label>ID:</Form.Label>
                                        <Form.Control type="number" ref={userIdRef} required />
                                    </Form.Group>
                                    <Form.Group id="email">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control type="email" ref={emailRef} required />
                                    </Form.Group>
                                    <Form.Group id="password">
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control type="password" ref={passwordRef} required />
                                    </Form.Group>
                                    <Form.Group id="password-confirm">
                                        <Form.Label>Password Confirmation:</Form.Label>
                                        <Form.Control type="password" ref={passwordConfirmRef} required />
                                    </Form.Group>
                                    <div className="text-center">
                                        <Button disabled={loading} className="btn-center w-10 my-2 text-black" type="submit">
                                            Add New Member
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
