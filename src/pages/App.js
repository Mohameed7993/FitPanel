import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useTheme } from './context/ThemeContext';

import Home from './Home';
import About from './About';
import Contact from './Contact';
import ProtectedRoute from '../ProtectedRoute';
import PublicRoute from '../PublicRoute';
import NotFound from '../NotFound';
import Master from './Master';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';
import Layouts from './Layouts'; 
import Footer from './footer';
import Workoutplan from './Workoutplan';
import Trainers from '../pages/OnlineTrainers/Trainers';
import Customer from './Subscriber/Customers';
import '../index.css';




function App() {
 const { theme } = useTheme();

 useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);

  return (
    <Router>
      <AuthProvider>
     
        <Layouts />
          <div className="d-flex flex-column min-vh-100">
            <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<PublicRoute element={Home} />} />  
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/trainer" element={<ProtectedRoute element={Trainers} requiredRole={8} />} />
                <Route path="/customer" element={<ProtectedRoute element={Customer} requiredRole={2} />} />
                <Route path="/forgot-password" element={<ForgotPassword />}/>
                <Route path="/update-profile" element={<ProtectedRoute element={UpdateProfile} />} /> 
                <Route path="/workoutplan" element={<ProtectedRoute element={Workoutplan} />} /> 
                <Route path="/master" element={<ProtectedRoute element={Master} requiredRole={10}/>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
