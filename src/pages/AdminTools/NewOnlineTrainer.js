import React, { useState } from "react";
import {Timestamp} from "firebase/firestore";
import { Form, Button, Card, Container, Row, Col, Toast } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';
import LoadingModal from '../LoadingModal';


const AddOnlineTrainer = () => {
  const SERVERSIDEURL="https://fitpanelserverside.onrender.com"
  const { signup } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [trainerDetails, setTrainerDetails] = useState({
    FirstName: '',
    LastName: '',
    UserId: '',
    FirstLoggin:0,
    EmailAddress: '',
    Participating_from: Timestamp.now(),
    Location: '',
    PhoneNumber: '', 
    membershipStatus: 'activated',
    traineesNumber: 0,
    Description: '', 
    ImageURL: '', 
    expirationDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 14))), // 2 weeks from now
    role: 8,
    PlanID: '',
  });
  const [imageFile, setImageFile] = useState(null); // State to hold the selected image file

  const handleTrainerChange = (e) => {
    const { name, value } = e.target;
    setTrainerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected file
  };


  const handleSubmit = async (e) => {
    setShowLoadingModal(true);
    e.preventDefault();
  
    // Validation checks
    const requiredFields = ['FirstName', 'LastName', 'UserId', 'EmailAddress', 'PhoneNumber', 'PlanID'];
    for (const field of requiredFields) {
      if (!trainerDetails[field]) {
        setToastMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        setShowToast(true);
        setShowLoadingModal(false);
        return;
      }
    }
  
    if (trainerDetails.UserId.length < 6) {
      setToastMessage('Error, User ID must be at least 6 characters long.');
      setShowToast(true);
      setShowLoadingModal(false);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('userId', trainerDetails.UserId);
      formData.append('firstName', trainerDetails.FirstName);
      formData.append('lastName', trainerDetails.LastName);
      formData.append('emailAddress', trainerDetails.EmailAddress);
      formData.append('membershipStatus', trainerDetails.membershipStatus);
      formData.append('planID', trainerDetails.PlanID);
      formData.append('description',trainerDetails.Description);
      formData.append('firstLoggin',trainerDetails.FirstLoggin);
      formData.append('location',trainerDetails.Location);
      formData.append('participating_from',trainerDetails.Participating_from);
      formData.append('phoneNumber',trainerDetails.PhoneNumber);
      formData.append('role',trainerDetails.role);
      formData.append('traineesNumber',trainerDetails.traineesNumber);


      if (imageFile) {
        formData.append('imageFile', imageFile);
      }
  

      const response = await fetch(`${SERVERSIDEURL}/MoDumbels/validateAndAddTrainer`, {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Perform signup function if server response is successful
      //  result await signup(trainerDetails.EmailAddress, trainerDetails.UserId);
      signup()
        // Show success toast
        setToastMessage('New online trainer added successfully!');
        setShowToast(true);
  
        // Clear form after submission
        setTrainerDetails({
          FirstName: '',
          LastName: '',
          UserId: '',
          FirstLoggin: 0,
          EmailAddress: '',
          Participating_from: Timestamp.now(),
          Location: '',
          PhoneNumber: '',
          membershipStatus: 'activated',
          traineesNumber: 0,
          Description: '',
          ImageURL: '',
          expirationDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 14))), // Reset expiration date
          role: 8,
          PlanID: '',
        });
        setImageFile(null); // Clear selected image file
      } else {
        setToastMessage(result.message || 'Error adding new online trainer. Please try again.');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setToastMessage('Error adding new online trainer. Please try again.');
      setShowToast(true);
    }
  
    setShowLoadingModal(false);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-info">Add New Online Trainer:</h2>
      <Card className="w-75 border-0" style={{ backgroundColor: 'transparent' }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="FirstName"
                    value={trainerDetails.FirstName}
                    onChange={handleTrainerChange}
                    placeholder="Enter trainer's first name"
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="LastName"
                    value={trainerDetails.LastName}
                    onChange={handleTrainerChange}
                    placeholder="Enter trainer's last name"
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>User ID <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="UserId"
                    value={trainerDetails.UserId}
                    onChange={handleTrainerChange}
                    placeholder="Enter trainer's ID"
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="EmailAddress"
                    value={trainerDetails.EmailAddress}
                    onChange={handleTrainerChange}
                    placeholder="Enter trainer's email address"
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="PhoneNumber"
                    value={trainerDetails.PhoneNumber}
                    onChange={handleTrainerChange}
                    placeholder="Enter trainer's phone number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="Location"
                    value={trainerDetails.Location}
                    onChange={handleTrainerChange}
                    placeholder="Enter trainer's location"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="Description"
                    value={trainerDetails.Description}
                    onChange={handleTrainerChange}
                    placeholder="Enter description about trainer"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Trainer Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Select Plan <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="PlanID"
                    value={trainerDetails.PlanID}
                    onChange={handleTrainerChange}
                    aria-label="Select Plan"
                    required
                  >
                    <option value="">Choose...</option>
  <option value="111">1 Month Plan</option>
  <option value="211">3 Months Plan</option>
  <option value="241">6 Months Plan</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-3">
              Add New Trainer
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Toast for success or error messages */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          minWidth: '300px',
          zIndex: 9999
        }}
        bg={toastMessage.includes('Error') ? 'danger' : 'success'}
        text="white"
        delay={5000}
        autohide
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      <LoadingModal show={showLoadingModal} />

    </Container>
  );
};

export default AddOnlineTrainer;
