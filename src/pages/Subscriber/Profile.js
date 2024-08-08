import React, { useState, useEffect } from 'react';
import { Card, Container, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, updateDoc, query, getDoc, doc, where, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProductSlider from '../../slider';
import LoadingModal from '../LoadingModal';
import { PDFDocument, rgb } from 'pdf-lib';

const SubscriberDashboard = ({ Views }) => {
  const { currentUser, userlogindetails } = useAuth();
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [steroidPlanDetails, setSteroidPlanDetails] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const navigate = useNavigate();
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const getFormattedDate = (time) => {
    let timestamp;
  
    // Check if 'time' is already a Timestamp object
    if (time instanceof Timestamp) {
      timestamp = time;
    } else if (time && time.seconds !== undefined && time.nanoseconds !== undefined) {
      // If 'time' is raw data, convert it to a Timestamp object
      timestamp = new Timestamp(time.seconds, time.nanoseconds);
    } else {
      // Invalid input
      return "Invalid Date";
    }
  
    // Convert Timestamp to Date and format it
    const date = timestamp.toDate();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };



 
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

  const fetchDetails = async () => {
    setLoading(true);
    setShowLoadingModal(true);
    if (userlogindetails) {
      // Fetch trainer details
      if (userlogindetails.trainerID) {
        const qTrainer = query(collection(db, 'Users'), where('UserId', '==', userlogindetails.trainerID));
        const querySnapshotTrainer = await getDocs(qTrainer);
        if (!querySnapshotTrainer.empty) {
          setTrainerDetails(querySnapshotTrainer.docs[0].data());
        }
      }

      // Fetch steroid plan details
      if (userlogindetails.SteroidPlanID) {
        const steroidPlanID = parseInt(userlogindetails.SteroidPlanID, 10);
        const qSteroidPlan = query(collection(db, 'SteroidPlan'), where('PlanID', '==', steroidPlanID));
        const querySnapshotSteroidPlan = await getDocs(qSteroidPlan);
        if (!querySnapshotSteroidPlan.empty) {
          setSteroidPlanDetails(querySnapshotSteroidPlan.docs[0].data());
        }
      }

      // Fetch product details
      if (userlogindetails.trainerID) {
        const qProducts = query(
          collection(db, 'products'),
          where('TrainerID', '==', userlogindetails.trainerID)
        );
        const querySnapshotProducts = await getDocs(qProducts);
        const products = querySnapshotProducts.docs.map(doc => doc.data());
        setProductDetails(products);
      }
    }
    setLoading(false);
    setShowLoadingModal(false);
  };

  useEffect(() => {
    fetchDetails();
  }, [userlogindetails]);

  const handleViewPlans = () => {
    Views('SteroidPlans');
  };

  const handleViewShop = () => {
    Views('Shopping');
  };

  const handleViewMeasurement = () => {
    Views('SubscriberDetails');
  };


  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'test.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
};

  if (loading) {
    return <LoadingModal show={showLoadingModal} />;
  }

  return (
    <Container>
      <Row>
        <LoadingModal show={showLoadingModal} />
        {/* Trainer Details */}
        <Col md={4}>
          {trainerDetails && (
            <Card className='m-3' style={{ color: 'var(--text-color)' }}>
              <Card.Body className='text-center'>
                <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)' }}>פרטי המאמן</h5>
                <img
                  className='mt-2'
                  src={trainerDetails.ImageURL || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                  alt="Trainer avatar"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <h4 className="card-title">{trainerDetails.FirstName + " " + trainerDetails.LastName}</h4>
                <p>
                  {trainerDetails.Description ? trainerDetails.Description.split('.').map((sentence, i) => (
                    <div key={i}>{sentence.trim() ? sentence.trim() + '.' : ''}</div>
                  )) : 'No description available'}
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Account Details */}
        <Col md={4}>
          <Card className='m-3' style={{ color: 'var(--text-color)' }}>
            <Card.Body className='text-center'>
              <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)'}}>פרטי חשבון</h5>
              <p>בתוקף עד: {getFormattedDate(userlogindetails.expirationDate)}</p>
              <p>תחילת מינוי: {getFormattedDate(userlogindetails.Participating_from)}</p>
              <p> {userlogindetails.membershipStatus} :מצב חשבון</p>
              <p>{userlogindetails.name}: שם </p>
              <p>מספר טלפון: {userlogindetails.phoneNumber}</p>
            </Card.Body>
          </Card>
        </Col>

     {/* Download Plans Card */}
     <Col md={4}>
          <Card className='m-3' style={{ color: 'var(--text-color)' }}>
            <Card.Body className='text-center'>
              <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)'}}>Download Plans</h5>
              <Button
                onClick={() => handleDownload(userlogindetails.trainingPlanURL)}
                disabled={!userlogindetails.trainingPlanURL}
                className="m-2"
              >
                Download Training Plan
              </Button>
              <Button
                onClick={() => handleDownload("https://firebasestorage.googleapis.com/v0/b/booming-voice-396809.appspot.com/o/FoodPlans%2F315257881?alt=media&token=d8f1fb66-b0c9-4608-b819-86e8ce58bb4c")}
                disabled={!userlogindetails.foodPlanURL}
                className="m-2"
              >
                Download Food Plan
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Steroid Plan Details */}
        {trainerDetails&&trainerDetails.PlanID==='241'&&(
        <Col md={4}>
          { userlogindetails.SteroidPlanID ? (
            steroidPlanDetails ? (
              <Card className='m-3 ' style={{ color: 'var(--text-color)' }}>
                <Card.Body className='text-center'>
                  <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)' }}>תוכנית סטרויד</h5>
                  <p>{steroidPlanDetails.PlanName}: שם תוכנית </p>
                  <p>בתוקף עד: {getFormattedDate(userlogindetails.expirationDateSteroidPlan)}</p>
                  <p>:על התוכנית {steroidPlanDetails.PlanDetails.split('.').map((sentence, i) => (
                    <div key={i}>{sentence.trim() ? sentence.trim() + '.' : ''}</div>))}</p>
                  <p>{steroidPlanDetails.Duration} :  משך בחודשים </p>
                  <p>מחיר: ₪{steroidPlanDetails.PlanCost}</p>
                </Card.Body>
              </Card>
            ) : <p>Loading steroid plan details...</p>
          ) : (
            <Card className='m-3' style={{ color: 'var(--text-color)' }}>
              <Card.Body className='text-center'>
                <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)' }}>Choose Your Steroid Plan</h5>
                <Button variant="primary" onClick={handleViewPlans}>Choose Your Steroid Plan</Button>
              </Card.Body>
            </Card>
          )}
    
        </Col>
        )}

        {/* Weeks Details */}
        <Col md={4}>
          <Card className='m-3' style={{ color: 'var(--text-color)' }}>
            <Card.Body className='text-center'>
              <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)' }}>מידידות שבועיות</h5>
               <Button onClick={handleViewMeasurement}>
                צפיה בניתונים
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Shop Details Card */}
        {trainerDetails.PlanID==='241'&&(
        <Col md={4}>
          <Card className='m-3 text-center' style={{ color: 'var(--text-color)' }}>
            <Card.Body className='text-center'>
              <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)' }}>Shop Details</h5>
              {productDetails.length > 0 ? (
                <ProductSlider products={productDetails} />
              ) : (
                <p>No products available</p>
              )}
              <Button className='mt-4' onClick={handleViewShop}>Go to Shop</Button>
            </Card.Body>
          </Card>
        </Col>
        )}
    
   
      </Row>
    </Container>
  );
};

export default SubscriberDashboard;
