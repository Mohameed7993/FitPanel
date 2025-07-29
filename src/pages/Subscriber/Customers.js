import React, { useState, useEffect } from 'react';
import logo from '../image/Mo ‘s.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faIdBadge,
     faRightFromBracket, faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { Offcanvas, Nav } from 'react-bootstrap';

import SubscriberDashboard from './Profile';
import SubscriberDetails from '../OnlineTrainers/SubscriberDetails';


const Customer = () => {
  const [currentView, setCurrentView] = useState('Dashboard');
  const { userlogindetails, logout } = useAuth();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [error, setError] = useState("");
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [show, setShow] = useState(false);


  const handleNavClick = (view) => {
    setCurrentView(view);
    if (view === 'SubscriberDetails') {
      setSelectedCustomerId(userlogindetails);
    } else {
      setSelectedCustomerId(null);
    }
    setShow(false); // Close Offcanvas when a navigation item is clicked
  };

const fetchDetails = async () => {
  if (userlogindetails?.trainerID) {
    try {
      const response = await fetch(`/MoDumbels/getTrainerDetails?trainerID=${userlogindetails.trainerID}`);
      if (response.ok) {
        const data = await response.json();
        setTrainerDetails(data.trainer);
      } else {
        console.error('Failed to fetch trainer details');
      }
    } catch (error) {
      console.error('Error fetching trainer details:', error);
    }
  }
};

useEffect(() => {
  fetchDetails();
}, [userlogindetails]);

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <SubscriberDashboard Views={handleNavClick} />;
      case 'SubscriberDetails':
        return <SubscriberDetails customerId={selectedCustomerId} />;
    
      default:
        return <div>Welcome to the Customer Dashboard</div>;
    }
  };

  async function handleLogout() {
    setError('');
    try {
      await logout();
    } catch {
      setError('Failed to log out');
      console.log(error);
    }
  }

  const getTimeOfDay = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'בוקר טוב';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'צוהריים טובים';
    } else if (currentHour >= 18 && currentHour < 21) {
      return 'ערב טוב';
    } else {
      return 'לילה טוב';
    }
  };

  const getNavItemClass = (view) =>
    currentView === view ? 'nav-link bg-info bg-opacity-50 text-success'  : 'nav-link text-dark'

  return (
    <>
      <button 
        className="btn btn-primary position-fixed"
        onClick={() => setShow(true)}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={logo} alt="Logo" style={{ width: '155px', height: 'auto' }} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="text-end mb-4" >
          <h5 style={{
  borderBottom: '2px solid black', // Adjust color and thickness as needed
  display: 'inline', // Ensures underline only applies to the text
  paddingBottom: '2px' // Optional: Adjust spacing from text
}}>
  {userlogindetails.name} {getTimeOfDay()}
</h5>          </div>
          <Nav className="flex-column text-end">
            <Nav.Item>
              <Nav.Link
                href="#"
                className={getNavItemClass('Dashboard')}
                onClick={() => handleNavClick('Dashboard')}
              >
                בית
                <FontAwesomeIcon icon={faTachometerAlt} className="mx-2" />
              </Nav.Link>
            </Nav.Item>
           
             
            <Nav.Item>
              <Nav.Link
                href="#"
                className={getNavItemClass('SubscriberDetails')}
                onClick={() => handleNavClick('SubscriberDetails')}
              >
                פרטי מתאמן
                <FontAwesomeIcon icon={faIdBadge} className="mx-2" />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="#"
                className={getNavItemClass('logout')}
                onClick={handleLogout}
              >
                יצאה
                <FontAwesomeIcon icon={faRightFromBracket} className="mx-2" />
              </Nav.Link>
            </Nav.Item>
           
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="flex-grow-1 p-3" >
        {renderView()}
      </div>
    </>
  );
};

export default Customer;
