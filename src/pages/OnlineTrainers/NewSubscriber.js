
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Toast } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LoadingModal from '../LoadingModal';
import gymImage from '../image/fitpanel1.png';

const AddNewSubscriber = () => {
  const SERVERSIDEURL="https://fitpanelserverside.onrender.com"
  const { currentUser, userlogindetails } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [subscriberDetails, setSubscriberDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    id: '',
    membershipStatus: 'activated',
    role: 2
  });

  const [trainingPlanFile, setTrainingPlanFile] = useState(null);
  const [foodPlanFile, setFoodPlanFile] = useState(null);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('');

  useEffect(() => {
    if (userlogindetails) {
      setSubscriberDetails(prev => ({ ...prev, trainerID: userlogindetails.UserId }));
    }
  }, [userlogindetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubscriberDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'trainingPlan') setTrainingPlanFile(files[0]);
    else if (name === 'foodPlan') setFoodPlanFile(files[0]);
  };

  const handleSubscriptionPeriodChange = (e) => {
    setSubscriptionPeriod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'email', 'phoneNumber', 'id'];
    for (const field of requiredFields) {
      if (!subscriberDetails[field]) {
        setToastMessage(`Please fill in the ${field}`);
        setShowToast(true);
        return;
      }
    }

    if (!subscriptionPeriod) {
      setToastMessage('Please select a subscription period.');
      setShowToast(true);
      return;
    }

    try {
      setShowLoadingModal(true);

      const formData = new FormData();
      formData.append('name', subscriberDetails.name);
      formData.append('email', subscriberDetails.email);
      formData.append('phoneNumber', subscriberDetails.phoneNumber);
      formData.append('id', subscriberDetails.id);
      formData.append('role', subscriberDetails.role);
      formData.append('membershipStatus', subscriberDetails.membershipStatus);
      formData.append('trainerID', subscriberDetails.trainerID);
      formData.append('subscriptionPeriod', subscriptionPeriod);
      if (trainingPlanFile) formData.append('trainingPlanFile', trainingPlanFile);
      if (foodPlanFile) formData.append('foodPlanFile', foodPlanFile);

      const res = await fetch(`${SERVERSIDEURL}/MoDumbels/addSubscriber`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setToastMessage('New subscriber added successfully!');
        setSubscriberDetails({
          name: '', email: '', phoneNumber: '', id: '', role: 2,
          membershipStatus: 'activated', trainerID: userlogindetails.UserId
        });
        setTrainingPlanFile(null);
        setFoodPlanFile(null);
        setSubscriptionPeriod('');
      } else {
        setToastMessage(data.message || 'Failed to add subscriber.');
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Error occurred while adding subscriber.');
    } finally {
      setShowToast(true);
      setShowLoadingModal(false);
    }
  };

  return (
    <Container className="mt-5 text-end">
      <h2 style={{ color: 'var(--text-color)' }}>:הוספת מתאמן חדש</h2>
      <Form className='w-80' onSubmit={handleSubmit}>
        <Row className="justify-content-end">
          <Col md={6}>
            <img src={gymImage} alt="Gym" className="img-fluid mx-5" />
          </Col>
          <Col md={6}>
            <Form.Group><Form.Label>* שם</Form.Label>
              <Form.Control name="name" value={subscriberDetails.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group><Form.Label>* אימייל</Form.Label>
              <Form.Control name="email" value={subscriberDetails.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group><Form.Label>* מספר טלפון</Form.Label>
              <Form.Control name="phoneNumber" value={subscriberDetails.phoneNumber} onChange={handleChange} required />
            </Form.Group>
            <Form.Group><Form.Label>* מספר ת\,ז</Form.Label>
              <Form.Control name="id" value={subscriberDetails.id} onChange={handleChange} required />
            </Form.Group>
            <Form.Group><Form.Label>* תקופת מינוי</Form.Label>
              <Form.Select value={subscriptionPeriod} onChange={handleSubscriptionPeriodChange} required>
                <option value="">Select period</option>
                <option value="1">חודש</option>
                <option value="3">3 חודשים</option>
                <option value="6">6 חודשים</option>
              </Form.Select>
            </Form.Group>
            <Form.Group><Form.Label>תוכנית אימון</Form.Label>
              <Form.Control type="file" name="trainingPlan" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group><Form.Label>תוכנית אוכל</Form.Label>
              <Form.Control type="file" name="foodPlan" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3"><strong>הוספת מתאמן</strong></Button>
          </Col>
        </Row>
      </Form>

      <Toast show={showToast} onClose={() => setShowToast(false)} className="mt-3">
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      <LoadingModal show={showLoadingModal} />
    </Container>
  );
};

export default AddNewSubscriber;
