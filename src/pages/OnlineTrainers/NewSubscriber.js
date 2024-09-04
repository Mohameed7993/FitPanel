import React, { useState, useEffect } from 'react';
import { getFirestore, setDoc, doc, runTransaction, getDocs, query, collection, where, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Form, Button, Container, Row, Col, Toast } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LoadingModal from '../LoadingModal'; // Adjust the path as necessary
import gymImage from '../image/newlogo.png'; // Import your image file

const AddNewSubscriber = () => {
  const { signup, currentUser, userlogindetails } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false); // State for loading modal
  const [subscriberDetails, setSubscriberDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    id: '',
    membershipStatus: 'activated',
    role: 2,
    Participating_from: Timestamp.now(),
    expirationDate: null // Added expirationDate field
  });

  const [trainingPlanFile, setTrainingPlanFile] = useState(null);
  const [foodPlanFile, setFoodPlanFile] = useState(null);

  const [subscriptionPeriod, setSubscriptionPeriod] = useState(''); // State for subscription period

  useEffect(() => {
    if (userlogindetails) {
      setSubscriberDetails(prevDetails => ({
        ...prevDetails,
        trainerID: userlogindetails.UserId,
      }));
    }
  }, [userlogindetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubscriberDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'trainingPlan') {
      setTrainingPlanFile(files[0]);
    } else if (name === 'foodPlan') {
      setFoodPlanFile(files[0]);
    }
  };

  const handleSubscriptionPeriodChange = (e) => {
    setSubscriptionPeriod(e.target.value);
  };

  const calculateExpirationDate = (period) => {
    const now = new Date();
    let expirationDate;

    switch (period) {
      case '1':
        expirationDate = new Date(now.setMonth(now.getMonth() + 1));
        break;
      case '3':
        expirationDate = new Date(now.setMonth(now.getMonth() + 3));
        break;
      case '6':
        expirationDate = new Date(now.setMonth(now.getMonth() + 6));
        break;
      default:
        expirationDate = null;
    }

    return Timestamp.fromDate(expirationDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'email', 'phoneNumber', 'id'];
    for (const field of requiredFields) {
      if (!subscriberDetails[field]) {
        setToastMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        setShowToast(true);
        return;
      }
    }

    if (subscriberDetails.id.length < 6) {
      setToastMessage('Error, User ID must be at least 6 characters long.');
      setShowToast(true);
      return;
    }

    if (!subscriptionPeriod) {
      setToastMessage('Please select a subscription period.');
      setShowToast(true);
      return;
    }

    try {
      setShowLoadingModal(true); // Show loading modal
      const db = getFirestore();
      const storage = getStorage();

      // Check if email or ID already exists
      const emailQuerySnapshot = await getDocs(query(collection(db, "customers"), where("email", "==", subscriberDetails.email)));
      if (!emailQuerySnapshot.empty) {
        setToastMessage('Error, Email address is already in use.');
        setShowToast(true);
        setShowLoadingModal(false); // Hide loading modal
        return;
      }
      const idQuerySnapshot = await getDocs(query(collection(db, "customers"), where("id", "==", subscriberDetails.id)));
      if (!idQuerySnapshot.empty) {
        setToastMessage('Error, Customer ID is already in use.');
        setShowToast(true);
        setShowLoadingModal(false); // Hide loading modal
        return;
      }

      // Calculate expiration date
      const expirationDate = calculateExpirationDate(subscriptionPeriod);

      // Upload files if selected
      let trainingPlanURL = '';
      let foodPlanURL = '';
      if (trainingPlanFile) {
        const trainingPlanRef = ref(storage, `TrainingPlans/${subscriberDetails.id}`);
        await uploadBytes(trainingPlanRef, trainingPlanFile);
        trainingPlanURL = await getDownloadURL(trainingPlanRef);
      }
      if (foodPlanFile) {
        const foodPlanRef = ref(storage, `FoodPlans/${subscriberDetails.id}`);
        await uploadBytes(foodPlanRef, foodPlanFile);
        foodPlanURL = await getDownloadURL(foodPlanRef);
      }

      // Save subscriber details to Firestore in 'customers' collection with ID as document ID
      await setDoc(doc(db, 'customers', subscriberDetails.id), {
        ...subscriberDetails,
        trainingPlanURL,
        foodPlanURL,
        expirationDate, // Save expirationDate
      });

      try {
        if (userlogindetails && userlogindetails.UserId) {
          const userDocRef = doc(db, 'Users', userlogindetails.UserId);
          console.log(`Updating document ID: ${userlogindetails.UserId}`);

          await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
              throw new Error('Document does not exist!');
            }

            const currentTraineesNumber = userDoc.data().traineesNumber || 0;
            const newTraineesNumber = currentTraineesNumber + 1;

            transaction.update(userDocRef, { traineesNumber: newTraineesNumber });
          });

          console.log('Trainees number incremented successfully.');
        } else {
          console.error('User details are not properly defined.');
        }
      } catch (error) {
        console.error('Error incrementing trainees number:', error);
      }

      // Create an account for the subscriber
      await signup(subscriberDetails.email, subscriberDetails.id);
      console.log(currentUser);
      // Show success toast
      setToastMessage('New subscriber added successfully!');
      setShowToast(true);

      // Clear form after submission
      setSubscriberDetails({
        name: '',
        email: '',
        phoneNumber: '',
        id: '',
        role: 2,
        membershipStatus: 'activated',
        trainerID: userlogindetails.UserId,
      });
      setTrainingPlanFile(null);
      setFoodPlanFile(null);
      setSubscriptionPeriod(''); // Clear subscription period
      setShowLoadingModal(false); // Hide loading modal

    } catch (error) {
      console.error("Error adding document or creating account: ", error);
      // Show error toast
      setToastMessage('Error adding new subscriber. Please try again.');
      setShowToast(true);
      setShowLoadingModal(false); // Hide loading modal
    }
  };

  return (
    <Container className="mt-5 text-end" >
      <h2 style={{ color: 'var(--text-color)' }}>:הוספת מתאמן חדש</h2>
      <Form onSubmit={handleSubmit}  >
        <Row className="justify-content-end">
          <Col md={6}>
          <img src={gymImage} alt="Gym" className="img-fluid mx-5" />

          </Col>
          <Col md={6}>
            {/* Required Fields Column */}
            <Form.Group as={Row}>
              <Form.Label> <span className="text-danger">*</span>שם</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={subscriberDetails.name}
                onChange={handleChange}
                placeholder="Enter subscriber's name"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label> <span className="text-danger">*</span>אימייל</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={subscriberDetails.email}
                onChange={handleChange}
                placeholder="Enter subscriber's email"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label><span className="text-danger">*</span>מספר טלפון</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={subscriberDetails.phoneNumber}
                onChange={handleChange}
                placeholder="Enter subscriber's phone number"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label> <span className="text-danger">*</span>מספר ת,ז</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={subscriberDetails.id}
                onChange={handleChange}
                placeholder="Enter subscriber's ID"
                required
              />
            </Form.Group>

            {/* Subscription Period Dropdown */}
            <Form.Group>
              <Form.Label><span className="text-danger">*</span>תקופת מינוי</Form.Label>
              <Form.Control as="select" value={subscriptionPeriod} onChange={handleSubscriptionPeriodChange} required>
                <option value="">Select period</option>
                <option value="1">חודש</option>
                <option value="3">חודשים 3</option>
                <option value="6">חודשים 6</option>
              </Form.Control>
            </Form.Group>

            {/* File Uploads */}
            <Form.Group>
              <Form.Label>תוכנית אימון (optional)</Form.Label>
              <Form.Control type="file" name="trainingPlan" onChange={handleFileChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>תוכנית אוכל (optional)</Form.Label>
              <Form.Control type="file" name="foodPlan" onChange={handleFileChange} />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="mt-3">
              <strong> הוספת מתאמן </strong>

            </Button>
          </Col>
        </Row>
      </Form>

      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        className="mt-3"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      {/* Loading Modal */}
      <LoadingModal show={showLoadingModal} />
    </Container>
  );
};

export default AddNewSubscriber;
