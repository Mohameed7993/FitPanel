import React, { useState, useEffect } from 'react';
import { Card, Container, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

import LoadingModal from '../LoadingModal';


const SubscriberDashboard = ({ Views }) => {
  const SERVERSIDEURL="https://fitpanelserverside.onrender.com"
  const { currentUser, userlogindetails } = useAuth();
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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
  if (!userlogindetails?.trainerID) return;

  setLoading(true);
  setShowLoadingModal(true);

  try {
    const response = await fetch(`${SERVERSIDEURL}/MoDumbels/getTrainerDetails?trainerID=${userlogindetails.trainerID}`);
    if (response.ok) {
      const data = await response.json();
      setTrainerDetails(data.trainer);
    } else {
      console.error('Failed to fetch trainer details');
    }
  } catch (error) {
    console.error('Error fetching trainer details:', error);
  } finally {
    setLoading(false);
    setShowLoadingModal(false);
  }
};

  useEffect(() => {
    fetchDetails();
  }, [userlogindetails]);




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
            <Card  className='m-3' style={{color: 'white' , backgroundColor: 'var(--text-color)'}}>
              <Card.Body className='text-center'>
                <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)' }}>פרטי המאמן</h5>
                <img
                  className='mt-2'
                  src={trainerDetails.ImageURL || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                  alt="Trainer avatar"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <h4 className="card-title"  style={{color: 'white' }}>{trainerDetails.FirstName + " " + trainerDetails.LastName}</h4>
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
          <Card className='m-3'style={{color: 'white' , backgroundColor: 'var(--text-color)'}}>
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
          <Card className='m-3' style={{color: 'white' , backgroundColor: 'var(--text-color)'}}>
            <Card.Body className='text-center'>
              <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)'}}>Download Plans</h5>
               <p>תוכנית אימון: {userlogindetails.trainingPlanLastUpdated ? getFormattedDate(userlogindetails.trainingPlanLastUpdated) : 'לא עודכן'}</p>
              <p>תוכנית אוכל: {userlogindetails.foodPlanLastUpdated ? getFormattedDate(userlogindetails.foodPlanLastUpdated) : 'לא עודכן'}</p>
  
              <Button
                onClick={() => handleDownload(userlogindetails.trainingPlanURL)}
                disabled={!userlogindetails.trainingPlanURL}
                className="m-2"
              >
                הורדת תוכנית אימון
              </Button>
              <Button
                onClick={() => handleDownload(userlogindetails.foodPlanURL)}
                disabled={!userlogindetails.foodPlanURL}
                className="m-2"
              >
                הורדת תוכנית אוכל
              </Button>
            </Card.Body>
          </Card>
        </Col>


        {/* Weeks Details */}
        <Col md={4}>
          <Card className='m-3' style={{color: 'white' , backgroundColor: 'var(--text-color)'}}>
            <Card.Body className='text-center'>
              <h5 className="mb-2 pb-1" style={{ borderBottom: '2px solid var(--text-color)' }}>מידידות שבועיות</h5>
               <Button onClick={handleViewMeasurement}>
                צפיה בניתונים
              </Button>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
};

export default SubscriberDashboard;
