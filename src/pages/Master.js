import React, { useState } from 'react';

import UserManagement from './AdminTools/UserManagement';
import AddingNewGym from './AdminTools/AddingNewGym';
import GymsStudio from './AdminTools/GymsStudio';
import StudiosPlan from './AdminTools/StudiosPlans';
import MasterDashboard from './AdminTools/MasterDashboard';
import AddOnlineTrainer from './AdminTools/NewOnlineTrainer';
import TrainersMangment from './AdminTools/TrainerMangment';
import TrainersPLan from './AdminTools/TrainerPlans';
import logo from './image/Mo ‘s.png';
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
      case 'userManagement':
        return <UserManagement />;
      case 'AddNewGymStudio':
        return <AddingNewGym />;
      case 'GymsStudio':
        return <GymsStudio />;
      case 'StudiosPlan':
        return <StudiosPlan />;
      case 'addOnlineTrainer':
        return <AddOnlineTrainer />;
      case 'TrainersMangment':
        return <TrainersMangment />;
      case 'TrainersPLan':
        return <TrainersPLan />;
      case 'dashboard':
        return <MasterDashboard />;

      default:
        return <div>Welcome to the Admin Dashboard</div>;
    }
  };

  const getNavItemClass = (view) =>
    currentView === view ? 'nav-link  bg-info bg-opacity-50' : 'nav-link ';

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
      <nav  className=" text-end  p-3 sidebar"
        style={{
          width: '250px',
          height: '100vh',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'var(--secondary-color)', // Adjusted for dark/light themes
          borderRight: '2px solid var(--primary-color)', // Adjusted for dark/light themes
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
            > מאמנים אונליין
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
              className={getNavItemClass('TrainersPLan')}
              onClick={() => handleNavClick('TrainersPLan')}
            > תוכניות מאמנים
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={getNavItemClass('notifications')}
              onClick={() => handleNavClick('notifications')}
            > התראות
              <FontAwesomeIcon icon={faBell} className="me-2" />
              
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={getNavItemClass('settings')}
              onClick={() => handleNavClick('settings')}
            >הגדרות
              <FontAwesomeIcon icon={faCog} className="me-2" />
              
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
