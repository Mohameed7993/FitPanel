import React, { useState, useEffect } from 'react';
import logo from '../image/fitpanel1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUsers,faIdBadge, faRightFromBracket, faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { Modal, Button, Form, Toast, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


import AddNewSubscriber from './NewSubscriber';
import SubscriberMang from './SubscriberMangment';
import SubscriberDetails from './SubscriberDetails';


const Trainer = () => {
  const SERVERSIDEURL="https://fitpanelserverside.onrender.com"
  const [currentView, setCurrentView] = useState('SubscriberMang');
  const { currentUser, userlogindetails, updateProfilePassword, logout } = useAuth();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // For controlling sidebar visibility

  useEffect(() => {
    console.log(currentUser , userlogindetails.FirstLoggin); 
    if (currentUser ) {
      if (userlogindetails.FirstLoggin === 0) {
        setShowChangePasswordModal(true);
      }
    }
  }, [userlogindetails, currentUser]);

  const handleNavClick = (view, customerId = null) => {
    if (view === 'SubscriberDetails' && !customerId) {
      setShowToast(true);
      return;
    }
    setCurrentView(view);
    if (view === 'SubscriberDetails') {
      setSelectedCustomerId(customerId);
    } else {
      setSelectedCustomerId(null);
    }
    setShowSidebar(false); // Close sidebar when navigation item is clicked
  };

  const renderView = () => {
    switch (currentView) {
      case 'AddNewSubscriber':
        return <AddNewSubscriber />;
      case 'SubscriberMang':
        return <SubscriberMang onSelectCustomer={handleNavClick} />;
      case 'SubscriberDetails':
        return <SubscriberDetails customerId={selectedCustomerId} />;
      // case 'Shop':
      //   return <Shop />;
      // case 'SteroidPlans':
      //   return <SteroidPlans />;
      // case 'SteroidMangment':
      //   return <SteroidMangment />;
      // case 'About':
      //   return <About />;
      // case 'Contact':
      //   return <Contact />;
      // case 'Profile':
      //   return <UpdateProfile />;
      default:
        return <div>Welcome to the Trainer Dashboard</div>;
    }
  };

  const getNavItemClass = (view) => (
    currentView === view ? 'nav-link bg-info bg-opacity-50 text-success'  : 'nav-link text-dark'
  );

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



  const handleChangePassword = async (newPassword) => {
    try {
      const response = await fetch(`${SERVERSIDEURL}/MoDumbels/changePassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userlogindetails.EmailAddress,
          newPassword,
          Userid:userlogindetails.UserId,
        }),
      });

  
      if (response.ok) {
        setShowChangePasswordModal(false);
      } else {
        const data = await response.json();
        console.error('Failed to change password:', data.message);
        setError(data.message || 'Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to update password. Please try again.');
    }
  };

  async function handleLogout() {
    setError('');
    try {
      await logout();
      // <Navigate to="/login" />;
    } catch {
      setError('Failed to log out');
      console.log(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    handleChangePassword(newPassword);
  };

  return (
    <>
    
      <Button variant="primary" onClick={() => setShowSidebar(true)} className="">
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="end" >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={logo} alt="Logo" style={{ width: '155px', height: 'auto' }} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="">
          <div className="text-end mb-4">
          <h5 style={{
  borderBottom: '2px solid black', // Adjust color and thickness as needed
  display: 'inline', // Ensures underline only applies to the text
  paddingBottom: '2px' // Optional: Adjust spacing from text
}}>
  {userlogindetails.FirstName} {getTimeOfDay()}
</h5>
          </div>
          <ul className="nav flex-column text-end ">
            <li className="nav-item">
              <a
                href="#"
                className={getNavItemClass('SubscriberMang')}
                onClick={() => handleNavClick('SubscriberMang')}
              > רשימת מתאמנים
                <FontAwesomeIcon icon={faUsers} className="mx-2" />
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={getNavItemClass('AddNewSubscriber')}
                onClick={() => handleNavClick('AddNewSubscriber')}
              > הוספת מתאמן חדש
                <FontAwesomeIcon icon={faUserPlus} className="mx-2" />
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={getNavItemClass('SubscriberDetails')}
                onClick={() => handleNavClick('SubscriberDetails')}
              > פרטי מתאמן
                <FontAwesomeIcon icon={faIdBadge} className="mx-2" />
              </a>
            </li>
            {/* {userlogindetails && userlogindetails.PlanID === '241' && (
              <>
                <li className="nav-item">
                  <a
                    href="#"
                    className={getNavItemClass('SteroidPlans')}
                    onClick={() => handleNavClick('SteroidPlans')}
                  > תוכניות סטרוידים
                    <FontAwesomeIcon icon={faSyringe} className="mx-2" style={{ color: '#FFD700' }} />
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#"
                    className={getNavItemClass('SteroidMangment')}
                    onClick={() => handleNavClick('SteroidMangment')}
                  > משתתפים בסטרוידים
                    <FontAwesomeIcon icon={faStar} className="mx-2" style={{ color: '#FFD700' }} />
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#"
                    className={getNavItemClass('Shop')}
                    onClick={() => handleNavClick('Shop')}
                  > חנות
                    <FontAwesomeIcon icon={faShop} className="mx-2" style={{ color: '#FFD700' }} />
                  </a>
                </li>
              </>
            )} */}
            
            
            <li className="nav-item">
              <a
                href="#"
                className={getNavItemClass('logout')}
                onClick={handleLogout}
              >
                יצאה
                <FontAwesomeIcon icon={faRightFromBracket} className="mx-2" />
              </a>
            </li>
          
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      {showChangePasswordModal && (
        <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <div className="text-danger mb-2">{error}</div>}
              <Button variant="primary" type="submit">
                Change Password
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {showToast && (
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body>אנא בחר מתאמן כד לצפות בפרטים שלו.</Toast.Body>
        </Toast>
      )}

      <div className="content">
        {renderView()}
      </div>
    </>
  );
};

export default Trainer;
