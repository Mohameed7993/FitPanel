import { useAuth } from "./context/AuthContext";
import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import gymImage from './image/Mo Dumbels.png';
import { getFirestore, setDoc, doc, Timestamp, collection, getDocs, updateDoc, increment } from "firebase/firestore";

export default function Signup() {
    const db = getFirestore();
    const emailRef = useRef();
    const FirstNameRef = useRef();
    const LastNameRef = useRef();
    const UserIdRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup,logout } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [gyms, setGyms] = useState([]);
    const [selectedGym, setSelectedGym] = useState('');

    useEffect(() => {
        fetchGyms();
    }, []);

    const fetchGyms = async () => {
        const gymsCollection = collection(db, 'GymStudios');
        const snapshot = await getDocs(gymsCollection);
        const gymsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGyms(gymsData);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            const { user } = await signup(emailRef.current.value, passwordRef.current.value);

            // Save user data to Firestore
            await saveDataToFirestore(UserIdRef.current.value, emailRef.current.value, FirstNameRef.current.value, LastNameRef.current.value, selectedGym);

            // Increment GymMember count in selected gym's Firestore document
            await updateGymMemberCount(selectedGym);



            setSuccessMessage("Sign up successful! You can now log in."); // Set success message
        } catch (error) {
            setError(`Failed to create account: ${error.message}`);
        }

        setLoading(false);
    }

    const saveDataToFirestore = async (id, email, firstName, lastName, selectedGym) => {
        try {
            await setDoc(doc(db, "Users", id), {
                FirstName: firstName,
                UserId:id,
                LastName: lastName,
                EmailAddress: email,
                Participating_from: Timestamp.now(),
                role: 1,
                membershipStatus: 'activated',
                IDstudio: selectedGym
            });
            console.log("Document written to Database");
        } catch (error) {
            console.error("Error writing document: ", error);
            alert("Failed to write document to Database");
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
        }
    };

    return (
        <>
            <Container className="row my-5 justify-content-between">
                <div className="col mx-5">
                    <img src={gymImage} alt="Gym" />
                </div>
                <Card className="h-50 w-50 col border-0" style={{ backgroundColor: 'transparent' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Sign Up </h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        <Form onSubmit={handleSubmit} className="text-black">
                            <Form.Group id="firstname">
                                <Form.Label>First name:</Form.Label>
                                <Form.Control type="name" ref={FirstNameRef} required />
                            </Form.Group>
                            <Form.Group id="lastname">
                                <Form.Label>Last name:</Form.Label>
                                <Form.Control type="name" ref={LastNameRef} required />
                            </Form.Group>
                            <Form.Group id="userid">
                                <Form.Label>ID:</Form.Label>
                                <Form.Control type="number" ref={UserIdRef} required />
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
                            <Form.Group controlId="selectGym">
                                <Form.Label>Select Gym:</Form.Label>
                                <Form.Control as="select" onChange={(e) => setSelectedGym(e.target.value)} required>
                                    <option value="">Select a gym...</option>
                                    {gyms.map((gym) => (
                                        <option key={gym.id} value={gym.id}>{gym.gymName}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <div className="text-center">
                                <Button disabled={loading} className=" btn-center w-10 my-2  text-black" type="submit">
                                    Sign Up
                                </Button>
                            </div>
                            <div className="w-100 text-center mt-2" style={{ textDecoration: 'underline' }}>
                                Already have an Account? <Link to="/login"> Log In</Link>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
