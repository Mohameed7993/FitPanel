import React, { useState } from 'react';

import Gymcustomers from './Gymcustomers';
import AddNewTrainningPlan from './AddNewTrainningPlan';
import AddNewMember from './AddNewMember';


import logo from '../image/Mo Dumbels.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faPlusSquare, faBuilding, faClipboardList, faChartBar, faBell, faCog } from '@fortawesome/free-solid-svg-icons';

const Manager = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'Gymcustomers':
        return <Gymcustomers />;
       case 'AddNewTranningPlan':
         return <AddNewTrainningPlan />;
      case 'AddNewMember':
         return <AddNewMember />;
      // case 'StudiosPlan':
      //   return <StudiosPlan />;
      // case 'reports':
      //   return <Reports />;
      // case 'notifications':
      //   return <Notifications />;
      // case 'settings':
      //   return <Settings />;
      case 'dashboard':
      default:
        return <div>Welcome to the Manager Dashboard</div>;
    }
  };

  return (
    <div className="d-flex">
      <nav className="bg-dark text-light p-3" style={{ width: '250px', height: '100vh', position: 'fixed', top: 0, bottom: 0 }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '165px', height: 'auto' }} />
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-light"
              onClick={() => setCurrentView('dashboard')}
              onMouseEnter={(e) => e.currentTarget.classList.add('bg-info')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('bg-info')}
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-light"
              onClick={() => setCurrentView('Gymcustomers')}
              onMouseEnter={(e) => e.currentTarget.classList.add('bg-info')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('bg-info')}
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Members
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-light"
              onClick={() => setCurrentView('AddNewMember')}
              onMouseEnter={(e) => e.currentTarget.classList.add('bg-info')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('bg-info')}
            >
              <FontAwesomeIcon icon={faPlusSquare} className="me-2" />
              Add New Member
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-light"
              onClick={() => setCurrentView('AddNewTranningPlan')}
              onMouseEnter={(e) => e.currentTarget.classList.add('bg-info')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('bg-info')}
            >
              <FontAwesomeIcon icon={faChartBar} className="me-2" />
              Add new Plan
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-light"
              onClick={() => setCurrentView('GymsStudio')}
              onMouseEnter={(e) => e.currentTarget.classList.add('bg-info')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('bg-info')}
            >
              <FontAwesomeIcon icon={faBuilding} className="me-2" />
              Master Plans
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-light"
              onClick={() => setCurrentView('StudiosPlan')}
              onMouseEnter={(e) => e.currentTarget.classList.add('bg-info')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('bg-info')}
            >
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Class Mangment
            </a>
          </li>
        
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-light"
              onClick={() => setCurrentView('notifications')}
              onMouseEnter={(e) => e.currentTarget.classList.add('bg-info')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('bg-info')}
            >
              <FontAwesomeIcon icon={faBell} className="me-2" />
              Notifications
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-light"
              onClick={() => setCurrentView('settings')}
              onMouseEnter={(e) => e.currentTarget.classList.add('bg-info')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('bg-info')}
            >
              <FontAwesomeIcon icon={faCog} className="me-2" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
      <div className="flex-grow-1 p-3" style={{ marginLeft: '250px' }}>
        {renderView()}
      </div>
    </div>
  );
};

export default Manager;
