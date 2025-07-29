import React, { useState } from 'react';

import MasterDashboard from './AdminTools/MasterDashboard';
import AddOnlineTrainer from './AdminTools/NewOnlineTrainer';
import TrainersMangment from './AdminTools/TrainerMangment';
import logo from './image/fitpanel.png';
import { useAuth } from './context/AuthContext';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faUserTie, faUserPlus, faRightFromBracket, faBuilding, faClipboardList, faChartBar, faBell, faCog } from '@fortawesome/free-solid-svg-icons';


const Master = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { userlogindetails, logout } = useAuth();
  const [error, setError] = useState("");


  const handleNavClick = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'addOnlineTrainer':
        return <AddOnlineTrainer />;
      case 'TrainersMangment':
        return <TrainersMangment />;
      case 'dashboard':
        return <MasterDashboard />;

      default:
        return <div>Welcome to the Admin Dashboard</div>;
    }
  };

  const getNavItemClass = (view) =>
    currentView === view ? 'nav-link  bg-white bg-opacity-50' : 'nav-link ';

  async function handleLogout() {
    setError('');
    try {
      await logout();
    } catch {
      setError('Failed to log out');
      console.log(error);
    }
  }

  return (
    <div className="d-flex">
     <nav className="text-end p-3 sidebar"
  style={{
    width: '220px',
    height: '100vh',
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'var(--text-color)',  // ✅ Dark sidebar background
    color: 'white',              // ✅ White text
    borderRight: '2px solid #fff',
  }}>

        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '165px', height: 'auto' }} />
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              href="#"
              className={getNavItemClass('dashboard')}
              onClick={() => handleNavClick('dashboard')}
            > בית
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
             
            </a>
          </li>
      
          <li className="nav-item">
            <a
              href="#"
              className={getNavItemClass('TrainersMangment')}
              onClick={() => handleNavClick('TrainersMangment')}
            >  רשימת מתאמנים  
              <FontAwesomeIcon icon={faUserTie} className="me-2" />
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={getNavItemClass('addOnlineTrainer')}
              onClick={() => handleNavClick('addOnlineTrainer')}
            > הוספת מאמן חדש
              <FontAwesomeIcon icon={faUserPlus} className="me-2" />
              
            </a>
          </li>

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
      </nav>
      <div className="flex-grow-1 p-3" style={{ marginRight: '250px' }}>
        {renderView()}
      </div>
    </div>
  );
};

export default Master;
