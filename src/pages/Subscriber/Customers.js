import React, { useState, useEffect } from 'react';
import logo from '../image/Mo ‘s.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faSyringe, faCalculator, faIdBadge,
    faUser, faRightFromBracket, faPhone, faAddressCard, faShop, faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Offcanvas, Nav } from 'react-bootstrap';

import SubscriberDashboard from './Profile';
import Calori_Calculate from './CaloriCalculater';
import SteroidMangment from '../OnlineTrainers/SteroidPlans';
import SubscriberDetails from '../OnlineTrainers/SubscriberDetails';
import Shopping from './shopping';
import About from '../About';
import Contact from '../Contact';
import UpdateProfile from '../UpdateProfile';

const Customer = () => {
  const [currentView, setCurrentView] = useState('Dashboard');
  const { userlogindetails, logout } = useAuth();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [error, setError] = useState("");
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [show, setShow] = useState(false);

  const db = getFirestore();

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
    if (userlogindetails) {
      // Fetch trainer details
      if (userlogindetails.trainerID) {
        const qTrainer = query(collection(db, 'Users'), where('UserId', '==', userlogindetails.trainerID));
        const querySnapshotTrainer = await getDocs(qTrainer);
        if (!querySnapshotTrainer.empty) {
          setTrainerDetails(querySnapshotTrainer.docs[0].data());
        }
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
      case 'CaloriCalculate':
        return <Calori_Calculate />;
      case 'SteroidPlans':
        return <SteroidMangment />;
      case 'SubscriberDetails':
        return <SubscriberDetails customerId={selectedCustomerId} />;
      case 'Shopping':
        return <Shopping />;
      case 'About':
        return <About />;
      case 'Contact':
        return <Contact />;
      case 'Profile':
        return <UpdateProfile />;
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
                className={getNavItemClass('CaloriCalculate')}
                onClick={() => handleNavClick('CaloriCalculate')}
              >
                מחשבון קלוריות
                <FontAwesomeIcon icon={faCalculator} className="mx-2" />
              </Nav.Link>
            </Nav.Item>
            {trainerDetails && trainerDetails.PlanID === '241' && (
              <Nav.Item>
                <Nav.Link
                  href="#"
                  className={getNavItemClass('SteroidPlans')}
                  onClick={() => handleNavClick('SteroidPlans')}
                >
                  תוכניות סטרוידים
                  <FontAwesomeIcon icon={faSyringe} className="mx-2" />
                </Nav.Link>
              </Nav.Item>
            )}
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
            {trainerDetails && trainerDetails.PlanID === '241' && (
              <Nav.Item>
                <Nav.Link
                  href="#"
                  className={getNavItemClass('Shopping')}
                  onClick={() => handleNavClick('Shopping')}
                >
                  חנות
                  <FontAwesomeIcon icon={faShop} className="mx-2" />
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link
                href="#"
                className={getNavItemClass('Profile')}
                onClick={() => handleNavClick('Profile')}
              >
                פרופיל
                <FontAwesomeIcon icon={faUser} className="mx-2" />
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
            <Nav.Item>
              <Nav.Link
                href="#"
                className={getNavItemClass('About')}
                onClick={() => handleNavClick('About')}
              >
                מי אנחנו
                <FontAwesomeIcon icon={faAddressCard} className="mx-2" />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="#"
                className={getNavItemClass('Contact')}
                onClick={() => handleNavClick('Contact')}
              >
                צור קשר
                <FontAwesomeIcon icon={faPhone} className="mx-2" />
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
