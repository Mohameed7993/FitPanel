import React, { useState } from "react";
import { getFirestore, setDoc, doc, Timestamp } from "firebase/firestore";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';

const generateRandomId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // Generate a random 5-digit number as a string
};

const AddingNewGym = () => {
    const { signup } =useAuth()

  const [gymDetails, setGymDetails] = useState({
    gymName: '',
    IDstudio: generateRandomId(),
    gymLocation: '',
    gymMembers: 0,
    membershipStatus:'activated'
  });

  const [managerDetails, setManagerDetails] = useState({
    FirstName: '',
    LastName: '',
    UserId: '',
    EmailAddres: '',
    participatingFrom: Timestamp.now(),
    membershipStatus: 'activated',
    role: 9,
    IDstudio: ''
  });

  const handleGymChange = (e) => {
    const { name, value } = e.target;
    setGymDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleManagerChange = (e) => {
    const { name, value } = e.target;
    setManagerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatemanagerDetails = { ...managerDetails, IDstudio: gymDetails.IDstudio };

    try {
      const db = getFirestore();

      // Save manager details to Firestore in 'users' collection
      const managerDocRef = doc(db, "Users", managerDetails.UserId);
      await setDoc(managerDocRef, updatemanagerDetails);

      // Save gym details to Firestore in 'GymStudios' collection
      const gymDocRef = doc(db, "GymStudios", gymDetails.IDstudio);
      await setDoc(gymDocRef, gymDetails);

      console.log("Data successfully written to Firestore!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
    if(signup(managerDetails.EmailAddres,managerDetails.UserId))
        console.log("new account had created")
  };

  return (
    <Container  className="mt-4">
      <h2 className="text-info">Add New Gym Studio:</h2>
      <Card className="w-75 border-0" style={{ backgroundColor: 'transparent' }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
            <Col>
                <h4>Manager Details</h4>
                <Form.Group>
                  <Form.Label>Manager First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="FirstName"
                    value={managerDetails.FirstName}
                    onChange={handleManagerChange}
                    placeholder="Enter manager's first name"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Manager Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="LastName"
                    value={managerDetails.LastName}
                    onChange={handleManagerChange}
                    placeholder="Enter manager's last name"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Manager ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="UserId"
                    value={managerDetails.UserId}
                    onChange={handleManagerChange}
                    placeholder="Enter manager's ID"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Manager Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="EmailAddres"
                    value={managerDetails.EmailAddres}
                    onChange={handleManagerChange}
                    placeholder="Enter manager's email"
                  />
                </Form.Group>
              </Col>
              <Col>
                <h4>Gym Details</h4>
                <Form.Group>
                  <Form.Label>Gym Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="gymName"
                    value={gymDetails.gymName}
                    onChange={handleGymChange}
                    placeholder="Enter gym name"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gym ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="IDstudio"
                    value={gymDetails.IDstudio}
                    readOnly
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gym Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="gymLocation"
                    value={gymDetails.gymLocation}
                    onChange={handleGymChange}
                    placeholder="Enter gym location"
                  />
                </Form.Group>
              </Col>

              
            </Row>

            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddingNewGym;
